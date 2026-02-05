<?php

namespace Tests\Feature;

use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_user(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $this->assertTrue($user->id == 1);
        $this->assertTrue($user->name == 'Usuário de Teste');
        $this->assertTrue($user->getFirstName() == 'Usuário');
        $this->assertTrue($user->email == 'teste@email.com');
        $this->assertTrue($user->birthday == '2002-08-18');
        $this->assertTrue($user->bio == 'Bio de teste.'); 
    }

    public function test_update_user(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $request = new Request([
            'name' => 'Teste Dois',
            'email' => 'teste2@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste dois.'
        ]);
        $user = UserService::update($user, $request);

        $this->assertTrue($user->id == 1);
        $this->assertTrue($user->name == 'Teste Dois');
        $this->assertTrue($user->getFirstName() == 'Teste');
        $this->assertTrue($user->email == 'teste2@email.com');
        $this->assertTrue($user->birthday == '2002-08-18');
        $this->assertTrue($user->bio == 'Bio de teste dois.'); 
    }

    public function test_delete_user(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $user = UserService::delete($user);

        $this->assertNull($user);
    }

    public function test_hash_password(): void
    {
        $request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($request);

        $this->assertTrue(Hash::check('Senha123@', $user->password));
    }
}
