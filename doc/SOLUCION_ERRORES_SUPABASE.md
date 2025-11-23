# 🔧 Solución de Errores - Integración Supabase

## ⚠️ ESTE ARCHIVO ESTÁ OBSOLETO

**Por favor usa:** `DATABASE_SETUP.md` (en la raíz del proyecto)

**SQL actualizado:** `supabase_schema_completo.sql`

---

## ✅ Cambios Importantes

### Antes (Obsoleto):
- SQL dividido en múltiples archivos
- Sin tabla `user_profiles`
- Sin soporte para login con username

### Ahora (Nuevo):
- ✅ **Un solo archivo SQL:** `supabase_schema_completo.sql`
- ✅ **Tabla user_profiles:** Login con username o email
- ✅ **RLS completo:** Cada usuario ve solo sus datos
- ✅ **Historia y price_history:** Con user_id

---

## 🚀 Instrucciones Actualizadas

Lee el archivo: **`DATABASE_SETUP.md`**

Ejecuta: **`supabase_schema_completo.sql`**

---

## Resumen de lo que cambió:

1. **user_profiles** - Nueva tabla para mapear username → email
2. **history** - Ahora incluye `user_id`
3. **price_history** - Ahora incluye `user_id`
4. **Todas las políticas RLS** - Filtran por `auth.uid()`

---


**Causa:** Las tablas `materials` y `products` no existen en tu base de datos de Supabase.

**Solución:** Ejecutar el SQL para crear las tablas (ver abajo).

### 2. Error: Cannot read properties of null
**Causa:** El código intentaba acceder a elementos del DOM que no existen.

**Solución:** ✅ Corregido - Ahora verifica que los elementos existan antes de usarlos.

### 3. Advertencias de autocomplete
**Solución:** ✅ Corregido - Agregados atributos `autocomplete` a todos los campos.

---

## 📋 PASO 1: Crear Tablas en Supabase

1. Ve a tu proyecto: https://supabase.com/dashboard/project/rrmjhtqpkdakagzbtkxi
2. Click en **SQL Editor** (menú lateral izquierdo)
3. Click en **New Query**
4. Copia y pega este SQL **COMPLETO**:

```sql
-- ============================================
-- CREAR TABLAS PARA BONITAS CREACIONES
-- ============================================

-- 1. Eliminar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. Crear tabla de materiales
CREATE TABLE materials (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    stock DECIMAL(10,2) NOT NULL,
    category TEXT,
    unit TEXT,
    conversion_factor DECIMAL(10,4) DEFAULT 1,
    alternative_unit TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear tabla de productos
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    image TEXT,
    margin DECIMAL(10,2),
    price DECIMAL(10,2),
    recipe JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear índices para mejorar rendimiento
CREATE INDEX idx_materials_user_id ON materials(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de seguridad para MATERIALS
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

-- 7. Crear políticas de seguridad para PRODUCTS
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

-- 8. Verificar que todo se creó correctamente
SELECT 'Tablas creadas exitosamente!' as mensaje;
```

5. Click en **Run** (o presiona `Ctrl + Enter`)
6. Deberías ver: `Tablas creadas exitosamente!`

---

## 📋 PASO 2: Verificar las Tablas

1. En Supabase, ve a **Table Editor** (menú lateral)
2. Deberías ver dos tablas nuevas:
   - ✅ `materials`
   - ✅ `products`
3. Click en cada una para ver su estructura

---

## 📋 PASO 3: Subir Código Actualizado a GitHub

```bash
cd c:\Users\Alejandro\.gemini\antigravity\scratch\calculadora_costos
git add .
git commit -m "fix: Corregir integración con Supabase y errores de DOM"
git push
```

---

## 📋 PASO 4: Probar la Aplicación

1. Espera 2-3 minutos para que GitHub Pages se actualice
2. Abre: https://takuas77.github.io/BonitasCreaciones/
3. Abre la consola del navegador (F12)
4. Deberías ver:
   ```
   ✓ Supabase inicializado correctamente
   🔐 Modo: Supabase Auth
   ```
5. **Inicia sesión** con tu cuenta
6. Ve a la pestaña **"Materiales"**
7. Crea un material de prueba
8. En la consola deberías ver:
   ```
   Materiales cargados desde Supabase: 1
   ```
9. **Recarga la página** (F5)
10. El material debería seguir ahí (¡cargado desde Supabase!)

---

## 🔍 Verificar en Supabase

1. Ve a **Table Editor** → `materials`
2. Deberías ver tu material guardado
3. Fíjate que tenga tu `user_id` correcto

---

## 🐛 Si Aún No Funciona

### Error: "relation materials does not exist"
**Solución:** Las tablas no se crearon. Ejecuta el SQL del Paso 1 otra vez.

### Error: "permission denied for table materials"
**Solución:** Las políticas RLS no están correctas. Ejecuta TODO el SQL del Paso 1.

### Los materiales no se cargan
1. Abre la consola (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes que digan:
   - `Error loading materials from Supabase:`
   - `Fallback a localStorage`
4. Si ves esos mensajes, las tablas no existen o hay problemas de permisos

### Verificar que tu usuario está autenticado
En la consola, escribe:
```javascript
Auth.currentUser
```
Deberías ver tu información de usuario con un `id`.

---

## ✅ Checklist Final

- [ ] SQL ejecutado en Supabase sin errores
- [ ] Tablas `materials` y `products` visibles en Table Editor
- [ ] Código subido a GitHub (`git push`)
- [ ] Esperé 2-3 minutos para que GitHub Pages se actualice
- [ ] Me logueé en la aplicación
- [ ] Creé un material de prueba
- [ ] Recargué la página y el material sigue ahí
- [ ] Veo el material en Supabase Table Editor

---

## 📊 Logs Esperados en Consola

**Éxito:**
```
✓ Supabase inicializado correctamente
🔐 Modo: Supabase Auth
Materiales cargados desde Supabase: 0
Productos cargados desde Supabase: 0
```

**Después de crear material:**
```
Materiales cargados desde Supabase: 1
```

---

¡Ahora sí debería funcionar! 🎉
