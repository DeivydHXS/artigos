<?php

namespace App\Http\Controllers;

use App\Models\Commentary;
use App\Services\CommentaryService;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class CommentaryController extends Controller
{
    private $user;

    public function __construct()
    {
        $this->user = JWTAuth::user();
    }

    public function like(Commentary $commentary, Request $request)
    {
        $like = CommentaryService::like($request, $commentary, $this->user->id);
        return ResponseService::send('Comentário curtido com sucesso.');
    }

    public function dislike(Commentary $commentary)
    {
        $like = CommentaryService::delete_like($commentary, $this->user->id);
        if ($like) {
            return ResponseService::send('Curtida removida com sucesso.');
        }
        return ResponseService::send('Curtida não encontrada.', 404);
    }   

    public function update(Request $request, Commentary $commentary)
    {
        $response = CommentaryService::update($commentary, $request);
        return ResponseService::send('Comentário atualizado com sucesso.', 200, $response);
    }

    public function delete(Commentary $commentary)
    {
        $response = CommentaryService::delete($commentary);
        return ResponseService::send('Comentário deletado com sucesso.');
    }
}