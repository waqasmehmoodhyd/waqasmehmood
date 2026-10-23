<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Crawler\SiteCrawlerService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SiteCrawlerController extends Controller
{
    protected SiteCrawlerService $crawlerService;

    public function __construct(SiteCrawlerService $crawlerService)
    {
        $this->crawlerService = $crawlerService;
    }

    /**
     * Real-time Server-Sent Events (SSE) Crawler Stream
     */
    public function stream(Request $request): StreamedResponse
    {
        $rawUrl = (string) $request->query('url', '');
        $limit = (int) $request->query('limit', 25);

        $response = new StreamedResponse(function () use ($rawUrl, $limit) {
            // Set reasonable execution time limit
            @set_time_limit(180);
            @ini_set('memory_limit', '256M');

            // Clean output buffers for immediate push
            while (ob_get_level() > 0) {
                @ob_end_flush();
            }
            flush();

            // Initial ping event
            echo "event: start\n";
            echo "data: " . json_encode(['message' => 'Initializing crawler engine...']) . "\n\n";
            flush();

            $this->crawlerService->crawlAndStream(
                $rawUrl,
                $limit,
                function (array $pageData, array $progress) {
                    echo "event: page\n";
                    echo "data: " . json_encode(['page' => $pageData, 'progress' => $progress]) . "\n\n";
                    flush();
                },
                function (array $summary) {
                    echo "event: complete\n";
                    echo "data: " . json_encode($summary) . "\n\n";
                    flush();
                },
                function (string $error, bool $blocked = false) {
                    echo "event: error_event\n";
                    echo "data: " . json_encode(['message' => $error, 'blocked' => $blocked]) . "\n\n";
                    flush();
                }
            );
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache, no-transform');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }
}
