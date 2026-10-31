<?php

namespace App\Providers;

use App\Auth\ConfigAdminProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Auth::provider('config_admin', function ($app, array $config) {
            return new ConfigAdminProvider();
        });
    }
}
