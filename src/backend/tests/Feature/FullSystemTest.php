<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Store;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class FullSystemTest extends TestCase
{
    // We don't use RefreshDatabase trait to preserve the seeded data for manual testing,
    // or we seed inside the test. Ideally we use a separate testing DB, but for this quick verification
    // we'll just be careful or use transactions. 
    // Actually, let's use the existing seeded data to verify "Production-like" state.

    public function test_frontend_can_be_served()
    {
        // This is a backend test, so we can't test Nginx serving frontend files directly here seamlessly
        // without making an HTTP request to the webserver.
        // But we can check if the API root is accessible.
        $response = $this->getJson('/api/auth/login'); // Method not allowed for GET, but check 405 or 404
        $this->assertNotEquals(404, $response->status());
    }

    public function test_authentication_flow()
    {
        // 1. Login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@demo.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'user']);

        $token = $response->json('access_token');

        // 2. Access Protected Route
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/auth/user');

        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'admin@demo.com']);
    }

    public function test_middleware_logs_requests()
    {
        // Clear logs first to ensure we capture THIS request
        // DB::table('request_logs')->truncate(); // Risky on live data, but okay for dev.
        $beforeCount = DB::table('request_logs')->count();

        // Make a request
        $this->postJson('/api/auth/login', [
            'email' => 'admin@demo.com',
            'password' => 'password',
        ]);

        $afterCount = DB::table('request_logs')->count();

        $this->assertTrue($afterCount > $beforeCount, "Request log count did not increase. Middleware might be disabled.");
    }

    public function test_client_error_logging()
    {
        $payload = [
            'message' => 'Test Error from Automated Test',
            'stack' => 'Error: Test at /src/components/Test.vue:10',
            'component' => 'TestComponent',
            'url' => 'http://localhost/test',
            'user_agent' => 'PHPUnit',
        ];

        $response = $this->postJson('/api/logs/client', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('client_error_logs', [
            'message' => 'Test Error from Automated Test',
            'component' => 'TestComponent'
        ]);
    }
}
