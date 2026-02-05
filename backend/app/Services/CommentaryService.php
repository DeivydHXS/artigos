<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use App\Models\Commentary;
use Illuminate\Http\Request;

class CommentaryService
{
    public static function create(Article $article, $user_id, string $message)
    {
        $commentary = $article->commentaries()->create([
            'message' => $message,
            'user_id' => $user_id
        ]);
        return $commentary;
    }

    public static function update(Commentary $commentary, string $message)
    {
        $commentary->update([
            'message' => $message
        ]);
        return $commentary;
    }

    public static function delete(Commentary $commentary)
    {
        $commentary->delete();
        return $commentary;
    }

    public static function like(Request $request, Commentary $commentary, $user_id)
    {
        $like = $commentary->likes()->where('user_id', $user_id)->first();
        if ($like) {
            $like->update([
                'reaction' => $request->only(['reaction'])
            ]);
        } else {
            $like = $commentary->likes()->create([
                'user_id' => $user_id,
                'reaction' => $request->reaction
            ]);
        }
        return $like;
    }

    public static function delete_like(Commentary $commentary, $user_id)
    {
        $like = $commentary->likes()->where('user_id', $user_id)->first();
        if ($like) {
            $like->delete();
        }
        return $like;
    }
}
