<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryService
{
    public static function all()
    {
        $category = Category::all();
        return $category;
    }

    public static function create(Request $request)
    {
        $category = Category::create($request->only(['name']));
        return $category;
    }

    public static function update(Category $category, Request $request)
    {
        $category->update($request->only(['name']));
        return $category;
    }

    public static function delete(Category $category)
    {
        $category->delete();
        return $category;
    }
}
