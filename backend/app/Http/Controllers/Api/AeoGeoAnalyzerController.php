<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AeoGeoAnalyzerController extends Controller
{
    /**
     * Live scrape target website for AI, AEO & GEO analysis
     */
    public function analyze(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        $rawUrl = trim($validated['url']);
        if (!preg_match('~^https?://~i', $rawUrl)) {
            $rawUrl = 'https://' . $rawUrl;
        }

        $parsed = parse_url($rawUrl);
        if (!$parsed || empty($parsed['host'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid URL structure. Please enter a valid address (e.g. https://example.com).'
            ], 422);
        }

        $host = strtolower($parsed['host']);

        // Check SSRF / Private IP protection
        $ip = gethostbyname($host);
        $isLocalhost = in_array($host, ['localhost', '127.0.0.1', '::1'], true) || 
                       str_ends_with($host, '.test') || 
                       str_ends_with($host, '.local');

        if (!$isLocalhost && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return response()->json([
                'success' => false,
                'message' => 'Restricted address. Analyzing internal or private IP ranges is not permitted.'
            ], 403);
        }

        $startTime = microtime(true);
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $rawUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_CONNECTTIMEOUT => 7,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; WaqasMehmood-AI-AEO-Engine/1.0)',
            CURLOPT_HTTPHEADER => [
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language: en-US,en;q=0.9',
                'Cache-Control: no-cache',
                'Pragma: no-cache'
            ],
            CURLOPT_ENCODING => ''
        ]);

        $html = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $effectiveUrl = (string) curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        $curlError = curl_error($ch);
        curl_close($ch);

        $loadTimeMs = (int) round((microtime(true) - $startTime) * 1000);

        if ($html === false || $httpCode === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Could not connect to target website (' . ($curlError ?: 'Connection timed out or DNS error') . '). Please check the URL and ensure the website is online.'
            ], 422);
        }

        if ($httpCode >= 400) {
            return response()->json([
                'success' => false,
                'message' => "Target website returned HTTP status {$httpCode}. The page may be private, blocked, or missing."
            ], 422);
        }

        if (empty(trim($html))) {
            return response()->json([
                'success' => false,
                'message' => 'Target website returned an empty response. It may require JavaScript rendering or is blocking crawlers.'
            ], 422);
        }

        return response()->json([
            'success' => true,
            'url' => $rawUrl,
            'effective_url' => $effectiveUrl,
            'status' => $httpCode,
            'load_time_ms' => $loadTimeMs,
            'raw_html' => $html
        ]);
    }
}
