<?php

namespace App\Filament\Resources\SitePages\Pages;

use App\Filament\Resources\SitePages\SitePageResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Str;

class EditSitePage extends EditRecord
{
    protected static string $resource = SitePageResource::class;

    protected function mutateFormDataBeforeSave(
        array $data
    ): array {
        if (!empty($data['slug'])) {
            $data['slug'] = Str::slug($data['slug']);
        }

        return $data;
    }

    protected function getHeaderActions(): array
    {
        // No Delete button against the shared live DB.
        return [];
    }
}
