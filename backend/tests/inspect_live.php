<?php

$url = 'https://waqasmehmood.com/on-page-seo/website-seo-checker/';
$context = stream_context_create([
    'http' => [
        'timeout' => 15,
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false
    ]
]);

$html = @file_get_contents($url, false, $context);

// Find script tags
preg_match_all('/<script[^>]*>(.*?)<\/script>/is', $html, $scripts);
foreach ($scripts[1] as $idx => $s) {
    if (strpos($s, 'aio-tool-btn') !== false || strpos($s, 'admin-ajax.php') !== false || strpos($s, 'aio_') !== false) {
        echo "=== SCRIPT $idx ===\n";
        echo substr($s, 0, 1500) . "\n...\n";
    }
}

// Also check external scripts
preg_match_all('/<script[^>]+src=[\'"]([^\'"]+)[\'"]/i', $html, $srcs);
echo "=== External Scripts ===\n";
print_r($srcs[1]);
