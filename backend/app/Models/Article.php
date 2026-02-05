<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class Article extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'body',
        'age_classification'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_article', 'article_id', 'category_id');
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites', 'article_id', 'user_id');
    }

    public function commentaries(): HasMany
    {
        return $this->hasMany(Commentary::class);
    }

    public function supportFiles(): HasMany
    {
        return $this->hasMany(SupportFile::class);
    }

    public function getCategoriesAttribute()
    {
        return $this->categories()->get();
    }

    public function getLikesAttribute()
    {
        return $this->likes()->get();
    }

    public function getIsFavoriteAttribute()
    {
        $user = JWTAuth::user();
        return ($this->favoritedBy()->wherePivot('user_id', $user->id)->count()) > 0;
    }

    public function getCountCommentsAttribute()
    {
        return $this->commentaries()->count();
    }

    public function getCountLikesAttribute()
    {
        return $this->likes()->count();
    }

    public function getAuthorAttribute()
    {
        return $this->user()->get()->first();
    }

    public function getSupportFilesAttribute()
    {
        return $this->supportFiles()->get();
    }

    public function getUserLikeAttribute()
    {
        $user = JWTAuth::user();
        $like = $this->likes()->where('user_id', $user->id)->first();
        return $like;
    }

    protected $appends = ['categories', 'likes', 'is_favorite', 'user_like', 'count_comments', 'count_likes', 'author', 'support_files'];

    use Searchable;

    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
            'thumbnail_url' => $this->thumbnail_url,
        ];
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function getThumbnailUrlAttribute($thumbnail_url)
    {
        if ($thumbnail_url) {
            return 'http://127.0.0.1:8000/storage/' . $thumbnail_url;
        }
        return '';
    }
}
