<?php

namespace App\Services\Seo;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class OffPageSeoService
{
    /**
     * Analyze a given URL for off-page SEO signals matching functions.php aio_offpage_analyze.
     */
    public function analyze(string $url): array
    {
        $url = trim($url);
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        $host = parse_url($url, PHP_URL_HOST);
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

            if ($response->failed()) {
                return ['success' => false, 'message' => 'HTTP ' . $response->status()];
            }

            $html = $response->body();
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

        // Trust / HTTPS
        if (strpos($url, 'https://') === 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Trust', 'text' => 'HTTPS enabled (basic trust signal for link earning).'];
            $score += 6;
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Trust', 'text' => 'No HTTPS – hurts trust and link acquisition.'];
            $recs[] = 'Move to HTTPS.';
        }

        // Social / brand presence (link building readiness)
        $social_map = [
            'facebook.com' => 'Facebook',
            'twitter.com' => 'Twitter',
            'x.com' => 'X',
            'linkedin.com' => 'LinkedIn',
            'instagram.com' => 'Instagram',
            'youtube.com' => 'YouTube',
            'pinterest.com' => 'Pinterest'
        ];
        $found_social = [];
        $links = $xpath->query('//a[@href]');
        $nofollow_count = 0;
        $dofollow_est = 0;
        $ext = 0;
        $anchors = [];

        foreach ($links as $a) {
            $href = strtolower($a->getAttribute('href'));
            $rel = strtolower($a->getAttribute('rel'));
            $atext = trim($a->textContent);
            if ($atext && count($anchors) < 10) {
                $anchors[] = $atext;
            }
            foreach ($social_map as $sdom => $name) {
                if (strpos($href, $sdom) !== false) {
                    $found_social[$name] = true;
                }
            }
            if (preg_match('~^https?://~i', $href) && strpos($href, $host) === false) {
                $ext++;
                if (strpos($rel, 'nofollow') !== false || strpos($rel, 'sponsored') !== false || strpos($rel, 'ugc') !== false) {
                    $nofollow_count++;
                } else {
                    $dofollow_est++;
                }
            }
        }

        $social_count = count($found_social);
        $d['social_count'] = $social_count;
        $d['social_list'] = array_keys($found_social);
        $d['ext_links'] = $ext;
        $d['nofollow_out'] = $nofollow_count;
        $d['dofollow_out'] = $dofollow_est;

        if ($social_count >= 3) {
            $checks[] = ['status' => 'good', 'cat' => 'Brand Presence', 'text' => 'Social profiles linked: ' . implode(', ', array_keys($found_social))];
            $score += 8;
        } elseif ($social_count >= 1) {
            $checks[] = ['status' => 'ok', 'cat' => 'Brand Presence', 'text' => 'Some social links: ' . implode(', ', array_keys($found_social))];
            $score += 4;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Brand Presence', 'text' => 'No clear social profile links on page.'];
            $score += 2;
            $recs[] = 'Link to active social profiles for brand signals.';
        }

        // DoFollow / NoFollow outbound awareness
        if ($ext > 0) {
            $checks[] = ['status' => 'ok', 'cat' => 'DoFollow/NoFollow', 'text' => "Outbound links: ~$dofollow_est dofollow-style, $nofollow_count nofollow/sponsored/ugc (on this page only)."];
            $score += 4;
            $checks[] = ['status' => 'ok', 'cat' => 'Backlinks', 'text' => 'Inbound backlinks, toxic links and competitor backlinks require Ahrefs/Moz/SEMrush – not available via public page fetch.'];
            $recs[] = 'Use Google Search Console + free Ahrefs Webmaster Tools for real backlink data.';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'DoFollow/NoFollow', 'text' => 'Few/no outbound links detected on this page.'];
            $score += 2;
        }

        // Anchor text distribution
        $d['sample_anchors'] = $anchors;
        if (count($anchors) >= 3) {
            $checks[] = ['status' => 'good', 'cat' => 'Anchor Text', 'text' => 'Sample anchors on page: ' . implode(' | ', array_slice($anchors, 0, 5))];
            $score += 4;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Anchor Text', 'text' => 'Limited anchor text samples on page.'];
            $score += 2;
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Anchor Text Distribution', 'text' => 'Full backlink anchor distribution needs a backlink database (Ahrefs/Moz).'];

        // Link building readiness - About, Blog, Contact, assets
        $has_about = false;
        $has_contact = false;
        $has_blog = false;
        $has_resource = false;
        foreach ($links as $a) {
            $t = strtolower(trim($a->textContent) . ' ' . $a->getAttribute('href'));
            if (strpos($t, 'about') !== false) $has_about = true;
            if (strpos($t, 'contact') !== false) $has_contact = true;
            if (strpos($t, 'blog') !== false || strpos($t, 'news') !== false || strpos($t, 'article') !== false) $has_blog = true;
            if (strpos($t, 'resource') !== false || strpos($t, 'guide') !== false || strpos($t, 'tool') !== false) $has_resource = true;
        }
        $d['has_about'] = $has_about;
        $d['has_contact'] = $has_contact;
        $d['has_blog'] = $has_blog;

        if ($has_about) {
            $checks[] = ['status' => 'good', 'cat' => 'Link Building', 'text' => 'About page link found (E-E-A-T / outreach trust).'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Link Building', 'text' => 'No clear About page.'];
            $score += 2;
            $recs[] = 'Add a strong About page before outreach.';
        }

        if ($has_blog) {
            $checks[] = ['status' => 'good', 'cat' => 'Guest Posting', 'text' => 'Blog/News section detected – good for content & guest post targets.'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Guest Posting', 'text' => 'No blog section detected.'];
            $score += 2;
            $recs[] = 'Publish linkable content for guest posting & digital PR.';
        }

        if ($has_contact) {
            $checks[] = ['status' => 'good', 'cat' => 'Blogger Outreach', 'text' => 'Contact page present (helps outreach).'];
            $score += 4;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Blogger Outreach', 'text' => 'No clear Contact link.'];
            $score += 1;
        }

        if ($has_resource) {
            $checks[] = ['status' => 'good', 'cat' => 'Digital PR', 'text' => 'Resource/guide/tool links suggest linkable assets.'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Digital PR', 'text' => 'Create linkable assets (research, tools, guides) for digital PR.'];
            $score += 2;
            $recs[] = 'Build original data studies and free tools for digital PR.';
        }

        // Broken link building note
        $checks[] = ['status' => 'ok', 'cat' => 'Broken Link Building', 'text' => 'Broken link building requires crawling other sites – use Screaming Frog or online broken-link tools.'];

        // DA / PA
        $checks[] = ['status' => 'ok', 'cat' => 'Domain Authority (DA)', 'text' => 'Real Moz DA cannot be fetched free. Use Moz Link Explorer (limited free) or Ahrefs DR via Webmaster Tools.'];
        $recs[] = 'Check DA/PA on Moz Link Explorer; DR on Ahrefs Webmaster Tools (free for verified sites).';
        $checks[] = ['status' => 'ok', 'cat' => 'Page Authority (PA)', 'text' => 'Page Authority is a Moz metric – check on Moz for the specific URL.'];

        // Toxic / Competitor / GBOB
        $checks[] = ['status' => 'ok', 'cat' => 'Toxic Backlinks', 'text' => 'Toxic backlink detection needs a backlink index (Ahrefs, SEMrush, Google Disavow workflow).'];
        $recs[] = 'Monitor GSC for unnatural links; disavow only after careful analysis.';
        $checks[] = ['status' => 'ok', 'cat' => 'Competitor Backlink Analysis', 'text' => 'Competitor backlink gaps need Ahrefs/SEMrush/SimilarWeb-type tools.'];
        $recs[] = 'Analyze competitor referring domains and replicate quality opportunities.';
        $checks[] = ['status' => 'ok', 'cat' => 'GBOB', 'text' => 'Guest Blogging Outreach: target relevant sites, pitch value-first content, track placements.'];
        $recs[] = 'Build a prospect list of niche blogs accepting guests; personalize outreach.';

        // Content depth for linkability
        $body = $xpath->query('//body');
        $words = $body->length ? str_word_count(strip_tags($body->item(0)->textContent)) : 0;
        $d['words'] = $words;
        if ($words >= 800) {
            $checks[] = ['status' => 'good', 'cat' => 'Linkable Content', 'text' => "Substantial content (~$words words) – better for earning links."];
            $score += 6;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Linkable Content', 'text' => "Content ~$words words. Deeper content earns more links."];
            $score += 2;
            $recs[] = 'Publish in-depth guides and original research.';
        }

        // Schema org
        $schema_org = false;
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $s) {
            if (stripos($s->textContent, 'Organization') !== false) {
                $schema_org = true;
            }
        }
        $d['schema_org'] = $schema_org;
        if ($schema_org) {
            $checks[] = ['status' => 'good', 'cat' => 'Entity Signals', 'text' => 'Organization schema present.'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Entity Signals', 'text' => 'Add Organization schema for entity clarity.'];
            $score += 2;
        }

        if (empty($recs)) {
            $recs[] = 'Strengthen linkable assets and use GSC + free Ahrefs WT for backlink data.';
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
            'host' => $host,
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
