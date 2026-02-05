<?php

namespace Tests\Feature;

use App\Services\ArticleService;
use App\Services\LikeService;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class LikeTest extends TestCase
{
    use RefreshDatabase;

    public function test_author_like_article(): void
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

        $like = ArticleService::like(new Request(['reaction' => 'H']), $article, $author->id);

        $this->assertTrue($like->id == 1);
        $this->assertTrue($like->reaction == 'H');
        $this->assertTrue($like->user_id == $author->id);
    }

    public function test_author_change_like_reaction_article(): void
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

        $like = ArticleService::like(new Request(['reaction' => 'H']), $article, $author->id);
        $like2 = ArticleService::like(new Request(['reaction' => 'L']), $article, $author->id);

        $this->assertTrue($like->id == $like2->id);
        $this->assertTrue($like2->reaction == 'L');
        $this->assertTrue($like->user_id == $author->id);
    }

    public function test_user_like_article(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $user_request = new Request([
            'name' => 'Usuário de Teste 2',
            'email' => 'teste2@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $like = ArticleService::like(new Request(['reaction' => 'H']), $article, $user->id);

        $this->assertTrue($like->id == 1);
        $this->assertTrue($like->reaction == 'H');
        $this->assertFalse($like->user_id == $author->id);
        $this->assertTrue($like->user_id == $user->id);
    }

    public function test_user_change_like_reaction_article(): void
    {
        $author_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $author = UserService::create($author_request);

        $user_request = new Request([
            'name' => 'Usuário de Teste 2',
            'email' => 'teste2@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12
        ]);
        $article = ArticleService::create($author, $article_request);

        $like = ArticleService::like(new Request(['reaction' => 'H']), $article, $user->id);
        $like2 = ArticleService::like(new Request(['reaction' => 'L']), $article, $user->id);

        $this->assertTrue($like->id == $like2->id);
        $this->assertTrue($like2->reaction == 'L');
        $this->assertFalse($like->user_id == $author->id);
        $this->assertTrue($like->user_id == $user->id);
    }
}
