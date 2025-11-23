-- ============================================
-- MIGRACIÓN COMPLETA - BONITAS CREACIONES
-- Schema completo + Migración de datos + Campos de imagen
-- ============================================

-- ============================================
-- PASO 1: PREPARACIÓN
-- ============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PASO 2: ELIMINAR TABLAS EXISTENTES (si las hay)
-- ============================================
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS history CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================
-- PASO 3: CREAR TABLA DE PERFILES DE USUARIO
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASO 4: CREAR TABLA DE MATERIALES
-- ============================================
CREATE TABLE materials (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    stock NUMERIC(10,2) NOT NULL,
    category TEXT,
    unit TEXT,
    conversion_factor NUMERIC(10,4) DEFAULT 1,
    alternative_unit TEXT,
    image_url TEXT,
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios para documentación de campos de imagen
COMMENT ON COLUMN materials.image_url IS 'URL pública de la imagen almacenada en Supabase Storage';
COMMENT ON COLUMN materials.image_path IS 'Ruta interna del archivo en Supabase Storage (para eliminación)';

-- ============================================
-- PASO 5: CREAR TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    image TEXT,
    image_url TEXT,
    image_path TEXT,
    margin NUMERIC(10,2),
    price NUMERIC(10,2),
    recipe JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios para documentación de campos de imagen
COMMENT ON COLUMN products.image_url IS 'URL pública de la imagen almacenada en Supabase Storage';
COMMENT ON COLUMN products.image_path IS 'Ruta interna del archivo en Supabase Storage (para eliminación)';

-- ============================================
-- PASO 6: CREAR TABLA DE HISTORIAL DE PRODUCCIÓN Y VENTAS
-- ============================================
CREATE TABLE history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'production' o 'sale'
    product_name TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    total_cost NUMERIC(10,2),
    sale_price NUMERIC(10,2),
    profit NUMERIC(10,2),
    date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASO 7: CREAR TABLA DE HISTORIAL DE PRECIOS
-- ============================================
CREATE TABLE price_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id TEXT REFERENCES materials(id) ON DELETE CASCADE,
    material_name TEXT NOT NULL,
    old_price NUMERIC(10,2),
    new_price NUMERIC(10,2),
    change_percent NUMERIC(10,2),
    date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASO 8: CREAR TABLA DE VENTAS
-- ============================================
CREATE TABLE sales (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    customer TEXT,
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    profit NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios para documentación
COMMENT ON TABLE sales IS 'Registro de ventas de productos';
COMMENT ON COLUMN sales.product_id IS 'ID del producto vendido (referencia a products.id)';
COMMENT ON COLUMN sales.customer IS 'Nombre del cliente (opcional)';
COMMENT ON COLUMN sales.quantity IS 'Cantidad de unidades vendidas';
COMMENT ON COLUMN sales.unit_price IS 'Precio unitario de venta';
COMMENT ON COLUMN sales.total IS 'Total de la venta (quantity * unit_price)';
COMMENT ON COLUMN sales.cost IS 'Costo total de producción';
COMMENT ON COLUMN sales.profit IS 'Ganancia obtenida (total - cost)';

-- ============================================
-- PASO 9: CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_materials_user_id ON materials(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_price_history_user_id ON price_history(user_id);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_product_id ON sales(product_id);

-- ============================================
-- PASO 10: HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 11: POLÍTICAS RLS - USER_PROFILES
-- ============================================
CREATE POLICY "Users can view all usernames"
    ON user_profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON user_profiles
    FOR DELETE
    USING (auth.uid() = id);

-- ============================================
-- PASO 12: POLÍTICAS RLS - MATERIALS
-- ============================================
CREATE POLICY "Users can view their own materials"
    ON materials
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own materials"
    ON materials
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials"
    ON materials
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials"
    ON materials
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PASO 13: POLÍTICAS RLS - PRODUCTS
-- ============================================
CREATE POLICY "Users can view their own products"
    ON products
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
    ON products
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
    ON products
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
    ON products
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PASO 14: POLÍTICAS RLS - HISTORY
-- ============================================
CREATE POLICY "Users can view their own history"
    ON history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
    ON history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
    ON history
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PASO 15: POLÍTICAS RLS - PRICE_HISTORY
-- ============================================
CREATE POLICY "Users can view their own price history"
    ON price_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own price history"
    ON price_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price history"
    ON price_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PASO 16: POLÍTICAS RLS - SALES
-- ============================================
CREATE POLICY "Users can view own sales"
    ON sales
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
    ON sales
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
    ON sales
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
    ON sales
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PASO 17: MIGRAR USUARIOS EXISTENTES
-- ============================================

-- Ver todos los usuarios registrados en Supabase Auth
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data->>'username' as username,
    raw_user_meta_data->>'name' as name
FROM auth.users
ORDER BY created_at DESC;

-- Crear perfiles para usuarios existentes
-- Si los usuarios tienen username y name en metadata
INSERT INTO user_profiles (id, username, email, name)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)) as username,
    email,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PASO 18: MIGRAR DATOS EXISTENTES (OPCIONAL)
-- ============================================

-- OPCIÓN: Crear perfil manualmente para un usuario específico
-- (Descomenta y reemplaza los valores con tus datos reales)
/*
INSERT INTO user_profiles (id, username, email, name)
VALUES (
    'REEMPLAZA_CON_TU_USER_ID',
    'tu_username',
    'tu@email.com',
    'Tu Nombre Completo'
)
ON CONFLICT (id) DO NOTHING;
*/

-- OPCIÓN: Asignar materiales sin dueño a un usuario específico
-- (Descomenta y reemplaza 'TU_USER_ID' con tu ID real)
/*
UPDATE materials 
SET user_id = 'TU_USER_ID'
WHERE user_id IS NULL;
*/

-- OPCIÓN: Asignar productos sin dueño a un usuario específico
-- (Descomenta y reemplaza 'TU_USER_ID' con tu ID real)
/*
UPDATE products 
SET user_id = 'TU_USER_ID'
WHERE user_id IS NULL;
*/

-- ============================================
-- PASO 19: VERIFICACIÓN FINAL
-- ============================================

-- Verificar que todas las tablas fueron creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'materials', 'products', 'history', 'price_history', 'sales')
ORDER BY table_name;

-- Verificar columnas de imagen agregadas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('materials', 'products') 
  AND column_name LIKE '%image%'
ORDER BY table_name, column_name;

-- Ver resumen de usuarios y sus datos
SELECT 
    up.username,
    up.email,
    up.name,
    COUNT(DISTINCT m.id) as total_materials,
    COUNT(DISTINCT p.id) as total_products
FROM user_profiles up
LEFT JOIN materials m ON m.user_id = up.id
LEFT JOIN products p ON p.user_id = up.id
GROUP BY up.id, up.username, up.email, up.name
ORDER BY up.created_at DESC;

SELECT '✓ Migración completa finalizada exitosamente!' as mensaje;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- 1. CONFIGURACIÓN DE STORAGE (debe hacerse desde el panel de Supabase):
--    - Ir a Storage > Create Bucket
--    - Nombre: images
--    - Public: Yes
--
-- 2. POLÍTICAS DE STORAGE (configurar en Supabase):
--    - Permitir a usuarios autenticados subir imágenes
--    - Permitir lectura pública de imágenes
--    - Permitir a usuarios eliminar sus propias imágenes
--
-- 3. QUERIES ÚTILES:
--    - Ver ID de usuario por email:
--      SELECT id FROM auth.users WHERE email = 'tu@email.com';
--    
--    - Ver ID de usuario por username:
--      SELECT id FROM user_profiles WHERE username = 'tu_username';
--    
--    - Cambiar username:
--      UPDATE user_profiles SET username = 'nuevo_username' WHERE id = 'USER_ID';
--    
--    - Eliminar perfil (también eliminará datos por CASCADE):
--      DELETE FROM user_profiles WHERE username = 'usuario_a_eliminar';
