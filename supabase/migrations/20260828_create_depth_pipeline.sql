-- ==============================================================================
-- CELSTORE™ 3D — STAGE 6: SERVERLESS DEPTH ESTIMATION PIPELINE & STORAGE
-- ==============================================================================

-- 1. Agregar columnas de mapa de profundidad a la tabla products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS depth_map_url TEXT,
ADD COLUMN IF NOT EXISTS depth_status VARCHAR(50) DEFAULT 'pending'
    CHECK (depth_status IN ('pending', 'processing', 'ready', 'error'));

-- 2. Asegurar que public.products esté en la publicación de Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- 3. Crear Storage Bucket para Media y Mapas de Profundidad
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Políticas de Acceso RLS para Storage de Mapas de Profundidad
CREATE POLICY "Public Depth Maps Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-media');

CREATE POLICY "Admin Upload Depth Maps"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "Admin Update Depth Maps"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-media');

CREATE POLICY "Admin Delete Depth Maps"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-media');

-- 5. Trigger para autollenar photo_url desde images[0] si no está definido
CREATE OR REPLACE FUNCTION public.handle_product_photo_url_sync()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.photo_url IS NULL AND jsonb_array_length(NEW.images) > 0 THEN
        NEW.photo_url := NEW.images->>0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_product_photo_sync ON public.products;
CREATE TRIGGER tr_product_photo_sync
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_product_photo_url_sync();
