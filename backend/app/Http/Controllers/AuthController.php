<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as RulesPassword;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validation = $request->only(['name', 'email', 'birthday', 'password', 'password_confirmation']);
        $validate = Validator::make($validation, [
            'name' => 'required',
            'email' => 'required',
            'birthday' => 'required',
            'password' => 'required',
            'password_confirmation' => 'required'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 400,  $validate->errors()->toArray());
        }

        $validate = Validator::make($validation, [
            'name' => 'regex:/^[A-Za-zÀ-ÿ\s]+$/i|max:255',
            'email' => 'email|max:255',
            'birthday' => [Rule::date()->format('Y-m-d')->before(today()->subYears(10))],
            'bio' => 'string|max:300',
            'password' => ['confirmed', RulesPassword::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()]
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $validate = Validator::make($validation, [
            'email' => 'unique:users,email',
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 409,  ['email' => 'O email informado já está em uso.']);
        }

        $user = UserService::create($request);
        $user->sendEmailVerificationNotification();

        return ResponseService::send('Usuário criado com sucesso.', 201, $user);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $validate = Validator::make($credentials, [
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 400,  $validate->errors()->toArray());
        }

        $validate = Validator::make($credentials, [
            'email' => 'email',
            'password' => 'string',
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $validate = Validator::make($credentials, [
            'email' => 'regex:/^[\w+\-\.]+@([\w-]+\.)+[\w-]{2,4}$/i',
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $response = AuthService::login($credentials);

        if (!$response) {
            return ResponseService::send('Campos obrigatórios inválidos.', 401,  [
                'email' => "Email e/ou senha inválido(s).",
                'password' => "Email e/ou senha inválido(s)."
            ]);
        }

        return ResponseService::send('Login realizado com sucesso.', 200, $response);
    }

    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return ResponseService::send('Token atualizado', 200, ['token' => $token]);
    }

    public function logout()
    {
        AuthService::logout();
        return ResponseService::send('Deslogado com sucesso.');
    }

    public function verify($id, $hash)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Link de validação inválido.'], 403);
        }
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return ResponseService::send('Email verificado com sucesso.');
    }

    public function verification(Request $request)
    {
        $validate = Validator::make($request->only(['email']), [
            'email' => 'required|email'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return ResponseService::send('Não encontramos um usuário com esse endereço de e-mail.', 422);
        }

        $user->sendEmailVerificationNotification();

        return ResponseService::send('Link de validação enviado!');
    }

    public function forgotPassword(Request $request)
    {
        $validate = Validator::make($request->only(['email']), [
            'email' => 'required|email'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? ResponseService::send(__($status), 200)
            : ResponseService::send(__($status), 500);
    }

    public function resetPassword($email, $token, Request $request)
    {
        $validation = [
            'email' => $email,
            'token' => $token,
            'password' => $request->password,
            'password_confirmation' => $request->password_confirmation
        ];

        $validate = Validator::make($validation, [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string',
            'password_confirmation' => 'required|string'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos obrigatórios inválidos.', 422,  $validate->errors()->toArray());
        }

        $status = Password::reset(
            $validation,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);

                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? ResponseService::send(__($status), 200)
            : ResponseService::send(__($status), 500);
    }
}
