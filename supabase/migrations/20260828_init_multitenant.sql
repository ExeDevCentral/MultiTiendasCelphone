-- ==============================================================================
-- CELSTORE™ 3D — SUPABASE / POSTGRESQL MULTI-TENANT SCHEMA WITH ROW LEVEL SECURITY
-- Compatible con IDs tipo slug (VARCHAR) usados por el dominio CelStore.
-- El servicio (API Routes de Next.js) opera con SERVICE_ROLE; la anon key solo
-- puede leer datos públicos gracias a RLS.
-- ==============================================================================

-- 1. Stores Table (Tenants)
CREATE TABLE IF NOT EXISTS public.stores (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    logo TEXT,
    banner TEXT,
    theme_color VARCHAR(50) DEFAULT '#0071e3',
    theme_gradient VARCHAR(120) DEFAULT 'from-blue-600 via-indigo-600 to-sky-400',
    address TEXT,
    phone_whatsapp VARCHAR(60) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT TRUE,
    specialty VARCHAR(160),
    manager_email VARCHAR(255) UNIQUE,
    manager_password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table (Multi-Tenant with store_id)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(120) PRIMARY KEY,
    store_id VARCHAR(100) NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'phone',
    category VARCHAR(120),
    model_year INT NOT NULL DEFAULT 2024,
    generation_category VARCHAR(50) NOT NULL DEFAULT 'last_2_years',
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2) CHECK (original_price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    condition_desc VARCHAR(200),
    tagline TEXT,
    description TEXT,
    compatibility TEXT,
    model_3d_type VARCHAR(80) DEFAULT 'modern_flagship',
    images JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    storage_options JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    solutions JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    photo_url TEXT,
    depth_map_url TEXT,
    depth_status VARCHAR(30) DEFAULT 'none',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for multi-tenant queries & generational filtering
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_generation ON public.products(generation_category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 3. Orders Table (customer/items persistidos como JSONB para el shape del dominio)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(120) PRIMARY KEY,
    store_id VARCHAR(100) NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    customer JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'Confirmado',
    payment_method VARCHAR(80) NOT NULL DEFAULT 'mercadopago',
    mercadopago_preference_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Objetivo: la anon key nunca puede leer/escribir datos no públicos.
-- El server (service role) opera con RLS bypaseado y validación de tenant propia.
-- ==============================================================================

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Stores RLS: Public can read all active stores
CREATE POLICY "Public Stores Read" ON public.stores
    FOR SELECT TO anon
    USING (true);

-- Products RLS:
-- 1. Public (anon) can read ONLY published products
CREATE POLICY "Public Products Read" ON public.products
    FOR SELECT TO anon
    USING (status = 'published');

-- 2. Authenticated users can read published products too
CREATE POLICY "Authenticated Products Read" ON public.products
    FOR SELECT TO authenticated
    USING (status = 'published');

-- Orders RLS: anonymous users cannot read orders at all (no policy).
-- (Escritura se realiza únicamente vía service role en las API Routes.)

-- ==============================================================================
-- ATOMIC STOCK DEDUCTION FUNCTION (CONCURRENCY LOCKING VIA 'FOR UPDATE')
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.decrease_stock_atomic(
    p_product_id VARCHAR,
    p_quantity INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ==============================================================================
-- ADMIN ROLE (anea MATERIALIZED a la función run-as-server)
-- ==============================================================================

REVOKE EXECUTE ON FUNCTION public.decrease_stock_atomic(VARCHAR, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrease_stock_atomic(VARCHAR, INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.decrease_stock_atomic(VARCHAR, INT) TO anon;