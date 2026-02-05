<?php

namespace Database\Seeders;

use App\Models\CategoryArticle;
use Illuminate\Database\Seeder;

class CategoriesArticlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CategoryArticle::truncate();

        for ($i = 1; $i < 15; $i++) {
            $category_id = mt_rand(1, 10);
            CategoryArticle::create([
                'category_id' => $category_id,
                'article_id' => $i,
            ]);
        }
    }
}
