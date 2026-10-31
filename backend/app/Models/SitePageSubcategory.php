<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitePageSubcategory extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.site_page_subcategories';

    protected $primaryKey = 'id';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'icon_class',
        'sort_order',
        'status',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            SitePageCategory::class,
            'category_id',
            'id'
        );
    }
}
