<?php

namespace Tests\Feature;

use App\Services\ArticleService;
use App\Services\CommentaryService;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class CommentaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_author_create_comment(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $comment = CommentaryService::create($article, $author->id, 'Comentario de teste.');

        $this->assertTrue($comment->id == 1);
        $this->assertTrue($comment->message == 'Comentario de teste.');
        $this->assertTrue($comment->user_id == $author->id);
    }

    public function test_author_update_comment(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $comment = CommentaryService::create($article, $author->id, 'Comentario de teste.');
        $comment = CommentaryService::update($comment, 'Comentario de teste 2.');

        $this->assertTrue($comment->id == 1);
        $this->assertTrue($comment->message == 'Comentario de teste 2.');
        $this->assertTrue($comment->user_id == $author->id);
    }

    public function test_user_create_comment(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $user_request = new Request([
            'name' => 'Usuário de Teste Dois',
            'email' => 'teste2@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $comment = CommentaryService::create($article, $user->id, 'Comentario de teste.');

        $this->assertTrue($comment->id == 1);
        $this->assertTrue($comment->message == 'Comentario de teste.');
        $this->assertFalse($comment->user_id == $author->id);
        $this->assertTrue($comment->user_id == $user->id);
    }

    public function test_user_update_comment(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $user_request = new Request([
            'name' => 'Usuário de Teste Dois',
            'email' => 'teste2@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $comment = CommentaryService::create($article, $user->id, 'Comentario de teste.');
        $comment = CommentaryService::update($comment, 'Comentario de teste 2.');

        $this->assertTrue($comment->id == 1);
        $this->assertTrue($comment->message == 'Comentario de teste 2.');
        $this->assertFalse($comment->user_id == $author->id);
        $this->assertTrue($comment->user_id == $user->id);
    }
}
