# 🔐 Configuración de Supabase para Bonitas Creaciones

## ¿Qué es Supabase?

Supabase es una plataforma de backend que proporciona:
- 🔒 Autenticación de usuarios segura
- 💾 Base de datos PostgreSQL
- ☁️ Almacenamiento en la nube
- 🔄 Sincronización en tiempo real

**Es GRATIS para proyectos pequeños** (hasta 50,000 usuarios activos/mes)

---

## 📋 Paso 1: Crear una cuenta en Supabase

1. Ve a https://supabase.com
2. Haz clic en **"Start your project"**
3. Regístrate con tu email de GitHub o Google

---

## 🚀 Paso 2: Crear un nuevo proyecto

1. En el dashboard de Supabase, haz clic en **"New Project"**
2. Completa los datos:
   - **Name**: Bonitas Creaciones (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala)
   - **Region**: Selecciona la región más cercana (ej: South America)
   - **Pricing Plan**: Free (gratis)
3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras se crea tu proyecto

---

## 🔑 Paso 3: Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** (icono de engranaje en la barra lateral)
2. Selecciona **API** en el menú de la izquierda
3. Encontrarás dos valores importantes:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
   ```

4. Copia estos dos valores

---

## ⚙️ Paso 4: Configurar tu aplicación

1. Abre el archivo `js/supabase-config.js`
2. Reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxxxxxxxxx.supabase.co', // 👈 Pega tu Project URL aquí
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...', // 👈 Pega tu anon key aquí
    useSupabase: true // 👈 Cambia a true para activar Supabase
};
```

3. Guarda el archivo

---

## 🛠️ Paso 5: Configurar la autenticación en Supabase

1. En tu proyecto de Supabase, ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. **Configuración recomendada**:
   - Settings → Authentication → Email Auth
   - ✅ Activa "Enable email confirmations" para mayor seguridad
   - O desactívalo si prefieres registro instantáneo
4. La app usa emails reales que proporciona el usuario
5. Puedes configurar plantillas de email personalizadas

---

## 📧 Paso 6: Configurar emails (recomendado)

Para que los emails de confirmación y recuperación funcionen:

1. Ve a **Settings** → **Authentication** → **Email Templates**
2. Configura un proveedor SMTP personalizado (opcional pero recomendado)
3. Personaliza los templates de:
   - Confirmación de cuenta
   - Recuperación de contraseña
   - Cambio de email
4. Por defecto, Supabase envía emails desde su dominio

---

## 🎨 Paso 7: Crear tabla para datos de la app (opcional)

Si quieres guardar materiales y productos en Supabase:

1. Ve a **Table Editor**
2. Crea una tabla `user_data`:
   ```sql
   CREATE TABLE user_data (
       id uuid references auth.users primary key,
       materials jsonb,
       products jsonb,
       created_at timestamp default now(),
       updated_at timestamp default now()
   );
   ```

3. Habilita Row Level Security (RLS):
   ```sql
   -- Solo el usuario puede ver sus propios datos
   CREATE POLICY "Users can view own data"
   ON user_data FOR SELECT
   USING (auth.uid() = id);

   -- Solo el usuario puede insertar sus propios datos
   CREATE POLICY "Users can insert own data"
   ON user_data FOR INSERT
   WITH CHECK (auth.uid() = id);

   -- Solo el usuario puede actualizar sus propios datos
   CREATE POLICY "Users can update own data"
   ON user_data FOR UPDATE
   USING (auth.uid() = id);
   ```

---

## ✅ Paso 8: Probar la integración

1. Abre tu aplicación en el navegador
2. Verás en la consola: `🔐 Modo: Supabase Auth`
3. Crea una cuenta nueva
4. Revisa tu email para confirmar la cuenta
5. Inicia sesión

---

## 🔄 Cambiar entre Local Storage y Supabase

En `js/supabase-config.js`:

```javascript
useSupabase: false // Usa Local Storage (datos solo en tu navegador)
useSupabase: true  // Usa Supabase (datos en la nube, sincronizados)
```

---

## 🆘 Solución de problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon key`
- Asegúrate de que no haya espacios al inicio o final

### Error: "Email not confirmed" o "Email rate limit"
- Verifica tu bandeja de entrada y spam
- Confirma tu email haciendo clic en el enlace
- O deshabilita "Email confirmations" en Settings → Authentication para registro instantáneo

### Error: "Email already registered"
- Este email ya tiene una cuenta
- Intenta iniciar sesión en lugar de registrarte
- O usa otro email para crear una cuenta nueva

### Los datos no se guardan
- Verifica que `useSupabase` esté en `true`
- Revisa la consola del navegador para ver errores
- Asegúrate de haber creado las tablas necesarias (Paso 7)

---

## 📚 Recursos adicionales

- 📖 [Documentación de Supabase](https://supabase.com/docs)
- 🎥 [Videos tutoriales](https://www.youtube.com/c/supabase)
- 💬 [Discord de Supabase](https://discord.supabase.com/)

---

## 💡 Ventajas de usar Supabase

✅ **Gratis** para proyectos pequeños
✅ **Seguro** - autenticación profesional
✅ **Escalable** - crece con tu negocio
✅ **Respaldos automáticos** de tu base de datos
✅ **Multi-dispositivo** - accede desde cualquier lugar
✅ **Sin servidor** - no necesitas configurar infraestructura

---

## 🔒 Seguridad

- ✅ Las contraseñas se encriptan automáticamente
- ✅ Tokens JWT para sesiones seguras
- ✅ HTTPS en todas las conexiones
- ✅ Row Level Security para proteger datos

---

¿Necesitas ayuda? Contáctame o revisa la documentación oficial de Supabase.
