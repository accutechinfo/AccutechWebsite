<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

class ConfigAdminProvider implements UserProvider
{
    private function getAdmin(): ?ConfigAdmin
    {
        $email = config('cms_admin.email');
        $password = config('cms_admin.password');

        if (
            !is_string($email) ||
            trim($email) === '' ||
            !is_string($password) ||
            $password === ''
        ) {
            return null;
        }

        return new ConfigAdmin([
            'id' => 1,
            'name' => config('cms_admin.name'),
            'email' => trim($email),
            'password' => $password,
            'remember_token' => null,
        ]);
    }

    public function retrieveById($identifier)
    {
        $admin = $this->getAdmin();

        if (!$admin) {
            return null;
        }

        return (string) $admin->getAuthIdentifier()
            === (string) $identifier
                ? $admin
                : null;
    }

    public function retrieveByToken($identifier, $token)
    {
        return null;
    }

    public function updateRememberToken(
        Authenticatable $user,
        $token
    ): void {
    }

    public function retrieveByCredentials(array $credentials)
    {
        $admin = $this->getAdmin();

        if (!$admin) {
            return null;
        }

        $email = $credentials['email'] ?? null;

        if (!is_string($email)) {
            return null;
        }

        return hash_equals(
            strtolower($admin->email),
            strtolower(trim($email))
        ) ? $admin : null;
    }

    public function validateCredentials(
        Authenticatable $user,
        array $credentials
    ): bool {
        $password = $credentials['password'] ?? null;

        if (!is_string($password)) {
            return false;
        }

        return hash_equals(
            (string) $user->getAuthPassword(),
            $password
        );
    }

    public function rehashPasswordIfRequired(
        Authenticatable $user,
        array $credentials,
        bool $force = false
    ): void {
    }
}
