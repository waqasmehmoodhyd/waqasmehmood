<?php

namespace App\Services\Seo;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class TechnicalSeoService
{
    /**
     * Analyze a given URL for technical SEO signals matching functions.php aio_technical_analyze.
     */
    public function analyze(string $url): array
    {
        $url = trim($url);
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        $host = parse_url($url, PHP_URL_HOST);
        $scheme = parse_url($url, PHP_URL_SCHEME) ?: 'https';
        $base = $scheme . '://' . $host;

        if (!$host || filter_var(gethostbyname($host), FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return ['success' => false, 'message' => 'Invalid or restricted domain target.'];
        }

        try {
            $response = Http::timeout(20)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; AllInOneSEO-Checker/1.7)',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                ])
                ->withoutVerifying()
                ->get($url);

            $code = $response->status();
            $html = $response->body();
            $headers = $response->headers();
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Could not fetch: ' . $e->getMessage()];
        }

        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();
        $xpath = new DOMXPath($dom);

        $checks = [];
        $recs = [];
        $score = 0;
        $d = [];

        // HTTPS / SSL
        $is_https = (strpos($url, 'https://') === 0);
        if ($is_https) {
            $checks[] = ['status' => 'good', 'cat' => 'HTTPS/SSL', 'text' => 'HTTPS is enabled site-wide on this URL.'];
            $score += 8;
            $d['https'] = 'Yes';
            $d['https_s'] = 'good';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'HTTPS/SSL', 'text' => 'Not using HTTPS.'];
            $d['https'] = 'No';
            $d['https_s'] = 'bad';
            $recs[] = 'Install SSL and force HTTPS.';
        }

        // HTTP Status
        if ($code == 200) {
            $checks[] = ['status' => 'good', 'cat' => 'Status Codes', 'text' => 'HTTP status 200 OK.'];
            $score += 8;
            $d['status'] = $code;
            $d['status_s'] = 'good';
        } elseif (in_array($code, [301, 302])) {
            $checks[] = ['status' => 'ok', 'cat' => 'Status Codes', 'text' => "HTTP $code redirect returned."];
            $score += 4;
            $d['status'] = $code;
            $d['status_s'] = 'ok';
            $recs[] = 'Ensure redirects are intentional and point to final URL.';
        } elseif ($code == 404) {
            $checks[] = ['status' => 'bad', 'cat' => 'Status Codes', 'text' => 'HTTP 404 Not Found.'];
            $d['status'] = $code;
            $d['status_s'] = 'bad';
            $recs[] = 'Fix 404 or redirect to a valid page.';
        } elseif ($code >= 500) {
            $checks[] = ['status' => 'bad', 'cat' => 'Status Codes', 'text' => "Server error HTTP $code."];
            $d['status'] = $code;
            $d['status_s'] = 'bad';
            $recs[] = 'Fix server errors immediately.';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Status Codes', 'text' => "HTTP status $code."];
            $score += 3;
            $d['status'] = $code;
            $d['status_s'] = 'ok';
        }

        // Mobile-Friendly (viewport)
        $viewport = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="viewport"]');
        if ($viewport->length > 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Mobile', 'text' => 'Mobile viewport meta present.'];
            $score += 8;
            $d['mobile'] = 'Yes';
            $d['mobile_s'] = 'good';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Mobile', 'text' => 'Missing viewport – not mobile-friendly signal.'];
            $d['mobile'] = 'No';
            $d['mobile_s'] = 'bad';
            $recs[] = 'Add viewport meta and responsive design.';
        }

        // Canonicalization
        $canonical = '';
        $cn = $xpath->query('//link[translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="canonical"]/@href');
        if ($cn->length) {
            $canonical = trim($cn->item(0)->nodeValue);
        }
        if ($canonical) {
            $checks[] = ['status' => 'good', 'cat' => 'Canonical', 'text' => 'Canonical tag found: ' . $canonical];
            $score += 7;
            $d['canonical'] = $canonical;
            $d['can_s'] = 'good';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Canonical', 'text' => 'No canonical tag.'];
            $score += 2;
            $d['canonical'] = '(none)';
            $d['can_s'] = 'ok';
            $recs[] = 'Add rel=canonical to prevent duplicate content.';
        }

        // Meta Robots
        $robots_val = '';
        $rn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="robots"]/@content');
        if ($rn->length) {
            $robots_val = strtolower(trim($rn->item(0)->nodeValue));
        }
        $d['meta_robots'] = $robots_val ?: '(not set)';
        if (strpos($robots_val, 'noindex') !== false) {
            $checks[] = ['status' => 'bad', 'cat' => 'Meta Robots', 'text' => 'Page has noindex – will not be indexed.'];
            $recs[] = 'Remove noindex if this page should rank.';
        } elseif (strpos($robots_val, 'nofollow') !== false) {
            $checks[] = ['status' => 'ok', 'cat' => 'Meta Robots', 'text' => 'nofollow present on page.'];
            $score += 3;
        } else {
            $checks[] = ['status' => 'good', 'cat' => 'Meta Robots', 'text' => 'No blocking meta robots (indexable).'];
            $score += 6;
        }

        // Robots.txt
        $robots_ok = false;
        $robots_body = '';
        try {
            $robots_res = Http::timeout(8)->withoutVerifying()->withHeaders(['User-Agent' => 'AllInOneSEO-Checker/1.7'])->get($base . '/robots.txt');
            if ($robots_res->status() == 200) {
                $robots_body = $robots_res->body();
                $robots_ok = true;
                if (preg_match('/Disallow:\s*\/\s*$/mi', $robots_body) && !preg_match('/Allow:/i', $robots_body)) {
                    $checks[] = ['status' => 'bad', 'cat' => 'Robots.txt', 'text' => 'robots.txt may block entire site (Disallow: /).'];
                    $recs[] = 'Review robots.txt – do not block important content.';
                } else {
                    $checks[] = ['status' => 'good', 'cat' => 'Robots.txt', 'text' => 'robots.txt is accessible.'];
                    $score += 6;
                }
            } else {
                $checks[] = ['status' => 'ok', 'cat' => 'Robots.txt', 'text' => 'robots.txt not found or not accessible.'];
                $score += 2;
                $recs[] = 'Create a proper robots.txt.';
            }
        } catch (\Exception $e) {
            $checks[] = ['status' => 'ok', 'cat' => 'Robots.txt', 'text' => 'robots.txt not found or not accessible.'];
            $score += 2;
            $recs[] = 'Create a proper robots.txt.';
        }
        $d['robots_txt'] = $robots_ok ? 'Found' : 'Missing';

        // XML Sitemap discovery
        $sitemap_found = false;
        $sitemap_urls = [$base . '/sitemap.xml', $base . '/sitemap_index.xml', $base . '/wp-sitemap.xml'];
        if ($robots_ok && preg_match_all('/Sitemap:\s*(\S+)/i', $robots_body, $sm)) {
            foreach ($sm[1] as $su) {
                $sitemap_urls[] = $su;
            }
        }
        foreach (array_unique($sitemap_urls) as $su) {
            try {
                $sr = Http::timeout(6)->withoutVerifying()->withHeaders(['User-Agent' => 'AllInOneSEO-Checker/1.7'])->get($su);
                if ($sr->status() == 200) {
                    $body_s = $sr->body();
                    if (stripos($body_s, '<urlset') !== false || stripos($body_s, '<sitemapindex') !== false || stripos($body_s, '<?xml') !== false) {
                        $sitemap_found = true;
                        $d['sitemap'] = $su;
                        break;
                    }
                }
            } catch (\Exception $e) {}
        }
        if ($sitemap_found) {
            $checks[] = ['status' => 'good', 'cat' => 'XML Sitemap', 'text' => 'XML Sitemap found: ' . ($d['sitemap'] ?? '')];
            $score += 7;
            $d['sitemap_s'] = 'good';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'XML Sitemap', 'text' => 'No XML sitemap detected at common locations.'];
            $score += 2;
            $d['sitemap'] = '(not found)';
            $d['sitemap_s'] = 'ok';
            $recs[] = 'Create and submit XML sitemap in Google Search Console.';
        }

        // Structured Data / Schema Validation
        $schemas = $xpath->query('//script[@type="application/ld+json"]');
        $schema_count = $schemas->length;
        $schema_types = [];
        foreach ($schemas as $s) {
            if (preg_match_all('/"@type"\s*:\s*"([^"]+)"/', $s->textContent, $m)) {
                foreach ($m[1] as $t) {
                    $schema_types[$t] = true;
                }
            }
        }
        $d['schema_count'] = $schema_count;
        $d['schema_types'] = array_keys($schema_types);
        if ($schema_count > 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Schema', 'text' => "Structured data present ($schema_count blocks): " . implode(', ', array_keys($schema_types))];
            $score += 7;
            $d['schema_s'] = 'good';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Schema', 'text' => 'No JSON-LD structured data detected.'];
            $score += 1;
            $d['schema_s'] = 'ok';
            $recs[] = 'Add and validate schema (Rich Results Test).';
        }

        // Page Speed proxy - HTML size
        $size_kb = round(strlen($html) / 1024, 1);
        $d['size_kb'] = $size_kb;
        if ($size_kb < 100) {
            $checks[] = ['status' => 'good', 'cat' => 'Page Speed', 'text' => "HTML size light ({$size_kb} KB) – good speed signal."];
            $score += 6;
            $d['size_s'] = 'good';
        } elseif ($size_kb < 250) {
            $checks[] = ['status' => 'ok', 'cat' => 'Page Speed', 'text' => "HTML size moderate ({$size_kb} KB)."];
            $score += 3;
            $d['size_s'] = 'ok';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Page Speed', 'text' => "HTML large ({$size_kb} KB). Optimize assets."];
            $score += 1;
            $d['size_s'] = 'bad';
            $recs[] = 'Minify HTML/CSS/JS, compress images, use caching.';
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Core Web Vitals', 'text' => 'Core Web Vitals (LCP/INP/CLS) need PageSpeed Insights or CrUX for exact scores.'];
        $recs[] = 'Test Core Web Vitals in Google PageSpeed Insights.';

        // Duplicate content signals
        $title = '';
        $tn = $xpath->query('//title');
        if ($tn->length) {
            $title = trim($tn->item(0)->textContent);
        }
        if ($canonical && $title) {
            $checks[] = ['status' => 'good', 'cat' => 'Duplicate Content', 'text' => 'Canonical + title present (helps avoid duplicates).'];
            $score += 4;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Duplicate Content', 'text' => 'Strengthen canonical and unique titles to avoid duplicates.'];
            $score += 2;
        }

        // JavaScript SEO signal
        $scripts = $xpath->query('//script[not(@type) or @type="text/javascript" or @type="application/javascript"]');
        $js_count = $scripts->length;
        $d['js_count'] = $js_count;
        if ($js_count > 40) {
            $checks[] = ['status' => 'ok', 'cat' => 'JavaScript SEO', 'text' => "Many script tags ($js_count). Ensure critical content is in HTML."];
            $score += 2;
            $recs[] = 'Avoid relying only on JS for main content; test with URL Inspection.';
        } else {
            $checks[] = ['status' => 'good', 'cat' => 'JavaScript SEO', 'text' => "Script count reasonable ($js_count)."];
            $score += 4;
        }

        // Security headers
        $has_xfo = false;
        $has_xcto = false;
        foreach ($headers as $hk => $hv) {
            $lk = strtolower($hk);
            if ($lk === 'x-frame-options') $has_xfo = true;
            if ($lk === 'x-content-type-options') $has_xcto = true;
        }
        if ($has_xfo || $has_xcto) {
            $checks[] = ['status' => 'good', 'cat' => 'Security', 'text' => 'Some security headers present.'];
            $score += 3;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Security', 'text' => 'Security headers not detected.'];
            $score += 1;
        }

        // Crawl / Indexing note
        $checks[] = ['status' => 'ok', 'cat' => 'Crawl & Indexing', 'text' => 'For crawl errors and full index coverage, use Google Search Console Coverage report.'];
        $recs[] = 'Monitor GSC for crawl errors and indexing issues.';

        if (empty($recs)) {
            $recs[] = 'Technical foundation looks solid. Re-test after major changes.';
        }
        $score = min(100, max(0, $score));

        // Calculate status counts (g, i, c)
        $g = 0; $i = 0; $c = 0;
        foreach ($checks as $chk) {
            if (($chk['status'] ?? '') === 'good') $g++;
            elseif (($chk['status'] ?? '') === 'ok') $i++;
            else $c++;
        }

        return array_merge($d, [
            'success' => true,
            'score' => $score,
            'final_url' => $url,
            'checks' => $checks,
            'recommendations' => $recs,
            'status_counts' => [
                'g' => $g,
                'i' => $i,
                'c' => $c,
            ],
            // Backward compatibility
            'summary' => $d,
        ]);
    }
}
