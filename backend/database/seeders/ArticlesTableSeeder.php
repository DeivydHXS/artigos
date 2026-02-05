<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Article::truncate();

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 15; $i++) {
            $imageContents = file_get_contents("https://picsum.dev/1050/420");
            $fileName = Str::uuid() . '.jpg';

            Storage::put("thumbnails/{$fileName}", $imageContents);

            $user_id = mt_rand(1, 10);
            User::find($user_id)->articles()->create([
                'title' => $faker->sentence,
                'body' => $faker->paragraph,
                'age_classification' => [12, 16, 18, 0][array_rand([12, 16, 18, 0], 1)],
                'thumbnail_url' => "thumbnails/{$fileName}"
            ]);
        }
    }
}
