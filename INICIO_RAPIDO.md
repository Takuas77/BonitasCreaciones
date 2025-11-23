# 🚀 Inicio Rápido: Imágenes en Supabase Storage

## ⚡ Configuración en 5 minutos

### 1️⃣ Crear Bucket en Supabase (2 min)
1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. **Storage** → **New Bucket**
3. Name: `images`
4. Public: ✅ **Activado**
5. Clic en **Create**

### 2️⃣ Configurar Políticas (2 min)
Ve a **SQL Editor** y ejecuta:

```sql
-- Permitir subir imágenes (usuarios autenticados)
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Permitir ver imágenes (público)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'images');

-- Permitir eliminar propias imágenes
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3️⃣ Ejecutar Migración (1 min)
En **SQL Editor**, ejecuta el contenido de:
```
database/add_image_fields_migration.sql
```

---

## ✅ ¡Listo! Ahora puedes:

### Agregar Imagen a Producto
1. **Productos** → **Nuevo Producto** (o editar uno existente)
2. Clic en **"Imagen del Producto"**
3. Selecciona una imagen (máx. 2MB)
4. Verás preview inmediato
5. **Guardar Producto**

### Agregar Imagen a Material
1. **Materiales** → **Nuevo Material** (o editar uno existente)
2. Clic en **"Imagen del Material"**
3. Selecciona una imagen (máx. 2MB)
4. Verás preview inmediato
5. **Guardar Material**

---

## 🔍 Verificar que Funciona

### En la App:
- ✅ Los productos muestran imagen en su tarjeta
- ✅ Los materiales muestran miniatura en la tabla
- ✅ Botón "Eliminar Imagen" visible

### En Supabase:
1. Ve a **Storage** → `images`
2. Navega a `{tu-user-id}/products/` o `materials/`
3. Verás archivos con nombres UUID (ej: `a1b2c3-d4e5...jpg`)

---

## ❓ Si algo no funciona

### Error al subir imagen
- Verifica que el bucket `images` sea **público**
- Revisa que las políticas estén creadas correctamente
- Asegúrate de estar **autenticado** en la app

### Imágenes no se muestran
- Abre la **consola del navegador** (F12)
- Busca errores en rojo
- Verifica que la URL de la imagen sea válida

### Fallback a Base64
Si Supabase no está configurado, la app automáticamente usa Base64 (funciona, pero es menos eficiente).

---

## 📚 Documentación Completa

Ver: `doc/SUPABASE_STORAGE_SETUP.md`

---

## 🎉 Ventajas

- ⚡ **Carga rápida** con CDN de Supabase
- 📦 **Base de datos liviana** (solo guarda URLs)
- 🔄 **Caché automático** del navegador
- 🗑️ **Limpieza automática** de imágenes antiguas

¡Disfruta tu nueva funcionalidad! 📸
