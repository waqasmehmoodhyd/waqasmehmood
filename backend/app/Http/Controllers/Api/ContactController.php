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

        // Attempt direct email delivery to Waqas's official inbox
        $to = 'waqasmehmoodhyd@gmail.com';
        $subject = "New Client Lead from {$inquiry->name} - {$inquiry->service}";
        $messageBody = "Assalam-o-Alaikum Waqas,\n\nYou have received a new client inquiry on waqasmehmood.com:\n\n"
            . "Client Name: {$inquiry->name}\n"
            . "Email: {$inquiry->email}\n"
            . "Phone / WhatsApp: " . ($inquiry->phone ?? 'Not provided') . "\n"
            . "Service Requested: " . ($inquiry->service ?? 'General Inquiry') . "\n"
            . "Budget Range: " . ($inquiry->budget ?? 'Not specified') . "\n\n"
            . "Project Details / Message:\n{$inquiry->message}\n\n"
            . "Submitted At: " . now()->toDateTimeString() . "\n"
            . "IP Address: " . $request->ip() . "\n\n"
            . "---\nDelivered automatically by waqasmehmood.com platform";

        $headers = "From: no-reply@waqasmehmood.com\r\n"
            . "Reply-To: {$inquiry->email}\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "X-Mailer: PHP/" . phpversion();

        @mail($to, $subject, $messageBody, $headers);

        return response()->json([
            'success' => true,
            'message' => 'Shukriya! Your message has been received. Waqas Mehmood will reach out to you via Email/WhatsApp within 12 hours.',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }

    /**
     * Get recent contact inquiries (Owner / Admin only)
     */
    public function index(): JsonResponse
    {
        $inquiries = ContactInquiry::latest()->take(50)->get();
        return response()->json([
            'success' => true,
            'count' => $inquiries->count(),
            'inquiries' => $inquiries,
        ]);
    }
}
