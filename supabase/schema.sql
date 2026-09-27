-- ==============================================================================
-- CELPHONE E-COMMERCE — ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL + RLS)
-- Concepto: Objeto de Precisión Técnica
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT,
    -- specs en formato jsonb con valores numéricos y tabulares precisos:
    -- {
    --   "ram": "16 GB LPDDR5X",
    --   "almacenamiento": "512 GB NVMe",
    --   "camara": "48 MP Main (f/1.78) + 12 MP Ultra Wide + 12 MP 5x Telephoto",
    --   "bateria": "4422 mAh (33h video)",
    --   "procesador": "A18 Pro (3nm)",
    --   "pantalla": "6.9\" Super Retina XDR OLED 120Hz ProMotion"
    -- }
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    images TEXT[] NOT NULL DEFAULT '{}'::text[],
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_specs ON public.products USING gin(specs);

-- 4. TABLA DE PERFILES DE USUARIO (EXTIENDE auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    items JSONB NOT NULL, -- Array de [{ product_id, name, price, quantity, color, storage }]
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'coordinating_whatsapp', 'confirmed', 'shipped', 'cancelled')),
    shipping_address JSONB NOT NULL,
    contact_phone TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ==============================================================================
-- 6. TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL AL REGISTRARSE EN AUTH.USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'customer')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 7. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Lectura pública, escritura solo admin
CREATE POLICY "Categorías son públicas para lectura"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores modifican categorías"
    ON public.categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- PRODUCTS: Lectura pública, modificación solo admin
CREATE POLICY "Productos son públicos para lectura"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores gestionan productos"
    ON public.products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- PROFILES: Usuario lee y actualiza su propio perfil, admin ve todos
CREATE POLICY "Usuarios gestionan su propio perfil"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Administradores pueden ver todos los perfiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ORDERS: Usuario crea y ve sus propias órdenes, admin ve y actualiza todas
CREATE POLICY "Cualquiera autenticado o anónimo puede crear pedido"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Usuarios ven sus propios pedidos"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Administradores gestionan todas las órdenes"
    ON public.orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ==============================================================================
-- 8. DATOS SEMILLA (SEED DATA) — CONCEPTO DE PRECISIÓN TÉCNICA
-- ==============================================================================
INSERT INTO public.categories (id, name, slug) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Flagships 2026', 'flagships-2026'),
    ('22222222-2222-2222-2222-222222222222', 'Smartphones Pro', 'smartphones-pro'),
    ('33333333-3333-3333-3333-333333333333', 'Vintage Archive', 'vintage-archive')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, brand, model, price, stock, description, specs, images, category_id, featured) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'iPhone 16 Pro Max',
    'Apple',
    'A3296',
    1399.00,
    14,
    'Chasis de titanio Grado 5 forjado a alta presión. Arquitectura A18 Pro a 3nm y botón de control de cámara táctil.',
    '{
      "ram": "8 GB LPDDR5X",
      "almacenamiento": "512 GB NVMe",
      "camara": "48 MP Fusion (f/1.78) + 48 MP Ultra Wide + 12 MP 5x Telephoto Tetraprisma",
      "bateria": "4685 mAh (33h video continuo)",
      "procesador": "Apple A18 Pro (3nm, 6-core CPU + 6-core GPU)",
      "pantalla": "6.9\" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits pico",
      "peso": "227 g",
      "material": "Titanio Grado 5 + Vidrio Ceramic Shield 2nd Gen"
    }'::jsonb,
    ARRAY[
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=90',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000&auto=format&fit=crop&q=90'
    ],
    '11111111-1111-1111-1111-111111111111',
    true
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Galaxy S24 Ultra Titanium',
    'Samsung',
    'SM-S928B',
    1299.00,
    9,
    'Pantalla plana Corning Gorilla Armor antireflejo con chasis de titanio y cámara de 200MP con zoom espacial IA.',
    '{
      "ram": "12 GB LPDDR5X",
      "almacenamiento": "512 GB UFS 4.0",
      "camara": "200 MP (f/1.7) + 50 MP (5x) + 10 MP (3x) + 12 MP Ultra Wide",
      "bateria": "5000 mAh (Carga 45W GaN)",
      "procesador": "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "pantalla": "6.8\" Dynamic AMOLED 2X, 120Hz LTPO, 2600 nits pico",
      "peso": "232 g",
      "material": "Marco de Titanio + Cristal Gorilla Armor"
    }'::jsonb,
    ARRAY[
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&auto=format&fit=crop&q=90'
    ],
    '11111111-1111-1111-1111-111111111111',
    false
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Pixel 9 Pro XL',
    'Google',
    'G1ZNC',
    1199.00,
    18,
    'Tensor G4 con 16GB de memoria para ejecución de modelos Gemini Nano en chip y barra de cámara icónica en aluminio pulido.',
    '{
      "ram": "16 GB LPDDR5X",
      "almacenamiento": "256 GB UFS 3.1",
      "camara": "50 MP Octa PD (f/1.68) + 48 MP Quad PD Ultra Wide + 48 MP Telephoto 5x",
      "bateria": "5060 mAh (Carga rápida 37W)",
      "procesador": "Google Tensor G4 (4nm) + Coprocesador Titan M2",
      "pantalla": "6.8\" Super Actua LTPO OLED, 120Hz, 3000 nits pico",
      "peso": "221 g",
      "material": "Aluminio 100% reciclado + Gorilla Glass Victus 2"
    }'::jsonb,
    ARRAY[
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop&q=90'
    ],
    '11111111-1111-1111-1111-111111111111',
    false
),
(
    'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90',
    'Xiaomi 14 Ultra Leica Edition',
    'Xiaomi',
    '24030PN60G',
    1249.00,
    6,
    'Sensor principal Sony LYT-900 de 1 pulgada con apertura variable continua y cuatro cámaras calibradas por Leica Summilux.',
    '{
      "ram": "16 GB LPDDR5X",
      "almacenamiento": "512 GB UFS 4.0",
      "camara": "50 MP 1\" LYT-900 (f/1.63-f/4.0) + 50 MP Telephoto + 50 MP Periscope + 50 MP Ultra Wide",
      "bateria": "5000 mAh (Carga 90W cable / 80W inalámbrica)",
      "procesador": "Snapdragon 8 Gen 3 (4nm)",
      "pantalla": "6.73\" LTPO AMOLED C8, 120Hz, 3000 nits",
      "peso": "219.8 g",
      "material": "Marco Unibody de Aluminio 6M42 + Cuero Vegano Nano-Tech"
    }'::jsonb,
    ARRAY[
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=90'
    ],
    '11111111-1111-1111-1111-111111111111',
    false
),
(
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f90a1',
    'Motorola Razr V3 (Silver Archive)',
    'Motorola',
    'RAZR-V3',
    289.00,
    4,
    'La silueta clamshell más legendaria de la era moderna móvil. Teclado de aluminio grabado químicamente y pantalla dual.',
    '{
      "ram": "5.5 MB memoria interna",
      "almacenamiento": "Mini-USB expandible",
      "camara": "VGA 640x480 con zoom digital 4x",
      "bateria": "Li-Ion 680 mAh (Celda nueva instalada)",
      "procesador": "ARM7TDMI 52 MHz",
      "pantalla": "TFT 2.2\" 176x220 píxeles, 260K colores + Display secundario CSTN",
      "peso": "95 g",
      "material": "Carcasa de Magnesio y Aluminio Anodizado"
    }'::jsonb,
    ARRAY[
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1000&auto=format&fit=crop&q=90'
    ],
    '33333333-3333-3333-3333-333333333333',
    false
)
ON CONFLICT (id) DO NOTHING;
