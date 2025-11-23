# 🔧 Fix: Errores de Registro y Redirección

## Problemas Encontrados

1. ❌ Error 406: Query a `user_profiles` mal formada
2. ❌ Error 500: Fallo en signup de Supabase  
3. ❌ Error 401: Sin autorización para insertar en `user_profiles`
4. ❌ Redirect incorrecto: Redirige a `localhost:3000` en lugar de GitHub Pages

---

## ✅ Soluciones Implementadas

### 1. Creación de Perfil Automática

**Antes:** El código intentaba crear el perfil inmediatamente después del registro, pero fallaba porque el usuario no estaba autenticado (RLS bloqueaba la inserción).

**Ahora:** El perfil se crea automáticamente la primera vez que el usuario inicia sesión:

```javascript
// En checkAuthState() y handleLogin()
await this.ensureUserProfile(user);
```

Esta función:
- ✅ Verifica si el perfil existe
- ✅ Si no existe, lo crea automáticamente
- ✅ Usa los datos de `user_metadata` (name, username)
- ✅ Funciona porque el usuario ya está autenticado

---

### 2. emailRedirectTo Configurado

Ahora el registro incluye la URL correcta:

```javascript
await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo: 'https://takuas77.github.io/BonitasCreaciones/',
        data: { name, username }
    }
});
```

---

### 3. Configuración en Supabase

**IMPORTANTE:** Debes configurar la URL en Supabase Dashboard.

#### Paso 1: Agregar URL de Redirección

1. Ve a tu proyecto: https://supabase.com/dashboard/project/rrmjhtqpkdakagzbtkxi
2. Ve a **Authentication** → **URL Configuration**
3. En **Redirect URLs**, agrega:
   ```
   https://takuas77.github.io/BonitasCreaciones/
   ```
4. Click en **Save**

#### Paso 2: Configurar Site URL

1. En la misma página, busca **Site URL**
2. Cambia de `http://localhost:3000` a:
   ```
   https://takuas77.github.io/BonitasCreaciones/
   ```
3. Click en **Save**

---

### 4. Política RLS Simplificada (Opcional)

Si aún tienes problemas con RLS, ejecuta este SQL en Supabase:

```sql
-- Eliminar política antigua
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Crear política que permite inserts cuando el usuario está autenticado
CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
```

Esto ya está incluido en `supabase_fix_rls.sql`.

---

## 🧪 Probar los Cambios

### Paso 1: Subir código actualizado

```bash
git add .
git commit -m "fix: Registro con creación automática de perfil y redirect correcto"
git push
```

### Paso 2: Esperar deploy (2-3 minutos)

### Paso 3: Probar registro

1. Ve a: https://takuas77.github.io/BonitasCreaciones/
2. Click en "Regístrate aquí"
3. Completa el formulario
4. Click en "Registrarse"
5. Verás: ✅ "¡Cuenta creada! Revisa tu email para confirmar tu cuenta"
6. **Revisa tu email**
7. Click en el link de confirmación
8. Deberías ser redirigido a: `https://takuas77.github.io/BonitasCreaciones/`
9. **Inicia sesión** con tu email y contraseña
10. ✅ El perfil se crea automáticamente al hacer login

### Paso 4: Verificar en Supabase

1. Ve a **Table Editor** → `user_profiles`
2. Deberías ver tu perfil creado con tu username

---

## 🔍 Logs Esperados

**En la consola (F12):**

```
✓ Supabase inicializado correctamente
🔐 Modo: Supabase Auth
✓ Perfil creado automáticamente para: Jonathan
Materiales cargados desde Supabase: 0
Productos cargados desde Supabase: 0
```

---

## 🐛 Si Aún Hay Errores

### Error: "User already registered"
**Solución:** El email ya está registrado. Usa otro email o intenta iniciar sesión.

### Error: "Invalid login credentials"
**Solución:** 
- Confirma tu email primero (revisa bandeja de entrada y spam)
- Verifica que estés usando el email correcto
- La contraseña es sensible a mayúsculas/minúsculas

### El perfil no se crea
**Solución:**
1. Abre consola (F12)
2. Busca mensajes de error
3. Verifica que la política RLS esté correcta:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
   ```

### Aún redirige a localhost
**Solución:**
- Verifica que cambiaste la **Site URL** en Supabase
- Limpia caché del navegador
- Prueba en modo incógnito

---

## ✅ Checklist de Configuración

- [ ] Código actualizado subido a GitHub
- [ ] Esperé 2-3 minutos para deploy
- [ ] Configuré **Redirect URLs** en Supabase
- [ ] Configuré **Site URL** en Supabase
- [ ] Probé registro con email nuevo
- [ ] Confirmé email desde bandeja de entrada
- [ ] Click en link de confirmación
- [ ] Fui redirigido a GitHub Pages (no localhost)
- [ ] Inicié sesión correctamente
- [ ] Verifiqué que el perfil existe en `user_profiles`
- [ ] Creé un material de prueba
- [ ] Recargué la página (F5) y todo funciona

---

## 📝 Resumen de Cambios

### auth.js
- ✅ Nueva función `ensureUserProfile()` - Crea perfil automáticamente
- ✅ `checkAuthState()` - Llama a `ensureUserProfile` al verificar sesión
- ✅ `handleLogin()` - Llama a `ensureUserProfile` después del login
- ✅ `handleRegister()` - Simplificado, NO intenta crear perfil inmediatamente
- ✅ `emailRedirectTo` configurado con GitHub Pages URL

### Supabase
- ✅ Redirect URLs: Agregar GitHub Pages URL
- ✅ Site URL: Cambiar de localhost a GitHub Pages

---

¡Ahora debería funcionar correctamente! 🎉
