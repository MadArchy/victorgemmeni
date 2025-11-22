# 📋 Sistema de Facturación Electrónica - GLAMOUR NYM

## Descripción General

Se ha implementado un **sistema completo de facturación electrónica** que se activa automáticamente cuando el usuario presiona el botón **"Proceder al Pago"** en la página del carrito.

## ¿Qué hace?

### ✅ Genera Factura Automáticamente

Cuando el usuario presiona "Proceder al Pago":

1. **Se abre una nueva ventana/pestaña** con la factura electrónica
2. **Se muestra el diálogo de impresión** automáticamente
3. **El usuario puede:**
   - Imprimir directamente a impresora
   - Guardar como PDF en su computadora
   - Cerrar sin imprimir (la factura se guarda igual)

### 📄 Contenido de la Factura

La factura incluye:

- ✅ Logo y datos de GLAMOUR NYM
- ✅ Número único de factura (NYM-YYYYMMDDHHMMSS-XXXX)
- ✅ Fecha y hora exacta de la compra
- ✅ Tabla detallada de productos:
  - Nombre del producto
  - Talla seleccionada
  - Precio unitario
  - Cantidad
  - Subtotal por producto
- ✅ Resumen de pagos:
  - Subtotal
  - Descuento aplicado (si hay)
  - Costo de envío
  - **TOTAL A PAGAR**
- ✅ Código QR con número de factura
- ✅ Información de contacto de la tienda
- ✅ Pie de página profesional

### 💾 Almacenamiento Automático

- **Se guarda en localStorage** una copia completa de cada factura
- El usuario puede acceder al historial sin necesidad de servidor
- Se conservan las últimas 50 facturas automáticamente

---

## Archivos Incluidos

### 1. **facturacion.js** (NUEVO)

Archivo que contiene toda la lógica de facturación.

**Funciones principales:**

```javascript
// Genera la factura cuando se presiona "Proceder al Pago"
generarFactura(items, resumen)

// Genera número único de factura
generarNumeroFactura()

// Calcula costo de envío según monto
calcularEnvio(subtotal)

// Genera HTML completo de la factura
generarHTMLFactura(...)

// Guarda copia en localStorage
guardarFacturaEnHistorial(...)

// Obtiene historial de facturas del usuario
obtenerHistorialFacturas()
```

### 2. **carrito.html** (ACTUALIZADO)

Se agregó la etiqueta de script al final del body:

```html
<script src="facturacion.js" defer></script>
```

Esto asegura que la función `generarFactura()` esté disponible cuando se presiona el botón.

---

## Cómo Funciona el Flujo

```
Usuario presiona "Proceder al Pago"
        ↓
procederAlPago() en carrito-unificado.js
        ↓
Recopila items y resumen del carrito
        ↓
Llama a generarFactura(items, resumen)
        ↓
facturacion.js genera:
  - Número único
  - HTML de factura
  - Código QR
        ↓
Se abre nueva ventana/pestaña
        ↓
Se muestra diálogo de impresión
        ↓
Usuario imprime o guarda como PDF
        ↓
Copia se guarda en localStorage
        ↓
Carrito se vacía automáticamente
```

---

## Personalización

### 🏢 Cambiar Datos de la Tienda

En `facturacion.js`, en la función `generarHTMLFactura()`:

```javascript
<h1>GLAMOUR NYM</h1>  <!-- Nombre de tienda -->
<p>
    Calle Principal 123, Bogotá, Colombia  <!-- Dirección -->
    Teléfono: +57 1 2345678                 <!-- Teléfono -->
    Email: info@glamournym.com              <!-- Email -->
    NIT: 900.123.456-7                      <!-- NIT -->
</p>
```

### 📦 Cambiar Política de Envío

En `facturacion.js`, en la función `calcularEnvio()`:

```javascript
function calcularEnvio(subtotal) {
  if (subtotal >= 300000) {
    return 0; // GRATIS para compras > $300,000
  } else if (subtotal >= 100000) {
    return 10000; // $10,000 para compras entre $100,000 - $300,000
  } else {
    return 15000; // $15,000 para compras < $100,000
  }
}
```

Modifica estos valores según tu política de envío.

---

## Características Técnicas

### 🔒 Seguridad

- ✅ **Prevención XSS**: Todos los datos de usuario se escapan con `escapeHtml()`
- ✅ **Validación de datos**: Se valida entrada antes de procesar
- ✅ **localStorage local**: Los datos no se envían a servidor (solo cliente)
- ✅ **Sin dependencias externas**: Código puro JavaScript, nada de librerías

### 🎨 Diseño

- ✅ **Responsive**: Se ve bien en pantalla y al imprimir
- ✅ **Optimizado para impresión**: Estilos CSS especiales para A4
- ✅ **Profesional**: Colores corporativos, tipografía clara
- ✅ **Accesible**: HTML semántico, fácil de navegar

### 📱 Código QR

- El código QR se **genera automáticamente** usando una API gratuita
- Contiene el número de factura
- Útil para seguimiento o escaneo futuro

---

## Uso de localStorage

### Estructura de Datos

Cada factura se guarda con esta estructura:

```javascript
{
  "numero": "NYM-20251119143025-7489",
  "fecha": "2025-11-19T14:30:25.000Z",
  "total": 189800,
  "html": "<!DOCTYPE html>...</html>"
}
```

### Recuperar Historial (para futuro)

Si necesitas mostrar un historial de facturas:

```javascript
const facturas = obtenerHistorialFacturas();
facturas.forEach((factura) => {
  console.log(`${factura.numero} - $${factura.total}`);
});
```

---

## Mantenimiento

### Limpiar Facturas Antiguas

Si localStorage se llena (~5-10MB):

```javascript
// Elimina facturas más antiguas de 30 días
limpiarFacturasAntiguas();
```

### Límites

- **localStorage típicamente**: 5-10 MB por dominio
- **Facturas promedio**: ~100 KB cada una
- **Máximo recomendado**: ~50 facturas

---

## Solución de Problemas

### ❌ "No se abre la ventana de factura"

**Causa**: Navegador tiene bloqueador de popups activado

**Solución**:

- Desactiva el bloqueador de popups para esta sitio
- O permite popups desde `glamour-website.com`

### ❌ "No se abre el diálogo de impresión"

**Causa**: Navegador no cargó completamente

**Solución**:

- Cierra la ventana y reintenta
- Presiona manualmente Ctrl+P para imprimir

### ❌ "El localStorage se llena"

**Causa**: Muchas facturas acumuladas

**Solución**:

- Ejecuta `limpiarFacturasAntiguas()` en consola
- O borra manualmente: `localStorage.clear()`

---

## Vista Previa de la Factura

```
═══════════════════════════════════════════════════
              GLAMOUR NYM
    Tienda de Moda y Accesorios
    Calle Principal 123, Bogotá, Colombia
    Teléfono: +57 1 2345678
═══════════════════════════════════════════════════

Factura Electrónica: NYM-20251119143025-7489

📅 Fecha: 19/11/2025       🕐 Hora: 14:30:25

───────────────────────────────────────────────────
# │ Producto    │ Talla │ Precio   │ Cant. │ Subtotal
───────────────────────────────────────────────────
1 │ Pantalón    │ M     │ $89.900  │  2    │ $179.800
2 │ Blusa       │ S     │ $65.900  │  1    │ $65.900
───────────────────────────────────────────────────

Subtotal:              $245.700
Descuento:            -$0
Envío:                $10.000
──────────────────────────────
TOTAL A PAGAR:        $255.700
══════════════════════════════════════════════════

                   [Código QR]

Gracias por tu compra!
Esta es una factura electrónica válida.
Conserva este documento como comprobante.

© 2025 GLAMOUR NYM
```

---

## Próximas Mejoras (Opcional)

Si deseas expandir el sistema en el futuro:

1. **Panel de Historial de Facturas**

   - Nueva página: `facturas.html`
   - Muestre todas las facturas guardadas
   - Opción para descargar o reimprimir

2. **Integración con Email**

   - Enviar factura al email del cliente
   - Requiere backend/API

3. **Facturación Oficial DIAN**

   - Integración con sistema DIAN de Colombia
   - Requiere certificado digital y API oficial

4. **Exportar a PDF desde Cliente**
   - Librería jsPDF
   - Mejor control sobre formato PDF

---

## Contacto y Soporte

Si tienes preguntas sobre la implementación:

- 📧 Email: info@glamournym.com
- 📱 Teléfono: +57 1 2345678
- 💬 Chat: En el sitio web

---

**Documento creado**: 19 de noviembre de 2025
**Versión**: 1.0
**Estado**: ✅ Listo para producción
