<?php

namespace App\Services\Crawler;

use DOMDocument;
use DOMXPath;

class SiteCrawlerService
{
    /**
     * High-risk domains that overwhelm server RAM/CPU or trigger Cloudflare bot walls
     */
    protected array $blacklistedDomainPatterns = [
        '~daraz\.~i',
        '~amazon\.~i',
        '~walmart\.~i',
        '~ebay\.~i',
        '~aliexpress\.~i',
        '~alibaba\.~i',
        '~wikipedia\.org~i',
        '~wikimedia\.org~i',
        '~facebook\.com~i',
        '~instagram\.com~i',
        '~twitter\.com~i',
        '~x\.com~i',
        '~tiktok\.com~i',
        '~youtube\.com~i',
        '~reddit\.com~i',
        '~linkedin\.com~i',
        '~pinterest\.com~i',
        '~netflix\.com~i',
    ];

    /**
     * File extensions to ignore from crawl queue
     */
    protected array $ignoredExtensions = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff',
        'pdf', 'zip', 'rar', 'tar', 'gz', '7z',
        'mp4', 'webm', 'avi', 'mov', 'mp3', 'wav', 'ogg',
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'css', 'js', 'json', 'xml', 'txt', 'woff', 'woff2', 'ttf', 'eot'
    ];

    /**
     * Validate target seed URL & verify it is not blacklisted or private
     */
    public function validateSeedUrl(string $rawUrl): array
    {
        $url = trim($rawUrl);
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        $parsed = parse_url($url);
        if (!$parsed || empty($parsed['host'])) {
            return [
                'valid' => false,
                'message' => 'Invalid URL structure. Please enter a valid website address (e.g. https://example.com).'
            ];
        }

        $host = strtolower($parsed['host']);

        // Check Blacklist Guard
        foreach ($this->blacklistedDomainPatterns as $pattern) {
            if (preg_match($pattern, $host)) {
                return [
                    'valid' => false,
                    'blocked' => true,
                    'message' => 'Enterprise e-commerce and social platforms (Amazon, Daraz, Wikipedia, etc.) block automated cloud crawlers with Cloudflare CAPTCHAs and can overwhelm server resources. Please enter a standard business, portfolio, agency, blog, or SaaS website.'
                ];
            }
        }

        // Check private IP / SSRF
        $ip = gethostbyname($host);
        $isLocalhost = in_array($host, ['localhost', '127.0.0.1'], true) || str_ends_with($host, '.test') || str_ends_with($host, '.local');
        
        if (!$isLocalhost && $ip === $host && !filter_var($ip, FILTER_VALIDATE_IP)) {
            // DNS resolution failed
            return [
                'valid' => false,
                'message' => "Could not resolve domain '{$host}'. Please verify that the domain name is active and spelled correctly."
            ];
        }

        if (!$isLocalhost && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return [
                'valid' => false,
                'message' => 'Scanning local or private network addresses (192.168.x, 10.x, internal IPs) is restricted for security reasons.'
            ];
        }

        // Reconstruct clean canonical root URL
        $scheme = $parsed['scheme'] ?? 'https';
        $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
        $path = isset($parsed['path']) && $parsed['path'] !== '/' ? rtrim($parsed['path'], '/') : '';
        $normalizedRoot = "{$scheme}://{$host}{$port}{$path}";
        if ($path === '') {
            $normalizedRoot .= '/';
        }

        return [
            'valid' => true,
            'url' => $normalizedRoot,
            'host' => $host,
            'scheme' => $scheme
        ];
    }

    /**
     * Crawl the website using Breadth-First Search (BFS) and stream each page as it finishes
     */
    public function crawlAndStream(string $seedUrl, int $maxPages, callable $emitPage, callable $emitSummary, callable $emitError): void
    {
        $validation = $this->validateSeedUrl($seedUrl);
        if (!$validation['valid']) {
            $emitError($validation['message'], $validation['blocked'] ?? false);
            return;
        }

        $cleanSeed = $validation['url'];
        $baseHost = $validation['host'];
        $baseHostNoWww = preg_replace('~^www\.~i', '', $baseHost);

        // Clamp limit between 5 and 50 pages for safety
        $pageLimit = max(5, min(50, $maxPages));

        $queue = [$cleanSeed];
        $queuedSet = [$this->normalizeForComparison($cleanSeed) => true];
        $visited = [];
        $crawledPages = [];

        // Pre-seed queue with XML Sitemap URLs if available (Essential for SPAs like React/Vue that have zero static <a> links on root)
        $sitemapUrls = $this->discoverSitemapUrls($cleanSeed, $baseHostNoWww);
        foreach ($sitemapUrls as $sUrl) {
            $normS = $this->normalizeForComparison($sUrl);
            if (!isset($queuedSet[$normS])) {
                $queuedSet[$normS] = true;
                $queue[] = $sUrl;
            }
        }

        $crawledCount = 0;
        $brokenCount = 0;
        $redirectCount = 0;
        $missingTitlesCount = 0;
        $missingH1Count = 0;
        $duplicateH1Count = 0;
        $missingDescCount = 0;
        $totalLoadTimeMs = 0;

        while (!empty($queue) && $crawledCount < $pageLimit) {
            $currentUrl = array_shift($queue);
            $normalizedCurrent = $this->normalizeForComparison($currentUrl);

            if (isset($visited[$normalizedCurrent])) {
                continue;
            }
            $visited[$normalizedCurrent] = true;

            // Fetch and analyze the single page
            $pageData = $this->fetchAndAnalyzePage($currentUrl, $crawledCount + 1, $baseHostNoWww);
            $crawledCount++;
            $crawledPages[] = $pageData;

            // Update stats
            if ($pageData['status'] >= 400 || $pageData['status'] === 0) {
                $brokenCount++;
            } elseif ($pageData['status'] >= 300 && $pageData['status'] < 400) {
                $redirectCount++;
            }

            if ($pageData['title_status'] === 'missing') $missingTitlesCount++;
            if ($pageData['h1_status'] === 'missing') $missingH1Count++;
            if ($pageData['h1_status'] === 'duplicate') $duplicateH1Count++;
            if ($pageData['description_status'] === 'missing') $missingDescCount++;
            $totalLoadTimeMs += $pageData['load_time_ms'];

            // Push discovered internal links to queue if under budget
            if ($crawledCount < $pageLimit && !empty($pageData['internal_urls'])) {
                foreach ($pageData['internal_urls'] as $foundUrl) {
                    $normFound = $this->normalizeForComparison($foundUrl);
                    if (!isset($visited[$normFound]) && !isset($queuedSet[$normFound])) {
                        $queuedSet[$normFound] = true;
                        $queue[] = $foundUrl;
                    }
                }
            }

            // Remove internal_urls array from payload before emitting to keep stream lightweight
            unset($pageData['internal_urls']);

            // Emit single page event to browser immediately
            $emitPage($pageData, [
                'current' => $crawledCount,
                'target' => $pageLimit,
                'queue_size' => count($queue),
                'percent' => (int) round(($crawledCount / $pageLimit) * 100)
            ]);

            // Politeness delay: 150ms between requests
            if (!empty($queue) && $crawledCount < $pageLimit) {
                usleep(150000);
            }
        }

        // Calculate final SEO Health Score (0 - 100)
        $avgLoadTime = $crawledCount > 0 ? (int) round($totalLoadTimeMs / $crawledCount) : 0;
        $healthScore = $this->calculateHealthScore(
            $crawledCount,
            $brokenCount,
            $redirectCount,
            $missingTitlesCount,
            $missingH1Count,
            $duplicateH1Count,
            $missingDescCount,
            $avgLoadTime
        );

        $summary = [
            'seed_url' => $cleanSeed,
            'base_host' => $baseHost,
            'total_crawled' => $crawledCount,
            'total_discovered' => count($queuedSet),
            'remaining_in_queue' => count($queue),
            'health_score' => $healthScore,
            'broken_links_count' => $brokenCount,
            'redirects_count' => $redirectCount,
            'missing_titles_count' => $missingTitlesCount,
            'missing_h1_count' => $missingH1Count,
            'duplicate_h1_count' => $duplicateH1Count,
            'missing_descriptions_count' => $missingDescCount,
            'average_load_time_ms' => $avgLoadTime,
            'completed_at' => date('Y-m-d H:i:s')
        ];

        $emitSummary($summary);
    }

    /**
     * Fetch single page via cURL with strict 3-second timeout and parse HTML
     */
    protected function fetchAndAnalyzePage(string $url, int $index, string $baseHostNoWww): array
    {
        $startTime = microtime(true);
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; SiteAuditBot/1.0)',
            CURLOPT_HTTPHEADER => [
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: en-US,en;q=0.5'
            ],
            CURLOPT_ENCODING => ''
        ]);

        $html = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $effectiveUrl = (string) curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        $curlError = curl_error($ch);
        curl_close($ch);

        $loadTimeMs = (int) round((microtime(true) - $startTime) * 1000);

        $parsedUrl = parse_url($url);
        $path = $parsedUrl['path'] ?? '/';
        if (isset($parsedUrl['query'])) {
            $path .= '?' . $parsedUrl['query'];
        }

        // Handle Connection / Timeout Failures
        if ($httpCode === 0) {
            return [
                'index' => $index,
                'url' => $url,
                'path' => $path,
                'status' => 0,
                'status_text' => $curlError ?: 'Connection Timeout',
                'load_time_ms' => $loadTimeMs,
                'title' => '',
                'title_length' => 0,
                'title_status' => 'missing',
                'description' => '',
                'description_length' => 0,
                'description_status' => 'missing',
                'h1' => '',
                'h1_count' => 0,
                'h1_status' => 'missing',
                'canonical' => '',
                'canonical_status' => 'missing',
                'internal_links_count' => 0,
                'external_links_count' => 0,
                'issues' => ['Failed to connect (Timeout or DNS error)'],
                'internal_urls' => []
            ];
        }

        // If not HTML (e.g. image, PDF accidentally crawled)
        if (!empty($contentType) && !preg_match('~text/html|application/xhtml\+xml~i', $contentType)) {
            return [
                'index' => $index,
                'url' => $url,
                'path' => $path,
                'status' => $httpCode,
                'status_text' => $this->getStatusText($httpCode),
                'load_time_ms' => $loadTimeMs,
                'title' => 'Non-HTML Resource',
                'title_length' => 0,
                'title_status' => 'na',
                'description' => '',
                'description_length' => 0,
                'description_status' => 'na',
                'h1' => '',
                'h1_count' => 0,
                'h1_status' => 'na',
                'canonical' => '',
                'canonical_status' => 'na',
                'internal_links_count' => 0,
                'external_links_count' => 0,
                'issues' => $httpCode >= 400 ? ['HTTP ' . $httpCode] : [],
                'internal_urls' => []
            ];
        }

        // Parse HTML DOM
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . ($html ?: ''));
        libxml_clear_errors();
        $xpath = new DOMXPath($dom);

        // 1. Meta Title
        $titleNodes = $xpath->query('//title');
        $title = $titleNodes->length > 0 ? trim($titleNodes->item(0)->textContent) : '';
        $titleLen = mb_strlen($title);
        $titleStatus = 'good';
        if ($titleLen === 0) {
            $titleStatus = 'missing';
        } elseif ($titleLen < 30) {
            $titleStatus = 'short';
        } elseif ($titleLen > 65) {
            $titleStatus = 'long';
        }

        // 2. Meta Description
        $descNodes = $xpath->query('//meta[translate(@name, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="description"]/@content');
        $desc = $descNodes->length > 0 ? trim($descNodes->item(0)->nodeValue) : '';
        $descLen = mb_strlen($desc);
        $descStatus = 'good';
        if ($descLen === 0) {
            $descStatus = 'missing';
        } elseif ($descLen < 70) {
            $descStatus = 'short';
        } elseif ($descLen > 165) {
            $descStatus = 'long';
        }

        // 3. H1 Tags
        $h1Nodes = $xpath->query('//h1');
        $h1Count = $h1Nodes->length;
        $h1Text = $h1Count > 0 ? trim($h1Nodes->item(0)->textContent) : '';
        $h1Status = 'good';
        if ($h1Count === 0) {
            $h1Status = 'missing';
        } elseif ($h1Count > 1) {
            $h1Status = 'duplicate';
        }

        // 4. Canonical Tag
        $canonicalNodes = $xpath->query('//link[translate(@rel, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="canonical"]/@href');
        $canonical = $canonicalNodes->length > 0 ? trim($canonicalNodes->item(0)->nodeValue) : '';
        $canonicalStatus = 'missing';
        if (!empty($canonical)) {
            $canonicalStatus = ($this->normalizeForComparison($canonical) === $this->normalizeForComparison($url)) ? 'matches' : 'differs';
        }

        // 5. Extract Links on this page
        $discoveredInternal = [];
        $internalCount = 0;
        $externalCount = 0;

        $linkNodes = $xpath->query('//a[@href]');
        foreach ($linkNodes as $linkNode) {
            $rawHref = trim($linkNode->getAttribute('href'));
            if ($rawHref === '' || preg_match('~^(mailto:|tel:|javascript:|whatsapp:|#)~i', $rawHref)) {
                continue;
            }

            $resolvedUrl = $this->resolveRelativeUrl($effectiveUrl ?: $url, $rawHref);
            if (!$resolvedUrl) {
                continue;
            }

            $linkParsed = parse_url($resolvedUrl);
            $linkHost = strtolower($linkParsed['host'] ?? '');
            $linkHostNoWww = preg_replace('~^www\.~i', '', $linkHost);

            // Is internal link?
            if ($linkHostNoWww === $baseHostNoWww) {
                $internalCount++;
                if ($this->isHtmlPageUrl($resolvedUrl)) {
                    $discoveredInternal[] = $resolvedUrl;
                }
            } else {
                $externalCount++;
            }
        }

        // Also extract internal routes from JSON-LD schemas (Crucial for modern apps)
        $jsonLdNodes = $xpath->query('//script[@type="application/ld+json"]');
        foreach ($jsonLdNodes as $jNode) {
            $jsonContent = trim($jNode->textContent);
            if (!empty($jsonContent) && preg_match_all('~https?://[^"\'\\s<>]+~i', $jsonContent, $urlMatches)) {
                foreach ($urlMatches[0] as $jUrl) {
                    $jParsed = parse_url($jUrl);
                    $jHostNoWww = preg_replace('~^www\.~i', '', strtolower($jParsed['host'] ?? ''));
                    if ($jHostNoWww === $baseHostNoWww && $this->isHtmlPageUrl($jUrl)) {
                        $discoveredInternal[] = $jUrl;
                        $internalCount++;
                    }
                }
            }
        }

        // 6. Aggregate Page Issues
        $issues = [];
        if ($httpCode >= 400) $issues[] = "HTTP {$httpCode} Error";
        elseif ($httpCode >= 300) $issues[] = "Redirect ({$httpCode})";
        if ($titleStatus === 'missing') $issues[] = 'Missing Title Tag';
        elseif ($titleStatus === 'short') $issues[] = "Short Title ({$titleLen} chars)";
        elseif ($titleStatus === 'long') $issues[] = "Truncated Title ({$titleLen} chars)";
        if ($descStatus === 'missing') $issues[] = 'Missing Meta Description';
        if ($h1Status === 'missing') $issues[] = 'Missing H1 Heading';
        elseif ($h1Status === 'duplicate') $issues[] = "Multiple H1 Headings ({$h1Count})";
        if ($canonicalStatus === 'missing') $issues[] = 'Missing Canonical Tag';
        if ($loadTimeMs > 2000) $issues[] = "Slow Response ({$loadTimeMs}ms)";

        return [
            'index' => $index,
            'url' => $url,
            'path' => $path,
            'status' => $httpCode,
            'status_text' => $this->getStatusText($httpCode),
            'load_time_ms' => $loadTimeMs,
            'title' => $title,
            'title_length' => $titleLen,
            'title_status' => $titleStatus,
            'description' => $desc,
            'description_length' => $descLen,
            'description_status' => $descStatus,
            'h1' => $h1Text,
            'h1_count' => $h1Count,
            'h1_status' => $h1Status,
            'canonical' => $canonical,
            'canonical_status' => $canonicalStatus,
            'internal_links_count' => $internalCount,
            'external_links_count' => $externalCount,
            'issues' => $issues,
            'internal_urls' => array_unique($discoveredInternal)
        ];
    }

    /**
     * Resolve relative URL against base URL
     */
    protected function resolveRelativeUrl(string $baseUrl, string $relUrl): ?string
    {
        // Strip fragment (#anchor)
        $relUrl = preg_replace('~#.*$~', '', $relUrl);
        if ($relUrl === '') return null;

        // Already absolute?
        if (preg_match('~^https?://~i', $relUrl)) {
            return $relUrl;
        }

        // Scheme-relative (//example.com/path)
        if (str_starts_with($relUrl, '//')) {
            $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';
            return $scheme . ':' . $relUrl;
        }

        $baseParsed = parse_url($baseUrl);
        $scheme = $baseParsed['scheme'] ?? 'https';
        $host = $baseParsed['host'] ?? '';
        $port = isset($baseParsed['port']) ? ':' . $baseParsed['port'] : '';
        $basePath = $baseParsed['path'] ?? '/';

        // Root-relative (/about)
        if (str_starts_with($relUrl, '/')) {
            return "{$scheme}://{$host}{$port}{$relUrl}";
        }

        // Directory-relative (sub/page.html)
        $dir = preg_replace('~/[^/]*$~', '', $basePath);
        $fullPath = $dir . '/' . $relUrl;

        // Resolve dot segments (/../ and /./)
        $parts = [];
        foreach (explode('/', $fullPath) as $part) {
            if ($part === '' || $part === '.') continue;
            if ($part === '..') {
                array_pop($parts);
            } else {
                $parts[] = $part;
            }
        }
        $resolvedPath = '/' . implode('/', $parts);

        return "{$scheme}://{$host}{$port}{$resolvedPath}";
    }

    /**
     * Check if a URL appears to be an HTML webpage rather than an asset/file
     */
    protected function isHtmlPageUrl(string $url): bool
    {
        $path = strtolower(parse_url($url, PHP_URL_PATH) ?? '');
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        if ($ext && in_array($ext, $this->ignoredExtensions, true)) {
            return false;
        }
        return true;
    }

    /**
     * Normalize URL for deduplication
     */
    protected function normalizeForComparison(string $url): string
    {
        $url = preg_replace('~#.*$~', '', $url);
        $parsed = parse_url($url);
        if (!$parsed) return strtolower(rtrim($url, '/'));

        $scheme = strtolower($parsed['scheme'] ?? 'https');
        $host = strtolower($parsed['host'] ?? '');
        $host = preg_replace('~^www\.~', '', $host);
        $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
        $path = isset($parsed['path']) ? rtrim($parsed['path'], '/') : '';
        if ($path === '') $path = '/';
        $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';

        return "{$scheme}://{$host}{$port}{$path}{$query}";
    }

    /**
     * Compute holistic SEO Health Score (0 - 100%)
     */
    protected function calculateHealthScore(
        int $total,
        int $broken,
        int $redirects,
        int $missingTitles,
        int $missingH1,
        int $duplicateH1,
        int $missingDesc,
        int $avgLoadTime
    ): int {
        if ($total === 0) return 100;

        $penalty = 0;
        // Broken links (severe: -20% weight relative to pages)
        $penalty += ($broken / $total) * 40;
        // Missing titles (high: -15% weight)
        $penalty += ($missingTitles / $total) * 20;
        // Missing H1s (moderate: -10%)
        $penalty += ($missingH1 / $total) * 15;
        // Duplicate H1s (-5%)
        $penalty += ($duplicateH1 / $total) * 10;
        // Missing meta description (-10%)
        $penalty += ($missingDesc / $total) * 10;
        // Excessive redirects (-5%)
        if ($redirects > ($total * 0.2)) {
            $penalty += 5;
        }
        // Slow speed penalty
        if ($avgLoadTime > 2000) {
            $penalty += 8;
        } elseif ($avgLoadTime > 1200) {
            $penalty += 4;
        }

        $score = (int) round(100 - $penalty);
        return max(5, min(100, $score));
    }

    /**
     * Map HTTP code to human-friendly status text
     */
    protected function getStatusText(int $code): string
    {
        return match ($code) {
            200 => 'OK',
            201 => 'Created',
            204 => 'No Content',
            301 => 'Moved Permanently',
            302 => 'Found (Temporary Redirect)',
            304 => 'Not Modified',
            307 => 'Temporary Redirect',
            308 => 'Permanent Redirect',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            410 => 'Gone',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            504 => 'Gateway Timeout',
            default => "HTTP {$code}"
        };
    }

    /**
     * Automatically discover and extract URLs from XML Sitemaps (sitemap.xml, robots.txt)
     */
    protected function discoverSitemapUrls(string $seedUrl, string $baseHostNoWww): array
    {
        $parsed = parse_url($seedUrl);
        $scheme = $parsed['scheme'] ?? 'https';
        $host = $parsed['host'] ?? '';

        $primarySitemap = "{$scheme}://{$host}/sitemap.xml";
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $primarySitemap,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 6,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; SiteAuditBot/1.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);
        $content = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $discovered = [];

        if ($code === 200 && !empty($content)) {
            if (preg_match_all('~<loc>(.*?)</loc>~i', $content, $matches)) {
                foreach ($matches[1] as $loc) {
                    $loc = trim($loc);
                    $locParsed = parse_url($loc);
                    $locHost = strtolower($locParsed['host'] ?? '');
                    $locHostNoWww = preg_replace('~^www\.~i', '', $locHost);

                    if ($locHostNoWww === $baseHostNoWww && $this->isHtmlPageUrl($loc)) {
                        $discovered[] = $loc;
                    }
                }
                if (!empty($discovered)) {
                    return array_unique($discovered);
                }
            }
        }

        // If primary /sitemap.xml didn't yield, fallback to secondary candidates & robots.txt
        $fallbackCandidates = [
            "{$scheme}://{$host}/sitemap_index.xml",
            "{$scheme}://{$host}/wp-sitemap.xml"
        ];

        $robotsUrl = "{$scheme}://{$host}/robots.txt";
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $robotsUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; SiteAuditBot/1.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);
        $robotsContent = curl_exec($ch);
        curl_close($ch);

        if (!empty($robotsContent) && preg_match_all('~^\s*Sitemap:\s*(https?://\S+)~mi', $robotsContent, $rMatches)) {
            foreach ($rMatches[1] as $rSite) {
                array_unshift($fallbackCandidates, trim($rSite));
            }
        }

        foreach (array_unique($fallbackCandidates) as $candidate) {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $candidate,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_CONNECTTIMEOUT => 3,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; SiteAuditBot/1.0)',
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ]);
            $content = curl_exec($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($code === 200 && !empty($content)) {
                if (preg_match_all('~<loc>(.*?)</loc>~i', $content, $matches)) {
                    foreach ($matches[1] as $loc) {
                        $loc = trim($loc);
                        $locParsed = parse_url($loc);
                        $locHost = strtolower($locParsed['host'] ?? '');
                        $locHostNoWww = preg_replace('~^www\.~i', '', $locHost);

                        if ($locHostNoWww === $baseHostNoWww && $this->isHtmlPageUrl($loc)) {
                            $discovered[] = $loc;
                        }
                    }
                    if (!empty($discovered)) {
                        break;
                    }
                }
            }
        }

        return array_unique($discovered);
    }
}
