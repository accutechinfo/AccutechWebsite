<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitePage extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.site_pages';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'tags',
        'content',
        'author',
        'status',
        'banner_image',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'published_at',
        'category_id',
        'subcategory_id',
        'sort_order',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'category_id' => 'integer',
        'subcategory_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            SitePageCategory::class,
            'category_id',
            'id'
        );
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(
            SitePageSubcategory::class,
            'subcategory_id',
            'id'
        );
    }
}
