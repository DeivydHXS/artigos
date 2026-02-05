<?php

namespace Tests\Feature;

use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_login(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $response = AuthService::login([
            'email' => $user->email,
            'password' => 'Senha123@'
        ]);

        $this->assertNotNull($response);
    }

    public function test_invalid_login(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $response = AuthService::login([
            'email' => $user->email,
            'password' => 'Senha123'
        ]);

        $this->assertNull($response);
    }
}
