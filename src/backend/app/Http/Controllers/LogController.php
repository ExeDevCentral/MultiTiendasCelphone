<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    public function storeClientError(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'stack' => 'nullable|string',
            'component' => 'nullable|string',
            'url' => 'nullable|string',
            'user_agent' => 'nullable|string',
        ]);

        try {
            DB::table('client_error_logs')->insert([
                'user_id' => $request->user('sanctum')?->id,
                'message' => $validated['message'],
                'stack_trace' => $validated['stack'] ?? null,
                'component' => $validated['component'] ?? null,
                'url' => $validated['url'] ?? null,
                'user_agent' => $validated['user_agent'] ?? $request->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json(['status' => 'logged'], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
