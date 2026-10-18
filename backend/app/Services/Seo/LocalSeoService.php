<?php

namespace App\Services\Seo;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class LocalSeoService
{
    /**
     * Analyze a given URL for local SEO signals matching functions.php aio_local_analyze.
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

        $body_text = '';
        $body = $xpath->query('//body');
        if ($body->length) {
            $body_text = $body->item(0)->textContent;
        }

        // Google Business Profile signals (on-page)
        $has_gbp_link = (stripos($html, 'business.google.com') !== false || stripos($html, 'maps.google') !== false || stripos($html, 'g.page/') !== false || stripos($html, 'search.google.com/local') !== false);
        $d['gbp_link'] = $has_gbp_link;
        if ($has_gbp_link) {
            $checks[] = ['status' => 'good', 'cat' => 'Google Business Profile', 'text' => 'Google Maps / GBP-related link detected on page.'];
            $score += 10;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Google Business Profile', 'text' => 'No direct GBP/Maps link found on page.'];
            $score += 3;
            $recs[] = 'Claim & optimize Google Business Profile; link to it from the site.';
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Google Business Profile', 'text' => 'Full GBP optimization (categories, photos, posts, Q&A) must be done inside Google Business Profile dashboard.'];
        $recs[] = 'Complete GBP: categories, services, hours, photos, regular posts, respond to all reviews.';

        // NAP Consistency signals
        $has_phone = (bool) preg_match('/(\+?\d[\d\-\.\s\(\)]{8,}\d)/', $body_text);
        $has_address = (bool) preg_match('/\b(street|st\.|avenue|ave\.|road|rd\.|suite|floor|boulevard|blvd|drive|dr\.|lane|ln\.|city|zip|postal)\b/i', $body_text);
        $has_tel = false;
        $links = $xpath->query('//a[@href]');
        foreach ($links as $a) {
            $href = $a->getAttribute('href');
            if (strpos($href, 'tel:') === 0) {
                $has_tel = true;
            }
        }
        $d['has_phone'] = $has_phone;
        $d['has_address'] = $has_address;
        $d['has_tel'] = $has_tel;

        if ($has_phone && $has_address) {
            $checks[] = ['status' => 'good', 'cat' => 'NAP Consistency', 'text' => 'Phone + address-related text found on page.'];
            $score += 12;
        } elseif ($has_phone || $has_address) {
            $checks[] = ['status' => 'ok', 'cat' => 'NAP Consistency', 'text' => 'Partial NAP signals (phone or address).'];
            $score += 6;
            $recs[] = 'Show full Name, Address, Phone clearly in footer and contact page.';
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'NAP Consistency', 'text' => 'No clear NAP (Name/Address/Phone) on page.'];
            $score += 1;
            $recs[] = 'Display consistent NAP sitewide and match GBP exactly.';
        }

        if ($has_tel) {
            $checks[] = ['status' => 'good', 'cat' => 'NAP Consistency', 'text' => 'Click-to-call (tel:) link present.'];
            $score += 6;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'NAP Consistency', 'text' => 'No tel: click-to-call link.'];
            $score += 2;
            $recs[] = 'Add tel: links for mobile users.';
        }
        $checks[] = ['status' => 'ok', 'cat' => 'NAP Consistency', 'text' => 'NAP must be identical on GBP, website, and all citations (directories).'];

        // Local Keywords
        $local_words = ['near me', 'local', 'city', 'downtown', 'area', 'location', 'serving', 'hours', 'directions', 'visit us', 'our store', 'our office'];
        $local_hits = 0;
        $lower = mb_strtolower($body_text);
        foreach ($local_words as $lw) {
            if (strpos($lower, $lw) !== false) {
                $local_hits++;
            }
        }
        $d['local_keyword_hits'] = $local_hits;
        if ($local_hits >= 3) {
            $checks[] = ['status' => 'good', 'cat' => 'Local Keywords', 'text' => "Local intent language detected ($local_hits signals)."];
            $score += 10;
        } elseif ($local_hits >= 1) {
            $checks[] = ['status' => 'ok', 'cat' => 'Local Keywords', 'text' => 'Some local keyword signals.'];
            $score += 5;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Local Keywords', 'text' => 'Few local keyword phrases found.'];
            $score += 2;
            $recs[] = 'Use city + service keywords naturally in titles, H1 and content.';
        }

        // Local Citations
        $citation_domains = ['yelp.com', 'yellowpages', 'foursquare', 'bbb.org', 'tripadvisor', 'hotfrog', 'manta.com', 'angi.com', 'thumbtack', 'facebook.com/pages'];
        $citation_found = [];
        foreach ($links as $a) {
            $href = strtolower($a->getAttribute('href'));
            foreach ($citation_domains as $cd) {
                if (strpos($href, $cd) !== false) {
                    $citation_found[$cd] = true;
                }
            }
        }
        $d['citations_on_page'] = array_keys($citation_found);
        if (count($citation_found) >= 2) {
            $checks[] = ['status' => 'good', 'cat' => 'Local Citations', 'text' => 'Citation/directory links on page: ' . implode(', ', array_keys($citation_found))];
            $score += 8;
        } elseif (count($citation_found) == 1) {
            $checks[] = ['status' => 'ok', 'cat' => 'Local Citations', 'text' => 'One citation-style link found.'];
            $score += 4;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Local Citations', 'text' => 'No major citation directory links on page.'];
            $score += 2;
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Local Citations', 'text' => 'Build consistent citations on Google, Bing Places, Apple Maps, Yelp and niche directories.'];
        $recs[] = 'Audit NAP consistency across all citation sources.';

        // Reviews & Ratings
        $has_review_schema = false;
        $has_review_text = (bool) preg_match('/\b(review|rating|stars|testimonial)\b/i', $body_text);
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $s) {
            $t = $s->textContent;
            if (stripos($t, 'Review') !== false || stripos($t, 'AggregateRating') !== false) {
                $has_review_schema = true;
            }
        }
        $d['review_schema'] = $has_review_schema;
        $d['review_text'] = $has_review_text;
        if ($has_review_schema) {
            $checks[] = ['status' => 'good', 'cat' => 'Reviews & Ratings', 'text' => 'Review / AggregateRating schema found.'];
            $score += 10;
        } elseif ($has_review_text) {
            $checks[] = ['status' => 'ok', 'cat' => 'Reviews & Ratings', 'text' => 'Review-related text on page (no schema).'];
            $score += 5;
            $recs[] = 'Add Review/AggregateRating schema if you show ratings.';
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Reviews & Ratings', 'text' => 'No review schema or strong review content detected.'];
            $score += 2;
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Reviews & Ratings', 'text' => 'Google review count & star rating must be managed inside GBP.'];
        $recs[] = 'Actively generate Google reviews and reply to every review.';

        // Local Backlinks
        $checks[] = ['status' => 'ok', 'cat' => 'Local Backlinks', 'text' => 'Local backlinks (chamber, local news, sponsors) require a backlink tool to measure.'];
        $recs[] = 'Earn links from local newspapers, chambers of commerce and community sites.';

        // Map Pack Rankings
        $has_maps = (stripos($html, 'maps.google') !== false || stripos($html, 'google.com/maps') !== false || stripos($html, 'maps.googleapis') !== false || stripos($html, 'openstreetmap') !== false);
        $d['has_maps'] = $has_maps;
        if ($has_maps) {
            $checks[] = ['status' => 'good', 'cat' => 'Map Pack Rankings', 'text' => 'Map embed or Maps link detected on site.'];
            $score += 10;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Map Pack Rankings', 'text' => 'No map embed detected.'];
            $score += 3;
            $recs[] = 'Embed Google Map on contact/location pages.';
        }
        $checks[] = ['status' => 'ok', 'cat' => 'Map Pack Rankings', 'text' => 'Map Pack rankings depend on GBP prominence, reviews, categories, proximity and on-page local SEO.'];
        $recs[] = 'Track local pack rankings for main city + service keywords.';

        // LocalBusiness schema
        $has_local_schema = false;
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $s) {
            $t = $s->textContent;
            if (stripos($t, 'LocalBusiness') !== false || stripos($t, 'Store') !== false || stripos($t, 'Restaurant') !== false || stripos($t, 'ProfessionalService') !== false) {
                $has_local_schema = true;
            }
        }
        $d['has_local_schema'] = $has_local_schema;
        if ($has_local_schema) {
            $checks[] = ['status' => 'good', 'cat' => 'Local Schema', 'text' => 'LocalBusiness (or similar) schema found.'];
            $score += 12;
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Local Schema', 'text' => 'No LocalBusiness schema detected.'];
            $recs[] = 'Add LocalBusiness JSON-LD with NAP and geo coordinates.';
        }

        // Contact / Location page
        $has_contact = false;
        foreach ($links as $a) {
            $t = strtolower($a->textContent . ' ' . $a->getAttribute('href'));
            if (strpos($t, 'contact') !== false || strpos($t, 'location') !== false || strpos($t, 'find-us') !== false) {
                $has_contact = true;
            }
        }
        if ($has_contact) {
            $checks[] = ['status' => 'good', 'cat' => 'Local Pages', 'text' => 'Contact/Location page link found.'];
            $score += 6;
        } else {
            $checks[] = ['status' => 'ok', 'cat' => 'Local Pages', 'text' => 'No clear Contact/Location link.'];
            $score += 2;
            $recs[] = 'Create dedicated location or contact pages with unique content.';
        }

        // HTTPS + Mobile
        if (strpos($url, 'https://') === 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Basics', 'text' => 'HTTPS enabled.'];
            $score += 4;
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Basics', 'text' => 'Not on HTTPS.'];
            $recs[] = 'Enable HTTPS.';
        }
        $viewport = $xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="viewport"]');
        if ($viewport->length > 0) {
            $checks[] = ['status' => 'good', 'cat' => 'Basics', 'text' => 'Mobile viewport present.'];
            $score += 4;
        } else {
            $checks[] = ['status' => 'bad', 'cat' => 'Basics', 'text' => 'Missing mobile viewport.'];
            $recs[] = 'Make site fully mobile-friendly.';
        }

        if (empty($recs)) {
            $recs[] = 'Local on-page signals look decent. Fully optimize GBP and citations next.';
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
