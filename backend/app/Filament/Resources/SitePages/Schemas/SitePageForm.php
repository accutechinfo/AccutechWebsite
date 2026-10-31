<?php

namespace App\Filament\Resources\SitePages\Schemas;

use App\Models\SitePageCategory;
use App\Models\SitePageSubcategory;
use App\Models\SitePage;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\Str;

class SitePageForm
{
     public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('title')
                    ->label('Page Title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(
                        function (?string $state, Set $set) {
                            $set('slug', Str::slug($state ?? ''));
                        }
                    )
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(
                        table: SitePage::class,
                        column: 'slug',
                        ignoreRecord: true
                    )
                    ->helperText('Unique URL slug for the page.'),

                Textarea::make('excerpt')
                    ->label('Short Description / Excerpt')
                    ->rows(4)
                    ->maxLength(1000)
                    ->columnSpanFull(),

                RichEditor::make('content')
                    ->label('Page Content')
                    ->required()
                    ->columnSpanFull(),

                Select::make('category_id')
                    ->label('Category')
                    ->options(fn (): array =>
                        SitePageCategory::query()
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->pluck('name', 'id')
                            ->all()
                    )
                    ->searchable()
                    ->preload()
                    ->live()
                    ->afterStateUpdated(
                        fn (Set $set) =>
                            $set('subcategory_id', null)
                    )
                    ->native(false),

                Select::make('subcategory_id')
                    ->label('Subcategory')
                    ->options(
                        function (Get $get): array {
                            $categoryId = $get('category_id');

                            if (!$categoryId) {
                                return [];
                            }

                            return SitePageSubcategory::query()
                                ->where('category_id', $categoryId)
                                ->orderBy('sort_order')
                                ->orderBy('name')
                                ->pluck('name', 'id')
                                ->all();
                        }
                    )
                    ->searchable()
                    ->native(false)
                    ->disabled(
                        fn (Get $get): bool =>
                            blank($get('category_id'))
                    ),

                TextInput::make('sort_order')
                    ->label('Sort Order')
                    ->numeric()
                    ->integer()
                    ->default(0)
                    ->minValue(0),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ])
                    ->default('draft')
                    ->required()
                    ->native(false),

                TextInput::make('author')
                    ->label('Author')
                    ->default('Accutech ERP Team')
                    ->maxLength(200),

                Textarea::make('tags')
                    ->label('Tags')
                    ->rows(2)
                    ->helperText('Comma-separated tags.')
                    ->columnSpanFull(),

                DateTimePicker::make('published_at')
                    ->label('Published At')
                    ->seconds(false),

                FileUpload::make('banner_image')
                    ->label('Banner Image')
                    ->image()
                    ->disk('legacy_page_banners')
                    ->visibility('public')
                    ->maxSize(8192)
                    ->acceptedFileTypes([
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                        'image/gif',
                    ])
                    ->imagePreviewHeight('180')
                    ->openable()
                    ->downloadable()
                    ->helperText(
                        'Upload a JPG, PNG, WEBP or GIF banner.'
                    )
                    ->columnSpanFull(),

                TextInput::make('meta_title')
                    ->label('Meta Title')
                    ->maxLength(200)
                    ->columnSpanFull(),

                Textarea::make('meta_description')
                    ->label('Meta Description')
                    ->rows(4)
                    ->columnSpanFull(),

                Textarea::make('meta_keywords')
                    ->label('Meta Keywords')
                    ->rows(2)
                    ->columnSpanFull(),

            ])
            ->columns(2);
    }
}
