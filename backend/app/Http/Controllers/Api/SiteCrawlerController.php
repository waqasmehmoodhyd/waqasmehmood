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
            // Set reasonable execution time limit & memory
            @set_time_limit(180);
            @ini_set('memory_limit', '256M');
            @ini_set('zlib.output_compression', '0');
            @ini_set('output_buffering', '0');
            @ini_set('implicit_flush', '1');
            @ob_implicit_flush(true);

            // Clean all previous output buffers for immediate stream push
            while (ob_get_level() > 0) {
                @ob_end_flush();
            }
            @flush();

            $sendEvent = function (string $event, array $data) {
                echo "event: {$event}\n";
                echo "data: " . json_encode($data) . "\n\n";
                if (ob_get_level() > 0) {
                    @ob_flush();
                }
                @flush();
            };

            // Initial ping event
            $sendEvent('start', ['message' => 'Initializing crawler engine...']);

            $this->crawlerService->crawlAndStream(
                $rawUrl,
                $limit,
                function (array $pageData, array $progress) use ($sendEvent) {
                    $sendEvent('page', ['page' => $pageData, 'progress' => $progress]);
                },
                function (array $summary) use ($sendEvent) {
                    $sendEvent('complete', $summary);
                },
                function (string $error, bool $blocked = false) use ($sendEvent) {
                    $sendEvent('error_event', ['message' => $error, 'blocked' => $blocked]);
                }
            );
        });

        $response->headers->set('Content-Type', 'text/event-stream; charset=UTF-8');
        $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Content-Encoding', 'none');

        return $response;
    }
}
