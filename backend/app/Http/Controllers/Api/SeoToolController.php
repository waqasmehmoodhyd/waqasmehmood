<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Seo\OnPageAnalyzerService;
use App\Services\Seo\TechnicalSeoService;
use App\Services\Seo\OffPageSeoService;
use App\Services\Seo\LocalSeoService;
use App\Services\Seo\SubtoolRunnerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SeoToolController extends Controller
{
    protected OnPageAnalyzerService $onPageAnalyzer;
    protected TechnicalSeoService $technicalAnalyzer;
    protected OffPageSeoService $offPageAnalyzer;
    protected LocalSeoService $localAnalyzer;
    protected SubtoolRunnerService $subtoolRunner;

    public function __construct(
        OnPageAnalyzerService $onPageAnalyzer,
        TechnicalSeoService $technicalAnalyzer,
        OffPageSeoService $offPageAnalyzer,
        LocalSeoService $localAnalyzer,
        SubtoolRunnerService $subtoolRunner
    ) {
        $this->onPageAnalyzer = $onPageAnalyzer;
        $this->technicalAnalyzer = $technicalAnalyzer;
        $this->offPageAnalyzer = $offPageAnalyzer;
        $this->localAnalyzer = $localAnalyzer;
        $this->subtoolRunner = $subtoolRunner;
    }

    /**
     * Run any of the 25 specific SEO sub-tools with dedicated analysis
     */
    public function runSubtool(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tool' => 'required|string|max:100',
            'url' => 'nullable|string|max:2048',
            'text' => 'nullable|string|max:100000',
            'keyword' => 'nullable|string|max:150',
            'competitor' => 'nullable|string|max:2048',
            'city' => 'nullable|string|max:150',
        ]);

        $tool = $validated['tool'];
        $url = $validated['url'] ?? null;
        $text = $validated['text'] ?? null;
        $keyword = $validated['keyword'] ?? null;
        $competitor = $validated['competitor'] ?? null;
        $city = $validated['city'] ?? null;

        // Cache based on tool & inputs
        $cacheKey = 'subtool_' . md5($tool . '_' . ($url ?? '') . '_' . ($keyword ?? '') . '_' . ($competitor ?? '') . '_' . ($city ?? '') . '_' . (empty($text) ? '' : md5($text)));

        $result = Cache::remember($cacheKey, now()->addHours(6), function () use ($tool, $url, $text, $keyword, $competitor, $city) {
            return $this->subtoolRunner->run($tool, $url, $text, $keyword, $competitor, $city);
        });

        if (!($result['success'] ?? false)) {
            return response()->json($result, 422);
        }

        return response()->json($result);
    }

    /**
     * Pillar 1: ON PAGE SEO Audit
     */
    public function analyzeOnPage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:2048',
            'keyword' => 'nullable|string|max:100',
        ]);

        $url = $validated['url'];
        $keyword = $validated['keyword'] ?? null;
        $cacheKey = 'seo_onpage_' . md5(strtolower($url) . '_' . strtolower($keyword ?? ''));

        $result = Cache::remember($cacheKey, now()->addHours(24), function () use ($url, $keyword) {
            return $this->onPageAnalyzer->analyze($url, $keyword);
        });

        if (!($result['success'] ?? false)) {
            return response()->json($result, 422);
        }

        return response()->json($result);
    }

    /**
     * Pillar 2: OFF PAGE SEO Audit
     */
    public function analyzeOffPage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        $url = $validated['url'];
        $cacheKey = 'seo_offpage_' . md5(strtolower($url));

        $result = Cache::remember($cacheKey, now()->addHours(24), function () use ($url) {
            return $this->offPageAnalyzer->analyze($url);
        });

        if (!($result['success'] ?? false)) {
            return response()->json($result, 422);
        }

        return response()->json($result);
    }

    /**
     * Pillar 3: TECHNICAL SEO Audit
     */
    public function analyzeTechnical(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        $url = $validated['url'];
        $cacheKey = 'seo_technical_' . md5(strtolower($url));

        $result = Cache::remember($cacheKey, now()->addHours(24), function () use ($url) {
            return $this->technicalAnalyzer->analyze($url);
        });

        if (!($result['success'] ?? false)) {
            return response()->json($result, 422);
        }

        return response()->json($result);
    }

    /**
     * Pillar 4: LOCAL SEO Audit
     */
    public function analyzeLocal(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        $url = $validated['url'];
        $cacheKey = 'seo_local_' . md5(strtolower($url));

        $result = Cache::remember($cacheKey, now()->addHours(24), function () use ($url) {
            return $this->localAnalyzer->analyze($url);
        });

        if (!($result['success'] ?? false)) {
            return response()->json($result, 422);
        }

        return response()->json($result);
    }
}
