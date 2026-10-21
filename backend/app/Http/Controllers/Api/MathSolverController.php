<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Math\MathSolverService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MathSolverController extends Controller
{
    protected MathSolverService $solverService;

    public function __construct(MathSolverService $solverService)
    {
        $this->solverService = $solverService;
    }

    /**
     * Solve a math problem from photo or text formula
     */
    public function solve(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'problem' => 'nullable|string|max:10000',
            'image' => 'nullable|string', // base64 data URI
            'api_key' => 'nullable|string|max:200',
            'mode' => 'nullable|string|in:solve,explain,follow_up',
            'follow_up' => 'nullable|string|max:2000',
            'history' => 'nullable|array'
        ]);

        if (empty($validated['problem']) && empty($validated['image']) && empty($validated['follow_up'])) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a math formula, problem description, or upload a photo.'
            ], 422);
        }

        try {
            $result = $this->solverService->solve($validated);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while solving: ' . $e->getMessage()
            ], 500);
        }
    }
}
