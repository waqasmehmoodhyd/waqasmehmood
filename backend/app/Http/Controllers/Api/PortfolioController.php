<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    /**
     * Public: Get all portfolio projects with optional category filter
     */
    public function index(Request $request): JsonResponse
    {
        $query = PortfolioItem::query()->latest();

        if ($request->has('category') && $request->category !== 'all' && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    /**
     * Admin Protected: Store a new portfolio item
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:graphic,webdev,smm,googleads,seo',
            'category_label' => 'nullable|string|max:100',
            'metrics' => 'nullable|string|max:255',
            'desc' => 'required|string',
            'tags' => 'nullable',
            'image' => 'nullable|string|max:2048',
            'project_url' => 'nullable|string|max:2048',
        ]);

        $categoryMap = [
            'graphic' => 'Graphic Design',
            'webdev' => 'Website Development',
            'smm' => 'SMM',
            'googleads' => 'Google Ads',
            'seo' => 'SEO Services',
        ];

        if (empty($validated['category_label'])) {
            $validated['category_label'] = $categoryMap[$validated['category']] ?? 'Digital Marketing';
        }

        if (is_string($validated['tags'] ?? null)) {
            $validated['tags'] = array_values(array_filter(array_map('trim', explode(',', $validated['tags']))));
        }

        if (empty($validated['image'])) {
            $validated['image'] = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
        }

        $item = PortfolioItem::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project added to portfolio successfully!',
            'data' => $item
        ], 201);
    }

    /**
     * Admin Protected: Delete a portfolio item
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $item = PortfolioItem::find($id);
        if (!$item) {
            return response()->json(['success' => false, 'message' => 'Project not found.'], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project removed from portfolio.'
        ]);
    }

    /**
     * Helper to verify admin key or password
     */
    protected function authorizeAdmin(Request $request): void
    {
        $adminKey = env('ADMIN_SECRET_KEY', 'waqas2026');
        $providedKey = $request->header('X-Admin-Key') ?? $request->input('admin_key');

        if (!$providedKey || $providedKey !== $adminKey) {
            abort(response()->json([
                'success' => false,
                'message' => 'Unauthorized: Only Waqas Mehmood (Admin) has permission to manage portfolio items.'
            ], 403));
        }
    }
}
