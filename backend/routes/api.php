<?php

use App\Http\Controllers\Api\SeoToolController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 1. Portfolio Endpoints (Public read, Admin protected write/delete)
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::post('/portfolio', [PortfolioController::class, 'store']);
Route::delete('/portfolio/{id}', [PortfolioController::class, 'destroy']);

// 2. Admin Auth / Session Verification
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::get('/admin/verify', [AdminAuthController::class, 'verify']);

// 3. Contact Form Submission
Route::post('/contact', [ContactController::class, 'store']);

// 4. No-API SEO 4-Pillar & Subtools Endpoints (from waqasmehmood.com)
Route::prefix('tools')->group(function () {
    Route::post('/run-subtool', [SeoToolController::class, 'runSubtool']);
    Route::post('/on-page-audit', [SeoToolController::class, 'analyzeOnPage']);
    Route::post('/off-page-audit', [SeoToolController::class, 'analyzeOffPage']);
    Route::post('/technical-audit', [SeoToolController::class, 'analyzeTechnical']);
    Route::post('/local-audit', [SeoToolController::class, 'analyzeLocal']);
});
