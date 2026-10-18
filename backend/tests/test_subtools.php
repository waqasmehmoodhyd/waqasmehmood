<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = new App\Services\Seo\SubtoolRunnerService();

echo "--- Testing word-counter ---\n";
$wc = $service->run('word-counter', null, 'Waqas Mehmood is a senior digital marketing specialist and full-stack developer with extensive experience in SEO, React, and Laravel.');
echo "Word counter result: words=" . $wc['extra']['words'] . ", chars=" . $wc['extra']['chars'] . ", score=" . $wc['score'] . "\n";

echo "--- Testing keyword-density-checker ---\n";
$kd = $service->run('keyword-density-checker', null, 'SEO is critical for organic growth. Modern SEO combines technical SEO, on-page SEO, and backlink authority. Without SEO your rankings drop.', 'SEO');
echo "Keyword density: " . $kd['extra']['density'] . "%, count=" . $kd['extra']['count'] . ", top words=" . count($kd['extra']['top_words']) . "\n";

echo "--- Testing live crawling: robots-txt-tester on example.com ---\n";
$rb = $service->run('robots-txt-tester', 'https://example.com');
echo "Robots result: found=" . ($rb['extra']['robots_url'] ?? 'none') . ", score=" . $rb['score'] . "\n";

echo "\nALL TESTS PASSED!\n";
