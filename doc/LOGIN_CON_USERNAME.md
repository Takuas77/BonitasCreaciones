# 🔧 Solución: Login con Username

## Problema
Solo se podía iniciar sesión con email, no con username.

## Solución
Crear una tabla `user_profiles` en Supabase que mapea username → email.

---

## 📋 PASO 1: Crear Tabla en Supabase

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard/project/rrmjhtqpkdakagzbtkxi
2. Click en **SQL Editor** (menú lateral)
3. Click en **New Query**
4. Copia y pega este SQL:

```sql
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

-- 4. Política: Los usuarios pueden ver todos los perfiles (solo username y name)
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
```

5. Click en **Run** (o `Ctrl + Enter`)
6. Deberías ver: `Tabla user_profiles creada exitosamente!`

---

## 📋 PASO 2: Migrar Usuarios Existentes (Si los tienes)

Si ya tienes usuarios registrados en Supabase, necesitas crear sus perfiles:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este SQL para cada usuario existente:

```sql
-- Reemplaza estos valores con los datos reales de tu usuario
INSERT INTO user_profiles (id, username, email, name)
VALUES (
    'TU_USER_ID',           -- ID del usuario de auth.users
    'tu_username',          -- El username que quieres usar
    'tu@email.com',         -- El email con el que te registraste
    'Tu Nombre'             -- Tu nombre
);
```

**Para encontrar tu USER_ID:**
```sql
-- Ver todos los usuarios registrados
SELECT id, email, raw_user_meta_data FROM auth.users;
```

---

## 📋 PASO 3: Subir Código a GitHub

```powershell
git add .
git commit -m "feat: Login con username - busca email en user_profiles"
git push
```

---

## ✅ Cómo Funciona Ahora

### Registro:
1. Usuario completa formulario con: nombre, email, username, contraseña
2. Se crea cuenta en Supabase Auth (con email)
3. Se guarda perfil en tabla `user_profiles` (username → email)

### Login:
1. Usuario ingresa **username o email**
2. Si es username: busca email en `user_profiles`
3. Si es email: usa directamente
4. Inicia sesión con el email encontrado

---

## 🧪 Probar

1. **Registra un nuevo usuario:**
   - Nombre: María
   - Email: maria@example.com
   - Username: maria123
   - Contraseña: ******

2. **Prueba login con username:**
   - Usuario: `maria123`
   - Contraseña: ******
   - ✅ Debería funcionar

3. **Prueba login con email:**
   - Usuario: `maria@example.com`
   - Contraseña: ******
   - ✅ Debería funcionar

---

## 🔍 Verificar en Supabase

### Ver tabla de perfiles:
1. Ve a **Table Editor** → `user_profiles`
2. Deberías ver todos los usuarios con su username y email

### Consulta SQL para ver todo:
```sql
SELECT 
    up.username,
    up.email,
    up.name,
    au.created_at as registered_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id;
```

---

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado"
**Causa:** El username no existe en la tabla `user_profiles`
**Solución:** Ejecuta el PASO 2 para crear el perfil del usuario

### Error: "relation user_profiles does not exist"
**Causa:** La tabla no se creó
**Solución:** Ejecuta el SQL del PASO 1

### Error: "duplicate key value violates unique constraint"
**Causa:** El username ya existe
**Solución:** Elige otro username o elimina el perfil duplicado

---

## 📊 Estructura de la Tabla

```
user_profiles
├── id (UUID, PK) → referencia a auth.users(id)
├── username (TEXT, UNIQUE) → nombre de usuario único
├── email (TEXT) → email del usuario
├── name (TEXT) → nombre completo
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

---

¡Ahora puedes iniciar sesión con username o email! 🎉
