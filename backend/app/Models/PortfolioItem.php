<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    protected $fillable = [
        'title',
        'category',
        'category_label',
        'metrics',
        'desc',
        'tags',
        'image',
        'project_url',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}
