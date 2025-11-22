# GLAMOUR NYM - Documentación Técnica Completa

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Componentes Principales](#componentes-principales)
4. [Sistema de Carrito](#sistema-de-carrito)
5. [Menú Hamburguesa](#menú-hamburguesa)
6. [Buenas Prácticas Implementadas](#buenas-prácticas-implementadas)
7. [Guía de Desarrollo]

---

## 📱 Descripción General

**GLAMOUR NYM** es una plataforma de comercio electrónico especializada en la venta de pantalones premium. El proyecto implementa:

- ✅ Sistema de carrito de compras con persistencia en `localStorage`
- ✅ Menú hamburguesa responsive con animaciones fluidas
- ✅ Interfaz accesible con ARIA attributes
- ✅ Validación de formularios con UX mejorada
- ✅ Diseño mobile-first con breakpoints estratégicos
- ✅ Sin dependencias externas (vanilla JavaScript/CSS)

**Tecnologías:**

- HTML5 semántico
- CSS3 (Flexbox, Grid, Animations, Media Queries)
- JavaScript ES6+ (sin frameworks)
- localStorage API para persistencia

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
proyecto2/
├── index.html              # Página principal (home)
├── catalogo.html           # Catálogo de productos
├── contacto.html           # Formulario de contacto
├── carrito.html            # Página del carrito de compras
├── test-hamburger.html     # Página de prueba del menú
│
├── main.js                 # Interactividad general + menú hamburguesa
├── catalogo.js             # Lógica específica del catálogo
├── carrito-unificado.js    # Sistema completo de carrito
│
├── styles.css              # Estilos únicos para toda la app
│
├── img/                    # Carpeta de imágenes
│   ├── Logo.jpeg
│   ├── H1.jpeg, H2.jpeg, H3.jpeg    # Productos hombre
│   ├── M1.jpeg, M2.jpeg, M3.jpeg    # Productos mujer
│   └── IMP 2.jpg, H2.jpeg           # Banners
│
└── Documentación
    ├── README.md
    ├── DOCUMENTATION.md
    ├── CARRITO_DOCUMENTACION.md
    ├── DOCUMENTACION_TECNICA.md (este archivo)
    ├── CHANGELOG.md
    ├── VERSION
    └── RELEASE_NOTES.md
```

### Diagrama de Dependencias

```
index.html ─┐
catalogo.html ├─→ main.js (menú + validación)
contacto.html─┤    └─→ carrito-unificado.js (carrito global)
carrito.html ─┤    └─→ catalogo.js (modal de compra)
              └─→ styles.css (estilos únicos)
```

---

## 🎯 Componentes Principales

### 1. Navegación y Menú Hamburguesa (`main.js`)

#### Función: `closeMenu()`

```javascript
/**
 * Cierra el menú de navegación y restaura el estado normal
 *
 * Operaciones realizadas:
 * - Remove la clase 'open' del menú (.nav-links)
 * - Remove la clase 'open' del botón hamburguesa (.nav-toggle)
 * - Actualiza aria-expanded a false (accesibilidad)
 * - Restaura etiqueta ARIA a "Abrir menú"
 * - Remueve overflow:hidden del body (permite scroll nuevamente)
 *
 * Beneficio: Garantiza que el menú queda completamente cerrado
 * y el estado visual es consistente con el estado lógico.
 *
 * Buena práctica: Centralizar lógica de cierre en una función
 * evita duplicación de código y facilita mantenimiento.
 */
function closeMenu() {
  navLinks.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
  document.body.style.overflow = "";
}
```

**Parámetros:** Ninguno  
**Retorna:** void  
**Efectos secundarios:** Modifica DOM y estado visual

---

#### Función: `openMenu()`
