<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class Commentary extends Model
{
    protected $fillable = ['message','user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function getLikesAttribute()
    {
        return $this->likes()->get();
    }

    public function getAuthorAttribute()
    {
        return $this->user()->get()->first();
    }
    
    public function getIsAuthorAttribute()
    {
        $user = JWTAuth::user();
        return $this->user->id === $user->id;
    }

    protected $appends = ['likes', 'author', 'is_author'];
}
