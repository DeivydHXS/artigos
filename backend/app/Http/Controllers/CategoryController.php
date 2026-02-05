<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $response = CategoryService::all();
        return ResponseService::send('Lista de categorias.', 200, $response);
    }

    public function create(Request $request)
    {
        $response = CategoryService::create($request);
        return ResponseService::send('Categoria criada com sucesso.', 201, $response);
    }

    public function update(Request $request, Category $category)
    {
        $response = CategoryService::update($category, $request);
        return ResponseService::send('Categoria atualizada com sucesso.', 200, $response);
    }

    public function delete(int $category_id)
    {
        $category = Category::find($category_id);

        if (! $category) {
            return ResponseService::send('Categoria não encontrada.', 422);
        }

        $response = CategoryService::delete($category);
        return ResponseService::send('Categoria deletada com sucesso.', 200, $response);
    }
}
