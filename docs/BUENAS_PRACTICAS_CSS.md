# BUENAS PRÁCTICAS CSS - GLAMOUR NYM

## 📋 Guía de Estilos CSS Implementadas

---

## 1. Sistema de Variables CSS (Tokens)

### ✅ Lo que implementamos

```css
:root {
  /* COLORES */
  --color-bg: #ffffff; /* Fondo principal */
  --color-text: #111827; /* Texto principal */
  --color-muted: #6b7280; /* Texto secundario */
  --color-surface: #f3f4f6; /* Superficies (cards) */
  --color-primary-900: #111827; /* Navbar oscuro */
  --color-primary-800: #1f2937; /* Hover/secundario */
  --color-accent: #eab308; /* CTA (amarillo) */
  --color-border: #e5e7eb; /* Bordes sutiles */

  /* ESPACIOS (si los usáramos) */
  /* --spacing-xs: 0.25rem; */
  /* --spacing-sm: 0.5rem; */
  /* --spacing-md: 1rem; */
  /* --spacing-lg: 2rem; */

  /* TIPOGRAFÍA (si la usáramos) */
  /* --font-base: 16px; */
  /* --font-weight-normal: 400; */
  /* --font-weight-bold: 700; */

  /* ANIMACIONES */
  /* --transition-fast: 200ms ease; */
  /* --transition-normal: 300ms ease; */
  /* --cubic-bezier-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94); */
}
```

### ✅ Beneficios

```
1. CONSISTENCIA
   - Un solo lugar para cambiar un color
   - Se aplica automáticamente en toda la app
   - Evita "color magic numbers" por todo el código

2. MANTENIBILIDAD
   - Fácil encontrar el color/espacio
   - Cambios globales en 1 línea
   - Entendible para nuevos desarrolladores

3. ESCALABILIDAD
   - Agregar nuevo token es trivial
   - Preparado para múltiples temas (dark mode, etc)
   - Documentado qué es cada variable

4. PERFORMANCE
   - Variables son eficientes
   - No requiere compilación (preprocessing)
   - Soportadas en todos los navegadores modernos
```

---

## 2. Sistema de Espacios (Spacing Scale)

... (rest of file moved)
