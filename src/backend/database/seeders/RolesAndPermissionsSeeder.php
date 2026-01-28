<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Force web guard
        // auth()->shouldUse('web');

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'manage organizations',
            'manage stores',
            'manage users',
            'manage products',
            'manage inventory',
            'manage sales',
            'view reports',
            'process sales',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create Roles and assign permissions
        $superAdmin = Role::create(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $orgAdmin = Role::create(['name' => 'organization-admin']);
        $orgAdmin->givePermissionTo([
            'manage stores',
            'manage users',
            'manage products',
            'manage inventory',
            'manage sales',
            'view reports',
            'process sales',
            'manage settings',
        ]);

        $storeManager = Role::create(['name' => 'store-manager']);
        $storeManager->givePermissionTo([
            'manage products',
            'manage inventory',
            'manage sales',
            'view reports',
            'process sales',
        ]);

        $cashier = Role::create(['name' => 'cashier']);
        $cashier->givePermissionTo([
            'process sales',
            'view reports', // maybe limited reports
        ]);
    }
}
