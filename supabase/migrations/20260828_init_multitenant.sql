-- ==============================================================================
-- CELSTORE™ 3D — SUPABASE / POSTGRESQL MULTI-TENANT SCHEMA WITH ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Stores Table (Tenants)
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    theme_color VARCHAR(50) DEFAULT '#0071e3',
    theme_gradient VARCHAR(100) DEFAULT 'from-blue-600 to-indigo-600',
    address TEXT,
    phone_whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    specialty VARCHAR(100),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table (Multi-Tenant with store_id)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'phone', -- 'phone' | 'accessory'
    category VARCHAR(100),
    model_year INT NOT NULL,
    generation_category VARCHAR(50) NOT NULL, -- 'last_2_years' | 'recent_gen' | 'vintage_classic'
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2) CHECK (original_price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- 'published' | 'draft' | 'archived'
    condition VARCHAR(100) DEFAULT 'Nuevo Sellado',
    tagline TEXT,
    model_3d_type VARCHAR(50) DEFAULT 'modern_flagship', -- 'modern_flagship' | 'vintage_bar' | 'vintage_flip'
    images JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    storage_options JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    solutions JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for multi-tenant queries & generational filtering
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_generation ON public.products(generation_category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
    mercadopago_preference_id VARCHAR(255),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'Confirmado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    storage VARCHAR(100),
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Stores RLS: Public can read all active stores
CREATE POLICY "Public Stores Read" ON public.stores
    FOR SELECT USING (true);

-- Products RLS:
-- 1. Public can read ONLY published products
CREATE POLICY "Public Products Read" ON public.products
    FOR SELECT USING (status = 'published');

-- 2. Authenticated Store Managers can read ALL products (including drafts) from their own store
CREATE POLICY "Store Manager Read All" ON public.products
    FOR SELECT TO authenticated
    USING (store_id = (auth.jwt() ->> 'store_id')::uuid);

-- 3. Store Managers can INSERT only into their own store
CREATE POLICY "Store Manager Insert" ON public.products
    FOR INSERT TO authenticated
    WITH CHECK (store_id = (auth.jwt() ->> 'store_id')::uuid);

-- 4. Store Managers can UPDATE only their own store products
CREATE POLICY "Store Manager Update" ON public.products
    FOR UPDATE TO authenticated
    USING (store_id = (auth.jwt() ->> 'store_id')::uuid)
    WITH CHECK (store_id = (auth.jwt() ->> 'store_id')::uuid);

-- 5. Store Managers can DELETE only their own store products
CREATE POLICY "Store Manager Delete" ON public.products
    FOR DELETE TO authenticated
    USING (store_id = (auth.jwt() ->> 'store_id')::uuid);

-- ==============================================================================
-- ATOMIC STOCK DEDUCTION FUNCTION (CONCURRENCY LOCKING VIA 'FOR UPDATE')
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.decrease_stock_atomic(
    p_product_id UUID,
    p_quantity INT
)
RETURNS JSONB AS $$
DECLARE
    v_current_stock INT;
    v_new_stock INT;
BEGIN
    -- 1. Lock the row to prevent race conditions during concurrent checkouts
    SELECT stock INTO v_current_stock
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Producto no encontrado');
    END IF;

    -- 2. Check if sufficient stock exists
    IF v_current_stock < p_quantity THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Stock insuficiente',
            'available_stock', v_current_stock
        );
    END IF;

    -- 3. Update stock atomically
    v_new_stock := v_current_stock - p_quantity;
    UPDATE public.products
    SET stock = v_new_stock,
        updated_at = NOW()
    WHERE id = p_product_id;

    RETURN jsonb_build_object(
        'success', true,
        'previous_stock', v_current_stock,
        'remaining_stock', v_new_stock
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
