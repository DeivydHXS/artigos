<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentaryController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\LoginRateLimiterMiddleware;
use App\Http\Middleware\VerifyEmailMiddleware;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login')->middleware([LoginRateLimiterMiddleware::class/*, VerifyEmailMiddleware::class*/]);
    Route::post('register', 'register');
    Route::post('logout', 'logout')->middleware([JwtMiddleware::class]);

    Route::get('verify/{id}/{hash}', 'verify')->name('verification.verify');
    Route::post('verification-notification', 'verification')->name('verification.send');

    Route::post('forgot-password', 'forgotPassword');
    Route::post('reset-password/{email}/{token}', 'resetPassword');
});

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::controller(ArticleController::class)->prefix('articles')->group(function () {
        Route::get('feed', 'feed');
        Route::get('', 'index');
        Route::post('', 'create');
        Route::post('delete-support-file/{support_file_id}', 'deleteSupportFile');
        Route::prefix('{article}')->group(function () {
            Route::get('', 'view');
            Route::post('', 'update');
            Route::delete('', 'delete');
            Route::post('comment', 'comment');

            Route::post('like', 'like');
            Route::delete('like', 'dislike');

            Route::post('favorite', 'favorite');
            Route::delete('favorite', 'unfavorite');
        });
    });

    Route::controller((CommentaryController::class))->prefix('commentary/{commentary}')->group(function () {
        Route::post('like', 'like');
        Route::delete('dislike', 'dislike');
        Route::put('', 'update');
        Route::delete('', 'delete');
    });

    Route::controller(CategoryController::class)->prefix('categories')->group(function () {
        Route::get('', 'index');
        Route::post('', 'create');
        Route::prefix('{category_id}')->group(function () {
            Route::put('', 'update');
            Route::delete('', 'delete');
        });
    });

    Route::controller(UserController::class)->prefix('user')->group(function () {
        Route::get('', 'view');
        Route::post('', 'update');
        Route::delete('', 'delete');
        Route::get('favorites', 'favorites');
    });
});
