-- ============================================
-- MIGRACIÓN: Agregar campos de imagen para Supabase Storage
-- ============================================

-- Agregar campos image_url y image_path a la tabla materials
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Agregar campos image_url y image_path a la tabla products
-- Nota: 'image' ya existe pero era para Base64, ahora usamos image_url para URLs
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN materials.image_url IS 'URL pública de la imagen almacenada en Supabase Storage';
COMMENT ON COLUMN materials.image_path IS 'Ruta interna del archivo en Supabase Storage (para eliminación)';
COMMENT ON COLUMN products.image_url IS 'URL pública de la imagen almacenada en Supabase Storage';
COMMENT ON COLUMN products.image_path IS 'Ruta interna del archivo en Supabase Storage (para eliminación)';

-- ============================================
-- CONFIGURACIÓN DEL BUCKET DE STORAGE
-- ============================================
-- NOTA: Esto debe ejecutarse desde el panel de Supabase Storage o mediante código
-- 
-- 1. Crear bucket 'images' con acceso público:
--    - Ir a Storage > Create Bucket
--    - Nombre: images
--    - Public: Yes
--
-- 2. Configurar políticas de Storage:

-- Política para permitir a usuarios autenticados subir imágenes
-- INSERT INTO storage.policies (name, bucket_id, definition)
-- VALUES (
--   'Users can upload images',
--   'images',
--   'authenticated'::text
-- );

-- Política para permitir lectura pública de imágenes
-- INSERT INTO storage.policies (name, bucket_id, definition)
-- VALUES (
--   'Public can view images',
--   'images',
--   'true'::text
-- );

-- Política para permitir a usuarios eliminar sus propias imágenes
-- INSERT INTO storage.policies (name, bucket_id, definition)
-- VALUES (
--   'Users can delete their own images',
--   'images',
--   'bucket_id = ''images'' AND auth.uid()::text = (storage.foldername(name))[1]'
-- );

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Migración completada: campos de imagen agregados' as mensaje;

-- Verificar columnas agregadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('materials', 'products') 
  AND column_name LIKE '%image%'
ORDER BY table_name, column_name;
