<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        $url = 'http://127.0.0.1:5173/' . substr($url, 26);
        return (new MailMessage)
            ->subject('Verifique seu email')
            ->line('Clique no botão abaixo para verificar seu e-mail.')
            ->action('Verifique seu e-mail', $url);
    });
    }
}
