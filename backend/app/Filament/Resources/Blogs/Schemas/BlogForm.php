<?php

namespace App\Filament\Resources\Blogs\Schemas;
use Filament\Infolists\Components\TextEntry;
use Illuminate\Support\HtmlString;
use App\Models\Blog;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Illuminate\Support\Str;


class BlogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Blog Title')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, $set) {
                        $set('slug', Str::slug($state));
                    }),

                TextInput::make('slug')
                    ->label('URL Slug')
                    ->required()
                    ->maxLength(220)
                    ->unique(ignoreRecord: true),

                Textarea::make('excerpt')
                    ->label('Short Description')
                    ->rows(4)
                    ->columnSpanFull(),

                RichEditor::make('content')
                    ->label('Full Blog Content')
                    ->required()
                    ->columnSpanFull(),

                TextInput::make('tags')
                    ->label('Tags')
                    ->placeholder('erp, accounting, gst')
                    ->maxLength(255),

                TextInput::make('author')
                    ->label('Author')
                    ->default('Accutech ERP Team')
                    ->maxLength(120),


                Select::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ])
                    ->default('draft')
                    ->required()
                    ->native(false),


                DateTimePicker::make('published_at')
                    ->label('Published At'),




                TextEntry::make('current_featured_image')
                    ->label('Current Featured Image')
                    ->state(function (?Blog $record): HtmlString {

                        if (!$record || blank($record->image)) {
                            return new HtmlString(
                                '<span>No existing image</span>'
                            );
                        }

                        $image = trim((string) $record->image);

                        // Same path logic as the working Blogs List.
                        if (preg_match('#^https?://#i', $image)) {
                            $url = $image;
                        } else {
                            $url = asset(
                                'blogs/' . basename(
                                    str_replace('\\', '/', $image)
                                )
                            );
                        }

                        return new HtmlString(
                            '<img src="' . e($url) . '"
                                alt="Current Blog Image"
                                style="
                                    width:250px;
                                    max-width:100%;
                                    height:160px;
                                    object-fit:cover;
                                    border-radius:8px;
                                    border:1px solid #ddd;
                                ">'
                        );
                    })
                    ->html()
                    ->columnSpanFull(),


                FileUpload::make('image')
                    ->label('Featured Image')
                    ->image()
                    ->imageEditor()
                    ->disk('legacy_blog_images')
                    ->visibility('public')
                    ->imagePreviewHeight('200')
                    ->maxSize(5120)
                    ->acceptedFileTypes([
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                    ])
                    ->preventFilePathTampering()
                    ->openable()
                    ->downloadable()
                    ->helperText('Keep the existing image or upload a new image to replace it.')
                    ->columnSpanFull(),


            ])
            ->columns(2);
    }
}
