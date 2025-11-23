-- ============================================
-- MIGRACIÓN DE USUARIOS EXISTENTES
-- Ejecuta DESPUÉS de crear el schema completo
-- ============================================

-- 1. Ver todos los usuarios registrados en Supabase Auth
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data->>'username' as username,
    raw_user_meta_data->>'name' as name
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- 2. Crear perfiles para usuarios existentes
-- ============================================

-- OPCIÓN A: Si los usuarios tienen username y name en metadata
INSERT INTO user_profiles (id, username, email, name)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)) as username,
    email,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- OPCIÓN B: Crear perfil manualmente para un usuario específico
-- (Reemplaza los valores con tus datos reales)
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

-- ============================================
-- 3. Migrar datos existentes de materials
-- (Si tienes datos sin user_id)
-- ============================================

-- Ver materiales sin user_id
-- SELECT * FROM materials WHERE user_id IS NULL LIMIT 10;

-- Asignar todos los materiales sin dueño a un usuario específico
-- (Reemplaza 'TU_USER_ID' con tu ID real)
/*
UPDATE materials 
SET user_id = 'TU_USER_ID'
WHERE user_id IS NULL;
*/

-- ============================================
-- 4. Migrar datos existentes de products
-- ============================================

-- Ver productos sin user_id
-- SELECT * FROM products WHERE user_id IS NULL LIMIT 10;

-- Asignar todos los productos sin dueño a un usuario específico
/*
UPDATE products 
SET user_id = 'TU_USER_ID'
WHERE user_id IS NULL;
*/

-- ============================================
-- 5. Verificar migración
-- ============================================

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

-- ============================================
-- QUERIES ÚTILES
-- ============================================

-- Ver el ID de un usuario por email
-- SELECT id FROM auth.users WHERE email = 'tu@email.com';

-- Ver el ID de un usuario por username
-- SELECT id FROM user_profiles WHERE username = 'tu_username';

-- Cambiar username de un usuario
-- UPDATE user_profiles SET username = 'nuevo_username' WHERE id = 'USER_ID';

-- Eliminar un perfil (también eliminará sus datos por CASCADE)
-- DELETE FROM user_profiles WHERE username = 'usuario_a_eliminar';
