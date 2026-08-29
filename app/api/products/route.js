import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PRODUCTS_FILE, readData, writeData } from '@/src/lib/dataStore';

const ProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  brand: z.string().min(1, "La marca es requerida"),
  type: z.enum(["phone", "accessory"]).default("phone"),
  modelYear: z.number().int().min(1990).max(2030),
  generationCategory: z.enum(["last_2_years", "recent_gen", "vintage_classic"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  originalPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  status: z.enum(["published", "draft", "archived"]).default("published"),
  storeId: z.string().min(1, "El storeId es requerido")
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let products = readData(PRODUCTS_FILE);

    const storeId = searchParams.get('storeId');
    const generationCategory = searchParams.get('generationCategory');
    const type = searchParams.get('type');
    const brand = searchParams.get('brand');
    const isFeatured = searchParams.get('isFeatured');
    const includeDrafts = searchParams.get('includeDrafts');
    const q = searchParams.get('q');

    if (includeDrafts !== 'true') {
      products = products.filter((p) => p.status === 'published' || !p.status);
    }

    if (storeId) {
      products = products.filter((p) => p.storeId === storeId);
    }
    if (generationCategory) {
      products = products.filter((p) => p.generationCategory === generationCategory);
    }
    if (type) {
      products = products.filter((p) => p.type === type);
    }
    if (brand) {
      products = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (isFeatured === 'true') {
      products = products.filter((p) => p.isFeatured === true);
    }
    if (q) {
      const query = q.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.tagline && p.tagline.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = ProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de producto inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const products = readData(PRODUCTS_FILE);
    const newProduct = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
      ...body,
    };

    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
