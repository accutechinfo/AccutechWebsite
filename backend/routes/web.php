<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\CustomerAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')
->group(function () {
    Route::get('/blogs', [
        BlogController::class,
        'index'
    ]);

    Route::get('/blogs/{slug}', [
        BlogController::class,
        'show'
    ]);
});

Route::prefix('api/customer-auth')->group(function () {
    Route::get('/csrf', [CustomerAuthController::class, 'csrf']);
    Route::get('/me', [CustomerAuthController::class, 'me']);

    Route::post('/login', [CustomerAuthController::class, 'login']);

    Route::post('/start', [CustomerAuthController::class, 'start']);
    Route::get('/otp-status', [CustomerAuthController::class, 'otpStatus']);
    Route::post('/verify', [CustomerAuthController::class, 'verify']);
    Route::post('/back', [CustomerAuthController::class, 'back']);

    Route::post('/complete', [CustomerAuthController::class, 'complete']);
    Route::post('/logout', [CustomerAuthController::class, 'logout']);
});
