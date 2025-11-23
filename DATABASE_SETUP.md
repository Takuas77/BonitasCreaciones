# 📊 Configuración de Base de Datos Supabase

## Archivos SQL Incluidos

1. **`supabase_schema_completo.sql`** - Schema completo y actualizado ✅
2. **`supabase_migracion.sql`** - Para migrar usuarios existentes
3. ~~`supabase_schema.sql`~~ - OBSOLETO, no usar
4. ~~`doc/SQL_USER_PROFILES.sql`~~ - OBSOLETO, no usar
5. ~~`doc/SOLUCION_ERRORES_SUPABASE.md`~~ - SQL antiguo, no usar

---

## 🚀 Instalación Completa (Nueva Base de Datos)

### PASO 1: Ejecutar Schema Completo

1. Ve a Supabase: https://supabase.com/dashboard/project/rrmjhtqpkdakagzbtkxi
2. Click en **SQL Editor** (menú lateral izquierdo)
3. Click en **New Query**
4. Abre el archivo `supabase_schema_completo.sql`
5. Copia TODO el contenido
6. Pega en el SQL Editor
7. Click en **Run** (o `Ctrl + Enter`)
8. Deberías ver: `Schema completo creado exitosamente!`

### PASO 2: Verificar Tablas Creadas

1. Ve a **Table Editor** (menú lateral)
2. Deberías ver estas 5 tablas:
   - ✅ `user_profiles` - Perfiles de usuario (username → email)
   - ✅ `materials` - Materiales
   - ✅ `products` - Productos
   - ✅ `history` - Historial de producción/ventas
   - ✅ `price_history` - Historial de cambios de precio

### PASO 3: Crear tu Primer Usuario

**Opción A: Registrarse en la aplicación**
1. Ve a: https://takuas77.github.io/BonitasCreaciones/
2. Click en "Regístrate aquí"
3. Completa el formulario
4. El perfil se crea automáticamente ✅

**Opción B: Si ya tienes un usuario en Supabase Auth**
1. Abre `supabase_migracion.sql`
2. Sigue las instrucciones de la "OPCIÓN A" o "OPCIÓN B"
3. Ejecuta el SQL correspondiente

---

## 🔄 Migración (Si Ya Tienes Datos)

### Si ya tienes usuarios registrados:

1. Abre `supabase_migracion.sql`
2. Ejecuta la sección **"2. Crear perfiles para usuarios existentes"**
3. Esto creará perfiles automáticamente para todos los usuarios

### Si ya tienes materiales/productos:

1. Encuentra tu USER_ID:
   ```sql
   SELECT id FROM auth.users WHERE email = 'tu@email.com';
   ```

2. Asigna tus datos a tu usuario:
   ```sql
   -- Reemplaza 'TU_USER_ID' con tu ID real
   UPDATE materials SET user_id = 'TU_USER_ID' WHERE user_id IS NULL;
   UPDATE products SET user_id = 'TU_USER_ID' WHERE user_id IS NULL;
   ```

---

## 📋 Estructura de Tablas

### user_profiles
```
id              UUID (PK, FK → auth.users)
username        TEXT (UNIQUE) - para login
email           TEXT
name            TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### materials
```
id                  TEXT (PK)
user_id             UUID (FK → auth.users)
name                TEXT
cost                NUMERIC(10,2)
stock               NUMERIC(10,2)
category            TEXT
unit                TEXT
conversion_factor   NUMERIC(10,4)
alternative_unit    TEXT
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

### products
```
id          TEXT (PK)
user_id     UUID (FK → auth.users)
name        TEXT
category    TEXT
image       TEXT
margin      NUMERIC(10,2)
price       NUMERIC(10,2)
recipe      JSONB
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### history
```
id              UUID (PK)
user_id         UUID (FK → auth.users)
type            TEXT ('production' o 'sale')
product_name    TEXT
quantity        NUMERIC(10,2)
total_cost      NUMERIC(10,2)
sale_price      NUMERIC(10,2)
profit          NUMERIC(10,2)
date            TIMESTAMPTZ
```

### price_history
```
id              UUID (PK)
user_id         UUID (FK → auth.users)
material_id     TEXT (FK → materials)
material_name   TEXT
old_price       NUMERIC(10,2)
new_price       NUMERIC(10,2)
change_percent  NUMERIC(10,2)
date            TIMESTAMPTZ
```

---

## 🔒 Seguridad (Row Level Security)

✅ **Todas las tablas tienen RLS habilitado**

Cada usuario solo puede:
- ✅ Ver sus propios datos
- ✅ Crear sus propios datos
- ✅ Modificar sus propios datos
- ✅ Eliminar sus propios datos

Excepción:
- ✅ `user_profiles` es visible para todos (solo username y name)
- ✅ Esto permite buscar usernames para el login

---

## ✅ Checklist de Instalación

- [ ] Ejecuté `supabase_schema_completo.sql`
- [ ] Vi el mensaje "Schema completo creado exitosamente!"
- [ ] Verifiqué que las 5 tablas existen en Table Editor
- [ ] Creé mi usuario (app o SQL)
- [ ] Probé login con username ✅
- [ ] Probé login con email ✅
- [ ] Creé un material de prueba
- [ ] Recargué la página (F5) y el material sigue ahí

---

## 🐛 Solución de Problemas

### Error: "relation materials already exists"
**Solución:** Las tablas ya existen. 
- Opción A: Elimina las tablas antiguas primero (el SQL ya tiene `DROP TABLE`)
- Opción B: Salta al PASO 2

### Error: "permission denied for table materials"
**Solución:** Las políticas RLS no están correctas.
- Ejecuta `supabase_schema_completo.sql` completo de nuevo

### Error: "Usuario no encontrado" al hacer login con username
**Solución:** El perfil no existe en `user_profiles`
- Ve a Table Editor → `user_profiles`
- Si está vacía, ejecuta `supabase_migracion.sql` sección 2

### No veo mis materiales después de crearlos
**Solución:** Problema de RLS o user_id
- Abre la consola del navegador (F12)
- Busca errores de Supabase
- Verifica que `auth.uid()` coincida con el `user_id` de tus datos

---

## 📚 Documentación Adicional

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostgreSQL JSON](https://www.postgresql.org/docs/current/datatype-json.html)

---

¡Tu base de datos está lista! 🎉
