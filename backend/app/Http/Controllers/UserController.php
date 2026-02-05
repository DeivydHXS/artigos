<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    private $user;

    public function __construct()
    {
        $this->user = JWTAuth::user();
    }

    public function view()
    {
        return ResponseService::send('Perfil do usuário.', 200, ['user' => $this->user]);
    }

    public function update(Request $request)
    {
        $validation = $request->only(['name', 'email', 'birthday', 'bio']);
        $validate = Validator::make($validation, [
            'name' => 'regex:/^[A-Za-zÀ-ÿ\s]+$/i|max:255',
            'email' => 'email|max:255',
            'birthday' => 'date',
            'bio' => 'string|max:300'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $validate = Validator::make($validation, [
            'email' => 'unique:users,email',
        ]);

        if ($this->user->email != $request->email && $validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 409,  ['email' => 'O email informado já está em uso.']);
        }

        UserService::update($this->user, $request);

        return ResponseService::send('Usuário atualizado com sucesso.', 200, $this->user);
    }

    public function delete()
    {
        AuthService::logout();
        UserService::delete($this->user);
        return ResponseService::send('Usuário deletado com sucesso.');
    }

    public function favorites()
    {
        $favorites = $this->user->favorites()->with('categories')->get();
        return ResponseService::send('Lista de favoritos.', 200, $favorites);
    }
}
