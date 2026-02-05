<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();

        $faker = \Faker\Factory::create();

        $password = Hash::make('Senha123@');

        $imageContents = file_get_contents("https://i.pravatar.cc/300?img=" . rand(1, 70));
        $fileName = Str::uuid() . '.jpg';

        Storage::put("profile_images/{$fileName}", $imageContents);

        User::create([
            'name' => 'Deivyd',
            'email' => 'deivyd@email.com',
            'password' => $password,
            'birthday' => '2002-08-18',
            'bio' => 'Conta de teste',
            'image_url' => "profile_images/{$fileName}"
        ]);

        for ($i = 0; $i < 14; $i++) {
            $imageContents = file_get_contents("https://i.pravatar.cc/300?img=" . rand(1, 70));
            $fileName = Str::uuid() . '.jpg';

            Storage::put("profile_images/{$fileName}", $imageContents);

            User::create([
                'name' => $faker->name,
                'email' => $faker->email,
                'password' => $password,
                'birthday' => $faker->date('Y-m-d', 'now'),
                'bio' => $faker->paragraph(),
                'image_url' => "profile_images/{$fileName}"
            ]);
        }
    }
}
