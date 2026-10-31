<?php

namespace App\Filament\Resources\SitePages;

use App\Models\SitePage;
use App\Filament\Resources\SitePages\Pages;
use App\Filament\Resources\SitePages\Schemas\SitePageForm;
use App\Filament\Resources\SitePages\Tables\SitePagesTable;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class SitePageResource extends Resource
{
    protected static ?string $model = SitePage::class;

    protected static ?string $slug = 'pages';

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $navigationLabel = 'Pages';

    protected static ?string $modelLabel = 'Page';

    protected static ?string $pluralModelLabel = 'Pages';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return SitePageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SitePagesTable::configure($table);
    }

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function canCreate(): bool
    {
        return true;
    }

    public static function canEdit(Model $record): bool
    {
        return true;
    }

    // Keep deletion disabled while sharing the live DB.
    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSitePages::route('/'),
            'create' => Pages\CreateSitePage::route('/create'),
            'edit' => Pages\EditSitePage::route('/{record}/edit'),
        ];
    }
}
