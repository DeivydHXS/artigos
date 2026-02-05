<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Seeder;

class LikesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Like::truncate();

        $users = User::orderBy('RANDOM()')->limit(15)->get();
        $articles = Article::orderBy('RANDOM()')->limit(15)->get();

        foreach ($users as $user) {
            Like::create([
                'reaction' => array_rand(['L','H','D'], 1),
                'user_id' => $user->id,
                'likeable_id' => $articles->pop()->id,
                'likeable_type' => 'App\Models\Article',
            ]);
        }
    }
}
