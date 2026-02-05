<?php

namespace App\Services;

use App\Models\Article;
use App\Models\SupportFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleService
{
    public static function upload_files(Request $request, Article $article)
    {
        if ($request->file('thumbnail')) {
            if ($article->thumbnail_url != '') {
                Storage::delete(substr($article->thumbnail_url, 30));
            }
            $path = $request->file('thumbnail')->store('thumbnails');
            $article->thumbnail_url = $path;
        }

        if ($request->hasFile('support_files')) {
            $article->supportFiles()->createMany(array_map(fn($file) => [
                'name' => $file->getClientOriginalName(),
                'type' => $file->getClientOriginalExtension(),
                'path' => $file->store('support_files'),
            ], $request->file('support_files')));
        }

        return $article;
    }

    public static function create(User $user, Request $request)
    {
        $article = $user->articles()->create($request->only(['title', 'body', 'age_classification']));

        if ($request->categories) {
            $article->categories()->sync($request->categories);
        }

        $article = ArticleService::upload_files($request, $article);

        $article->push();

        return $article;
    }

    public static function update(Article $article, Request $request)
    {
        $article->update($request->all());

        if ($request->categories) {
            $article->categories()->sync($request->categories);
        }

        $article = ArticleService::upload_files($request, $article);

        $article->push();

        return $article;
    }

    public static function delete(Article $article)
    {
        if ($article->thumbnail_url != '') {
            Storage::delete(substr($article->thumbnail_url, 30));
        }

        $files = $article->supportFiles()->get();
        foreach ($files as $file) {
            Storage::delete(substr($file->path, 30));
        }

        $article->delete();
    }

    public static function deleteSupportFile($support_file_id)
    {
        $file = SupportFile::find($support_file_id)->first();
        Storage::delete(substr($file->path, 30));
        SupportFile::find($support_file_id)->delete();
    }

    public static function like(Request $request, Article $article, $user_id)
    {
        $like = $article->likes()->where('user_id', $user_id)->first();
        if ($like) {
            $like->update([
                'reaction' => $request->reaction
            ]);
        } else {
            $like = $article->likes()->create([
                'user_id' => $user_id,
                'reaction' => $request->reaction
            ]);
        }
        return $like;
    }

    public static function delete_like(Article $article, $user_id)
    {
        $like = $article->likes()->where('user_id', $user_id)->first();
        if ($like) {
            $like->delete();
        }
        return $like;
    }
}
