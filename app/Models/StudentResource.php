<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentResource extends Model
{
    protected $table = 'student_resources';

    protected $fillable = [
        'category',
        'title',
        'description',
        'date_modified',
        'download_link_1',
        'download_link_2',
        'order',
    ];
}
