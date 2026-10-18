<?php

namespace App\Services\Seo;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class OnPageAnalyzerService
{
    /**
     * Analyze a given URL for on-page SEO signals matching functions.php aio_onpage_analyze.
     */
    public function analyze(string $url, ?string $keyword = null): array
    {
        $url = trim($url);
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        $keyword = $keyword ? trim($keyword) : '';

        $host = parse_url($url, PHP_URL_HOST);
        if (!$host || filter_var(gethostbyname($host), FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return [
                'success' => false,
                'message' => 'Invalid or restricted domain target.'
            ];
        }

        try {
            $response = Http::timeout(20)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; AllInOneSEO-Checker/1.6)',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                ])
                ->withoutVerifying()
                ->get($url);

            if ($response->failed()) {
                return [
                    'success' => false,
                    'message' => 'HTTP ' . $response->status()
                ];
            }

            $html = $response->body();
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Could not fetch: ' . $e->getMessage()
            ];
        }

        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();
        $xpath = new DOMXPath($dom);

        $checks = [];
        $recs = [];
        $score = 0;
        $details = [];

        // ===== 1. SEO Title =====
        $title = '';
        $tn = $xpath->query('//title');
        if ($tn->length) {
            $title = trim($tn->item(0)->textContent);
        }
        $title_len = mb_strlen($title);
        $details['title'] = $title;
        $details['title_len'] = $title_len;
        if ($title_len >= 50 && $title_len <= 60) {
            $checks[] = ['status' => 'good', 'cat' => 'Title', 'text' => "Title length optimal ($title_len chars)."];
            $score += 8;
            $details['title_s'] = 'good';
        } elseif ($title_len >= 30 && $title_len <= 70) {
            $checks[] = ['status' => 'ok', 'cat' => 'Title', 'text' => "Title length acceptable ($title_len chars). Ideal 50-60."];
            $score += 5;
            $details['title_s'] = 'ok';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Title', 'text' => "Title length issue ($title_len chars). Keep 50-60."];
            $score += 1;
            $details['title_s'] = 'bad';
            $recs[] = 'Rewrite title to 50-60 characters with primary keyword near start.';
        }

        if ($keyword !== '' && $title !== '' && stripos($title, $keyword) !== false) {
            $checks[] = ['status' => 'good', 'cat' => 'Title', 'text' => 'Focus keyword found in Title.'];
            $score += 6;
        } elseif ($keyword !== '') {
            $checks[] = ['status' => 'bad', 'cat' => 'Title', 'text' => 'Focus keyword missing in Title.'];
            $recs[] = 'Include focus keyword in the title tag.';
        }

        // ===== 2. Meta Description =====
        $meta = '';
        $mn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]/@content');
        if ($mn->length) {
            $meta = trim($mn->item(0)->nodeValue);
        }
        $meta_len = mb_strlen($meta);
        $details['meta'] = $meta;
        $details['meta_len'] = $meta_len;
        if ($meta_len >= 140 && $meta_len <= 160) {
            $checks[] = ['status' => 'good', 'cat' => 'Meta', 'text' => "Meta description optimal ($meta_len chars)."];
            $score += 7;
            $details['meta_s'] = 'good';
        } elseif ($meta_len >= 100 && $meta_len <= 170) {
            $checks[] = ['status' => 'ok', 'cat' => 'Meta', 'text' => "Meta length acceptable ($meta_len chars)."];
            $score += 4;
            $details['meta_s'] = 'ok';
        } elseif ($meta_len === 0) {
            $checks[] = ['status' => 'bad', 'cat' => 'Meta', 'text' => 'Meta description missing.'];
            $details['meta_s'] = 'bad';
            $recs[] = 'Add unique meta description 140-160 characters.';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Meta', 'text' => "Meta length needs work ($meta_len chars)."];
            $score += 1;
            $details['meta_s'] = 'bad';
            $recs[] = 'Adjust meta to 140-160 characters.';
        }

        if ($keyword !== '' && $meta !== '' && stripos($meta, $keyword) !== false) {
            $checks[] = ['status' => 'good', 'cat' => 'Meta', 'text' => 'Focus keyword in Meta Description.'];
            $score += 4;
        } elseif ($keyword !== '' && $meta !== '') {
            $checks[] = ['status' => 'ok', 'cat' => 'Meta', 'text' => 'Consider adding keyword in Meta.'];
            $score += 1;
        }

        // ===== 3. URL Structure =====
        $path = parse_url($url, PHP_URL_PATH) ?: '/';
        $details['url_path'] = $path;
        $url_has_kw = $keyword !== '' && stripos($path, str_replace(' ', '-', strtolower($keyword))) !== false;
        if (strlen($path) < 80 && !preg_match('/\?|\&|session|id=\d+/i', $path)) {
            $checks[] = ['status' => 'good', 'cat' => 'URL', 'text' => 'URL structure is clean and readable.'];
            $score += 5;
            $details['url_s'] = 'good';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'URL', 'text' => 'URL could be cleaner (avoid parameters, long paths).'];
            $score += 2;
            $details['url_s'] = 'ok';
            $recs[] = 'Use short, hyphenated, keyword-rich permalinks.';
        }

        if ($keyword !== '' && $url_has_kw) {
            $checks[] = ['status' => 'good', 'cat' => 'URL', 'text' => 'Focus keyword appears in URL.'];
            $score += 3;
        } elseif ($keyword !== '') {
            $checks[] = ['status' => 'ok', 'cat' => 'URL', 'text' => 'Keyword not in URL slug.'];
            $score += 1;
        }

        // ===== 4. Headings H1 H2 H3 =====
        $h1n = $xpath->query('//h1');
        $h2n = $xpath->query('//h2');
        $h3n = $xpath->query('//h3');
        $h1c = $h1n->length;
        $h2c = $h2n->length;
        $h3c = $h3n->length;
        $h1 = $h1c ? trim($h1n->item(0)->textContent) : '';
        $details['h1'] = $h1;
        $details['h1_count'] = $h1c;
        $details['h2_count'] = $h2c;
        $details['h3_count'] = $h3c;

        if ($h1c === 1) {
            $checks[] = ['status' => 'good', 'cat' => 'Headings', 'text' => 'Exactly one H1 found.'];
            $score += 6;
            $details['h1_s'] = 'good';
        } elseif ($h1c === 0) {
            $checks[] = ['status' => 'bad', 'cat' => 'Headings', 'text' => 'No H1 found.'];
            $details['h1_s'] = 'bad';
            $recs[] = 'Add one clear H1 with the main keyword.';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Headings', 'text' => "Multiple H1s ($h1c). Prefer one."];
            $score += 2;
            $details['h1_s'] = 'ok';
            $recs[] = 'Use only one H1 per page.';
        }

        if ($keyword !== '' && $h1 !== '' && stripos($h1, $keyword) !== false) {
            $checks[] = ['status' => 'good', 'cat' => 'Headings', 'text' => 'Focus keyword in H1.'];
            $score += 5;
        } elseif ($keyword !== '' && $h1 !== '') {
            $checks[] = ['status' => 'ok', 'cat' => 'Headings', 'text' => 'H1 missing focus keyword.'];
            $score += 1;
            $recs[] = 'Include keyword in H1.';
        }

        if ($h2c >= 2) {
            $checks[] = ['status' => 'good', 'cat' => 'Headings', 'text' => "Good H2 structure ($h2c H2s)."];
            $score += 4;
        } elseif ($h2c === 1) {
            $checks[] = ['status' => 'ok', 'cat' => 'Headings', 'text' => 'Only one H2. Add more subheadings.'];
            $score += 2;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Headings', 'text' => 'No H2 headings found.'];
            $score += 1;
            $recs[] = 'Use H2/H3 for content structure.';
        }

        if ($h3c > 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Headings', 'text' => "H3 subheadings present ($h3c)."];
            $score += 2;
        }

        // ===== 5. Content & Keyword Density =====
        $body = $xpath->query('//body');
        $body_text = $body->length ? trim(preg_replace('/\s+/', ' ', $body->item(0)->textContent)) : '';
        $words = preg_split('/\s+/', $body_text, -1, PREG_SPLIT_NO_EMPTY);
        $word_count = count($words);
        $details['word_count'] = $word_count;
        $keyword_count = 0;
        $density = 0;
        if ($keyword !== '') {
            $keyword_count = substr_count(mb_strtolower($body_text), mb_strtolower($keyword));
            $density = $word_count > 0 ? round(($keyword_count / $word_count) * 100, 2) : 0;
        }
        $details['keyword_count'] = $keyword_count;
        $details['density'] = $density;

        if ($word_count >= 1000) {
            $checks[] = ['status' => 'good', 'cat' => 'Content', 'text' => "Strong content length ($word_count words)."];
            $score += 7;
            $details['content_s'] = 'good';
        } elseif ($word_count >= 600) {
            $checks[] = ['status' => 'good', 'cat' => 'Content', 'text' => "Good content length ($word_count words)."];
            $score += 5;
            $details['content_s'] = 'good';
        } elseif ($word_count >= 300) {
            $checks[] = ['status' => 'ok', 'cat' => 'Content', 'text' => "Moderate content ($word_count words). Aim 800+."];
            $score += 3;
            $details['content_s'] = 'ok';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Content', 'text' => "Content too short ($word_count words)."];
            $score += 1;
            $details['content_s'] = 'bad';
            $recs[] = 'Expand to 800+ words covering the topic fully.';
        }

        if ($keyword !== '') {
            if ($density >= 0.5 && $density <= 2.5) {
                $checks[] = ['status' => 'good', 'cat' => 'Keyword', 'text' => "Keyword density healthy ($density%, $keyword_count times)."];
                $score += 6;
            } elseif ($density > 2.5 && $density <= 4) {
                $checks[] = ['status' => 'ok', 'cat' => 'Keyword', 'text' => "Density a bit high ($density%). Avoid stuffing."];
                $score += 2;
                $recs[] = 'Reduce keyword density under 2.5%.';
            } elseif ($density < 0.5) {
                $checks[] = ['status' => 'bad', 'cat' => 'Keyword', 'text' => "Density low ($density%)."];
                $score += 1;
                $recs[] = 'Use keyword more naturally in content.';
            } else {
                $checks[] = ['status' => 'bad', 'cat' => 'Keyword', 'text' => "Density too high ($density%)."];
                $recs[] = 'Stop keyword stuffing.';
            }

            $first100 = implode(' ', array_slice($words, 0, 100));
            if (stripos($first100, $keyword) !== false) {
                $checks[] = ['status' => 'good', 'cat' => 'Keyword', 'text' => 'Keyword appears in first 100 words.'];
                $score += 4;
            } else {
                $checks[] = ['status' => 'ok', 'cat' => 'Keyword', 'text' => 'Keyword missing in first 100 words.'];
                $score += 1;
                $recs[] = 'Place keyword early in the content.';
            }
        }

        // ===== 6. Internal & External Links + Anchor Text =====
        $internal = 0;
        $external = 0;
        $anchors = [];
        $empty_anchors = 0;
        $linkNodes = $xpath->query('//a[@href]');
        foreach ($linkNodes as $a) {
            $href = $a->getAttribute('href');
            $atext = trim($a->textContent);
            if ($atext === '' || $atext === '#') {
                $empty_anchors++;
            } elseif (count($anchors) < 8) {
                $anchors[] = $atext;
            }

            if (preg_match('~^https?://~i', $href)) {
                if (strpos($href, $host) !== false) {
                    $internal++;
                } else {
                    $external++;
                }
            } elseif (strpos($href, '#') !== 0 && strpos($href, 'mailto:') !== 0 && strpos($href, 'tel:') !== 0 && $href !== '') {
                $internal++;
            }
        }
        $details['internal_links'] = $internal;
        $details['external_links'] = $external;
        $details['sample_anchors'] = $anchors;

        if ($internal >= 3) {
            $checks[] = ['status' => 'good', 'cat' => 'Links', 'text' => "Good internal linking ($internal links)."];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Links', 'text' => "Few internal links ($internal). Add 3-5 relevant ones."];
            $score += 2;
            $recs[] = 'Add descriptive internal links to related pages.';
        }

        if ($external >= 1 && $external <= 20) {
            $checks[] = ['status' => 'good', 'cat' => 'Links', 'text' => "Outbound links present ($external)."];
            $score += 2;
        } elseif ($external > 20) {
            $checks[] = ['status' => 'ok', 'cat' => 'Links', 'text' => "Many outbound links ($external). Review quality."];
            $score += 1;
        }

        if ($empty_anchors > 5) {
            $checks[] = ['status' => 'ok', 'cat' => 'Links', 'text' => "Some empty/generic anchor texts ($empty_anchors)."];
            $score += 1;
            $recs[] = 'Use descriptive anchor text, avoid "click here".';
        } else {
            $checks[] = ['status' => 'good', 'cat' => 'Links', 'text' => 'Anchor text looks mostly descriptive.'];
            $score += 2;
        }

        // ===== 7. Image SEO =====
        $imgs = $xpath->query('//img');
        $img_count = $imgs->length;
        $img_alt = 0;
        $img_no_name = 0;
        foreach ($imgs as $img) {
            if (trim($img->getAttribute('alt')) !== '') {
                $img_alt++;
            }
            $src = $img->getAttribute('src');
            if (preg_match('/image\d+|img\d+|DSC|IMG_|screenshot/i', $src)) {
                $img_no_name++;
            }
        }
        $details['img_count'] = $img_count;
        $details['img_with_alt'] = $img_alt;

        if ($img_count === 0) {
            $checks[] = ['status' => 'ok', 'cat' => 'Images', 'text' => 'No images on page.'];
            $score += 2;
            $details['img_s'] = 'ok';
        } elseif ($img_alt === $img_count) {
            $checks[] = ['status' => 'good', 'cat' => 'Images', 'text' => "All $img_count images have alt text."];
            $score += 6;
            $details['img_s'] = 'good';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Images', 'text' => ($img_count - $img_alt) . " of $img_count images missing alt."];
            $score += 2;
            $details['img_s'] = 'ok';
            $recs[] = 'Add descriptive alt text to every image.';
        }

        if ($img_no_name > 0) {
            $checks[] = ['status' => 'ok', 'cat' => 'Images', 'text' => "$img_no_name images may have non-descriptive filenames."];
            $score += 1;
            $recs[] = 'Use descriptive filenames (e.g. on-page-seo-guide.jpg).';
        }

        // ===== 8. Canonical =====
        $canonical = '';
        $cn = $xpath->query('//link[translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="canonical"]/@href');
        if ($cn->length) {
            $canonical = trim($cn->item(0)->nodeValue);
        }
        $details['canonical'] = $canonical ?: '(none)';

        if ($canonical) {
            $checks[] = ['status' => 'good', 'cat' => 'Canonical', 'text' => 'Canonical tag present.'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Canonical', 'text' => 'No canonical tag found.'];
            $score += 1;
            $recs[] = 'Add rel=canonical to avoid duplicate content issues.';
        }

        // ===== 9. Schema Markup =====
        $schemas = $xpath->query('//script[@type="application/ld+json"]');
        $schema_count = $schemas->length;
        $schema_types = [];
        foreach ($schemas as $s) {
            $t = $s->textContent;
            if (preg_match_all('/"@type"\s*:\s*"([^"]+)"/', $t, $m)) {
                foreach ($m[1] as $type) {
                    $schema_types[$type] = true;
                }
            }
        }
        $details['schema_count'] = $schema_count;
        $details['schema_types'] = array_keys($schema_types);

        if ($schema_count > 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Schema', 'text' => "Schema found ($schema_count blocks): " . implode(', ', array_keys($schema_types))];
            $score += 6;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Schema', 'text' => 'No JSON-LD schema detected.'];
            $score += 1;
            $recs[] = 'Add Article/FAQ/HowTo/Organization schema as relevant.';
        }

        // ===== 10. Readability =====
        $sentences = preg_split('/[.!?]+/', $body_text, -1, PREG_SPLIT_NO_EMPTY);
        $sent_count = count($sentences);
        $avg_sentence = $sent_count > 0 ? round($word_count / $sent_count, 1) : 0;
        $details['avg_sentence'] = $avg_sentence;

        if ($avg_sentence > 0 && $avg_sentence <= 20) {
            $checks[] = ['status' => 'good', 'cat' => 'Readability', 'text' => "Average sentence length good ($avg_sentence words)."];
            $score += 3;
        } elseif ($avg_sentence > 25) {
            $checks[] = ['status' => 'ok', 'cat' => 'Readability', 'text' => "Sentences may be long (avg $avg_sentence words)."];
            $score += 1;
            $recs[] = 'Shorten sentences for better readability.';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Readability', 'text' => "Sentence length average: $avg_sentence words."];
            $score += 2;
        }

        if (empty($recs)) {
            $recs[] = 'On-Page SEO looks solid overall. Keep content updated and monitor rankings.';
        }

        $score = min(100, max(0, $score));

        // Calculate status counts (g, i, c)
        $g = 0; $i = 0; $c = 0;
        foreach ($checks as $chk) {
            if (($chk['status'] ?? '') === 'good') $g++;
            elseif (($chk['status'] ?? '') === 'ok') $i++;
            else $c++;
        }

        return array_merge($details, [
            'success' => true,
            'score' => $score,
            'final_url' => $url,
            'keyword' => $keyword,
            'checks' => $checks,
            'recommendations' => $recs,
            'status_counts' => [
                'g' => $g,
                'i' => $i,
                'c' => $c,
            ],
            // Backward compatibility
            'summary' => $details,
        ]);
    }
}
