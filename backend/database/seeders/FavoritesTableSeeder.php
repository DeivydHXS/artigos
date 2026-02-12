<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Favorites;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoritesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Favorites::truncate();

        $users = User::inRandomOrder()->limit(15)->get();
        $articles = Article::inRandomOrder()->limit(15)->get();

        foreach ($users as $user) {
            Favorites::create([
                'user_id' => $user->id,
                'article_id' => $articles->pop()->id,
            ]);
        }
    }
}
