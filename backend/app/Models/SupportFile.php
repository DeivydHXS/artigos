<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportFile extends Model
{
    protected $fillable = [
        'name',
        'type',
        'path',
        'article_id',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function getPathAttribute($path)
    {
        return env('APP_URL', 'http://localhost:8000') . '/storage/' . $path;
    }
}
