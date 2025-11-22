# ⚡ INICIO RÁPIDO - Sistema de Facturación

**¿Qué se hizo?**

Se creó un **sistema automático de facturación electrónica** que genera una factura profesional (lista para imprimir) cada vez que un cliente presiona "Proceder a Pagar".

---

## 🚀 Cómo Funciona (3 pasos)

### 1️⃣ Cliente Presiona "Proceder a Pagar"

```
Usuario en carrito.html → Click en botón "Proceder al Pago"
```

### 2️⃣ Se Abre Factura Electrónica

```
Nueva ventana con factura profesional
Incluye: productos, precios, total, código QR
```

### 3️⃣ Cliente Imprime o Guarda

```
Presiona Ctrl+P o botón "Imprimir Factura"
Elige: Impresora o "Guardar como PDF"
```

---

## 📁 Archivos Nuevos Creados

| Archivo                        | Descripción            | Ubicación         |
| ------------------------------ | ---------------------- | ----------------- |
| **facturacion.js**             | Lógica principal       | Raíz del proyecto |
| **test-facturacion.html**      | Página de prueba       | Raíz del proyecto |
| **FACTURACION_ELECTRONICA.md** | Documentación completa | `docs/`           |
| **CAMBIOS_FACTURACION.md**     | Resumen técnico        | `docs/`           |

---

## ✅ Verificación Rápida

Abre tu navegador y ve a:

```
file:///c:/Users/Usuario/Desktop/proyecto2/test-facturacion.html
```

Deberías ver una página con botones para generar facturas de prueba.

---

## 🧪 Primer Uso - Prueba Ahora

### Opción A: Prueba Rápida (Recomendado)

1. **Abre** `test-facturacion.html`
2. **Presiona** "Generar Factura Simple"
3. **Se abrirá** nueva ventana con factura
4. **Presiona** Ctrl+P para imprimir/guardar como PDF

### Opción B: Prueba en Carrito Real

1. **Abre** `catalogo.html`
2. **Agrega** algunos productos al carrito
3. **Ve a** `carrito.html`
4. **Presiona** "Proceder al Pago"
5. **Se generará** factura con tus productos

---

## 📋 Lo Que Incluye la Factura

✅ Número único (NYM-20251119143025-7489)  
✅ Datos de GLAMOUR NYM  
✅ Fecha y hora exacta  
✅ Tabla de productos con precios  
✅ Subtotal, descuentos, envío  
✅ **TOTAL A PAGAR**  
✅ Código QR  
✅ Optimizada para impresión A4

---

## 🎨 Personalización

¿Quieres cambiar los datos de tu tienda?

**Abre:** `facturacion.js`  
**Busca:** "GLAMOUR NYM"  
**Cambia a:** Tu nombre, dirección, teléfono, NIT

```javascript
<h1>TU TIENDA AQUI</h1>
<p>
    Tu Dirección 123, Tu Ciudad
    Teléfono: +57 1 XXXX-XXXX
    Email: tuemail@tutienda.com
    NIT: XXX-XXX-XXX-X
</p>
```

---

## 🖨️ Opciones de Impresión

### Imprimir a Papel

```
Ctrl+P → Selecciona impresora → Presiona Imprimir
```

### Guardar como PDF

```
Ctrl+P → Cambiar destino a "Guardar como PDF" → Elige carpeta
```

### Guardar en la Nube

```
PDF → Google Drive / OneDrive / Dropbox
```

---

## 📱 ¿Dónde Se Guardan las Facturas?

Las facturas se guardan **automáticamente en el navegador** (localStorage):

- ✅ Se accede sin necesidad de servidor
- ✅ El cliente puede verlas después
- ✅ Se conservan ~50 facturas recientes

Para **ver historial**:

```javascript
// En consola del navegador (F12):
obtenerHistorialFacturas();
```

---

## ❌ Solución Rápida de Problemas

### "No se abre la ventana de factura"

→ **Solución**: Desactiva bloqueador de popups

### "No aparece el diálogo de impresión"

→ **Solución**: Recarga la página y reintenta

### "Quiero limpiar todas las facturas"

→ **Solución**: En `test-facturacion.html`, presiona "Limpiar Datos"

---

## 📊 Información Técnica

- **Lenguaje**: JavaScript vanilla (sin librerías)
- **Almacenamiento**: localStorage del navegador
- **Seguridad**: Prevención XSS en todos los datos
- **Impresión**: CSS optimizado para A4
- **QR**: Generado automáticamente vía API gratuita

---

## 🎯 Próximos Pasos

1. **Hoy**: Prueba `test-facturacion.html`
2. **Mañana**: Personaliza datos de tu tienda
3. **Próxima semana**: Prueba con clientes reales
4. **Futuro**: Considera mejoras (email, DIAN, etc)

---

## 📚 Documentación Completa

Para más detalles, lee:

- 📖 [`docs/FACTURACION_ELECTRONICA.md`](./docs/FACTURACION_ELECTRONICA.md)
- 🔧 [`docs/CAMBIOS_FACTURACION.md`](./docs/CAMBIOS_FACTURACION.md)

---

## 💡 Ejemplos

### Generador Factura Programáticamente

```javascript
const items = [{ nombre: "Pantalón", precio: 89900, talla: "M", cantidad: 2 }];

const resumen = {
  subtotal: 179800,
  descuento: 0,
};

generarFactura(items, resumen);
```

### Obtener Historial

```javascript
const facturas = obtenerHistorialFacturas();
console.log(`Total facturas: ${facturas.length}`);
facturas.forEach((f) => {
  console.log(`${f.numero} - $${f.total}`);
});
```

---

## ✨ ¿Qué Sigue?

Tu tienda ahora tiene:

- ✅ Carrito de compras funcional
- ✅ Catálogo de productos
- ✅ **Facturación electrónica automática** ← NUEVO!
- ✅ Historial de compras local
- ✅ Impresión optimizada

**¡Listo para vender! 🎉**

---

**Documento**: Quick Start - Facturación Electrónica  
**Creado**: 19 de noviembre de 2025  
**Estado**: ✅ Listo para usar
