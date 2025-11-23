# 🎒 Bonitas Creaciones - Calculadora de Costos

**Aplicación web completa para gestión de costos, producción, inventario y ventas**

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)](https://takuas77.github.io/BonitasCreaciones/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/backend-Supabase-green)](https://supabase.com)
[![Version](https://img.shields.io/badge/version-2.0-blue)](https://github.com/Takuas77/BonitasCreaciones)

---

## 🚀 Acceso Rápido

**[🌐 Abrir Aplicación](https://takuas77.github.io/BonitasCreaciones/)**

---

## ✨ Características Destacadas

### Core
- 🔐 **Autenticación completa** - Login con username o email
- 💰 **Calculadora de costos** - Calcula automáticamente el costo de producción
- 📦 **Control de inventario** - Gestiona stock de materiales con alertas
- 🏷️ **Gestión de productos** - Crea productos con recetas personalizadas

### Nuevo en v2.0 ⭐
- 💵 **Módulo de Ventas** - Registra y gestiona todas tus ventas
- � **Estadísticas en tiempo real** - Ventas, ingresos y ganancias del mes
- 🔍 **Filtros avanzados** - Por período, producto o cliente
- 💹 **Análisis de rentabilidad** - Costo, ganancia y margen por venta

### Otras Funcionalidades
- �📊 **Historial completo** - Producción, ventas y cambios de precio
- 🎨 **Galería de productos** - Imágenes y catálogo compartible
- ☁️ **Sincronización en la nube** - Datos seguros en Supabase
- 📱 **Responsive** - Funciona en móvil, tablet y desktop

---

## 📚 Documentación

**[📖 Ver Documentación Completa](doc/DOCUMENTACION.md)**

La documentación unificada incluye:
- ✅ Guía de instalación y configuración
- ✅ Configuración de Supabase paso a paso
- ✅ Estructura completa de base de datos (incluye tabla `sales`)
- ✅ Sistema de autenticación
- ✅ Guía de uso de todos los módulos
- ✅ **Módulo de Ventas - Guía completa** ⭐
- ✅ **Sistema de Vistas Modulares** ⭐⭐ NUEVO
- ✅ Solución de problemas
- ✅ Guía de desarrollo

---

## 🎯 Inicio Rápido

### Usar la Aplicación (Sin Instalación)

1. Ve a: **https://takuas77.github.io/BonitasCreaciones/**
2. Crea una cuenta nueva
3. ¡Empieza a gestionar tu emprendimiento!

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/Takuas77/BonitasCreaciones.git
cd BonitasCreaciones

# Abrir en navegador
open index.html  # Mac
start index.html # Windows
xdg-open index.html # Linux
```

### Configurar Supabase (Opcional pero Recomendado)

Para sincronización en la nube:

1. Crea cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto (GRATIS)
3. Ejecuta el SQL: `database/migracion_completa.sql` ⭐
4. Configura credenciales en `js/supabase-config.js`
5. Cambia `useSupabase: true`

**[📖 Guía completa de configuración](doc/DOCUMENTACION.md#configuración-de-supabase)**

---

## 💡 Funcionalidades

### 📦 Materiales
- Crear, editar y eliminar materiales
- Control de stock con alertas
- Categorías personalizables
- Unidades de medida con conversión
- Historial de cambios de precio
- Búsqueda y filtrado

### 🏷️ Productos
- Crear productos con recetas
- Calculadora de margen/precio bidireccional
- Imágenes de productos
- Galería visual
- Compartir catálogo
- Categorías personalizadas

### � Ventas (NUEVO v2.0) ⭐
- Registrar ventas con todos los detalles
- Cálculo automático de totales y ganancias
- Estadísticas en tiempo real (ventas, ingresos, ganancia del mes)
- Filtros por período (hoy, semana, mes, año)
- Búsqueda por producto o cliente
- Análisis de rentabilidad por venta

### �📊 Producción y Reportes
- Registrar producción (descuenta stock automáticamente)
- Historial completo de producción y ventas
- Estadísticas de ganancias
- Exportar datos a JSON/CSV
- Dashboard con métricas clave

### 🔐 Autenticación
- Registro de usuarios con email
- Login con username o email
- Sesiones persistentes
- Modo dual: LocalStorage o Supabase
- Validaciones de seguridad

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6 (Vanilla)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: LocalStorage como fallback
- **Hosting**: GitHub Pages
- **Diseño**: Glassmorphism, colores de marca

---

## 📁 Estructura del Proyecto

```
BonitasCreaciones/
├── index.html                      # Página principal
├── manifest.json                   # PWA config
├── README.md                       # Este archivo
├── css/
│   └── style.css                  # Estilos completos
├── js/
│   ├── app.js                     # Lógica principal
│   ├── ui.js                      # Renderizado UI
│   ├── storage.js                 # Persistencia de datos
│   ├── sales.js                   # Módulo de ventas ⭐
│   ├── auth.js                    # Autenticación
│   ├── supabase-client.js         # Cliente Supabase
│   └── supabase-config.js         # Configuración Supabase
├── images/
│   ├── logo.png                   # Logo
│   └── BonitasCreaciones.ico      # Favicon
├── database/
│   └── migracion_completa.sql     # 📖 Schema completo (incluye ventas) ⭐
└── doc/
    └── DOCUMENTACION.md           # 📖 Documentación completa unificada ⭐
```

---

## 🚀 Deploy

### GitHub Pages (Automático)

1. Fork este repositorio
2. Ve a Settings → Pages
3. Source: Deploy from branch `main`
4. ¡Listo! Tu app estará en: `https://tu-usuario.github.io/BonitasCreaciones/`

### Configurar Supabase

```bash
# 1. Edita js/supabase-config.js
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    anonKey: 'tu-anon-key...',
    useSupabase: true
};

# 2. Commit y push
git add .
git commit -m "feat: Configurar Supabase"
git push origin main

# 3. Espera 2-3 minutos para deploy automático
```

---

## 🐛 Solución de Problemas

### "Usuario no encontrado"
- Intenta con tu email en lugar del username
- Verifica que el perfil exista en `user_profiles` (Supabase)

### "Los datos no se sincronizan"
- Verifica que `useSupabase: true` en `supabase-config.js`
- Verifica credenciales de Supabase
- Revisa consola del navegador (F12) para errores

### "Los botones no funcionan después de F5"
- Actualiza a la última versión: `git pull origin main`
- Limpia caché del navegador

**[📖 Ver soluciones completas](DOCUMENTACION_COMPLETA.md#solución-de-problemas)**

---

## 📖 Guías y Tutoriales

- **[Documentación Completa](DOCUMENTACION_COMPLETA.md)** - Todo en un solo lugar
- **[Configurar Supabase](DOCUMENTACION_COMPLETA.md#configuración-de-supabase)** - Paso a paso
- **[Estructura de BD](DOCUMENTACION_COMPLETA.md#estructura-de-base-de-datos)** - Schema completo
- **[Sistema de Auth](DOCUMENTACION_COMPLETA.md#sistema-de-autenticación)** - Cómo funciona
- **[Desarrollo](DOCUMENTACION_COMPLETA.md#desarrollo-y-mantenimiento)** - Agregar funcionalidades

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 👨‍💻 Autor

**Alejandro** - [GitHub](https://github.com/Takuas77)

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend as a Service
- [GitHub Pages](https://pages.github.com/) - Hosting gratuito
- Comunidad de desarrolladores

---

## 📞 Soporte

¿Necesitas ayuda?
- 📖 Lee la [Documentación Completa](DOCUMENTACION_COMPLETA.md)
- 🐛 Reporta un [Issue](https://github.com/Takuas77/BonitasCreaciones/issues)
- 💬 Únete a [Supabase Discord](https://discord.supabase.com/)

---

## ⭐ Si te gusta este proyecto, dale una estrella!

**Hecho con ❤️ para emprendedores**
