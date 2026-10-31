
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\PublicPageController;
Route::post('/enquiries', [
    EnquiryController::class,
    'submit',
])->middleware('throttle:5,1');

Route::get('/pages/categories', [PublicPageController::class, 'categories']);
Route::get('/pages', [PublicPageController::class, 'index']);
Route::get('/pages/{slug}', [PublicPageController::class, 'show']);
