# Calculadora de Costos para Cartucheras

Aplicación web para gestión de costos, producción e inventario de un micro-emprendimiento de cartucheras.

## Características Principales

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

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño glassmorphism moderno
- **JavaScript Vanilla**: Sin frameworks, código modular
- **LocalStorage**: Persistencia de datos local

## Estructura del Proyecto

```
calculadora_costos/
├── index.html          # Estructura principal
├── css/
│   └── style.css      # Estilos glassmorphism
├── js/
│   ├── app.js         # Lógica de la aplicación
│   ├── storage.js     # Manejo de datos LocalStorage
│   └── ui.js          # Renderizado de interfaz
└── README.md          # Este archivo
```

## Cómo Usar

1. Abre `index.html` en tu navegador
2. Comienza agregando materiales desde la vista "Materiales"
3. Crea productos con sus recetas en la vista "Productos"
4. Registra producciones cuando fabriques cartucheras
5. Monitorea tu negocio desde el Dashboard

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

## Tips de Uso

1. **Stock Bajo**: Mantén siempre más de 5 unidades para evitar alertas
2. **Márgenes**: Los márgenes típicos van del 50% al 150% según el producto
3. **Historial**: Revisa regularmente el top de materiales consumidos para compras inteligentes
4. **Backup**: Exporta tus datos regularmente como respaldo
5. **Pedidos Grandes**: Usa la calculadora bulk antes de comprometerte con pedidos grandes

## Autor

Desarrollado para un micro-emprendimiento de cartucheras artesanales.

---

**Versión**: 2.0  
**Última actualización**: 2024
