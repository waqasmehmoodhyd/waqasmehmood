<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Handle incoming contact form submissions
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'service' => 'nullable|string|max:100',
            'budget' => 'nullable|string|max:100',
            'message' => 'required|string|max:5000',
        ]);

        $inquiry = ContactInquiry::create($validated);

        Log::info("New Client Inquiry Received from {$inquiry->name} ({$inquiry->email}): Service: {$inquiry->service}");

        return response()->json([
            'success' => true,
            'message' => 'Shukriya! Your message has been received. Waqas Mehmood will reach out to you via Email/WhatsApp within 12 hours.',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }
}
