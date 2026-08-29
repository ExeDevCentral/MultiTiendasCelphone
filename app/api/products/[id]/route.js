import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PRODUCTS_FILE, readData, writeData } from '@/src/lib/dataStore';
import { parseAuthToken, verifyTenantAccess } from '@/src/lib/authGuard';

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

    // Protect draft and archived products from unauthenticated public viewing
    if (product.status && product.status !== 'published') {
      const auth = parseAuthToken(request);
      if (!auth || (!auth.isSuperAdmin && auth.storeId !== product.storeId)) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const auth = parseAuthToken(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
    }
    if (!verifyTenantAccess(auth, products[index].storeId)) {
      return NextResponse.json({ error: 'Acceso denegado: No tienes permisos para modificar este producto' }, { status: 403 });
    }

    const body = await request.json();
    const validation = ProductUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de actualización inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    // Preserve product immutable fields (id, storeId)
    const { id: _ignoredId, storeId: _ignoredStoreId, ...safeUpdates } = body;

    products[index] = { ...products[index], ...safeUpdates, id: products[index].id, storeId: products[index].storeId };
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

    const auth = parseAuthToken(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado: Se requiere sesión activa' }, { status: 401 });
    }
    if (!verifyTenantAccess(auth, products[index].storeId)) {
      return NextResponse.json({ error: 'Acceso denegado: No tienes permisos para eliminar este producto' }, { status: 403 });
    }

    products = products.filter((p) => p.id !== id);
    writeData(PRODUCTS_FILE, products);

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
