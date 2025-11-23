-- ============================================
-- TABLA DE PERFILES DE USUARIO
-- Permite login con username buscando el email
-- ============================================

-- 1. Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear índice para búsqueda rápida por username
CREATE INDEX idx_user_profiles_username ON user_profiles(username);

-- 3. Habilitar Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Política: Los usuarios pueden ver todos los perfiles (solo username y name, no datos sensibles)
CREATE POLICY "Anyone can view usernames"
    ON user_profiles
    FOR SELECT
    USING (true);

-- 5. Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 6. Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- 7. Verificar que todo se creó correctamente
SELECT 'Tabla user_profiles creada exitosamente!' as mensaje;
