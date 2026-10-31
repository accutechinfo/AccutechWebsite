<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class CustomerAuthController extends Controller
{
    private function customers() { return DB::connection('pgsql')->table('public.user'); }

    private function findUser(string $identity): ?object
    {
        return $this->customers()->where(
            filter_var($identity, FILTER_VALIDATE_EMAIL) ? 'UserEmail' : 'UserPhone',
            $identity
        )->first();
    }

    private function passwordValid(string $plain, ?string $stored): bool
    {
        if (!$stored) return false;
        // Read legacy CI3 MD5 credentials without rewriting them.
        if (preg_match('/^[a-f0-9]{32}$/i', $stored)) {
            return hash_equals(strtolower($stored), md5($plain));
        }
        return Hash::check($plain, $stored);
    }

    private function sessionLogin(Request $request, object $user): void
    {
        $request->session()->regenerate();
        $request->session()->put('customer_user_id', $user->UserId);
        $request->session()->forget('customer_otp');
    }

    public function csrf(Request $request): JsonResponse
    {
        return response()->json(['token' => csrf_token()]);
    }

    public function me(Request $request): JsonResponse
    {
        $id = $request->session()->get('customer_user_id');
        $user = $id ? $this->customers()->where('UserId', $id)->first() : null;
        return response()->json(['authenticated' => (bool) $user,
            'user' => $user ? ['id' => $user->UserId, 'email' => $user->UserEmail, 'phone' => $user->UserPhone] : null]);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['username' => 'required|string|max:255', 'password' => 'required|string']);
        $identifier = trim($data['username']);
        $key = 'customer-login:'.sha1(Str::lower($identifier)).':'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Too many attempts. Try again later.'], 429);
        }
        $user = $this->findUser($identifier);
        if (!$user || !$this->passwordValid($data['password'], $user->UserPassword ?? null)
            || (int)($user->UserStatus ?? 1) !== 1) {
            RateLimiter::hit($key, 300);
            return response()->json(['message' => 'Invalid login.'], 422);
        }
        RateLimiter::clear($key);
        $this->sessionLogin($request, $user);
        return response()->json(['status' => true, 'redirect' => '/']);
    }

    public function start(Request $request): JsonResponse
    {
        $data = $request->validate([
            'purpose' => 'required|in:signup,reset',
            'channel' => 'required|in:email,mobile',
            'identity' => ['required', 'string', 'max:255'],
        ]);
        $identity = trim($data['identity']);
        $rule = $data['channel'] === 'email' ? 'email:rfc' : 'regex:/^[6-9][0-9]{9}$/';
        validator(['identity' => $identity], ['identity' => [$rule]])->validate();
        $key = 'customer-otp:'.sha1(Str::lower($identity)).':'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json(['message' => 'Please try again later.'], 429);
        }
        $existing = $this->findUser($identity);
        if ($data['purpose'] === 'signup' && $existing) {
            return response()->json(['message' => 'This account already exists.'], 422);
        }
        // Do not reveal whether reset accounts exist; the response stays generic.
        if ($data['purpose'] === 'reset' && !$existing) {
            RateLimiter::hit($key, 300);
            return response()->json(['status' => true, 'message' => 'If an account exists, a verification code will be sent.']);
        }
        if ($data['channel'] === 'mobile') {
            return response()->json(['message' => 'SMS delivery must be configured before mobile verification is available. Use email for now.'], 503);
        }
        $otp = (string) random_int(1000, 9999);
        try {
            Mail::raw("Your Accutech ERP verification code is {$otp}. It expires in 30 minutes.",
                fn ($mail) => $mail->to($identity)->subject('Accutech ERP Verification Code'));
        } catch (Throwable $error) {
            Log::error('Customer OTP email failed', ['error' => $error->getMessage()]);
            return response()->json(['message' => 'Could not send verification code. Try again later.'], 503);
        }
        $request->session()->put('customer_otp', [
            'purpose' => $data['purpose'], 'channel' => $data['channel'],
            'identity' => $identity, 'hash' => Hash::make($otp),
            'expires' => now()->addMinutes(30)->timestamp, 'verified' => false,
            'attempts' => 0, 'sent_at' => now()->timestamp,
        ]);
        RateLimiter::hit($key, 300);
        return response()->json(['status' => true, 'step' => 'sent', 'message' => 'OTP has been sent successfully.']);
    }

    public function otpStatus(Request $request): JsonResponse
    {
        $pending = $request->session()->get('customer_otp');
        return response()->json(['pending' => $pending && !$pending['verified'] && now()->timestamp <= $pending['expires'],
            'verified' => $pending && $pending['verified'], 'purpose' => $pending['purpose'] ?? null]);
    }

    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate(['otp' => ['required', 'regex:/^[0-9]{4}$/']]);
        $pending = $request->session()->get('customer_otp');
        if (!$pending || now()->timestamp > $pending['expires']) {
            $request->session()->forget('customer_otp');
            return response()->json(['message' => 'OTP expired. Request a new code.'], 422);
        }
        if (($pending['attempts'] ?? 0) >= 5) {
            $request->session()->forget('customer_otp');
            return response()->json(['message' => 'Too many incorrect codes. Start again.'], 429);
        }
        if (!Hash::check($data['otp'], $pending['hash'])) {
            $pending['attempts']++;
            $request->session()->put('customer_otp', $pending);
            return response()->json(['message' => 'Invalid OTP.'], 422);
        }
        $pending['verified'] = true;
        $pending['hash'] = null;
        $request->session()->put('customer_otp', $pending);
        return response()->json(['status' => true,
            'redirect' => $pending['purpose'] === 'signup' ? '/login/create_password' : '/login/update_password']);
    }

    public function back(Request $request): JsonResponse
    {
        $request->session()->forget('customer_otp');
        return response()->json(['status' => true]);
    }

    public function complete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'password' => ['required', 'string', 'min:8', 'max:255', 'regex:/[A-Za-z]/', 'regex:/[0-9]/', 'confirmed'],
        ]);
        $pending = $request->session()->get('customer_otp');
        if (!$pending || empty($pending['verified']) || now()->timestamp > $pending['expires']) {
            return response()->json(['message' => 'Your verification has expired. Please verify again.'], 403);
        }
        if (!config('customer_auth.allow_writes')) {
            return response()->json(['message' => 'Customer account writes are disabled. Enable only after testing against the shared database.'], 503);
        }
        $identity = $pending['identity'];
        $user = $this->findUser($identity);
        if ($pending['purpose'] === 'signup' && $user) {
            return response()->json(['message' => 'Account already exists.'], 422);
        }
        if ($pending['purpose'] === 'reset' && !$user) {
            return response()->json(['message' => 'Unable to update the account.'], 422);
        }
        // Modern hash; CI3 must be updated to support Hash::check before old-site login works for newly created credentials.
        $passwordHash = Hash::make($data['password']);
        try {
            if ($pending['purpose'] === 'signup') {
                $userId = $this->customers()->insertGetId([
                    'UserEmail' => $pending['channel'] === 'email' ? $identity : '',
                    'UserPhone' => $pending['channel'] === 'mobile' ? $identity : '',
                    'UserPassword' => $passwordHash,
                    'UserStatus' => 1,
                    'IsSignupUser' => 1,
                    'SignupUserPhone' => $pending['channel'] === 'mobile' ? 1 : 0,
                ], 'UserId');
                $user = $this->customers()->where('UserId', $userId)->first();
            } else {
                $this->customers()->where('UserId', $user->UserId)->update(['UserPassword' => $passwordHash]);
            }
        } catch (Throwable $error) {
            Log::error('Customer account change failed', ['error' => $error->getMessage()]);
            return response()->json(['message' => 'Unable to save account. Check existing table constraints and server logs.'], 503);
        }
        $this->sessionLogin($request, $user);
        return response()->json(['status' => true, 'redirect' => '/']);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->session()->forget(['customer_user_id', 'customer_otp']);
        $request->session()->regenerateToken();
        return response()->json(['status' => true]);
    }
}
