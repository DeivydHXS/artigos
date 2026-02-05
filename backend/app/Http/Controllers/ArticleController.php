<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\ArticleService;
use App\Services\CommentaryService;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ArticleController extends Controller
{
    private $user;

    public function __construct()
    {
        $this->user = JWTAuth::user();
    }

    public function feed(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'categories' => 'array',
            'categories.*' => 'int|distinct'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos inválidos.', 422, ['categories' => 'Formato inválido.']);
        }

        $validate = Validator::make($request->all(), [
            'categories.*' => 'exists:categories,id'
        ]);

        if ($validate->fails()) {
            return ResponseService::send('Campos inválidos.', 422, ['categories' => 'Escolha uma categoria válida.']);
        }

        $search = $request->search ? $request->search :  '';
        $categories = $request->categories ? $request->categories : [];
        $response = Article::search($search)->query(function ($query) use ($categories) {
            $user_age = date_diff(date_create($this->user->birthday), date_create())->format('%Y');
            $query->where('age_classification', '<=', $user_age);
            if (count($categories) > 0) {
                $query->whereHas('categories', function ($query) use ($categories) {
                    if (count($categories) > 0) {
                        $query->whereIn('categories.id', $categories);
                    }
                });
            }
        })->orderByDesc('created_at')->get();

        return ResponseService::send('Sucesso', 200, $response);
    }

    public function index(Request $request)
    {
        if ($request->categories) {
            $response = $this->user->articles()->whereRelation('categories', 'category_id', $request->categories)->orderByDesc('created_at')->get();
        } else {
            $response = $this->user->articles()->orderByDesc('created_at')->get();
        }
        return ResponseService::send('Sucesso', 200, $response);
    }

    public function view(Article $article)
    {
        $comments = $article->commentaries()->orderByDesc('created_at')->get();
        return ResponseService::send('Sucesso', 200, ['article' => $article, 'comments' => $comments]);
    }

    public function validate($request)
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'body' => 'required'
        ]);

        if ($validate->fails()) {
            return [
                'message' => 'Campos obrigatórios inválidos.',
                'code' => 422,
                'errors' => $validate->errors()->toArray()
            ];
        }

        $validate = Validator::make($request->all(), [
            'categories' => 'array',
            'age_classification' => 'integer',
            'thumbnail' => 'file|max:2048',
            'support_files' => 'array|max:5',
            'support_files.*' => 'file|max:2048'
        ]);

        if ($validate->fails()) {
            return [
                'message' => 'Campos inválidos.',
                'code' => 422,
                'errors' => $validate->errors()->toArray()
            ];
        }

        $validate = Validator::make($request->all(), [
            'categories.*' => 'int|distinct',
        ]);

        if ($validate->fails()) {
            return [
                'message' => 'Campos inválidos.',
                'code' => 422,
                'errors' => ['categories' => 'O campo de categorias deve conter apenas números inteiros.']
            ];
        }

        $validate = Validator::make($request->all(), [
            'categories.*' => 'exists:categories,id'
        ]);

        if ($validate->fails()) {
            return [
                'message' => 'Campos inválidos.',
                'code' => 422,
                'errors' => ['categories' => 'O campo de categorias deve conter ids válidos.']
            ];
        }
        return false;
    }

    public function create(Request $request)
    {
        $hasErrors = ArticleController::validate($request);
        if ($hasErrors) {
            return ResponseService::send($hasErrors['message'], $hasErrors['code'], $hasErrors['errors']);
        }

        $article = ArticleService::create($this->user, $request);

        return ResponseService::send('Artigo criado com sucesso.', 201, $article);
    }

    public function update(Article $article, Request $request)
    {
        if ($article->user_id !== $this->user->id) {
            return ResponseService::send('Não autorizado.', 403);
        }

        $hasErrors = ArticleController::validate($request);
        if ($hasErrors) {
            return ResponseService::send($hasErrors['message'], $hasErrors['code'], $hasErrors['errors']);
        }

        $article = ArticleService::update($article, $request);

        return ResponseService::send('Artigo atualizado com sucesso.', 200, $article);
    }

    public function delete(Article $article)
    {
        if ($article->user_id !== $this->user->id) {
            return ResponseService::send('Não autorizado.', 403);
        }

        ArticleService::delete($article);

        return ResponseService::send('Artigo deletado com sucesso.');
    }

    public function deleteSupportFile(string $support_file_id)
    {
        ArticleService::deleteSupportFile($support_file_id);
        return ResponseService::send('Sucesso ao deletar arquivos de apoio.');
    }

    public function comment(Article $article, Request $request)
    {
        $comment = CommentaryService::create($article, $this->user->id, $request->message);
        return ResponseService::send('Comentário criado com sucesso.', 201, $comment);
    }

    public function like(Article $article, Request $request)
    {
        $like = ArticleService::like($request, $article, $this->user->id);
        return ResponseService::send('Artigo curtido com sucesso.', 200, $like);
    }

    public function dislike(Article $article)
    {
        $dislike = ArticleService::delete_like($article, $this->user->id);
        if ($dislike) {
            return ResponseService::send('Curtida removida com sucesso.');
        }
        return ResponseService::send('Curtida não encontrado', 404);
    }

    public function favorite(Article $article)
    {
        $this->user->favorites()->attach($article->id);
        return ResponseService::send('Artigo adicionado aos favoritos.');
    }

    public function unfavorite(Article $article)
    {
        $this->user->favorites()->detach($article->id);
        return ResponseService::send('Artigo removido dos favoritos');
    }
}
