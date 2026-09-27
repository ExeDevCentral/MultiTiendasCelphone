import { NextResponse } from 'next/server';
import { createSupabaseClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { mockStore } from '@/src/lib/mockStore';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { quantity = 1 } = await request.json();
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseClient();
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('id, store_id, stock')
          .eq('id', id)
          .maybeSingle();

        if (product) {
          const { data: result, error } = await supabase.rpc('decrease_stock_atomic', {
            p_product_id: id,
            p_quantity: qty,
          });

          if (!error && result) {
            if (!result.success) {
              return NextResponse.json(
                {
                  error: result.error || 'Stock insuficiente para completar la operación',
                  availableStock: result.available_stock ?? product.stock,
                },
                { status: 409 }
              );
            }
            return NextResponse.json({ success: true, remainingStock: result.remaining_stock });
          }
        }
      } catch (dbErr) {
        console.warn('decrease-stock bypass to mockStore:', dbErr.message);
      }
    }

    // Zero-Cost Mock Store Stock Deduction
    const res = mockStore.decreaseStock(id, qty);
    if (!res.success) {
      return NextResponse.json(
        { error: res.error, availableStock: 0 },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, remainingStock: res.remainingStock });
  } catch (error) {
    console.error('POST /api/products/:id/decrease-stock:', error);
    return NextResponse.json({ error: 'Error al descontar stock' }, { status: 500 });
  }
}