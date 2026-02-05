<?php

namespace Database\Seeders;

use App\Models\Commentary;
use Illuminate\Database\Seeder;

class CommentariesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Commentary::truncate();

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 30; $i++) {
            $user_id = mt_rand(1, 15);
            $article_id = mt_rand(1, 15);
            Commentary::create([
                'message' => $faker->sentence(mt_rand(2,8)),
                'user_id' => $user_id,
                'article_id' => $article_id,
            ]);
        }
    }
}
