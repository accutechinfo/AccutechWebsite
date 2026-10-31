<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Throwable;

class EnquiryController extends Controller
{
    public function submit(Request $request): JsonResponse
    {
        // Anti-spam honeypot
        if ($request->filled('website')) {
            return response()->json([
                'status' => true,
                'message' => 'Your request has been received.',
            ]);
        }

        $type = $request->input('form_type', 'demo');

        $commonRules = [
            'form_type' => 'required|in:demo,contact,landing',
            'website' => 'nullable|string|max:0',
            'source' => 'nullable|string|max:255',
            'current_url' => 'nullable|string|max:2048',
        ];

        if ($type === 'contact') {

            $rules = [
                'first_name' => 'required|string|max:50',
                'last_name' => 'required|string|max:50',
                'email' => 'required|email|max:255',
                'phone_no' => [
                    'required',
                    'regex:/^[0-9]{10}$/',
                ],
                'message' => 'required|string',
            ];

        } elseif ($type === 'landing') {

            $rules = [
                'name' => 'required|string|max:80',
                'email' => 'required|email|max:120',
                'phone' => [
                    'required',
                    'regex:/^[6-9][0-9]{9}$/',
                ],
                'company' => 'nullable|string|max:100',
                'industry' => 'nullable|string|max:150',
                'erp_requirement' => 'nullable|string|max:255',
                'message' => 'required|string|max:1000',
            ];

        } else {

            $rules = [
                'first_name' => 'required|string|max:50',
                'email' => 'required|email|max:255',
                'phone_no' => [
                    'required',
                    'regex:/^[0-9]{10}$/',
                ],
                'message' => 'required|string',
            ];
        }

        $validator = Validator::make(
            $request->all(),
            array_merge($commonRules, $rules)
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please check the form fields.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Normalize customer details
        $name = $type === 'landing'
            ? trim($data['name'])
            : trim(
                ($data['first_name'] ?? '') . ' ' .
                ($data['last_name'] ?? '')
            );

        $email = trim($data['email']);

        $phone = $type === 'landing'
            ? $data['phone']
            : $data['phone_no'];

        $message = trim($data['message']);

        $source = $data['source'] ?? ucfirst($type);

        $currentUrl = $data['current_url'] ?? '';

        // Common recipient for every enquiry form
        $recipient = config('enquiry.support_email');

        if (
            !is_string($recipient) ||
            !filter_var($recipient, FILTER_VALIDATE_EMAIL)
        ) {
            Log::error('Accutech ERP enquiry recipient missing', [
                'form_type' => $type,
                'config_key' => 'enquiry.support_email',
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Email service is not configured.',
            ], 503);
        }

        // Common email fields
        $fields = [
            'Form Type' => ucfirst($type),
            'Name' => $name,
            'Email' => $email,
            'Phone Number' => $phone,
            'Message' => $message,
        ];

        if ($type === 'landing') {
            $fields['Company'] = $data['company'] ?? '';
            $fields['Industry'] = $data['industry'] ?? '';
            $fields['ERP Requirement'] =
                $data['erp_requirement'] ?? '';
        }

        if ($source !== '') {
            $fields['Source'] = $source;
        }

        if ($currentUrl !== '') {
            $fields['Page Path'] = $currentUrl;
        }

        // Email subject based on the form type
        $subject = match ($type) {
            'contact' => 'New Contact Form Submission - Accutech ERP',
            'landing' => 'New ERP Demo Enquiry - Accutech ERP',
            default => 'Request for Software demo',
        };

        // Build HTML email
        $html = '<!doctype html>';
        $html .= '<html><body>';
        $html .= '<h2>' . e($subject) . '</h2>';
        $html .= '<p>A new enquiry has been received.</p>';

        $html .= '<table cellpadding="10" cellspacing="0" ';
        $html .= 'border="1" ';
        $html .= 'style="border-collapse:collapse;width:100%;">';

        foreach ($fields as $label => $value) {
            $html .= '<tr>';
            $html .= '<td><strong>' .
                e($label) .
                '</strong></td>';

            $html .= '<td>' .
                nl2br(e((string) $value)) .
                '</td>';

            $html .= '</tr>';
        }

        $html .= '</table></body></html>';

        // Send email using the SAME mailer for all forms
        $startedAt = microtime(true);

        try {

            Mail::html(
                $html,
                function ($mail) use (
                    $recipient,
                    $subject,
                    $email,
                    $name
                ) {
                    $mail->to($recipient)
                        ->replyTo($email, $name)
                        ->subject($subject);
                }
            );

            $durationMs = round(
                (microtime(true) - $startedAt) * 1000,
                2
            );

            Log::info('Accutech ERP enquiry mail accepted', [
                'form_type' => $type,
                'duration_ms' => $durationMs,
            ]);

        } catch (Throwable $e) {

            $durationMs = round(
                (microtime(true) - $startedAt) * 1000,
                2
            );

            Log::error('Accutech ERP enquiry mail failed', [
                'form_type' => $type,
                'exception_type' => get_class($e),
                'error' => $e->getMessage(),
                'duration_ms' => $durationMs,
                'mailer' => config('mail.default'),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Email not sent. Please try again.',
            ], 503);
        }

        $response = [
            'status' => true,
            'message' =>
                'Your request has been submitted successfully. ' .
                'Our team will contact you soon.',
        ];

        // Preserve WhatsApp flow for landing forms only
        if ($type === 'landing') {

            $whatsappMessage =
                "New Accutech ERP Demo Enquiry\n\n";

            foreach ($fields as $label => $value) {
                $whatsappMessage .=
                    $label . ': ' . $value . "\n";
            }

            $whatsappNumber =
                config('enquiry.whatsapp_number');

            if ($whatsappNumber) {
                $response['whatsapp_url'] =
                    'https://wa.me/' .
                    preg_replace(
                        '/\D+/',
                        '',
                        (string) $whatsappNumber
                    ) .
                    '?text=' .
                    rawurlencode($whatsappMessage);
            }
        }

        return response()->json($response);
    }
}
