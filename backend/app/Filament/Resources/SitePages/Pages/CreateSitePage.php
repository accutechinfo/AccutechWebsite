<?php

namespace App\Filament\Resources\SitePages\Pages;

use App\Filament\Resources\SitePages\SitePageResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateSitePage extends CreateRecord
{
    protected static string $resource = SitePageResource::class;

    protected function mutateFormDataBeforeCreate(
        array $data
    ): array {
        $data['slug'] = Str::slug(
            $data['slug'] ?: $data['title']
        );

        if (
            ($data['status'] ?? 'draft') === 'published'
            && empty($data['published_at'])
        ) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
