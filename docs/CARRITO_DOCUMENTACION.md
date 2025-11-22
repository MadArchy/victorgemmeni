# Sistema de Carrito de Compras - GLAMOUR NYM

## Descripción General

Se ha implementado un sistema completo de carrito de compras sin modificar el código existente de la tienda GLAMOUR NYM. El sistema utiliza localStorage para persistencia de datos y proporciona una interfaz completa para agregar, modificar y gestionar productos en el carrito.

---

## Archivos del Sistema

### carrito-unificado.js

Archivo JavaScript unificado que contiene:

#### Clase Carrito

Gestiona todos los datos y operaciones del carrito con almacenamiento en localStorage.

**Métodos**:

- `cargarDelStorage()` - Carga items de localStorage
- `guardarEnStorage()` - Guarda items en localStorage
- `agregarProducto(nombre, precio, talla, cantidad)` - Agrega un producto
- `generarId()` - Genera ID único para cada item
- `obtenerItems()` - Retorna todos los items
- `obtenerCantidadTotal()` - Retorna cantidad total de items
- `obtenerTotal()` - Calcula el total del carrito
- `extraerNumeroDelPrecio(precioText)` - Extrae número del formato precio
- `eliminarItem(id)` - Elimina un item específico
- `actualizarCantidad(id, nuevaCantidad)` - Actualiza cantidad de un item
- `vaciar()` - Limpia todo el carrito
- `formatearMoneda(numero)` - Formatea números como moneda

#### Instancia Global

- `carritoGlobal` - Instancia única del carrito disponible globalmente

#### Funciones Auxiliares

- `agregarAlCarrito(nombre, precio, talla, cantidad)` - Agrega producto desde catalogo.html
- `actualizarBadgeCarrito()` - Actualiza el contador en la navegación
- `mostrarNotificacionCarrito(nombreProducto, cantidad)` - Muestra toast de confirmación

#### Funcionalidad de carrito.html

- `renderizarCarrito()` - Renderiza tabla de productos
- `actualizarResumen()` - Actualiza totales y cantidades
- `vaciarCarrito()` - Vacía todo el carrito con confirmación
- `procederAlPago()` - Simula proceso de pago
- `generarNumeroOrden()` - Genera número de orden único
- `escapeHtml(unsafe)` - Protección contra XSS

---

## localStorage

**Clave**: `carritoGLAMOUR`

**Formato**: Array JSON de objetos producto

**Estructura de item**:

```javascript
{
  id: "item_1234567890_abc123",
  nombre: "Jean Mujer",
  precio: "$94.900",
  talla: "M",
  cantidad: 2,
  fechaAgregado: "2025-11-18T14:30:00.000Z"
}
```

---

## Características Principales

✅ **Almacenamiento persistente** - Los datos se guardan en localStorage
✅ **Badge contador** - Muestra número de items en navegación
✅ **Agregar productos** - Se agregan automáticamente desde catalogo.html
✅ **Tabla interactiva** - Ver todos los productos
✅ **Editar cantidades** - Cambiar cantidad en tiempo real
✅ **Eliminar productos** - Remover items específicos
✅ **Vaciar carrito** - Limpiar todo con confirmación
✅ **Cálculo automático** - Subtotal, envío y total
✅ **Cálculo de envío** - 5% del subtotal (mínimo $5000)
✅ **Notificaciones** - Toast verde al agregar productos
✅ **Proceder al pago** - Genera número de orden único
✅ **Responsive design** - Funciona en móvil y escritorio
✅ **Seguridad XSS** - Escapado de caracteres HTML

---

## Flujo de Usuario

... (contenido resumido)
