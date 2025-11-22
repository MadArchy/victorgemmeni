# GLAMOUR NYM - Documentación Completa del Proyecto

**Sitio de comercio electrónico especializado en venta de pantalones premium**

---

## 📑 Índice

1. [Inicio Rápido](#inicio-rápido)
2. [Características Principales](#características-principales)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes Técnicos](#componentes-técnicos)
5. [Funcionalidades Detalladas](#funcionalidades-detalladas)
6. [Buenas Prácticas Implementadas](#buenas-prácticas-implementadas)
7. [Guía de Uso](#guía-de-uso)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación ni servidor
- Funciona localmente abriendo archivos HTML directamente

### Primeros Pasos

```bash
1. Abre catalogo.html en tu navegador
2. Explora los productos disponibles
3. Click en "Comprar" para agregar al carrito
4. Ve a carrito.html para revisar compra
5. Prueba el menú hamburguesa en dispositivo móvil
```

---

## ✨ Características Principales

### 🛒 Sistema de Carrito

- ✅ **Persistencia en localStorage**: Los items se guardan automáticamente
- ✅ **Multi-talla**: Mismo producto en diferentes tallas = items separados
- ✅ **Cantidad dinámica**: Incrementar/decrementar cantidad fácilmente
- ✅ **Cálculo automático**: Totales, subtotales, envío
- ✅ **Badge contador**: Muestra cantidad de items en tiempo real
- ✅ **Notificaciones**: Toast que confirma acciones

### 📱 Menú Hamburguesa Responsive

- ✅ **Breakpoints**: Desktop (>770px), Tablet (480-770px), Móvil (<480px)
- ✅ **Animaciones suaves**: Hamburguesa → X (320ms cubic-bezier)
- ✅ **Múltiples formas de cerrar**:
  - Click en enlace
  - Click fuera del menú
  - Tecla Escape
  - Redimensión de ventana
- ✅ **Accesibilidad WCAG AA**: ARIA attributes, navegación por teclado

### 🔐 Validación de Formularios

- ✅ **Contacto**: Nombre, email, mensaje
- ✅ **Feedback visual**: Campos en rojo cuando hay error
- ✅ **Mensajes descriptivos**: Le dice al usuario qué corregir
- ✅ **Expresiones regulares**: Validación de email robusto

### 🎨 Diseño Responsive

- ✅ **Mobile-first**: Optimizado para cualquier pantalla
- ✅ **CSS Grid y Flexbox**: Layouts modernos y flexibles
- ✅ **Variables CSS**: Tokens de diseño reutilizables
- ✅ **Animaciones CSS3**: Transiciones suaves

### ♿ Accesibilidad

- ✅ **ARIA attributes**: Etiquetas para screen readers
- ✅ **Navegación por teclado**: Tab, Enter, Escape
- ✅ **Contraste de colores**: WCAG AA compliant
- ✅ **Textos descriptivos**: Alt en imágenes, labels en inputs

---

## 📂 Estructura del Proyecto

```
proyecto2/
│
├── PÁGINAS HTML
│   ├── index.html              # Página principal
│   ├── catalogo.html           # Catálogo de productos (hombre/mujer)
│   ├── contacto.html           # Formulario de contacto
│   ├── carrito.html            # Página del carrito
│   └── test-hamburger.html     # Página de prueba del menú
│
├── JAVASCRIPT
│   ├── main.js                 # Menú hamburguesa + formularios (260 líneas)
│   ├── catalogo.js             # Lógica específica del catálogo
│   └── carrito-unificado.js    # Sistema completo del carrito (400+ líneas)
│
├── ESTILOS
│   └── styles.css              # Hoja de estilos única (1120 líneas)
│                               # - Variables CSS
│                               # - Componentes
│                               # - Media queries
│                               # - Animaciones
│
├── IMÁGENES
│   └── img/
│       ├── Logo.jpeg           # Logo GLAMOUR NYM
│       ├── H1.jpeg, H2.jpeg, H3.jpeg    # Productos hombre
│       ├── M1.jpeg, M2.jpeg, M3.jpeg    # Productos mujer
│       └── IMP 2.jpg, H2.jpeg           # Banners
│
└── DOCUMENTACIÓN
    ├── README_COMPLETO.md              # Este archivo
    ├── DOCUMENTACION_TECNICA.md        # Documentación técnica extendida
    ├── CARRITO_DOCUMENTACION.md        # API del carrito
    ├── CHANGELOG.md                    # Historial de cambios
    ├── RELEASE_NOTES.md                # Notas de release
    ├── VERSION                         # Número de versión
    └── DOCUMENTATION.md                # Documentación general
```

... (rest of file moved)
