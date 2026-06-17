<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsItem extends Model
{
    use HasFactory;

    protected $table = 'news_items';

    protected $fillable = [
        'category',
        'date',
        'title',
        'excerpt',
        'content',
        'readTime',
        'featured',
        'emoji',
        'images',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'images' => 'array',
    ];

    public $timestamps = false;
}
