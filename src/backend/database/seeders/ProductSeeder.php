<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\Organization;
use App\Models\Inventory;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::first();
        $store = Store::first();

        // Create Categories
        $electronics = Category::create([
            'organization_id' => $org->id,
            'name' => 'Electronics',
            'description' => 'Gadgets and devices',
        ]);

        $clothing = Category::create([
            'organization_id' => $org->id,
            'name' => 'Clothing',
            'description' => 'Apparel and fashion',
        ]);

        // Create Products
        $laptop = Product::create([
            'organization_id' => $org->id,
            'category_id' => $electronics->id,
            'sku' => 'LAP-001',
            'name' => 'Gaming Laptop',
            'description' => 'High performance gaming laptop',
            'price' => 1299.99,
            'cost' => 900.00,
            'barcode' => '1234567890123',
            'status' => 'active',
        ]);

        $tshirt = Product::create([
            'organization_id' => $org->id,
            'category_id' => $clothing->id,
            'sku' => 'TSH-001',
            'name' => 'Cotton T-Shirt',
            'description' => '100% Cotton, Black',
            'price' => 19.99,
            'cost' => 5.00,
            'barcode' => '9876543210987',
            'status' => 'active',
        ]);

        // Inventory
        Inventory::create([
            'product_id' => $laptop->id,
            'store_id' => $store->id,
            'quantity' => 10,
            'min_stock' => 2,
        ]);

        Inventory::create([
            'product_id' => $tshirt->id,
            'store_id' => $store->id,
            'quantity' => 100,
            'min_stock' => 10,
        ]);
    }
}
