<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    private function imageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        $image = trim(str_replace('\\', '/', $image));

        if ($image === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $image)) {
            return $image;
        }
        $filename = basename($image);

        $possiblePaths = [
            'uploads/blogs/' . $filename,
            'blogs/' . $filename,
        ];

        foreach ($possiblePaths as $path) {
            if (is_file(public_path($path))) {
                return asset($path);
            }
        }

        return null;
    }

    private function transformBlog(
        Blog $blog,
        bool $includeContent = false
    ): array {
        $data = [
            'id' => $blog->id,
            'title' => $blog->title,
            'slug' => $blog->slug,
            'excerpt' => $blog->excerpt,
            'tags' => $blog->tags,
            'author' => $blog->author,
            'image' => $this->imageUrl($blog->image),
            'published_at' => $blog->published_at,
        ];

        if ($includeContent) {
            $data['content'] = $blog->content;
        }

        return $data;
    }

    public function index(Request $request)
    {
        $perPage = 6;
        $blogs = Blog::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->whereDate('published_at', '<=', today()->toDateString())
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($blogs->items())
                ->map(fn ($blog) =>
                    $this->transformBlog($blog)
                )
                ->values(),
            'pagination' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ],
        ]);
    }

    public function show(string $slug)
    {
        $blog = Blog::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->whereDate('published_at', '<=', today()->toDateString())
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $this->transformBlog($blog, true),
        ]);
    }
}
