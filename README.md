# 🎒 Bonitas Creaciones - Calculadora de Costos

Aplicación web completa para gestión de costos, producción e inventario de un micro-emprendimiento de cartucheras.

## 🌟 Características Principales

### 🔐 Autenticación de Usuarios
- **Sistema de login seguro**: Crea tu cuenta y protege tus datos
- **Registro completo**: Nombre, email, usuario y contraseña
- **Login flexible**: Inicia sesión con usuario o email
- **Sesión persistente**: Mantiene tu sesión activa
- **Modo local**: Datos guardados en tu navegador (LocalStorage)
- **Integración Supabase** (opcional): Sincroniza datos en la nube
  - Ver archivo [doc/SUPABASE_SETUP.md](doc/SUPABASE_SETUP.md) para configuración

### 📊 Dashboard
- Resumen financiero con ventas totales, costos y ganancias
- Contador de productos registrados
- Alertas de stock bajo
- Top 5 materiales más consumidos
- Historial de producción y ventas

### 🧵 Gestión de Materiales
- **Crear/Editar/Eliminar materiales**
- **Categorías**: Telas, Cierres, Forros, Accesorios, Hilos, Relleno, Otros
- **Múltiples unidades de medida**: Metro, Unidad, Gramos, Centímetros, etc.
- **Factor de conversión**: Para materiales con unidades alternativas
- **Control de stock**: Alertas automáticas cuando el stock es bajo (<5 unidades)
- **Búsqueda rápida**: Filtrar materiales por nombre
- **Filtro por categoría**: Ver solo materiales de una categoría específica
- **Historial de precios**: Registro automático de cambios en precios de materiales

### 🎒 Gestión de Productos
- **Crear/Editar/Eliminar productos**
- **Categorías**: Cartucheras, Neceseres, Mochilas, Porta Cosméticos, General
- **Imágenes de productos**: Sube fotos de cada producto (máx. 2MB)
- **Galería visual**: Vista de catálogo con todas las imágenes
- **Compartir catálogo**: Genera catálogo HTML para compartir con clientes
- **Receta de materiales**: Define qué materiales y cantidades se necesitan para cada producto
- **Cálculo automático de costos**: Suma automática del costo de todos los materiales
- **Precios flexibles**: 
  - Define un precio de venta fijo y ve el margen de ganancia calculado
  - O define un margen de ganancia deseado y ve el precio de venta sugerido
  - Cálculo bidireccional en tiempo real
- **Sin límite de margen**: Configura el margen de ganancia que necesites
- **Búsqueda rápida**: Filtrar productos por nombre
- **Filtro por categoría**: Ver solo productos de una categoría específica

### 📸 Galería y Catálogo
- **Subir imágenes**: Formatos JPG, PNG, WebP (máximo 2MB por imagen)
- **Vista previa**: Ve la imagen antes de guardar
- **Galería de productos**: Vista tipo grid con todas las imágenes
- **Catálogo compartible**: Genera catálogo HTML con imágenes y precios
- **Impresión**: Imprime el catálogo directamente
- **Imágenes en tarjetas**: Las fotos se muestran en las tarjetas de productos

### 🏭 Producción
- **Registro de producción**: Ingresa cuántas unidades producir
- **Verificación de stock**: Comprueba automáticamente si hay materiales suficientes
- **Deducción automática**: El stock de materiales se descuenta al producir
- **Registro de ventas**: Guarda precio de venta, ganancia y fecha
- **Historial completo**: Ve todas las producciones realizadas con sus ganancias

### 📦 Calculadora de Pedidos Grandes
- Calcula materiales necesarios para pedidos de múltiples unidades
- Compara stock disponible vs. necesario
- Identifica materiales faltantes
- Muestra costo total, precio de venta y ganancia del pedido
- Verifica si es posible producir el pedido completo

### 📤 Exportación de Datos
- **Exportar Materiales**: Descarga archivo CSV con todos los materiales
- **Exportar Productos**: Descarga archivo CSV con todos los productos
- **Exportar Historial**: Descarga archivo CSV con el historial de ventas
- **Exportar Todo**: Descarga archivo JSON completo con todos los datos

### 🔄 Actualizaciones Automáticas
- Al cambiar el precio de un material, todos los productos que lo usan se actualizan automáticamente
- Recálculo en tiempo real de costos y márgenes
- Notificaciones visuales de actualizaciones

### 🗑️ Gestión de Datos
- **Reiniciar Historial**: Limpia el historial de ventas y materiales consumidos (con confirmación)
- Todos los datos se guardan localmente en el navegador (LocalStorage)

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Diseño glassmorphism con colores de marca (rosa coral)
- **JavaScript ES6**: Código modular sin frameworks
- **LocalStorage API**: Persistencia de datos local
- **Supabase** (opcional): Backend en la nube para sincronización
- **Base64**: Codificación de imágenes para almacenamiento

## 📁 Estructura del Proyecto

```
calculadora_costos/
├── index.html                  # Estructura principal con auth
├── css/
│   └── style.css              # Estilos glassmorphism y brand
├── js/
│   ├── auth.js                # Sistema de autenticación
│   ├── app.js                 # Lógica de la aplicación
│   ├── storage.js             # Manejo de LocalStorage
│   ├── ui.js                  # Renderizado de interfaz
│   └── supabase-config.js     # Configuración de Supabase
├── images/
│   └── logo.png               # Logo de Bonitas Creaciones
├── README.md                  # Documentación principal
└── SUPABASE_SETUP.md          # Guía de configuración Supabase
```

## 🚀 Cómo Usar

### Primera vez

1. Abre `index.html` en tu navegador
2. **Crea una cuenta**:
   - Ingresa tu nombre completo
   - Proporciona un email válido
   - Elige un nombre de usuario (mínimo 3 caracteres)
   - Crea una contraseña segura (mínimo 6 caracteres)
   - Confirma tu contraseña
3. Haz clic en "Registrarse"

### Inicio de sesión

1. Ingresa tu usuario o email
2. Ingresa tu contraseña
3. Haz clic en "Iniciar Sesión"
4. ¡Listo! Accede a tu dashboard

### Uso diario

1. **Materiales**: Agrega tus materiales con precios y stock
2. **Productos**: Crea productos con sus recetas de materiales
3. **Producción**: Registra cuando fabriques cartucheras
4. **Dashboard**: Monitorea ventas, ganancias y stock
5. **Galería**: Agrega fotos y comparte tu catálogo

### Cerrar sesión

- Haz clic en el botón "Cerrar Sesión" en la esquina superior derecha

## Funcionalidades de Categorización

### Materiales
- **Telas**: Telas principales, lonas, cueros sintéticos
- **Cierres**: Cierres de todos los tamaños
- **Forros**: Telas para forros internos
- **Accesorios**: Hebillas, mosquetones, cintas
- **Hilos**: Hilos de coser de todos los tipos
- **Relleno**: Guatas, goma espuma
- **Otros**: Otros materiales no clasificados

### Productos
- **Cartucheras**: Cartucheras escolares, de oficina
- **Neceseres**: Neceseres para cosméticos, viaje
- **Mochilas**: Mochilas pequeñas, bandoleras
- **Porta Cosméticos**: Estuches especializados
- **General**: Otros productos

## 💡 Tips de Uso

1. **Email válido**: Usa un email real para configurar Supabase más adelante
2. **Login flexible**: Puedes iniciar sesión con tu usuario o email
3. **Contraseña segura**: Usa contraseñas de al menos 8 caracteres con números y símbolos
3. **Stock Bajo**: Mantén siempre más de 5 unidades para evitar alertas
4. **Márgenes**: Los márgenes típicos van del 50% al 150% según el producto
5. **Historial**: Revisa regularmente el top de materiales consumidos
6. **Backup**: Exporta tus datos regularmente como respaldo
7. **Pedidos Grandes**: Usa la calculadora bulk antes de comprometerte
8. **Imágenes**: Usa fotos de buena calidad para tu catálogo (máx. 2MB)
9. **Supabase**: Si quieres acceder desde múltiples dispositivos, configura Supabase
10. **Datos locales**: Los datos se guardan en tu navegador, no los borres con el historial

## 🔒 Seguridad y Privacidad

### Modo Local Storage (por defecto)
- ✅ Datos guardados solo en tu navegador
- ✅ No se envía información a servidores externos
- ✅ Contraseñas hasheadas localmente
- ⚠️ Si borras datos del navegador, pierdes la información
- ⚠️ Solo accesible desde ese navegador/dispositivo

### Modo Supabase (opcional)
- ✅ Datos sincronizados en la nube (encriptados)
- ✅ Acceso desde múltiples dispositivos
- ✅ Respaldos automáticos
- ✅ Autenticación profesional con JWT
- ✅ Row Level Security - solo ves tus datos
- 📖 Ver [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para activar

## 🆘 Solución de Problemas

### No puedo iniciar sesión
- Verifica usuario y contraseña
- Asegúrate de haber creado una cuenta primero
- Los datos son sensibles a mayúsculas/minúsculas

### Perdí mi contraseña
- En modo local: No hay recuperación (deberás crear nueva cuenta)
- En modo Supabase: Usa la función de recuperación de contraseña

### Se borraron mis datos
- Si limpiaste el historial del navegador, los datos se pierden
- Solución: Exporta regularmente tus datos (botón "Exportar Todo")
- Mejor opción: Configura Supabase para respaldo automático

### No se cargan las imágenes
- Verifica que el archivo sea menor a 2MB
- Formatos permitidos: JPG, PNG, WebP
- Si el problema persiste, prueba con otra imagen

### La app no funciona
- Asegúrate de tener JavaScript habilitado
- Usa un navegador moderno (Chrome, Firefox, Edge, Safari)
- Revisa la consola del navegador para errores (F12)

## 🎨 Personalización

### Colores de Marca
La app usa los colores de "Bonitas Creaciones":
- **Rosa Coral**: `#FFB3BA` y `#FF9AA2`
- **Negro**: `#1A1A1A`
- **Glassmorphism**: Efectos de vidrio translúcido

### Logo
- Ubicación: `images/logo.png`
- Reemplaza con tu propio logo manteniendo las proporciones

## 📈 Roadmap / Futuras Mejoras

- [ ] Dashboard con gráficos de ventas por mes
- [ ] Notificaciones de stock bajo por email
- [ ] Exportar catálogo a PDF
- [ ] App móvil (PWA)
- [ ] Múltiples monedas
- [ ] Cálculo de costos de envío
- [ ] Integración con WhatsApp Business

## 👤 Autor

Desarrollado para **Bonitas Creaciones**, micro-emprendimiento de cartucheras artesanales.

---

**Versión**: 3.0  
**Última actualización**: Noviembre 2024

## 📞 Soporte

¿Necesitas ayuda? 
- 📧 Contacta al desarrollador
- 📖 Lee la [Guía de Supabase](SUPABASE_SETUP.md)
- 🔍 Revisa la sección de solución de problemas
