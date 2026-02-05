<?php

namespace App\Services;

use DateTime;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public static function login(mixed $credentials)
    {
        if (!JWTAuth::attempt($credentials)) {
            return null;
        }

        $user = JWTAuth::user();

        $response = [
            'user' => $user,
            'token' => [
                'access_token' =>  JWTAuth::fromUser($user),
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
                'created_at' => (new DateTime())->format('Y-m-d H:i:s'),
            ]
        ];

        return $response;
    }

    public static function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}
