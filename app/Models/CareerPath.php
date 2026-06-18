<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerPath extends Model
{
    protected $table = 'career_paths';

    protected $fillable = [
        'icon',
        'title',
        'tags',
        'desc',
        'skills',
        'outlook',
        'salary',
        'color',
        'order',
    ];

    protected $casts = [
        'tags' => 'array',
        'skills' => 'array',
    ];
}
