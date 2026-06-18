<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlumniTestimonial extends Model
{
    protected $table = 'alumni_testimonials';

    protected $fillable = [
        'name',
        'role',
        'company',
        'year',
        'quote',
        'avatar',
        'image',
        'color',
        'order',
    ];
}
