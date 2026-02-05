<?php

namespace Tests\Feature;

use App\Services\CategoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_categories(): void
    {
        $category1 = CategoryService::create(new Request(['name' => 'Categoria 1']));
        $category2 = CategoryService::create(new Request(['name' => 'Categoria 2']));
        $category3 = CategoryService::create(new Request(['name' => 'Categoria 3']));

        $categories = CategoryService::all();

        $this->assertTrue(count($categories) == 3);
        $this->assertTrue($categories[0]->name == 'Categoria 1');
        $this->assertTrue($categories[1]->name == 'Categoria 2');
        $this->assertTrue($categories[2]->name == 'Categoria 3');
    }

    public function test_create_category(): void
    {
        $request = new Request([
            'name' => 'Categoria teste',
        ]);
        $category = CategoryService::create($request);

        $this->assertTrue($category->id == 1);
        $this->assertTrue($category->name == 'Categoria teste');
    }

    public function test_update_category(): void
    {
        $request = new Request([
            'name' => 'Categoria teste',
        ]);
        $category = CategoryService::create($request);

        $request = new Request([
            'name' => 'Categoria teste 2'
        ]);
        $category = CategoryService::update($category, $request);

        $this->assertTrue($category->id == 1);
        $this->assertTrue($category->name == 'Categoria teste 2');
    }

    public function test_delete_category(): void
    {
        $request = new Request([
            'name' => 'Categoria teste'
        ]);
        $category = CategoryService::create($request);

        $category = CategoryService::delete($category);

        $this->assertNull($category);
    }
}
