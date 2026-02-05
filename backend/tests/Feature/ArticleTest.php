<?php

namespace Tests\Feature;

use App\Services\ArticleService;
use App\Services\CategoryService;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_article(): void
    {
        $user_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $category1 = CategoryService::create(new Request(['name' => 'Php']));
        $category2 = CategoryService::create(new Request(['name' => 'Ts']));

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12,
            'categories' => [$category2, $category1->id]
        ]);
        $article = ArticleService::create($user, $article_request);

        $this->assertTrue($article->id == 1);
        $this->assertTrue($article->title == 'Artigo de teste');
        $this->assertTrue($article->body == 'Corpo de texto para teste.');
        $this->assertTrue($article->age_classification == 12);
        $this->assertTrue($article->author->name == 'Usuário de Teste');
        $this->assertTrue($article->categories[0]->id == $category2->id);
        $this->assertTrue($article->categories[1]->id == $category1->id);
    }

    public function test_update_article(): void
    {
        $user_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $category1 = CategoryService::create(new Request(['name' => 'Php']));
        $category2 = CategoryService::create(new Request(['name' => 'Ts']));

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12,
            'categories' => [$category2, $category1->id]
        ]);
        $article = ArticleService::create($user, $article_request);

        $article_request = new Request([
            'title' => 'Artigo de teste 2',
            'body' => 'Corpo de texto para teste 2.',
            'age_classification' => 16,
            'categories' => [$category2]
        ]);
        $article = ArticleService::update($article, $article_request);

        $this->assertTrue($article->id == 1);
        $this->assertTrue($article->title == 'Artigo de teste 2');
        $this->assertTrue($article->body == 'Corpo de texto para teste 2.');
        $this->assertFalse($article->age_classification == 12);
        $this->assertTrue($article->age_classification == 16);
        $this->assertTrue($article->author->name == 'Usuário de Teste');
        $this->assertTrue($article->categories[0]->id == $category2->id);
    }

    public function test_delete_article(): void
    {
        $user_request = new Request([
            'name' => 'Usuário de Teste',
            'email' => 'teste@email.com',
            'password' => 'Senha123@',
            'birthday' => '2002-08-18',
            'bio' => 'Bio de teste.'
        ]);
        $user = UserService::create($user_request);

        $category1 = CategoryService::create(new Request(['name' => 'Php']));
        $category2 = CategoryService::create(new Request(['name' => 'Ts']));

        $article_request = new Request([
            'title' => 'Artigo de teste',
            'body' => 'Corpo de texto para teste.',
            'age_classification' => 12,
            'categories' => [$category2, $category1->id]
        ]);
        $article = ArticleService::create($user, $article_request);

        $article = ArticleService::delete($article);

        $this->assertNull($article);
    }
}
