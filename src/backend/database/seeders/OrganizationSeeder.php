<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        // Create Demo Organization
        $org = Organization::create([
            'name' => 'Demo Company',
            'slug' => 'demo-company',
            'settings' => ['currency' => 'USD'],
            'status' => 'active',
        ]);

        // Create Demo Store
        $store = Store::create([
            'organization_id' => $org->id,
            'name' => 'Main Store',
            'address' => '123 Main St, Tech City',
            'phone' => '555-0123',
            'status' => 'active',
        ]);

        // Create Org Admin User
        $admin = User::create([
            'organization_id' => $org->id,
            'store_id' => $store->id,
            'name' => 'Admin User',
            'email' => 'admin@demo.com',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $admin->assignRole('organization-admin');

        // Create Cashier User
        $cashier = User::create([
            'organization_id' => $org->id,
            'store_id' => $store->id,
            'name' => 'John Cashier',
            'email' => 'cashier@demo.com',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $cashier->assignRole('cashier');
    }
}
