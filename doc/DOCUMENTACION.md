# 📚 Documentación Completa - Bonitas Creaciones

**Calculadora de Costos & Inventario para Emprendimientos**

**Versión**: 2.0 (con Módulo de Ventas)  
**Fecha**: 23 de noviembre de 2025

---

## 📖 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Características](#características)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Configuración de Supabase](#configuración-de-supabase)
5. [Estructura de Base de Datos](#estructura-de-base-de-datos)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [Uso de la Aplicación](#uso-de-la-aplicación)
8. [Módulo de Ventas](#módulo-de-ventas)
9. [Solución de Problemas](#solución-de-problemas)
10. [Desarrollo y Mantenimiento](#desarrollo-y-mantenimiento)

---

## 🎯 Introducción

**Bonitas Creaciones** es una aplicación web completa para gestionar tu emprendimiento de cartucheras (o cualquier negocio similar). Incluye:

- 💰 Calculadora de costos de producción
- 📦 Control de inventario de materiales
- 🏷️ Gestión de productos con recetas
- � **Módulo de ventas completo (NUEVO)**
- �📊 Historial de producción y ventas
- 📈 Estadísticas y reportes
- 🔐 Sistema de autenticación seguro
- ☁️ Sincronización con Supabase (opcional)

**Tecnologías:**
- HTML5, CSS3, JavaScript ES6 (Vanilla)
- Supabase para backend (PostgreSQL + Auth)
- LocalStorage como fallback
- GitHub Pages para hosting

---

## ✨ Características

### 🔐 Autenticación
- ✅ Registro de usuarios con email
- ✅ Login con **username o email**
- ✅ Sesiones persistentes
- ✅ Modo dual: LocalStorage o Supabase
- ✅ Validaciones de seguridad
- ✅ Hash de contraseñas

### 💼 Gestión de Materiales
- ✅ Crear, editar y eliminar materiales
- ✅ Control de stock
- ✅ Categorías personalizables
- ✅ Unidades de medida con conversión
- ✅ Historial de cambios de precio
- ✅ Búsqueda y filtrado
- ✅ Alertas de stock bajo

### 🏷️ Gestión de Productos
- ✅ Crear productos con recetas
- ✅ Calculadora de margen/precio bidireccional
- ✅ Imágenes de productos
- ✅ Galería de productos
- ✅ Compartir catálogo
- ✅ Categorías personalizadas

### � Gestión de Ventas (NUEVO)
- ✅ Registrar ventas con información completa
- ✅ Cálculo automático de totales y ganancias
- ✅ Filtrado por período (hoy, semana, mes, año)
- ✅ Búsqueda por producto o cliente
- ✅ Estadísticas en tiempo real
- ✅ Historial completo de ventas
- ✅ Análisis de rentabilidad

### 📊 Producción y Reportes
- ✅ Registrar producción (descuenta stock)
- ✅ Historial completo
- ✅ Estadísticas de ganancias
- ✅ Exportar datos a JSON/CSV
- ✅ Dashboard con métricas clave

### 🎨 Interfaz
- ✅ Diseño glassmorphism
- ✅ Colores de marca (rosa/coral)
- ✅ Logo personalizado
- ✅ Favicon
- ✅ Responsive (móvil y desktop)
- ✅ Notificaciones visuales

---

## 🚀 Instalación y Configuración

### Opción 1: Usar en GitHub Pages (Recomendado)

**Accede directamente a:**
```
https://takuas77.github.io/BonitasCreaciones/
```

### Opción 2: Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Takuas77/BonitasCreaciones.git
   cd BonitasCreaciones
   ```

2. **Abrir en navegador:**
   ```bash
   # Windows
   start index.html
   
   # Mac
   open index.html
   
   # Linux
   xdg-open index.html
   ```

3. **O usar un servidor local:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (con npx)
   npx serve
   ```

### Archivos Importantes

```
BonitasCreaciones/
├── index.html              # Página principal
├── manifest.json           # PWA config
├── README.md               # Descripción del proyecto
├── css/
│   └── style.css          # Estilos completos
├── js/
│   ├── app.js             # Lógica principal
│   ├── ui.js              # Renderizado UI
│   ├── storage.js         # Persistencia de datos
│   ├── sales.js           # Módulo de ventas (NUEVO) ⭐
│   ├── auth.js            # Autenticación
│   ├── supabase-client.js # Cliente Supabase
│   └── supabase-config.js # Configuración Supabase
├── images/
│   ├── logo.png           # Logo del emprendimiento
│   └── BonitasCreaciones.ico  # Favicon
├── database/
│   └── migracion_completa.sql  # Schema completo con ventas ⭐
└── doc/
    └── DOCUMENTACION.md   # Esta documentación completa ⭐
```

---

## ⚙️ Configuración de Supabase

### ¿Qué es Supabase?

Supabase es una plataforma de backend que proporciona:
- 🔒 Autenticación segura (JWT, bcrypt)
- 💾 Base de datos PostgreSQL
- ☁️ Almacenamiento en la nube
- 🔄 Row Level Security (RLS)

**Es GRATIS** para proyectos pequeños (hasta 50,000 usuarios activos/mes)

---

### 📋 PASO 1: Crear Cuenta en Supabase

1. Ve a https://supabase.com
2. Click en **"Start your project"**
3. Regístrate con GitHub o Google

---

### 🚀 PASO 2: Crear Proyecto

1. En el dashboard, click en **"New Project"**
2. Completa:
   - **Name**: Bonitas Creaciones
   - **Database Password**: Elige una contraseña segura (guárdala)
   - **Region**: South America (o la más cercana)
   - **Pricing Plan**: Free
3. Click en **"Create new project"**
4. Espera 2-3 minutos

---

### 🔑 PASO 3: Obtener Credenciales

1. En tu proyecto, ve a **Settings** → **API**
2. Copia estos dos valores:

   **Project URL:**
   ```
   https://rrmjhtqpkdakagzbtkxi.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### ⚙️ PASO 4: Configurar la App

Abre `js/supabase-config.js` y pega tus credenciales:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',     // 👈 Tu Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI...', // 👈 Tu anon key
    useSupabase: true  // 👈 true = Supabase, false = LocalStorage
};
```

---

### 🗄️ PASO 5: Crear Base de Datos

1. Ve a **SQL Editor** en Supabase
2. Click en **New Query**
3. Abre el archivo `database/migracion_completa.sql` de tu proyecto
4. **Copia TODO el contenido**
5. Pega en el SQL Editor
6. Click en **Run** (o `Ctrl + Enter`)
7. Deberías ver: ✅ `Migración completa finalizada exitosamente!`

El SQL crea estas tablas:
- ✅ `user_profiles` - Perfiles de usuario (username → email)
- ✅ `materials` - Materiales con stock
- ✅ `products` - Productos con recetas
- ✅ `history` - Historial de producción/ventas
- ✅ `price_history` - Cambios de precio
- ✅ `sales` - Registro de ventas (NUEVO) ⭐

---

### 🔄 PASO 6: Migrar Usuarios Existentes (Opcional)

Si ya tienes usuarios registrados:

1. El script `migracion_completa.sql` incluye la migración automática
2. Ejecuta esta query para verificar:

```sql
-- Ver usuarios registrados
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Ver perfiles creados
SELECT * FROM user_profiles;
```

3. Si necesitas crear un perfil manualmente:

```sql
INSERT INTO user_profiles (id, username, email, name)
VALUES (
    'TU_USER_ID_AQUI',
    'tu_username',
    'tu@email.com',
    'Tu Nombre'
);
```

---

### ✅ PASO 7: Verificar Instalación

1. Ve a **Table Editor** en Supabase
2. Verifica que existan las 6 tablas:
   - user_profiles
   - materials
   - products
   - history
   - price_history
   - sales ⭐ (NUEVA)
3. Abre tu app: https://takuas77.github.io/BonitasCreaciones/
4. Abre la consola (F12)
5. Deberías ver:
   ```
   ✓ Supabase inicializado correctamente
   🔐 Modo: Supabase Auth
   ```
6. Crea una cuenta nueva
7. Inicia sesión con username o email
8. Crea un material de prueba
9. Crea un producto
10. Registra una venta de prueba ⭐
11. Recarga la página (F5)
12. ✅ Todos los datos deberían estar ahí

---

## 🗄️ Estructura de Base de Datos

### Diagrama de Relaciones

```
auth.users (Supabase Auth)
    ↓
user_profiles (username → email mapping)
    ↓
    ├── materials (materiales del usuario)
    ├── products (productos del usuario)
    ├── sales (ventas del usuario) ⭐ NUEVO
    ├── history (historial del usuario)
    └── price_history (cambios de precio del usuario)
```

---

### Tabla: user_profiles

Mapea username a email para permitir login con username.

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,                    -- FK → auth.users(id)
    username TEXT UNIQUE NOT NULL,          -- Usuario único
    email TEXT NOT NULL,                    -- Email del usuario
    name TEXT NOT NULL,                     -- Nombre completo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- ✅ Todos pueden ver usernames (para búsqueda en login)
- ✅ Solo el usuario puede modificar su propio perfil

---

### Tabla: materials

Almacena materiales del usuario con control de stock.

```sql
CREATE TABLE materials (
    id TEXT PRIMARY KEY,                    -- ID único del material
    user_id UUID NOT NULL,                  -- FK → auth.users(id)
    name TEXT NOT NULL,                     -- Nombre del material
    cost NUMERIC(10,2) NOT NULL,            -- Costo unitario
    stock NUMERIC(10,2) NOT NULL,           -- Stock actual
    category TEXT,                          -- Categoría (opcional)
    unit TEXT,                              -- Unidad (ej: metros, gramos)
    conversion_factor NUMERIC(10,4),        -- Factor de conversión
    alternative_unit TEXT,                  -- Unidad alternativa
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- ✅ Cada usuario solo ve sus propios materiales
- ✅ Solo el dueño puede modificar/eliminar

---

### Tabla: products

Almacena productos con sus recetas.

```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,                    -- ID único del producto
    user_id UUID NOT NULL,                  -- FK → auth.users(id)
    name TEXT NOT NULL,                     -- Nombre del producto
    category TEXT,                          -- Categoría
    image TEXT,                             -- Base64 de imagen
    margin NUMERIC(10,2),                   -- Margen de ganancia (%)
    price NUMERIC(10,2),                    -- Precio de venta
    recipe JSONB,                           -- Receta en formato JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Formato de recipe (JSONB):**
```json
[
    {
        "materialId": "mat_123",
        "materialName": "Tela",
        "quantity": 0.5,
        "unit": "metros",
        "cost": 10.50
    }
]
```

**RLS Policies:**
- ✅ Cada usuario solo ve sus propios productos

---

### Tabla: history

Historial de producción y ventas.

```sql
CREATE TABLE history (
    id UUID PRIMARY KEY,                    -- ID autogenerado
    user_id UUID NOT NULL,                  -- FK → auth.users(id)
    type TEXT NOT NULL,                     -- 'production' o 'sale'
    product_name TEXT NOT NULL,             -- Nombre del producto
    quantity NUMERIC(10,2) NOT NULL,        -- Cantidad producida/vendida
    total_cost NUMERIC(10,2),               -- Costo total
    sale_price NUMERIC(10,2),               -- Precio de venta (si es sale)
    profit NUMERIC(10,2),                   -- Ganancia (si es sale)
    date TIMESTAMPTZ DEFAULT NOW()          -- Fecha del registro
);
```

**RLS Policies:**
- ✅ Cada usuario solo ve su propio historial

---

### Tabla: price_history

Historial de cambios de precio de materiales.

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,                  -- FK → auth.users(id)
    material_id TEXT,                       -- FK → materials(id)
    material_name TEXT NOT NULL,
    old_price NUMERIC(10,2),                -- Precio anterior
    new_price NUMERIC(10,2),                -- Precio nuevo
    change_percent NUMERIC(10,2),           -- % de cambio
    date TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Tabla: sales (NUEVA) ⭐

Registro completo de ventas de productos.

```sql
CREATE TABLE sales (
    id TEXT PRIMARY KEY,                    -- ID único de la venta
    user_id UUID NOT NULL,                  -- FK → auth.users(id)
    product_id TEXT NOT NULL,               -- ID del producto vendido
    product_name TEXT NOT NULL,             -- Nombre del producto
    customer TEXT,                          -- Nombre del cliente (opcional)
    quantity NUMERIC(10,2) NOT NULL,        -- Cantidad vendida
    unit_price NUMERIC(10,2) NOT NULL,      -- Precio unitario de venta
    total NUMERIC(10,2) NOT NULL,           -- Total (quantity × unit_price)
    cost NUMERIC(10,2) NOT NULL,            -- Costo de producción
    profit NUMERIC(10,2) NOT NULL,          -- Ganancia (total - cost)
    date DATE NOT NULL,                     -- Fecha de la venta
    notes TEXT,                             -- Notas adicionales
    created_at TIMESTAMPTZ DEFAULT NOW(),   -- Fecha de creación
    updated_at TIMESTAMPTZ DEFAULT NOW()    -- Fecha de actualización
);
```

**Índices:**
- `idx_sales_user_id` - Para búsquedas por usuario
- `idx_sales_date` - Para filtrar por fecha
- `idx_sales_product_id` - Para análisis por producto

**RLS Policies:**
- ✅ Cada usuario solo ve sus propias ventas
- ✅ Solo el dueño puede crear/modificar/eliminar

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

```
1. Usuario abre la app
   ↓
2. Auth.init() verifica sesión
   ↓
3. ¿Hay sesión activa?
   ├─ SÍ → Muestra app, carga datos
   └─ NO → Muestra pantalla de login
   ↓
4. Usuario se registra o inicia sesión
   ↓
5. Modo Supabase:
   - Busca email por username (si es necesario)
   - Autentica con Supabase
   - Guarda perfil en user_profiles
   ↓
6. Modo Local:
   - Busca usuario en localStorage
   - Verifica password hasheado
   - Guarda sesión
   ↓
7. App.init() carga materiales y productos
   ↓
8. Usuario trabaja normalmente
   ↓
9. Al cerrar sesión → Vuelve a paso 1
```

---

### Login con Username o Email

**Supabase solo permite login con email**, pero la app permite usar username:

1. Usuario ingresa: `alejandro` o `ale@gmail.com`
2. Si no tiene `@`, se busca en `user_profiles`:
   ```sql
   SELECT email FROM user_profiles WHERE username = 'alejandro';
   ```
3. Se obtiene el email: `ale@gmail.com`
4. Se hace login con el email en Supabase
5. ✅ Login exitoso

**Código en auth.js:**
```javascript
async handleLogin() {
    let loginEmail = username;
    
    // Si no es email, buscar en user_profiles
    if (!username.includes('@')) {
        const { data } = await supabaseClient
            .from('user_profiles')
            .select('email')
            .eq('username', username)
            .single();
        
        loginEmail = data.email;
    }
    
    // Login con email
    await supabaseClient.auth.signInWithPassword({
        email: loginEmail,
        password: password
    });
}
```

---

### Registro de Usuarios

Al registrarse, se crean dos registros:

1. **En Supabase Auth** (auth.users):
   ```javascript
   await supabaseClient.auth.signUp({
       email: email,
       password: password,
       options: {
           data: { name, username }
       }
   });
   ```

2. **En user_profiles**:
   ```javascript
   await supabaseClient.from('user_profiles').insert({
       id: user.id,
       username: username,
       email: email,
       name: name
   });
   ```

---

### Seguridad Implementada

#### Modo LocalStorage (Básico)
- ✅ Contraseñas hasheadas (no texto plano)
- ✅ Validaciones de campos
- ✅ Usuario único
- ⚠️ Hash simple (no para producción real)

#### Modo Supabase (Profesional)
- ✅ JWT tokens
- ✅ bcrypt para passwords
- ✅ HTTPS obligatorio
- ✅ Row Level Security (RLS)
- ✅ Sesiones seguras
- ✅ Recuperación de contraseña por email

---

## 📱 Uso de la Aplicación

### Primera Vez

1. **Abre la app**: https://takuas77.github.io/BonitasCreaciones/
2. **Crea una cuenta**:
   - Nombre: Tu nombre completo
   - Email: tu@email.com
   - Usuario: username único
   - Contraseña: mínimo 6 caracteres
3. **Confirma tu email** (si está habilitado en Supabase)
4. **Inicia sesión** con username o email

---

### Gestión de Materiales

1. **Crear material:**
   - Click en "➕ Nuevo Material"
   - Completa nombre, costo, stock, categoría
   - Opcional: unidad alternativa con factor de conversión
   - Guardar

2. **Editar material:**
   - Click en ✏️ del material
   - Modifica los campos
   - Si cambias el costo, se guarda en historial de precios

3. **Eliminar material:**
   - Click en 🗑️
   - Confirma la eliminación

4. **Buscar/Filtrar:**
   - Usa la barra de búsqueda
   - Filtra por categoría

---

### Gestión de Productos

1. **Crear producto:**
   - Click en "➕ Nuevo Producto"
   - Nombre y categoría
   - **Agregar ingredientes** (receta):
     - Selecciona material
     - Ingresa cantidad
     - Click en "Agregar"
   - **Calcular precio**:
     - Opción A: Ingresa margen de ganancia (%)
     - Opción B: Ingresa precio final (calcula margen)
   - **Agregar imagen** (opcional)
   - Guardar

2. **Ver galería:**
   - Click en "🖼️ Ver Galería"
   - Ve todos tus productos con imágenes

3. **Compartir catálogo:**
   - Click en "📤 Compartir Catálogo"
   - Genera una imagen con tus productos
   - Descarga o comparte

---

### Producción

1. **Registrar producción:**
   - Ve a pestaña "Producción"
   - Selecciona producto
   - Ingresa cantidad
   - Click en "Producir"
   - ⚠️ **Se descuenta el stock de materiales automáticamente**

2. **Ver historial:**
   - Ve a pestaña "Historial"
   - Filtra por producción o ventas
   - Exporta a JSON si necesitas

---

### Calculadora de Costos

1. **Calcular costo de producto:**
   - El costo se calcula automáticamente según la receta
   - Costo = Suma de (cantidad × precio_material)

2. **Calcular precio de venta:**
   - **Margen conocido:**
     - Precio = Costo × (1 + Margen/100)
     - Ejemplo: Costo $100, Margen 50% → Precio $150
   
   - **Precio conocido:**
     - Margen = ((Precio - Costo) / Costo) × 100
     - Ejemplo: Costo $100, Precio $150 → Margen 50%

3. **Calculadora masiva:**
   - Click en "🧮 Calculadora Masiva"
   - Selecciona múltiples productos
   - Ingresa cantidad
   - Ve costo total

---

## � Módulo de Ventas

### Descripción General

El módulo de ventas te permite registrar y gestionar todas las ventas de tus productos, calculando automáticamente costos, ganancias y proporcionando estadísticas detalladas.

### Características Principales

✅ **Registro de Ventas Completo**
- Producto vendido (con precio sugerido)
- Cantidad vendida
- Cliente (opcional)
- Fecha de venta
- Precio unitario personalizable
- Notas adicionales

✅ **Cálculos Automáticos**
- Total de la venta (cantidad × precio)
- Costo de producción (basado en receta)
- Ganancia (total - costo)

✅ **Estadísticas en Tiempo Real**
- Ventas del mes (cantidad)
- Ingresos del mes
- Ganancia del mes
- Total histórico de ventas

✅ **Filtros y Búsqueda**
- Por período: Hoy, Esta semana, Este mes, Este año, Todas
- Por producto o cliente

### Cómo Registrar una Venta

1. **Acceder al módulo:**
   - Click en la pestaña "**Ventas**" en el menú principal

2. **Registrar nueva venta:**
   - Click en "**Registrar Venta**"
   - Selecciona el **producto** del desplegable
   - El **precio se autocompleta** con el del producto
   - Ingresa la **cantidad** vendida
   - (Opcional) Ingresa nombre del **cliente**
   - Selecciona la **fecha** de venta
   - (Opcional) Ajusta el precio si hubo descuento/aumento
   - (Opcional) Agrega **notas** adicionales
   - Verás en tiempo real:
     - **Costo Total**: Cuánto costó producir
     - **Ganancia Estimada**: Cuánto ganarás

3. **Confirmar:**
   - Click en "**Registrar Venta**"
   - La venta aparecerá en la tabla
   - Las estadísticas se actualizan automáticamente

### Visualizar Ventas

1. **Tabla de ventas:**
   - Muestra todas las ventas con:
     - Fecha
     - Producto
     - Cliente
     - Cantidad
     - Precio Unitario
     - Total
     - Costo
     - Ganancia
     - Botón para eliminar

2. **Filtrar ventas:**
   - Usa el **selector de período**:
     - Hoy
     - Esta semana
     - Este mes (por defecto)
     - Este año
     - Todas las ventas
   
3. **Buscar ventas:**
   - Usa la **barra de búsqueda**
   - Busca por nombre de producto o cliente

### Análisis de Rentabilidad

El módulo calcula automáticamente:

**Por cada venta:**
- **Costo**: Basado en la receta del producto
- **Ganancia**: Total - Costo
- **Margen**: (Ganancia / Costo) × 100

**Estadísticas del mes:**
- **Ventas realizadas**: Cantidad total de ventas
- **Ingresos**: Suma de todos los totales
- **Ganancia**: Suma de todas las ganancias

### Ejemplos de Uso

**Ejemplo 1: Venta Normal**
```
Producto: Cartuchera Rosa
Cantidad: 2
Precio: $500 c/u
Total: $1,000
Costo: $600 (2 × $300)
Ganancia: $400
```

**Ejemplo 2: Venta con Descuento**
```
Producto: Neceser Grande
Cantidad: 1
Precio original: $800
Precio con descuento: $700
Total: $700
Costo: $450
Ganancia: $250
```

**Ejemplo 3: Venta al Por Mayor**
```
Producto: Mochila Escolar
Cantidad: 10
Precio: $1,200 c/u
Cliente: Escuela Primavera
Total: $12,000
Costo: $7,000
Ganancia: $5,000
```

### Integración con Productos

- Al seleccionar un producto, el precio se autocompleta
- El costo se calcula automáticamente según la receta
- Los materiales NO se descuentan del stock (usa "Producción" para eso)

### Almacenamiento

Las ventas se guardan en:
- **localStorage** (modo local)
- **Tabla `sales`** en Supabase (modo nube)
- Sincronización automática si Supabase está configurado

### Exportar Ventas

Próximamente: Exportar ventas a CSV/Excel para análisis externo.

---

## �🐛 Solución de Problemas

### Problemas de Login

#### Error: "Usuario no encontrado"
**Causa:** El username no existe en `user_profiles`
**Solución:**
1. Intenta con tu email en lugar del username
2. Si acabas de registrarte, verifica que se creó el perfil:
   ```sql
   SELECT * FROM user_profiles WHERE email = 'tu@email.com';
   ```
3. Si no existe, créalo manualmente:
   ```sql
   INSERT INTO user_profiles (id, username, email, name)
   VALUES ('TU_USER_ID', 'tu_username', 'tu@email.com', 'Tu Nombre');
   ```

#### Error: "Invalid login credentials"
**Causa:** Email o contraseña incorrectos
**Solución:**
- Verifica que estés usando el email correcto
- Si olvidaste la contraseña, usa "Recuperar contraseña"
- En modo local, los usuarios están en localStorage

---

### Problemas con Datos

#### No veo mis materiales/productos
**Causa:** Problema con RLS o user_id
**Solución:**
1. Abre consola (F12)
2. Escribe: `Auth.currentUser`
3. Verifica que tengas un `id`
4. En Supabase, verifica que tus datos tengan tu `user_id`:
   ```sql
   SELECT * FROM materials WHERE user_id = 'TU_USER_ID';
   ```

#### Error: "permission denied for table materials"
**Causa:** Las políticas RLS no están correctas
**Solución:**
- Ejecuta `supabase_schema_completo.sql` completo de nuevo
- Verifica que las políticas existan:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'materials';
  ```

#### Los datos no se sincronizan
**Causa:** `useSupabase` está en `false`
**Solución:**
- Abre `js/supabase-config.js`
- Cambia `useSupabase: true`
- Recarga la página

---

### Problemas de Base de Datos

#### Error: "relation materials does not exist"
**Causa:** Las tablas no se crearon
**Solución:**
1. Ve a Supabase → SQL Editor
2. Ejecuta `supabase_schema_completo.sql`
3. Verifica en Table Editor que las tablas existan

#### Error: "duplicate key value violates unique constraint"
**Causa:** Username o email ya existe
**Solución:**
- Usa otro username
- O elimina el registro duplicado:
  ```sql
  DELETE FROM user_profiles WHERE username = 'username_duplicado';
  ```

---

### Problemas de Interfaz

#### Los botones no funcionan después de F5
**Causa:** Event listeners no se reiniciaron
**Solución:**
- Esto ya está corregido en la versión actual
- Verifica que tengas el código más reciente:
  ```bash
  git pull origin main
  ```

#### Las imágenes no se cargan
**Causa:** Rutas incorrectas o imágenes muy grandes
**Solución:**
- Imágenes de productos se guardan en Base64
- Limite recomendado: 500KB por imagen
- Comprime las imágenes antes de subirlas

---

## 🛠️ Desarrollo y Mantenimiento

### Estructura del Código

```
js/
├── app.js              # Lógica principal
│   ├── App.init()         → Inicializa la app
│   ├── App.loadData()     → Carga datos desde Storage
│   ├── App.setupEventListeners() → Registra eventos
│   └── App.handleSaveMaterial()  → Guarda material
│
├── ui.js               # Renderizado de UI
│   ├── UI.renderMaterials() → Muestra lista de materiales
│   ├── UI.renderProducts()  → Muestra lista de productos
│   └── UI.showModal()       → Muestra modales
│
├── storage.js          # Persistencia de datos
│   ├── Storage.getMaterials()  → Lee materiales (Supabase o Local)
│   ├── Storage.saveMaterial()  → Guarda material
│   └── Storage.useSupabase     → Getter para modo activo
│
├── auth.js             # Autenticación
│   ├── Auth.init()         → Inicializa auth
│   ├── Auth.handleLogin()  → Procesa login
│   ├── Auth.handleRegister() → Procesa registro
│   └── Auth.logout()       → Cierra sesión
│
└── supabase-config.js  # Configuración
    └── SUPABASE_CONFIG → Credenciales y modo
```

---

### Agregar una Nueva Funcionalidad

**Ejemplo: Agregar campo "proveedor" a materiales**

1. **Modificar HTML** (index.html):
```html
<div class="form-group">
    <label>Proveedor</label>
    <input type="text" id="material-supplier">
</div>
```

2. **Modificar Storage** (js/app.js):
```javascript
async handleSaveMaterial() {
    const material = {
        // ... campos existentes
        supplier: document.getElementById('material-supplier').value.trim()
    };
    await Storage.saveMaterial(material);
}
```

3. **Modificar Base de Datos** (Supabase SQL):
```sql
ALTER TABLE materials ADD COLUMN supplier TEXT;
```

4. **Modificar UI** (js/ui.js):
```javascript
renderMaterials(materials) {
    // Agregar columna de proveedor
    html += `<td>${material.supplier || '-'}</td>`;
}
```

---

### Hacer Deploy a GitHub Pages

1. **Commit tus cambios:**
```bash
git add .
git commit -m "feat: Descripción del cambio"
git push origin main
```

2. **Configurar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

3. **Espera 2-3 minutos**
4. **Accede a:** https://tu-usuario.github.io/BonitasCreaciones/

---

### Cambiar el Modo (Local ↔ Supabase)

En `js/supabase-config.js`:

```javascript
// Modo LocalStorage (sin internet)
const SUPABASE_CONFIG = {
    url: '',
    anonKey: '',
    useSupabase: false  // 👈 false = Local
};

// Modo Supabase (con sincronización)
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    anonKey: 'tu-anon-key...',
    useSupabase: true  // 👈 true = Supabase
};
```

---

### Migrar de LocalStorage a Supabase

1. **Exporta tus datos locales:**
   - En la app, ve a Configuración
   - Click en "Exportar Datos"
   - Guarda el JSON

2. **Activa Supabase:**
   - Configura credenciales en `supabase-config.js`
   - Cambia `useSupabase: true`

3. **Importa manualmente** (por ahora):
   - Abre el JSON exportado
   - Crea los materiales/productos uno por uno en la app
   - O ejecuta SQL para importar masivamente

---

### Agregar Logo Personalizado

1. **Prepara tu imagen:**
   - Formato: PNG con fondo transparente
   - Tamaño recomendado: 200x200px
   - Peso máximo: 100KB

2. **Guarda en la carpeta images:**
   ```
   images/logo.png
   ```

3. **El HTML ya está configurado:**
   ```html
   <img src="images/logo.png" alt="Bonitas Creaciones" class="logo">
   ```

4. **Regenera el favicon:**
   - Ve a: https://favicon.io/favicon-converter/
   - Sube tu logo
   - Descarga favicon.ico
   - Guarda en: `images/BonitasCreaciones.ico`

---

### Backup de Datos

#### Backup Automático (Supabase)
- ✅ Supabase hace backups diarios automáticamente
- ✅ Puedes restaurar desde el dashboard

#### Backup Manual (Exportar)
1. En la app, click en "Exportar Datos"
2. Guarda el JSON en un lugar seguro
3. Para restaurar: importa manualmente

#### Backup desde Supabase (SQL)
```sql
-- Exportar todos tus materiales
COPY (SELECT * FROM materials WHERE user_id = 'TU_USER_ID') 
TO '/tmp/materials_backup.csv' CSV HEADER;

-- Exportar todos tus productos
COPY (SELECT * FROM products WHERE user_id = 'TU_USER_ID') 
TO '/tmp/products_backup.csv' CSV HEADER;
```

---

### Personalizar Colores

En `css/style.css`, busca las variables CSS:

```css
:root {
    --primary: #FFB3BA;      /* Rosa coral principal */
    --primary-dark: #FF9AA2; /* Rosa coral oscuro */
    --secondary: #FFDAC1;    /* Durazno */
    --accent: #E2F0CB;       /* Verde menta suave */
    --text: #1A1A1A;         /* Texto oscuro */
    --bg: #F8F9FA;           /* Fondo claro */
}
```

Cambia los valores hexadecimales por tus colores preferidos.

---

## 📊 Estadísticas y Métricas

### Ver Estadísticas en Supabase

```sql
-- Total de usuarios registrados
SELECT COUNT(*) FROM auth.users;

-- Usuarios activos (con materiales)
SELECT COUNT(DISTINCT user_id) FROM materials;

-- Total de materiales en el sistema
SELECT COUNT(*) FROM materials;

-- Total de productos en el sistema
SELECT COUNT(*) FROM products;

-- Usuario con más materiales
SELECT 
    up.username,
    COUNT(m.id) as total_materials
FROM user_profiles up
JOIN materials m ON m.user_id = up.id
GROUP BY up.id, up.username
ORDER BY total_materials DESC
LIMIT 1;
```

---

## 🔗 Enlaces Útiles

- **App en Producción:** https://takuas77.github.io/BonitasCreaciones/
- **Repositorio GitHub:** https://github.com/Takuas77/BonitasCreaciones
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Documentación Supabase:** https://supabase.com/docs

---

## 📝 Notas Finales

### Archivos de Documentación Obsoletos

Los siguientes archivos en `doc/` están **obsoletos**:
- ❌ `SOLUCION_ERRORES_SUPABASE.md`
- ❌ `LOGIN_CON_USERNAME.md`
- ❌ `SUPABASE_SETUP.md`
- ❌ `IMPLEMENTACION_LOGIN.md`
- ❌ `INSTRUCCIONES_LOGO.md`
- ❌ `DATABASE_SETUP.md` (versión antigua)

**Usa solo:** `DOCUMENTACION_COMPLETA.md` (este archivo)

### SQL Actualizado

Usa únicamente:
- ✅ `supabase_schema_completo.sql` - Schema completo
- ✅ `supabase_migracion.sql` - Migración de usuarios

---

## ✅ Checklist de Implementación Completa

- [ ] Creé cuenta en Supabase
- [ ] Creé proyecto en Supabase
- [ ] Copié credenciales a `supabase-config.js`
- [ ] Ejecuté `supabase_schema_completo.sql`
- [ ] Verifiqué que las 5 tablas existen
- [ ] Cambié `useSupabase: true`
- [ ] Hice deploy a GitHub Pages
- [ ] Creé mi cuenta de usuario
- [ ] Probé login con username ✅
- [ ] Probé login con email ✅
- [ ] Creé materiales de prueba
- [ ] Creé productos de prueba
- [ ] Registré producción
- [ ] Verifiqué que el stock se descuenta
- [ ] Probé F5 (recarga) y todo funciona
- [ ] Los datos persisten en Supabase ✅

---

## 🎉 ¡Felicidades!

Tu aplicación está completamente configurada y lista para usar. 

**¿Necesitas ayuda?**
- Revisa la sección "Solución de Problemas"
- Abre un issue en GitHub
- Consulta la documentación de Supabase

---

**Bonitas Creaciones** - Calculadora de Costos © 2025
