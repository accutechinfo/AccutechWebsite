<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SitePageCategory extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.site_page_categories';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'icon_class',
        'sort_order',
        'status',
    ];

    public function subcategories(): HasMany
    {
        return $this->hasMany(
            SitePageSubcategory::class,
            'category_id',
            'id'
        );
    }

    public function pages(): HasMany
    {
        return $this->hasMany(
            SitePage::class,
            'category_id',
            'id'
        );
    }
}
