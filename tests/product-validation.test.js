import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  brand: z.string().min(1, "La marca es requerida"),
  type: z.enum(["phone", "accessory"]).default("phone"),
  modelYear: z.number().int().min(1990).max(2030),
  generationCategory: z.enum(["last_2_years", "recent_gen", "vintage_classic"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  status: z.enum(["published", "draft", "archived"]).default("published"),
  storeId: z.string().min(1, "El storeId es requerido")
});

describe('Product Schema & Data Validation', () => {
  it('should accept valid product data in published or draft state', () => {
    const validProduct = {
      name: 'Samsung Galaxy S25 Ultra',
      brand: 'Samsung',
      type: 'phone',
      modelYear: 2025,
      generationCategory: 'last_2_years',
      price: 1349,
      stock: 15,
      status: 'draft',
      storeId: 'store-celstore-premium'
    };

    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('should reject invalid products with negative price or negative stock', () => {
    const invalidProduct = {
      name: 'Invalid Phone',
      brand: 'TestBrand',
      modelYear: 2024,
      generationCategory: 'last_2_years',
      price: -50, // Invalid negative price
      stock: -5,  // Invalid negative stock
      storeId: 'store-1'
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});
