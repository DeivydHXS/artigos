<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Commentary;
use App\Models\Like;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public static function upload_files(Request $request, User $user)
    {
        if ($request->file('profile_image')) {
            if ($user->image_url != '') {
                Storage::delete(substr($user->image_url, 30));
            }
            $path = $request->file('profile_image')->store('profile_images');
            $user->image_url = $path;
            $user->save();
        }
        return $user;
    }

    public static function create(Request $request)
    {
        $user = User::create($request->only(['name', 'email', 'password', 'password_confirmation', 'birthday', 'bio']));
        return UserService::upload_files($request, $user);
    }

    public static function update(User $user, Request $request)
    {
        $user->update($request->only(['name', 'email', 'password', 'password_confirmation', 'birthday', 'bio']));
        return UserService::upload_files($request, $user);
    }

    public static function delete(User $user)
    {
        Storage::delete(substr($user->image_url, 30));
        Like::where('user_id', $user->id)->delete();
        Commentary::where('user_id', $user->id)->delete();
        Article::where('user_id', $user->id)->delete();
        $user->delete();
    }
}
