<?php

namespace App\Http\Middleware;

use App\Services\ResponseService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class LoginRateLimiterMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $executed = RateLimiter::attempt(
            'tooManyAttempts:' . $request->email,
            $perMinute = 5,
            function () {
                return true;
            },
            $decayRate = 60,
        );

        if (! $executed) {
            return response()->json(['error' => 'Credenciais inválidas.'], 429);
        }

        return $next($request);
    }
}
