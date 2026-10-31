<?php

namespace App\Filament\Resources\SitePages\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\EditAction;
use App\Models\SitePageCategory;

class SitePagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                ImageColumn::make('banner_image')
                    ->label('Banner')
                    ->disk('legacy_page_banners')
                    ->height(60)
                    ->width(100),

                TextColumn::make('title')
                    ->label('Page Title')
                    ->searchable()
                    ->sortable()
                    ->limit(65)
                    ->wrap(),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->limit(35)
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->placeholder('—')
                    ->sortable(),

                TextColumn::make('subcategory.name')
                    ->label('Subcategory')
                    ->placeholder('—'),

                TextColumn::make('author')
                    ->label('Author')
                    ->searchable()
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(
                        fn (?string $state): string =>
                            $state === 'published'
                                ? 'success'
                                : 'warning'
                    ),

                TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),

                TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime('d M Y')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),

            ])
            ->filters([

                SelectFilter::make('status')
                    ->options([
                        'published' => 'Published',
                        'draft' => 'Draft',
                    ]),

                SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(
                        fn (): array =>
                            SitePageCategory::query()
                                ->orderBy('name')
                                ->pluck('name', 'id')
                                ->all()
                    ),

            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->paginated([10, 25, 50, 100]);
    }
}
