<?php

namespace App\Auth;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Models\Contracts\HasAvatar;
use Filament\Panel;
use Illuminate\Auth\GenericUser;

class ConfigAdmin extends GenericUser implements FilamentUser, HasName, HasAvatar
{
    /**
     * Allow access only to the admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $panel->getId() === 'admin';
    }

    /**
     * Administrator name shown in Filament.
     */
    public function getFilamentName(): string
    {
        return (string) (
            $this->attributes['name'] ?? 'Accutech Administrator'
        );
    }

    /**
     * Use Filament's default avatar.
     */
    public function getFilamentAvatarUrl(): ?string
    {
        return null;
    }

    /**
     * Support attribute access required by Filament.
     */
    public function getAttributeValue($key)
    {
        return $this->attributes[$key] ?? null;
    }

    /**
     * User identifier.
     */
    public function getKey()
    {
        return $this->getAuthIdentifier();
    }

    public function getAuthIdentifierName()
    {
        return 'id';
    }

    public function getAuthPasswordName()
    {
        return 'password';
    }

    /**
     * Disable remember-token functionality.
     */
    public function getRememberToken()
    {
        return null;
    }

    public function setRememberToken($value)
    {
        // No persistent token storage.
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }
}
