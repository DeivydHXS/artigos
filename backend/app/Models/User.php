<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'birthday',
        'bio',
        'password',
        'image_url'
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function commentaries(): HasMany
    {
        return $this->hasMany(Commentary::class);
    }

    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'favorites', 'user_id', 'article_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getCreatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['created_at'])->format('Y-m-d H:i:s');
    }

    public function getUpdatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('Y-m-d H:i:s');
    }

    public function getImageUrlAttribute($image_url)
    {
        if ($image_url) {
            return 'http://127.0.0.1:8000/storage/' . $image_url;
        }
        return '';
    }

    public function getFirstName()
    {
        return explode(' ', $this->name)[0];
    }

    public function sendPasswordResetNotification($token)
    {
        $url = env('FRONT_URL', 'http://localhost:5173') . "/reset-password/" . $this->email . "/" . $token;

        $this->notify(new ResetPasswordNotification($url));
    }
}
