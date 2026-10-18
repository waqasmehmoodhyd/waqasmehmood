<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    /**
     * Admin login to manage portfolio
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $adminSecret = env('ADMIN_SECRET_KEY', 'waqas2026');

        if ($request->password === $adminSecret) {
            return response()->json([
                'success' => true,
                'message' => 'Admin access granted. Welcome, Waqas Mehmood!',
                'admin_key' => $adminSecret,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid admin secret key or password.'
        ], 401);
    }

    /**
     * Verify current admin key
     */
    public function verify(Request $request): JsonResponse
    {
        $adminSecret = env('ADMIN_SECRET_KEY', 'waqas2026');
        $key = $request->header('X-Admin-Key') ?? $request->input('admin_key');

        if ($key === $adminSecret) {
            return response()->json([
                'success' => true,
                'is_admin' => true,
                'message' => 'Active Admin Session: Waqas Mehmood'
            ]);
        }

        return response()->json([
            'success' => false,
            'is_admin' => false,
            'message' => 'Not authenticated as admin.'
        ], 401);
    }
}
