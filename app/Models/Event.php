<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'date',
        'title',
        'desc',
        'icon',
        'tag',
        'tagType',
        'slots',
        'time',
        'venue',
        'image',
    ];

    public $timestamps = false;
}
