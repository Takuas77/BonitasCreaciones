# Configuración de Supabase Storage para Imágenes

Este documento explica cómo configurar Supabase Storage para almacenar imágenes de productos y materiales.

## 📦 ¿Qué se implementó?

Se agregó integración con **Supabase Storage** para subir y almacenar imágenes de productos y materiales, en lugar de usar Base64 (que aumenta el tamaño de la base de datos).

### ✨ Funcionalidades

- ✅ Subida de imágenes de **productos** a Supabase Storage
- ✅ Subida de imágenes de **materiales** a Supabase Storage
- ✅ Vista previa de imágenes antes de guardar
- ✅ Eliminación automática de imágenes antiguas al actualizar
- ✅ Fallback a Base64 si Supabase no está disponible
- ✅ Validación de tamaño (máx. 2MB) y tipo de archivo
- ✅ URLs públicas optimizadas para carga rápida

---

## 🚀 Pasos de Configuración en Supabase

### 1. Crear el Bucket de Storage

1. Ve al panel de **Supabase** → **Storage**
2. Haz clic en **"New Bucket"**
3. Configura el bucket:
   - **Name:** `images`
   - **Public:** ✅ **Activado** (para URLs públicas)
   - **File size limit:** 2MB (opcional)
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif`

4. Haz clic en **"Create Bucket"**

### 2. Configurar Políticas de Storage (RLS)

Debes crear políticas para permitir que los usuarios autenticados suban, lean y eliminen sus propias imágenes.

#### Opción A: Desde el Panel de Supabase

1. Ve a **Storage** → selecciona el bucket `images`
2. Ve a la pestaña **"Policies"**
3. Crea las siguientes políticas:

**Política 1: Permitir subir imágenes (INSERT)**
- **Name:** `Users can upload images`
- **Policy definition:** 
  ```sql
  (bucket_id = 'images'::text) AND (auth.role() = 'authenticated'::text)
  ```
- **Target roles:** `authenticated`
- **Operations:** `INSERT`

**Política 2: Permitir leer imágenes públicamente (SELECT)**
- **Name:** `Public can view images`
- **Policy definition:**
  ```sql
  bucket_id = 'images'::text
  ```
- **Target roles:** `public`
- **Operations:** `SELECT`

**Política 3: Permitir eliminar propias imágenes (DELETE)**
- **Name:** `Users can delete their own images`
- **Policy definition:**
  ```sql
  (bucket_id = 'images'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```
- **Target roles:** `authenticated`
- **Operations:** `DELETE`

#### Opción B: Ejecutar SQL

Si prefieres ejecutar SQL directamente, ve a **SQL Editor** y ejecuta:

```sql
-- Política para subir imágenes
CREATE POLICY "Users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Política para leer imágenes (público)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Política para eliminar propias imágenes
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Ejecutar la Migración de Base de Datos

Ejecuta el archivo de migración para agregar los campos `image_url` e `image_path` a las tablas:

1. Ve a **SQL Editor** en Supabase
2. Abre el archivo `database/add_image_fields_migration.sql`
3. Copia y pega el contenido
4. Haz clic en **"Run"**

Esto agregará:
- `materials.image_url` y `materials.image_path`
- `products.image_url` y `products.image_path`

---

## 🔧 Configuración en el Código

El código ya está configurado en `js/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    anonKey: 'tu-anon-key',
    useSupabase: true,
    storageBucket: 'images' // ← Nombre del bucket
};
```

**Asegúrate de que:**
- ✅ `useSupabase` esté en `true`
- ✅ `storageBucket` sea `'images'`
- ✅ Las credenciales de Supabase sean correctas

---

## 📁 Estructura de Archivos en Storage

Las imágenes se organizan automáticamente por usuario y tipo:

```
images/
├── {user_id}/
│   ├── products/
│   │   ├── {uuid}.jpg
│   │   ├── {uuid}.png
│   │   └── ...
│   └── materials/
│       ├── {uuid}.jpg
│       ├── {uuid}.png
│       └── ...
```

Ejemplo:
```
images/a1b2c3.../products/f4e5d6...abc.jpg
images/a1b2c3.../materials/g7h8i9...def.png
```

---

## 🧪 Probar la Funcionalidad

1. **Login** en la aplicación
2. Ve a **Productos** → **Nuevo Producto**
3. Haz clic en **"Imagen del Producto"** y selecciona una imagen
4. Completa el formulario y haz clic en **"Guardar Producto"**
5. Verifica que la imagen aparece en la tarjeta del producto
6. Repite para **Materiales**

### Verificar en Supabase

1. Ve a **Storage** → `images`
2. Navega a la carpeta `{tu-user-id}/products/` o `materials/`
3. Deberías ver las imágenes subidas con nombres UUID únicos

---

## 🐛 Solución de Problemas

### ❌ Error: "Supabase no está habilitado"

**Solución:**
- Verifica que `SUPABASE_CONFIG.useSupabase = true`
- Asegúrate de que `supabaseClient` se inicializó correctamente

### ❌ Error al subir imagen: "Policy violation"

**Solución:**
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado (`Auth.currentUser` existe)

### ❌ Las imágenes no se muestran (404)

**Solución:**
- Verifica que el bucket `images` sea **público**
- Revisa la política de lectura (`SELECT`) para `public`
- Comprueba que la URL sea correcta en `product.image_url`

### ⚠️ Fallback a Base64

Si Supabase no está disponible, la aplicación automáticamente usa Base64 como fallback. Esto funciona, pero aumenta el tamaño de los datos.

---

## 📊 Comparación: Base64 vs Supabase Storage

| Característica | Base64 | Supabase Storage |
|---|---|---|
| **Tamaño en DB** | ❌ Muy grande | ✅ Solo URL (pequeña) |
| **Velocidad de carga** | ❌ Lento | ✅ Rápido (CDN) |
| **Límite de tamaño** | ⚠️ Limitado por DB | ✅ Configurable |
| **Optimización** | ❌ No | ✅ Sí (caché, CDN) |
| **Gestión** | ⚠️ Manual | ✅ Automática |

---

## 📝 Archivos Modificados

### Nuevos archivos:
- `database/add_image_fields_migration.sql` - Migración SQL

### Archivos actualizados:
- `js/supabase-config.js` - Módulo `SupabaseStorage` con funciones de gestión
- `js/app.js` - Lógica de subida para productos y materiales
- `js/ui.js` - Renderizado de imágenes desde URLs
- `index.html` - Campo de imagen en formulario de materiales

---

## 🎉 ¡Listo!

Ahora tu aplicación puede:
- ✅ Subir imágenes de productos y materiales a Supabase Storage
- ✅ Mostrar imágenes desde URLs públicas optimizadas
- ✅ Eliminar automáticamente imágenes antiguas
- ✅ Funcionar offline con fallback a Base64

Si tienes dudas, revisa la consola del navegador para ver logs de errores.
