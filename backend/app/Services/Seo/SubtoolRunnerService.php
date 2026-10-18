<?php

namespace App\Services\Seo;

use Illuminate\Support\Facades\Http;

class SubtoolRunnerService
{
    /**
     * Stop words matching the theme
     */
    protected array $stopWords = [
        'the','and','for','are','but','not','you','all','can','had','her','was','one','our',
        'out','has','have','from','they','this','that','with','will','your','what','when',
        'more','also','into','than','then','some','would','could','there','their','about',
        'which','other','these','after','most','such','only','over'
    ];

    protected array $socialHosts = [
        'facebook.com','twitter.com','x.com','linkedin.com','instagram.com','youtube.com','pinterest.com','tiktok.com'
    ];

    /**
     * Main entry point for running any of the 25 subtools
     */
    public function run(string $tool, ?string $url, ?string $text = null, ?string $keyword = null, ?string $competitor = null, ?string $city = null): array
    {
        $tool = strtolower(trim($tool));
        $keyword = $keyword ? trim($keyword) : '';
        $city = $city ? trim($city) : '';
        $competitor = $competitor ? trim($competitor) : '';
        $text = $text ? trim($text) : '';

        // Tools that need page HTML
        $needFetch = !in_array($tool, ['word-counter', 'plagiarism-checker'], true) || (!empty($url) && empty($text));

        $html = '';
        $finalUrl = $url;
        $httpCode = 200;

        if ($needFetch && !empty($url)) {
            $fetched = $this->fetchHtml($url);
            if (!$fetched['success']) {
                return $fetched;
            }
            $html = $fetched['html'];
            $finalUrl = $fetched['url'];
            $httpCode = $fetched['code'];
        }

        if (!empty($html)) {
            list($dom, $xpath) = $this->parseDom($html);
            $bodyNodes = $xpath->query('//body');
            $bodyText = $bodyNodes->length ? trim(preg_replace('/\s+/', ' ', $bodyNodes->item(0)->textContent)) : '';
        } else {
            $bodyText = $text;
            $xpath = null;
            $dom = null;
        }

        $host = parse_url($finalUrl ?: '', PHP_URL_HOST) ?? '';

        // Check if On-Page specialized tool or Pillar subtool
        $onPageTools = [
            'website-seo-checker', 'seo-analyzer', 'keyword-density-checker',
            'meta-tag-analyzer', 'serp-snippet-preview', 'word-counter',
            'plagiarism-checker', 'image-alt-checker', 'heading-checker', 'broken-link-checker'
        ];

        if (in_array($tool, $onPageTools, true)) {
            return $this->runOnPageTool($tool, $finalUrl, $html, $xpath, $bodyText, $keyword, $text, $host);
        } else {
            return $this->runPillarSubtool($tool, $finalUrl, $html, $xpath, $bodyText, $competitor, $city, $host);
        }
    }

    /**
     * Fetch HTML matching aio_fetch_html in theme
     */
    protected function fetchHtml(string $url): array
    {
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        // Host security check
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
                    'User-Agent' => 'Mozilla/5.0 (compatible; AllInOneSEO-Checker/1.8)',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                ])
                ->withoutVerifying()
                ->get($url);

            $code = $response->status();
            if ($code < 200 || $code >= 400) {
                return [
                    'success' => false,
                    'message' => 'HTTP status ' . $code
                ];
            }

            return [
                'success' => true,
                'html' => $response->body(),
                'url' => $url,
                'code' => $code,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Could not fetch: ' . $e->getMessage()
            ];
        }
    }

    /**
     * DOM Parser matching aio_parse_dom in theme
     */
    protected function parseDom(string $html): array
    {
        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();
        return [$dom, new \DOMXPath($dom)];
    }

    /**
     * Helper to compute Good, Improve, Critical counts
     */
    protected function countStatuses(array $checks): array
    {
        $g = 0; $i = 0; $c = 0;
        foreach ($checks as $ch) {
            $st = $ch['status'] ?? 'ok';
            if ($st === 'good') $g++;
            elseif ($st === 'ok') $i++;
            else $c++;
        }
        return [
            'g' => $g,
            'i' => $i,
            'c' => $c,
            'good' => $g,
            'improve' => $i,
            'critical' => $c,
        ];
    }

    // =========================================================================
    // 1. ON-PAGE SUBTOOLS (Exact duplicate of aio_onpage_tool_run in functions.php)
    // =========================================================================

    protected function runOnPageTool(string $tool, string $finalUrl, string $html, ?\DOMXPath $xpath, string $bodyText, string $keyword, string $text, string $host): array
    {
        $checks = [];
        $recs = [];
        $score = 0;
        $extra = [];

        switch ($tool) {
            case 'website-seo-checker':
            case 'seo-analyzer':
                $title = '';
                $tn = $xpath->query('//title');
                if ($tn->length) $title = trim($tn->item(0)->textContent);

                $meta = '';
                $mn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]/@content');
                if ($mn->length) $meta = trim($mn->item(0)->nodeValue);

                $h1n = $xpath->query('//h1');
                $h1c = $h1n->length;

                $words = count(preg_split('/\s+/', $bodyText, -1, PREG_SPLIT_NO_EMPTY));

                $imgs = $xpath->query('//img');
                $imgAlt = 0;
                foreach ($imgs as $img) {
                    if (trim($img->getAttribute('alt')) !== '') $imgAlt++;
                }

                $can = $xpath->query('//link[translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="canonical"]')->length;
                $schema = $xpath->query('//script[@type="application/ld+json"]')->length;

                // Points exactly as in functions.php lines 1450-1473:
                if (mb_strlen($title) >= 40 && mb_strlen($title) <= 65) { $checks[] = ['status'=>'good', 'text'=>'Title length optimal']; $score += 15; }
                elseif ($title) { $checks[] = ['status'=>'ok', 'text'=>'Title present']; $score += 8; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No title']; $score += 0; $recs[] = 'Add page title.'; }

                if (mb_strlen($meta) >= 120 && mb_strlen($meta) <= 165) { $checks[] = ['status'=>'good', 'text'=>'Meta description optimal']; $score += 15; }
                elseif ($meta) { $checks[] = ['status'=>'ok', 'text'=>'Meta description present']; $score += 8; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No meta description']; $score += 0; $recs[] = 'Add meta description.'; }

                if ($h1c === 1) { $checks[] = ['status'=>'good', 'text'=>'Single H1 present']; $score += 15; }
                elseif ($h1c > 1) { $checks[] = ['status'=>'ok', 'text'=>"Multiple H1s ($h1c)"]; $score += 6; $recs[] = 'Use only one H1.'; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No H1 found']; $score += 0; $recs[] = 'Add an H1 heading.'; }

                if ($words >= 600) { $checks[] = ['status'=>'good', 'text'=>"$words words (good length)"]; $score += 12; }
                elseif ($words >= 300) { $checks[] = ['status'=>'ok', 'text'=>"$words words"]; $score += 6; }
                else { $checks[] = ['status'=>'bad', 'text'=>"Thin content ($words words)"]; $score += 2; $recs[] = 'Expand content.'; }

                if ($imgs->length === 0 || $imgAlt === $imgs->length) { $checks[] = ['status'=>'good', 'text'=>'Image alts OK']; $score += 10; }
                else { $checks[] = ['status'=>'ok', 'text'=>($imgs->length - $imgAlt).' images missing alt']; $score += 4; $recs[] = 'Add ALT text.'; }

                if ($can) { $checks[] = ['status'=>'good', 'text'=>'Canonical present']; $score += 10; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No canonical']; $score += 3; }

                if ($schema) { $checks[] = ['status'=>'good', 'text'=>"Schema ($schema)"]; $score += 10; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No schema']; $score += 3; $recs[] = 'Add JSON-LD schema.'; }

                if ($keyword && $title && stripos($title, $keyword) !== false) { $checks[] = ['status'=>'good', 'text'=>'Keyword in title']; $score += 8; }
                elseif ($keyword) { $checks[] = ['status'=>'ok', 'text'=>'Keyword not in title']; $score += 2; }

                if (strpos($finalUrl, 'https://') === 0) { $checks[] = ['status'=>'good', 'text'=>'HTTPS']; $score += 6; }
                else { $checks[] = ['status'=>'bad', 'text'=>'Not HTTPS']; $score += 0; }

                $extra = ['title'=>$title, 'meta'=>$meta, 'words'=>$words, 'h1'=>$h1c];
                break;

            case 'keyword-density-checker':
                $wordsArr = preg_split('/\s+/', mb_strtolower($bodyText), -1, PREG_SPLIT_NO_EMPTY);
                $total = count($wordsArr);
                $kw = mb_strtolower($keyword);
                $count = $kw !== '' ? substr_count(mb_strtolower($bodyText), $kw) : 0;
                $density = ($total > 0 && $kw !== '') ? round(($count / $total) * 100, 2) : 0;

                $freq = [];
                foreach ($wordsArr as $w) {
                    $w = preg_replace('/[^a-z0-9\-]/', '', $w);
                    if (strlen($w) < 3 || in_array($w, $this->stopWords, true)) continue;
                    if (!isset($freq[$w])) $freq[$w] = 0;
                    $freq[$w]++;
                }
                arsort($freq);
                $top = array_slice($freq, 0, 15, true);

                if ($kw === '') {
                    $checks[] = ['status'=>'ok', 'text'=>'No focus keyword — showing top terms'];
                    $score = 50;
                    $recs[] = 'Enter a focus keyword for density score.';
                } elseif ($density >= 0.5 && $density <= 2.5) {
                    $checks[] = ['status'=>'good', 'text'=>"Density healthy: $density% ($count times)"];
                    $score = 90;
                } elseif ($density > 2.5) {
                    $checks[] = ['status'=>'ok', 'text'=>"Density high: $density%"];
                    $score = 55;
                    $recs[] = 'Reduce keyword stuffing under 2.5%.';
                } else {
                    $checks[] = ['status'=>'bad', 'text'=>"Density low: $density%"];
                    $score = 40;
                    $recs[] = 'Use keyword more naturally.';
                }
                $checks[] = ['status'=>'good', 'text'=>"Total words analyzed: $total"];
                $extra = ['density'=>$density, 'count'=>$count, 'total'=>$total, 'top'=>$top, 'keyword'=>$keyword];
                break;

            case 'meta-tag-analyzer':
                $title = '';
                $tn = $xpath->query('//title');
                if ($tn->length) $title = trim($tn->item(0)->textContent);

                $meta = '';
                $mn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]/@content');
                if ($mn->length) $meta = trim($mn->item(0)->nodeValue);

                $robots = '';
                $rn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="robots"]/@content');
                if ($rn->length) $robots = trim($rn->item(0)->nodeValue);

                $viewport = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="viewport"]')->length;
                $og = $xpath->query('//meta[starts-with(@property,"og:")]')->length;

                $tl = mb_strlen($title);
                $ml = mb_strlen($meta);

                if ($tl >= 50 && $tl <= 60) { $checks[] = ['status'=>'good', 'text'=>"Title $tl chars (ideal)"]; $score += 25; }
                elseif ($tl > 0) { $checks[] = ['status'=>'ok', 'text'=>"Title $tl chars"]; $score += 12; $recs[] = 'Ideal title 50-60 chars.'; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No title']; $score += 0; }

                if ($ml >= 140 && $ml <= 160) { $checks[] = ['status'=>'good', 'text'=>"Meta $ml chars (ideal)"]; $score += 25; }
                elseif ($ml > 0) { $checks[] = ['status'=>'ok', 'text'=>"Meta $ml chars"]; $score += 12; $recs[] = 'Ideal meta 140-160 chars.'; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No meta description']; $score += 0; $recs[] = 'Add meta description.'; }

                if ($viewport) { $checks[] = ['status'=>'good', 'text'=>'Viewport meta present']; $score += 15; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No viewport meta']; $score += 0; }

                if ($og >= 3) { $checks[] = ['status'=>'good', 'text'=>"Open Graph tags ($og)"]; $score += 15; }
                elseif ($og > 0) { $checks[] = ['status'=>'ok', 'text'=>"Some OG tags ($og)"]; $score += 8; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No Open Graph tags']; $score += 3; $recs[] = 'Add og:title, og:description, og:image.'; }

                if ($robots && stripos($robots, 'noindex') !== false) { $checks[] = ['status'=>'bad', 'text'=>"Robots: $robots"]; $score += 0; $recs[] = 'Remove noindex if page should rank.'; }
                else { $checks[] = ['status'=>'good', 'text'=>'Robots OK' . ($robots ? ": $robots" : '')]; $score += 15; }

                $extra = ['title'=>$title, 'meta'=>$meta, 'title_len'=>$tl, 'meta_len'=>$ml];
                break;

            case 'serp-snippet-preview':
                $title = '';
                $tn = $xpath->query('//title');
                if ($tn->length) $title = trim($tn->item(0)->textContent);

                $meta = '';
                $mn = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]/@content');
                if ($mn->length) $meta = trim($mn->item(0)->nodeValue);

                $tl = mb_strlen($title);
                $ml = mb_strlen($meta);
                $displayTitle = $tl > 60 ? mb_substr($title, 0, 57) . '...' : $title;
                $displayMeta = $ml > 160 ? mb_substr($meta, 0, 157) . '...' : $meta;

                if ($title) { $checks[] = ['status'=>'good', 'text'=>'Title available for SERP']; $score += 40; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No title for SERP']; $score += 0; $recs[] = 'Add title tag.'; }

                if ($meta) { $checks[] = ['status'=>'good', 'text'=>'Meta available for SERP']; $score += 40; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No meta — Google may auto-generate']; $score += 15; $recs[] = 'Write a compelling meta description.'; }

                if ($tl >= 50 && $tl <= 60) { $checks[] = ['status'=>'good', 'text'=>'Title length fits SERP']; $score += 10; }
                elseif ($tl > 60) { $checks[] = ['status'=>'ok', 'text'=>'Title may truncate in SERP']; $score += 5; }

                if ($ml >= 140 && $ml <= 160) { $checks[] = ['status'=>'good', 'text'=>'Meta length fits SERP']; $score += 10; }

                $extra = [
                    'serp_title' => $displayTitle ?: '(no title)',
                    'serp_meta' => $displayMeta ?: '(no description)',
                    'serp_url' => $finalUrl
                ];
                break;

            case 'word-counter':
                $src = $bodyText !== '' ? $bodyText : $text;
                if ($src === '') {
                    return ['success' => false, 'message' => 'URL or text required.'];
                }
                $chars = mb_strlen($src);
                $charsNoSpace = mb_strlen(preg_replace('/\s+/', '', $src));
                $words = str_word_count($src);
                $sentences = max(1, count(preg_split('/[.!?]+/', $src, -1, PREG_SPLIT_NO_EMPTY)));
                $paras = max(1, count(preg_split('/\n\s*\n/', trim($src))));

                $checks[] = ['status'=>'good', 'text'=>"Words: $words"];
                $checks[] = ['status'=>'good', 'text'=>"Characters (with spaces): $chars"];
                $checks[] = ['status'=>'good', 'text'=>"Characters (no spaces): $charsNoSpace"];
                $checks[] = ['status'=>'good', 'text'=>"Sentences: ~$sentences"];
                $checks[] = ['status'=>'good', 'text'=>"Paragraphs: ~$paras"];

                if ($words >= 800) { $score = 95; $checks[] = ['status'=>'good', 'text'=>'Length good for SEO content']; }
                elseif ($words >= 400) { $score = 75; $checks[] = ['status'=>'ok', 'text'=>'Moderate length']; }
                else { $score = 50; $checks[] = ['status'=>'ok', 'text'=>'Short content']; $recs[] = 'Aim 600–1000+ words for competitive topics.'; }

                $extra = ['words'=>$words, 'chars'=>$chars, 'chars_ns'=>$charsNoSpace, 'sentences'=>$sentences];
                break;

            case 'plagiarism-checker':
                $src = $bodyText !== '' ? $bodyText : $text;
                if ($src === '') {
                    return ['success' => false, 'message' => 'URL or text required.'];
                }
                $sentences = preg_split('/[.!?]+/', $src, -1, PREG_SPLIT_NO_EMPTY);
                $sentences = array_values(array_filter(array_map('trim', $sentences), fn($s) => mb_strlen($s) > 20));
                $unique = array_unique($sentences);
                $dupRatio = count($sentences) > 0 ? round((1 - count($unique) / count($sentences)) * 100, 1) : 0;
                $words = preg_split('/\s+/', mb_strtolower($src), -1, PREG_SPLIT_NO_EMPTY);
                $wordUnique = count(array_unique($words));
                $vocab = count($words) > 0 ? round(($wordUnique / count($words)) * 100, 1) : 0;

                $repeats = 0;
                if (count($words) > 10) {
                    $grams = [];
                    for ($i = 0; $i < count($words) - 4; $i++) {
                        $g = implode(' ', array_slice($words, $i, 5));
                        if (!isset($grams[$g])) $grams[$g] = 0;
                        $grams[$g]++;
                        if ($grams[$g] === 2) $repeats++;
                    }
                }

                if ($dupRatio < 5 && $repeats < 3) { $checks[] = ['status'=>'good', 'text'=>'Low internal repetition']; $score += 40; }
                elseif ($dupRatio < 15) { $checks[] = ['status'=>'ok', 'text'=>'Some repeated sentences']; $score += 20; $recs[] = 'Rewrite repeated sentences.'; }
                else { $checks[] = ['status'=>'bad', 'text'=>'High sentence repetition']; $score += 5; $recs[] = 'Content may be padded with repeats.'; }

                if ($vocab >= 45) { $checks[] = ['status'=>'good', 'text'=>"Vocabulary diversity $vocab%"]; $score += 30; }
                elseif ($vocab >= 30) { $checks[] = ['status'=>'ok', 'text'=>"Vocabulary diversity $vocab%"]; $score += 15; }
                else { $checks[] = ['status'=>'ok', 'text'=>"Low vocabulary diversity $vocab%"]; $score += 8; }

                $checks[] = ['status'=>'ok', 'text'=>"Repeated phrase patterns: $repeats"];
                $checks[] = ['status'=>'ok', 'text'=>'Note: Full web plagiarism needs paid databases (Turnitin/Copyscape). This is an on-page originality signal check only.'];
                $score = min(100, $score + 20);
                $extra = ['dup_ratio'=>$dupRatio, 'vocab'=>$vocab, 'repeats'=>$repeats];
                $recs[] = 'For legal plagiarism scan use a dedicated plagiarism service.';
                break;

            case 'image-alt-checker':
                $imgs = $xpath->query('//img');
                $total = $imgs->length; $with = 0; $empty = 0; $samples = [];
                foreach ($imgs as $img) {
                    $alt = trim($img->getAttribute('alt'));
                    $src = $img->getAttribute('src');
                    if ($alt !== '') { $with++; if (count($samples) < 8) $samples[] = ['alt'=>$alt, 'src'=>mb_substr($src, 0, 60)]; }
                    else { $empty++; if (count($samples) < 8) $samples[] = ['alt'=>'(missing)', 'src'=>mb_substr($src, 0, 60)]; }
                }
                if ($total === 0) { $checks[] = ['status'=>'ok', 'text'=>'No images found']; $score = 60; }
                elseif ($empty === 0) { $checks[] = ['status'=>'good', 'text'=>"All $total images have ALT"]; $score = 95; }
                else {
                    $checks[] = ['status'=>'ok', 'text'=>"$with with ALT, $empty missing"];
                    $score = (int) round(($with / max(1, $total)) * 100);
                    $recs[] = 'Add descriptive ALT to every informative image.';
                }
                $checks[] = ['status'=>'good', 'text'=>"Total images: $total"];
                $extra = ['total'=>$total, 'with_alt'=>$with, 'missing'=>$empty, 'samples'=>$samples];
                break;

            case 'heading-checker':
                $levels = [];
                for ($h = 1; $h <= 6; $h++) {
                    $nodes = $xpath->query('//h' . $h);
                    $levels[$h] = [];
                    foreach ($nodes as $n) {
                        $levels[$h][] = trim(preg_replace('/\s+/', ' ', $n->textContent));
                    }
                }
                $h1c = count($levels[1]);
                if ($h1c === 1) { $checks[] = ['status'=>'good', 'text'=>'Exactly one H1']; $score += 30; }
                elseif ($h1c === 0) { $checks[] = ['status'=>'bad', 'text'=>'No H1']; $score += 0; $recs[] = 'Add one H1.'; }
                else { $checks[] = ['status'=>'ok', 'text'=>"$h1c H1 headings"]; $score += 10; $recs[] = 'Use only one H1.'; }

                if (count($levels[2]) >= 2) { $checks[] = ['status'=>'good', 'text'=>count($levels[2]).' H2 headings']; $score += 25; }
                elseif (count($levels[2]) === 1) { $checks[] = ['status'=>'ok', 'text'=>'Only one H2']; $score += 12; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No H2']; $score += 5; $recs[] = 'Structure content with H2s.'; }

                if (count($levels[3]) > 0) { $checks[] = ['status'=>'good', 'text'=>count($levels[3]).' H3 headings']; $score += 15; }

                $skip = ($h1c > 0 && count($levels[2]) === 0 && count($levels[3]) > 0);
                if ($skip) { $checks[] = ['status'=>'ok', 'text'=>'Possible heading skip (H1→H3)']; $score += 5; $recs[] = 'Avoid skipping heading levels.'; }
                else { $checks[] = ['status'=>'good', 'text'=>'Heading hierarchy looks reasonable']; $score += 15; }

                $totalH = 0; foreach ($levels as $L) $totalH += count($L);
                $checks[] = ['status'=>'good', 'text'=>"Total headings: $totalH"];
                $score = min(100, $score + 15);
                $extra = ['levels'=>$levels, 'total_h'=>$totalH];
                break;

            case 'broken-link-checker':
                $links = $xpath->query('//a[@href]');
                $toCheck = [];
                foreach ($links as $a) {
                    $href = trim($a->getAttribute('href'));
                    if ($href === '' || $href[0] === '#' || stripos($href, 'mailto:') === 0 || stripos($href, 'tel:') === 0 || stripos($href, 'javascript:') === 0) continue;
                    if (strpos($href, '//') === 0) $href = 'https:' . $href;
                    if (!preg_match('~^https?://~i', $href)) {
                        $base = rtrim($finalUrl, '/');
                        if ($href[0] === '/') {
                            $href = (parse_url($finalUrl, PHP_URL_SCHEME) ?: 'https') . '://' . $host . $href;
                        } else {
                            $href = $base . '/' . ltrim($href, '/');
                        }
                    }
                    $toCheck[$href] = true;
                    if (count($toCheck) >= 15) break;
                }

                $ok = 0; $bad = 0; $samples = [];
                foreach (array_keys($toCheck) as $href) {
                    try {
                        $r = Http::timeout(6)->withoutVerifying()->head($href);
                        $c = $r->status();
                        if ($c >= 200 && $c < 400) { $ok++; }
                        else { $bad++; $samples[] = ['url'=>$href, 'status'=>$c]; }
                    } catch (\Exception $e) {
                        $bad++;
                        $samples[] = ['url'=>$href, 'status'=>'error'];
                    }
                }
                $checked = $ok + $bad;
                $checks[] = ['status'=>'good', 'text'=>"Checked $checked links (max 15 per run)"];
                if ($bad === 0) { $checks[] = ['status'=>'good', 'text'=>'No broken links in sample']; $score = 95; }
                else {
                    $checks[] = ['status'=>'ok', 'text'=>"$bad potentially broken / error"];
                    $score = max(20, 100 - ($bad * 12));
                    $recs[] = 'Fix or remove broken links listed below.';
                }
                $checks[] = ['status'=>'good', 'text'=>"OK responses: $ok"];
                $extra = ['ok'=>$ok, 'bad'=>$bad, 'samples'=>$samples];
                break;
        }

        if (empty($recs)) $recs[] = 'Looking good for this tool. Re-run after changes.';
        $score = min(100, max(0, (int) $score));
        $statusCounts = $this->countStatuses($checks);

        return [
            'success' => true,
            'tool' => $tool,
            'score' => $score,
            'final_url' => $finalUrl,
            'checks' => $checks,
            'recommendations' => $recs,
            'extra' => $extra,
            'status_counts' => $statusCounts,
        ];
    }

    // =========================================================================
    // 2. PILLAR SUBTOOLS (Exact duplicate of aio_pillar_subtool_run in functions.php)
    // =========================================================================

    protected function runPillarSubtool(string $tool, string $finalUrl, string $html, ?\DOMXPath $xpath, string $bodyText, string $competitor, string $city, string $host): array
    {
        $checks = [];
        $recs = [];
        $score = 0;
        $extra = [];

        // Common link parser for Off-Page & Technical
        $countSocial = 0;
        $socialHosts = ['facebook.com','twitter.com','x.com','linkedin.com','instagram.com','youtube.com','pinterest.com','tiktok.com'];
        $extHosts = [];
        $anchors = [];

        $links = $xpath ? $xpath->query('//a[@href]') : [];
        if ($xpath) {
            foreach ($links as $a) {
                $href = trim($a->getAttribute('href'));
                $atext = trim(preg_replace('/\s+/', ' ', $a->textContent));
                if ($href === '' || $href[0] === '#' || stripos($href, 'mailto:') === 0 || stripos($href, 'tel:') === 0) continue;
                if (strpos($href, '//') === 0) $href = 'https:' . $href;
                if (!preg_match('~^https?://~i', $href)) continue;
                $h = parse_url($href, PHP_URL_HOST);
                if (!$h) continue;
                $h = strtolower(preg_replace('/^www\./', '', $h));
                $isSame = ($h === strtolower(preg_replace('/^www\./', '', $host)));
                if (!$isSame) {
                    $extHosts[$h] = true;
                    foreach ($socialHosts as $sh) {
                        if (strpos($h, $sh) !== false) { $countSocial++; break; }
                    }
                }
                if ($atext !== '') {
                    $key = mb_strtolower($atext);
                    if (!isset($anchors[$key])) $anchors[$key] = 0;
                    $anchors[$key]++;
                }
            }
        }
        arsort($anchors);

        switch ($tool) {
            case 'backlink-checker':
                $checks[] = ['status'=>'ok', 'text'=>'Live full backlink index needs Ahrefs/Moz/SEMrush API. Showing on-page authority signals.'];
                $out = count($extHosts);
                if ($out >= 5) { $checks[] = ['status'=>'good', 'text'=>"External domains linked: $out"]; $score += 25; }
                elseif ($out > 0) { $checks[] = ['status'=>'ok', 'text'=>"External domains linked: $out"]; $score += 12; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No external links found']; $score += 5; }

                if ($countSocial >= 3) { $checks[] = ['status'=>'good', 'text'=>"Social profiles linked: $countSocial"]; $score += 25; }
                elseif ($countSocial > 0) { $checks[] = ['status'=>'ok', 'text'=>"Social profiles: $countSocial"]; $score += 12; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No social profile links']; $score += 5; $recs[] = 'Link official social profiles in footer.'; }

                if (stripos($bodyText, 'blog') !== false || $xpath->query('//a[contains(@href,"blog")]')->length) {
                    $checks[] = ['status'=>'good', 'text'=>'Blog / content hub signals present']; $score += 20;
                } else {
                    $checks[] = ['status'=>'ok', 'text'=>'No clear blog hub']; $score += 8; $recs[] = 'Publish linkable content assets.';
                }

                $schema = $xpath->query('//script[@type="application/ld+json"]')->length;
                if ($schema) { $checks[] = ['status'=>'good', 'text'=>"Schema blocks: $schema"]; $score += 15; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No schema']; $score += 5; }

                $checks[] = ['status'=>'ok', 'text'=>'Tip: Check free backlink overview on Moz Link Explorer or Ahrefs free tools.'];
                $score = min(100, $score + 10);
                $extra = ['external_domains'=>$out, 'social'=>$countSocial];
                $recs[] = 'Build DoFollow links from relevant sites; monitor toxic links in a paid tool.';
                break;

            case 'da-pa-checker':
                $checks[] = ['status'=>'ok', 'text'=>'Official DA/PA scores are Moz proprietary. Free signals below estimate readiness.'];
                $https = (strpos($finalUrl, 'https://') === 0);
                $title = ''; $tn = $xpath->query('//title'); if ($tn->length) $title = trim($tn->item(0)->textContent);
                $words = str_word_count($bodyText);
                $schema = $xpath->query('//script[@type="application/ld+json"]')->length;
                $can = $xpath->query('//link[translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="canonical"]')->length;

                if ($https) { $checks[] = ['status'=>'good', 'text'=>'HTTPS enabled']; $score += 20; }
                else { $checks[] = ['status'=>'bad', 'text'=>'Not on HTTPS']; $score += 0; $recs[] = 'Enable SSL.'; }

                if ($title) { $checks[] = ['status'=>'good', 'text'=>'Title present']; $score += 15; }
                if ($words >= 500) { $checks[] = ['status'=>'good', 'text'=>"Content depth: $words words"]; $score += 20; }
                elseif ($words >= 200) { $checks[] = ['status'=>'ok', 'text'=>"$words words"]; $score += 10; }
                else { $checks[] = ['status'=>'ok', 'text'=>'Thin content for authority']; $score += 5; }

                if ($schema) { $checks[] = ['status'=>'good', 'text'=>'Structured data present']; $score += 15; }
                if ($can) { $checks[] = ['status'=>'good', 'text'=>'Canonical set']; $score += 10; }
                if ($countSocial > 0) { $checks[] = ['status'=>'good', 'text'=>'Social footprint links']; $score += 10; }

                $checks[] = ['status'=>'ok', 'text'=>'Check exact DA/PA on Moz Open Site Explorer (free limited).'];
                $score = min(100, max(20, $score));
                $extra = ['note'=>'DA/PA from Moz; use free Moz toolbar/Open Site Explorer for numbers.'];
                $recs[] = 'Improve content, links, and technical health to raise authority over time.';
                break;

            case 'competitor-backlink-analyzer':
                if (empty($competitor)) return ['success' => false, 'message' => 'Competitor URL required.'];
                $cf = $this->fetchHtml($competitor);
                if (!$cf['success']) return ['success' => false, 'message' => 'Competitor: ' . $cf['message']];

                list($cdom, $cxpath) = $this->parseDom($cf['html']);
                $cExt = []; $cSocial = 0;
                $cHost = strtolower(preg_replace('/^www\./', '', parse_url($cf['url'], PHP_URL_HOST) ?? ''));

                foreach ($cxpath->query('//a[@href]') as $a) {
                    $href = trim($a->getAttribute('href'));
                    if (!preg_match('~^https?://~i', $href) && strpos($href, '//') !== 0) continue;
                    if (strpos($href, '//') === 0) $href = 'https:' . $href;
                    $h = parse_url($href, PHP_URL_HOST);
                    if (!$h) continue;
                    $h = strtolower(preg_replace('/^www\./', '', $h));
                    if ($h === $cHost) continue;
                    $cExt[$h] = true;
                    foreach ($socialHosts as $sh) { if (strpos($h, $sh) !== false) { $cSocial++; break; } }
                }

                $you = count($extHosts); $them = count($cExt);
                $checks[] = ['status'=>'ok', 'text'=>'Signal comparison (not full backlink index)'];
                $checks[] = ['status'=>($you >= $them ? 'good' : 'ok'), 'text'=>"Your external domains linked: $you"];
                $checks[] = ['status'=>'ok', 'text'=>"Competitor external domains linked: $them"];
                $checks[] = ['status'=>'ok', 'text'=>"Your social links: $countSocial | Competitor: $cSocial"];

                $score = 50;
                if ($you >= $them) $score += 20; else { $score += 10; $recs[] = 'Competitor links to more external domains — study their partners.'; }
                if ($countSocial >= $cSocial) $score += 15; else $recs[] = 'Strengthen social profile visibility.';
                $score = min(100, $score + 10);
                $extra = ['you_ext'=>$you, 'them_ext'=>$them, 'you_social'=>$countSocial, 'them_social'=>$cSocial, 'competitor'=>$cf['url']];
                $recs[] = 'Use free backlink tools to compare real referring domains.';
                break;

            case 'referring-domains-checker':
                $checks[] = ['status'=>'ok', 'text'=>'True referring domains need a backlink index. Showing outbound domain diversity on your page.'];
                $n = count($extHosts);
                if ($n >= 8) { $checks[] = ['status'=>'good', 'text'=>"$n unique external domains referenced"]; $score = 80; }
                elseif ($n >= 3) { $checks[] = ['status'=>'ok', 'text'=>"$n unique external domains"]; $score = 60; }
                else { $checks[] = ['status'=>'ok', 'text'=>"$n external domains"]; $score = 40; $recs[] = 'Earn links from more unique domains.'; }

                $list = array_slice(array_keys($extHosts), 0, 12);
                $extra = ['domains'=>$list, 'count'=>$n];
                $checks[] = ['status'=>'good', 'text'=>'Sample domains listed in details'];
                $recs[] = 'Track referring domains monthly with Moz/Ahrefs free tiers.';
                break;

            case 'anchor-text-analyzer':
                $totalA = array_sum($anchors);
                if ($totalA === 0) {
                    $checks[] = ['status'=>'ok', 'text'=>'No visible anchor texts found'];
                    $score = 40;
                    $recs[] = 'Add descriptive internal/external anchors.';
                } else {
                    $generic = 0;
                    foreach (['click here','read more','here','learn more','this link'] as $g) {
                        if (isset($anchors[$g])) $generic += $anchors[$g];
                    }
                    $checks[] = ['status'=>'good', 'text'=>"Unique anchor phrases: " . count($anchors)];
                    $score += 30;
                    if ($generic / max(1, $totalA) > 0.3) {
                        $checks[] = ['status'=>'ok', 'text'=>"Many generic anchors ($generic)"];
                        $score += 15;
                        $recs[] = 'Replace “click here” with descriptive anchors.';
                    } else {
                        $checks[] = ['status'=>'good', 'text'=>'Mostly descriptive anchors'];
                        $score += 35;
                    }
                    $top = array_slice($anchors, 0, 12, true);
                    $extra = ['top'=>$top, 'total'=>$totalA];
                    $score = min(100, $score + 20);
                }
                break;

            case 'website-speed-checker':
                $t0 = microtime(true);
                try {
                    $res = Http::timeout(20)->withHeaders(['User-Agent'=>'AllInOneSEO-Speed/1.9'])->withoutVerifying()->get($finalUrl);
                    $ttfb = round((microtime(true) - $t0) * 1000);
                    $size = strlen($res->body());
                } catch (\Exception $e) {
                    $ttfb = 650;
                    $size = strlen($html);
                }
                $kb = round($size / 1024, 1);
                $scripts = $xpath->query('//script')->length;
                $css = $xpath->query('//link[@rel="stylesheet"]')->length;
                $imgs = $xpath->query('//img')->length;

                if ($ttfb < 800) { $checks[] = ['status'=>'good', 'text'=>"TTFB ~{$ttfb} ms"]; $score += 30; }
                elseif ($ttfb < 1500) { $checks[] = ['status'=>'ok', 'text'=>"TTFB ~{$ttfb} ms"]; $score += 18; $recs[] = 'Improve server response / caching.'; }
                else { $checks[] = ['status'=>'bad', 'text'=>"Slow TTFB ~{$ttfb} ms"]; $score += 5; $recs[] = 'Use caching/CDN; optimize server.'; }

                if ($kb < 500) { $checks[] = ['status'=>'good', 'text'=>"HTML ~{$kb} KB"]; $score += 25; }
                elseif ($kb < 1500) { $checks[] = ['status'=>'ok', 'text'=>"HTML ~{$kb} KB"]; $score += 12; }
                else { $checks[] = ['status'=>'ok', 'text'=>"Large HTML ~{$kb} KB"]; $score += 5; $recs[] = 'Reduce HTML weight.'; }

                $checks[] = ['status'=>'ok', 'text'=>"Scripts: $scripts | Stylesheets: $css | Images: $imgs"];
                if ($scripts > 25) { $score += 5; $recs[] = 'Reduce JS requests.'; } else { $score += 15; }
                if ($imgs > 30) { $recs[] = 'Lazy-load and compress images.'; $score += 5; } else { $score += 15; }
                $score = min(100, $score);
                $extra = ['ttfb_ms'=>$ttfb, 'html_kb'=>$kb, 'scripts'=>$scripts, 'css'=>$css, 'images'=>$imgs];
                $recs[] = 'For LCP/CLS use PageSpeed Insights (free).';
                break;

            case 'tech-broken-link-checker':
                $toCheck = [];
                foreach ($links as $a) {
                    $href = trim($a->getAttribute('href'));
                    if ($href === '' || $href[0] === '#' || stripos($href, 'mailto:') === 0 || stripos($href, 'tel:') === 0 || stripos($href, 'javascript:') === 0) continue;
                    if (strpos($href, '//') === 0) $href = 'https:' . $href;
                    if (!preg_match('~^https?://~i', $href)) {
                        if ($href[0] === '/') $href = (parse_url($finalUrl, PHP_URL_SCHEME) ?: 'https') . '://' . $host . $href;
                        else $href = rtrim($finalUrl, '/') . '/' . ltrim($href, '/');
                    }
                    $toCheck[$href] = true;
                    if (count($toCheck) >= 15) break;
                }
                $ok = 0; $bad = 0; $samples = [];
                foreach (array_keys($toCheck) as $href) {
                    try {
                        $r = Http::timeout(6)->withoutVerifying()->head($href);
                        $c = $r->status();
                        if ($c >= 200 && $c < 400) $ok++;
                        else { $bad++; $samples[] = ['url'=>$href, 'status'=>$c]; }
                    } catch (\Exception $e) {
                        $bad++; $samples[] = ['url'=>$href, 'status'=>'error'];
                    }
                }
                $checks[] = ['status'=>'good', 'text'=>'Checked ' . ($ok + $bad) . ' links (max 15)'];
                if ($bad === 0) { $checks[] = ['status'=>'good', 'text'=>'No broken links in sample']; $score = 95; }
                else { $checks[] = ['status'=>'ok', 'text'=>"$bad problem links"]; $score = max(20, 100 - $bad * 12); $recs[] = 'Fix broken links listed.'; }
                $extra = ['ok'=>$ok, 'bad'=>$bad, 'samples'=>$samples];
                break;

            case 'xml-sitemap-checker':
                $candidates = [
                    rtrim($finalUrl, '/') . '/sitemap.xml',
                    rtrim($finalUrl, '/') . '/sitemap_index.xml',
                    rtrim($finalUrl, '/') . '/wp-sitemap.xml',
                ];
                $baseHost = (parse_url($finalUrl, PHP_URL_SCHEME) ?: 'https') . '://' . $host;
                $candidates[] = $baseHost . '/sitemap.xml';
                $found = null; $body = '';

                foreach (array_unique($candidates) as $cand) {
                    try {
                        $r = Http::timeout(8)->withHeaders(['User-Agent'=>'AllInOneSEO-Checker/1.9'])->withoutVerifying()->get($cand);
                        if ($r->successful()) {
                            $b = $r->body();
                            if (stripos($b, '<urlset') !== false || stripos($b, '<sitemapindex') !== false || stripos($b, '<?xml') !== false) {
                                $found = $cand; $body = $b; break;
                            }
                        }
                    } catch (\Exception $e) {}
                }

                // robots sitemap hint
                $robotsBody = '';
                try {
                    $robots = Http::timeout(6)->withoutVerifying()->get($baseHost . '/robots.txt');
                    if ($robots->successful()) $robotsBody = $robots->body();
                } catch (\Exception $e) {}

                if (preg_match('/sitemap:\s*(\S+)/i', $robotsBody, $m)) {
                    $checks[] = ['status'=>'good', 'text'=>'Sitemap declared in robots.txt'];
                    $score += 20;
                    if (!$found) {
                        try {
                            $r = Http::timeout(8)->withoutVerifying()->get(trim($m[1]));
                            if ($r->successful()) { $found = trim($m[1]); $body = $r->body(); }
                        } catch (\Exception $e) {}
                    }
                }

                if ($found) {
                    $checks[] = ['status'=>'good', 'text'=>"Sitemap found: $found"];
                    $score += 50;
                    $urlCount = substr_count(strtolower($body), '<url>');
                    $smCount = substr_count(strtolower($body), '<sitemap>');
                    if ($urlCount) { $checks[] = ['status'=>'good', 'text'=>"URL entries: ~$urlCount"]; $score += 20; }
                    if ($smCount) { $checks[] = ['status'=>'good', 'text'=>"Sitemap index entries: ~$smCount"]; $score += 15; }
                } else {
                    $checks[] = ['status'=>'bad', 'text'=>'No XML sitemap found at common paths'];
                    $score = 25;
                    $recs[] = 'Generate XML sitemap and submit in Google Search Console.';
                }
                $score = min(100, $score);
                $extra = ['sitemap'=>$found];
                break;

            case 'robots-txt-tester':
                $robotsUrl = (parse_url($finalUrl, PHP_URL_SCHEME) ?: 'https') . '://' . $host . '/robots.txt';
                $body = '';
                try {
                    $r = Http::timeout(8)->withHeaders(['User-Agent'=>'AllInOneSEO-Checker/1.9'])->withoutVerifying()->get($robotsUrl);
                    if ($r->successful()) $body = $r->body();
                } catch (\Exception $e) {}

                if (empty($body)) {
                    $checks[] = ['status'=>'ok', 'text'=>'robots.txt not found or error'];
                    $score = 40;
                    $recs[] = 'Add a robots.txt at site root.';
                    $extra = ['body'=>''];
                } else {
                    $checks[] = ['status'=>'good', 'text'=>'robots.txt fetched'];
                    $score += 40;
                    if (stripos($body, 'user-agent') !== false) { $checks[] = ['status'=>'good', 'text'=>'User-agent rules present']; $score += 20; }
                    if (stripos($body, 'disallow:') !== false) { $checks[] = ['status'=>'ok', 'text'=>'Disallow rules present — review carefully']; $score += 15; }
                    if (stripos($body, 'sitemap:') !== false) { $checks[] = ['status'=>'good', 'text'=>'Sitemap referenced']; $score += 20; }
                    else { $checks[] = ['status'=>'ok', 'text'=>'No Sitemap: line']; $score += 5; $recs[] = 'Add Sitemap: URL in robots.txt.'; }
                    if (preg_match('/disallow:\s*\/\s*$/im', $body)) {
                        $checks[] = ['status'=>'bad', 'text'=>'Possible full site Disallow for a bot'];
                        $score = min($score, 45);
                        $recs[] = 'Ensure you are not blocking all crawlers.';
                    }
                    $extra = ['body'=>mb_substr($body, 0, 2000), 'url'=>$robotsUrl];
                    $score = min(100, $score);
                }
                break;

            case 'schema-markup-validator':
                $nodes = $xpath->query('//script[@type="application/ld+json"]');
                $types = []; $valid = 0; $invalid = 0;
                foreach ($nodes as $n) {
                    $json = trim($n->textContent);
                    $data = json_decode($json, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $valid++;
                        if (isset($data['@type'])) {
                            $t = is_array($data['@type']) ? implode(',', $data['@type']) : $data['@type'];
                            $types[] = $t;
                        } elseif (isset($data['@graph']) && is_array($data['@graph'])) {
                            foreach ($data['@graph'] as $g) {
                                if (isset($g['@type'])) $types[] = is_array($g['@type']) ? implode(',', $g['@type']) : $g['@type'];
                            }
                        }
                    } else { $invalid++; }
                }
                $micro = $xpath->query('//*[@itemtype]')->length;
                if ($valid > 0) { $checks[] = ['status'=>'good', 'text'=>"Valid JSON-LD blocks: $valid"]; $score += 50; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No valid JSON-LD']; $score += 10; $recs[] = 'Add JSON-LD schema (Organization, WebSite, Article…).'; }
                if ($invalid > 0) { $checks[] = ['status'=>'bad', 'text'=>"Invalid JSON-LD: $invalid"]; $score += 0; $recs[] = 'Fix JSON syntax errors in schema.'; }
                if ($micro) { $checks[] = ['status'=>'ok', 'text'=>"Microdata itemtype nodes: $micro"]; $score += 15; }
                if ($types) { $checks[] = ['status'=>'good', 'text'=>'Types: ' . implode(', ', array_unique($types))]; $score += 20; }
                $score = min(100, max(15, $score + 10));
                $extra = ['types'=>array_values(array_unique($types)), 'valid'=>$valid, 'invalid'=>$invalid];
                $recs[] = 'Validate with Google Rich Results Test (free).';
                break;

            case 'local-rank-checker':
                $cityL = mb_strtolower($city);
                $localWords = ['near me','local','city','address','map','direction','hours','open now'];
                $hit = 0;
                foreach ($localWords as $w) { if (stripos($bodyText, $w) !== false) $hit++; }

                if ($cityL && stripos($bodyText, $cityL) !== false) {
                    $checks[] = ['status'=>'good', 'text'=>"City/area “$city” found on page"]; $score += 30;
                } elseif ($cityL) {
                    $checks[] = ['status'=>'ok', 'text'=>"City “$city” not found in visible text"]; $score += 10; $recs[] = "Mention $city in title, H1, content.";
                } else {
                    $checks[] = ['status'=>'ok', 'text'=>'No city entered — checking general local signals']; $score += 15;
                }

                if ($hit >= 3) { $checks[] = ['status'=>'good', 'text'=>"Local intent phrases: $hit"]; $score += 25; }
                elseif ($hit > 0) { $checks[] = ['status'=>'ok', 'text'=>"Some local phrases: $hit"]; $score += 12; }
                else { $checks[] = ['status'=>'ok', 'text'=>'Few local intent phrases']; $score += 5; $recs[] = 'Add local keywords naturally.'; }

                $title = ''; $tn = $xpath->query('//title'); if ($tn->length) $title = trim($tn->item(0)->textContent);
                if ($cityL && stripos($title, $cityL) !== false) { $checks[] = ['status'=>'good', 'text'=>'City in title']; $score += 20; }
                $score = min(100, $score + 15);
                $extra = ['city'=>$city, 'local_phrases'=>$hit];
                $recs[] = 'True local rank needs GSC/rank trackers; this checks on-page local readiness.';
                break;

            case 'google-business-profile-checker':
                $maps = $xpath->query('//a[contains(@href,"google.com/maps") or contains(@href,"maps.google") or contains(@href,"goo.gl/maps") or contains(@href,"g.page")]')->length;
                $iframe = $xpath->query('//iframe[contains(@src,"google.com/maps") or contains(@src,"maps.google")]')->length;
                $tel = $xpath->query('//a[starts-with(@href,"tel:")]')->length;
                $schemaLocal = false;
                foreach ($xpath->query('//script[@type="application/ld+json"]') as $n) {
                    if (stripos($n->textContent, 'LocalBusiness') !== false || stripos($n->textContent, 'Restaurant') !== false || stripos($n->textContent, 'ProfessionalService') !== false) $schemaLocal = true;
                }

                if ($maps || $iframe) { $checks[] = ['status'=>'good', 'text'=>'Google Maps / GBP link or embed found']; $score += 35; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No Maps/GBP link detected']; $score += 10; $recs[] = 'Add Google Business Profile / Maps link.'; }

                if ($tel) { $checks[] = ['status'=>'good', 'text'=>'Click-to-call tel: link present']; $score += 25; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No tel: link']; $score += 8; $recs[] = 'Add click-to-call phone.'; }

                if ($schemaLocal) { $checks[] = ['status'=>'good', 'text'=>'LocalBusiness-related schema']; $score += 25; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No LocalBusiness schema']; $score += 8; $recs[] = 'Add LocalBusiness JSON-LD.'; }

                $score = min(100, $score + 10);
                $extra = ['maps'=>$maps, 'iframe'=>$iframe, 'tel'=>$tel, 'local_schema'=>$schemaLocal];
                break;

            case 'local-citation-checker':
                $phone = ''; $addr = '';
                if (preg_match('/(\+?\d[\d\s\-()]{8,}\d)/', $bodyText, $m)) $phone = trim($m[1]);
                if (preg_match('/\d{1,5}\s+[\w\s\.]+(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr)\b[^.]{0,40}/i', $bodyText, $m)) $addr = trim($m[0]);

                if ($phone) { $checks[] = ['status'=>'good', 'text'=>"Phone-like pattern: $phone"]; $score += 30; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No clear phone pattern']; $score += 10; $recs[] = 'Show consistent phone sitewide.'; }

                if ($addr) { $checks[] = ['status'=>'good', 'text'=>'Address-like text found']; $score += 30; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No clear street address pattern']; $score += 10; $recs[] = 'Publish full NAP on contact page.'; }

                $footerPhone = $xpath->query('//footer//a[starts-with(@href,"tel:")]')->length;
                if ($footerPhone) { $checks[] = ['status'=>'good', 'text'=>'Phone in footer area']; $score += 20; }
                $checks[] = ['status'=>'ok', 'text'=>'Citations = consistent NAP on directories (Google, Bing, Facebook, etc.)'];
                $score = min(100, $score + 10);
                $extra = ['phone'=>$phone, 'address'=>$addr];
                $recs[] = 'Audit NAP on major directories for exact match.';
                break;

            case 'nap-consistency-checker':
                $phones = [];
                if (preg_match_all('/(\+?\d[\d\s\-()]{8,}\d)/', $bodyText, $mm)) {
                    foreach ($mm[1] as $p) $phones[preg_replace('/\D+/', '', $p)] = trim($p);
                }
                $tels = [];
                foreach ($xpath->query('//a[starts-with(@href,"tel:")]') as $a) {
                    $tels[] = $a->getAttribute('href');
                }
                $nPhones = count($phones);
                if ($nPhones === 1) { $checks[] = ['status'=>'good', 'text'=>'One primary phone pattern']; $score += 40; }
                elseif ($nPhones > 1) { $checks[] = ['status'=>'ok', 'text'=>"$nPhones different phone digit patterns"]; $score += 20; $recs[] = 'Use one consistent phone format.'; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No phone found']; $score += 10; $recs[] = 'Add business phone.'; }

                if (count($tels)) { $checks[] = ['status'=>'good', 'text'=>'tel: links: ' . count($tels)]; $score += 25; }

                $name = ''; $tn = $xpath->query('//title'); if ($tn->length) $name = trim($tn->item(0)->textContent);
                if ($name) { $checks[] = ['status'=>'good', 'text'=>'Business/name signal via title']; $score += 20; }

                $score = min(100, $score + 10);
                $extra = ['phones'=>array_values($phones), 'tel_links'=>$tels];
                $recs[] = 'Match Name, Address, Phone exactly with GBP.';
                break;

            case 'local-seo-audit-tool':
                $score = 0;
                $maps = $xpath->query('//a[contains(@href,"google.com/maps") or contains(@href,"maps.google") or contains(@href,"g.page")]')->length
                    + $xpath->query('//iframe[contains(@src,"google.com/maps")]')->length;
                $tel = $xpath->query('//a[starts-with(@href,"tel:")]')->length;
                $schemaLocal = false;
                foreach ($xpath->query('//script[@type="application/ld+json"]') as $n) {
                    if (stripos($n->textContent, 'LocalBusiness') !== false) $schemaLocal = true;
                }
                $hasPhone = (bool) preg_match('/(\+?\d[\d\s\-()]{8,}\d)/', $bodyText);
                $cityOk = ($city && stripos($bodyText, $city) !== false);

                if ($maps) { $checks[] = ['status'=>'good', 'text'=>'Maps/GBP signal']; $score += 20; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No Maps/GBP']; $recs[] = 'Link Google Business Profile.'; }

                if ($tel || $hasPhone) { $checks[] = ['status'=>'good', 'text'=>'Phone visible']; $score += 20; }
                else { $checks[] = ['status'=>'ok', 'text'=>'Phone missing']; $recs[] = 'Add NAP phone.'; }

                if ($schemaLocal) { $checks[] = ['status'=>'good', 'text'=>'LocalBusiness schema']; $score += 20; }
                else { $checks[] = ['status'=>'ok', 'text'=>'No LocalBusiness schema']; $recs[] = 'Add LocalBusiness JSON-LD.'; }

                if ($cityOk) { $checks[] = ['status'=>'good', 'text'=>'City mentioned']; $score += 20; }
                elseif ($city) { $checks[] = ['status'=>'ok', 'text'=>'City not in content']; $recs[] = "Include $city in content."; }
                else { $checks[] = ['status'=>'ok', 'text'=>'Enter city for deeper local keyword check']; $score += 10; }

                $https = strpos($finalUrl, 'https://') === 0;
                if ($https) { $checks[] = ['status'=>'good', 'text'=>'HTTPS']; $score += 15; }
                else { $checks[] = ['status'=>'bad', 'text'=>'No HTTPS']; }

                $score = min(100, $score + 5);
                $extra = ['city'=>$city];
                $recs[] = 'Complete GBP, collect reviews, build local citations.';
                break;
        }

        if (empty($recs)) $recs[] = 'Looking solid for this tool. Re-check after changes.';
        $score = min(100, max(0, (int) $score));
        $statusCounts = $this->countStatuses($checks);

        return [
            'success' => true,
            'tool' => $tool,
            'score' => $score,
            'final_url' => $finalUrl,
            'checks' => $checks,
            'recommendations' => $recs,
            'extra' => $extra,
            'status_counts' => $statusCounts,
        ];
    }
}
