<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\ResponseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmailMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = User::where('email', $request->email)->first();
        if (!$user->hasVerifiedEmail()) {
            return ResponseService::send('Email não verificado.', 403);
        }

        return $next($request);
    }
}
