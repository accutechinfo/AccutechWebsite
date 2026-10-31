<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PublicPageController extends Controller
{
   private function publishedPages()
    {
        $query = DB::table('site_pages')->where('status', 'published');
        if (Schema::hasColumn('site_pages', 'published_at')) {
            $query->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
        }
        return $query;
    }

    private function bannerUrl(?string $value): ?string
    {
        if (!$value || trim($value) === '') {
            return null;
        }

        $image = trim(str_replace('\\', '/', $value));

        if (preg_match('/^https?:\/\//i', $image)) {
            return $image;
        }

        $filename = basename($image);
        $possiblePaths = [
            'uploads/pages/' . $filename,
            'pages/' . $filename,
            'storage/pages/' . $filename,
        ];

        foreach ($possiblePaths as $path) {
            if (is_file(public_path($path))) {
                return asset($path);
            }
        }

        return null;
    }

    private function present(object $page, bool $full = false): array
    {
        $item = (array) $page;
        $filename = $item['banner_image'] ?? null;
        $item['banner_image'] = $filename;
        $item['banner_url'] = $this->bannerUrl($filename);
        $item['image'] = $item['banner_url'];
        if (!$full) unset($item['content']);
        return $item;
    }

    public function index(): JsonResponse
    {
        $pages = $this->publishedPages()->orderByDesc('id')->get()
            ->map(fn ($page) => $this->present($page))->values();
        return response()->json(['success' => true, 'data' => $pages]);
    }

    public function show(string $slug): JsonResponse
    {
        $page = $this->publishedPages()->where('slug', $slug)->first();
        if (!$page) return response()->json(['success' => false, 'message' => 'Page not found.'], 404);
        return response()->json(['success' => true, 'data' => $this->present($page, true)]);
    }

    public function categories(): JsonResponse
    {
        if (!Schema::hasTable('site_page_categories')) {
            return response()->json(['success' => false, 'message' => 'Category table not found'], 500);
        }
        $cats = DB::table('site_page_categories')->orderBy('id')->get();
        $subTable = Schema::hasTable('site_page_subcategories') ? 'site_page_subcategories'
            : (Schema::hasTable('site_page_sub_categories') ? 'site_page_sub_categories' : null);
        $subs = $subTable ? DB::table($subTable)->orderBy('sort_order')->orderBy('id')->get() : collect();
        $pages = $this->publishedPages()->get();
        $pagesBySlug = $pages->keyBy('slug');
        $result = $cats->map(function ($cat) use ($subs, $pages, $pagesBySlug) {
            $items = $subs->filter(fn ($sub) => (string)($sub->category_id ?? '') === (string)$cat->id);
            if ($items->isEmpty()) {
                $children = $pages->filter(fn ($p) => (string)($p->category_id ?? '') === (string)$cat->id)
                    ->map(fn ($p) => ['id' => $p->id, 'name' => $p->title, 'page_slug' => $p->slug, 'icon_class' => ''])->values()->all();
            } else {
                $children = $items->map(function ($sub) use ($pages, $pagesBySlug, $cat) {
                    $page = $pages->first(fn ($p) => (string)($p->subcategory_id ?? '') === (string)$sub->id
                        && (string)($p->category_id ?? '') === (string)$cat->id);
                    if (!$page && !empty($sub->page_slug)) {
                        $candidate = $pagesBySlug->get($sub->page_slug);
                        if ($candidate && (string)($candidate->category_id ?? '') === (string)$cat->id) $page = $candidate;
                    }
                    return [
                        'id' => $sub->id,
                        'name' => $sub->name ?? $sub->title ?? '',
                        'icon_class' => $sub->icon_class ?? '',
                        'page_slug' => $page?->slug,
                    ];
                })->values()->all();
            }
            return [
                'id' => $cat->id,
                'name' => $cat->name ?? $cat->title ?? '',
                'slug' => $cat->slug ?? '',
                'icon_class' => $cat->icon_class ?? '',
                'description' => $cat->description ?? '',
                'subcategories' => $children,
            ];
        })->values();
        return response()->json(['success' => true, 'data' => $result]);
    }
}
