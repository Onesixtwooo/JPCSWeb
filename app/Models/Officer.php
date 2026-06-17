<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'title', 'officer_name', 'year_level', 'motto', 'order'];

    public $timestamps = false;
}
