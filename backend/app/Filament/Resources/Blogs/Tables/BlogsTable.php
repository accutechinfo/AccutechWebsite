<?php

namespace App\Filament\Resources\Blogs\Tables;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BlogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),



                ImageColumn::make('image')
                    ->label('Featured Image')
                    ->getStateUsing(function ($record): ?string {

                        $image = trim((string) $record->image);

                        if ($image === '') {
                            return null;
                        }

                        if (preg_match('#^https?://#i', $image)) {
                            return $image;
                        }

                        $image = str_replace('\\', '/', $image);
                        $image = ltrim($image, '/');

                        if (!str_starts_with($image, 'blogs/')) {
                            $image = 'blogs/' . basename($image);
                        }

                        return asset($image);
                    })
                    ->height(65)
                    ->width(100)
                    ->imageSize(100),


                TextColumn::make('title')
                    ->label('Blog Title')
                    ->searchable()
                    ->sortable()
                    ->limit(65)
                    ->wrap(),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('author')
                    ->label('Author')
                    ->searchable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (?string $state): string =>
                        strtolower($state ?? '') === 'published'
                            ? 'success'
                            : 'warning'
                    ),

                TextColumn::make('published_at')
                    ->label('Published Date')
                    ->dateTime('d M Y')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created Date')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'Published' => 'Published',
                        'Draft' => 'Draft',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->requiresConfirmation(),
            ])
            ->defaultSort('id', 'desc');
    }
}
