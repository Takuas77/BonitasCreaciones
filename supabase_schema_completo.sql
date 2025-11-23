-- ============================================
-- SCHEMA COMPLETO PARA BONITAS CREACIONES
-- Base de datos Supabase con autenticación
-- ============================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ELIMINAR TABLAS EXISTENTES (si las hay)
-- ============================================
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS history CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================
-- TABLA DE PERFILES DE USUARIO
-- Mapea username → email para login con username
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
-- TABLA DE MATERIALES
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    image TEXT,
    margin NUMERIC(10,2),
    price NUMERIC(10,2),
    recipe JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE HISTORIAL DE PRODUCCIÓN Y VENTAS
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
-- TABLA DE HISTORIAL DE PRECIOS
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
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_materials_user_id ON materials(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_price_history_user_id ON price_history(user_id);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: USER_PROFILES
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
-- POLÍTICAS RLS: MATERIALS
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
-- POLÍTICAS RLS: PRODUCTS
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
-- POLÍTICAS RLS: HISTORY
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
-- POLÍTICAS RLS: PRICE_HISTORY
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
-- VERIFICACIÓN
-- ============================================
SELECT 'Schema completo creado exitosamente!' as mensaje;

-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
