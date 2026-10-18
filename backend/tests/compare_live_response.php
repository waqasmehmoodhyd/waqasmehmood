<?php

// 1. Get nonce from live site
$html = file_get_contents('https://waqasmehmood.com/on-page-seo/website-seo-checker/');
preg_match('/aioTool\s*=\s*\{[^}]*"nonce"\s*:\s*"([a-zA-Z0-9]+)"/i', $html, $m);
$nonce = $m[1] ?? '';

echo "Live Nonce: $nonce\n";

if ($nonce) {
    $ch = curl_init('https://waqasmehmood.com/wp-admin/admin-ajax.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'action' => 'aio_onpage_tool_run',
        'nonce' => $nonce,
        'tool' => 'website-seo-checker',
        'url' => 'https://example.com',
        'keyword' => ''
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    echo "--- Live waqasmehmood.com Result for https://example.com ---\n";
    echo $response . "\n\n";
} else {
    echo "Could not fetch nonce\n";
}
