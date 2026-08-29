import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PRODUCTS_FILE, readData, writeData } from '@/src/lib/dataStore';

const ProductUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  brand: z.string().min(1).optional(),
  type: z.enum(["phone", "accessory"]).optional(),
  modelYear: z.number().int().min(1990).max(2030).optional(),
  generationCategory: z.enum(["last_2_years", "recent_gen", "vintage_classic"]).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  status: z.enum(["published", "draft", "archived"]).optional(),
  colors: z.array(z.any()).optional(),
  storageOptions: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  specs: z.record(z.any()).optional()
});

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const products = readData(PRODUCTS_FILE);
    const product = products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const validation = ProductUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de actualización inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    products[index] = { ...products[index], ...body, id: products[index].id };
    writeData(PRODUCTS_FILE, products);

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    let products = readData(PRODUCTS_FILE);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    products = products.filter((p) => p.id !== id);
    writeData(PRODUCTS_FILE, products);

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
