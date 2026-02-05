<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UsersTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(ArticlesTableSeeder::class);
        $this->call(FavoritesTableSeeder::class);
        $this->call(LikesTableSeeder::class);
        $this->call(CategoriesArticlesTableSeeder::class);
        $this->call(CommentariesTableSeeder::class);
    }
}
