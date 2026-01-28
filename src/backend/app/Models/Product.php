<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Organization;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Store;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'category_id',
        'sku',
        'name',
        'description',
        'price',
        'cost',
        'tax_rate',
        'barcode',
        'image',
        'status',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'inventories')
            ->withPivot(['quantity', 'min_stock', 'max_stock', 'last_restock_date'])
            ->withTimestamps();
    }
}
