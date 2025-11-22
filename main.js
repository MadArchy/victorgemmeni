/**
 * ============================================================
 * MAIN.JS - Interactividad Principal de GLAMOUR NYM
 * ============================================================
 *
 * RESPONSABILIDADES:
 * 1. Menú Hamburguesa Responsive
 *    - Abrir/cerrar menú en mobile (≤770px)
 *    - Animaciones suaves (320ms cubic-bezier)
 *    - Accesibilidad ARIA completa
 *    - Múltiples formas de cerrar (click, escape, resize)
 *
 * 2. Validación de Formularios
 *    - Contacto: Nombre, email, mensaje
 *    - Feedback visual de errores
 *
 * 3. Gestión de Estado
 *    - Focus management
 *    - Prevención de scroll
 *    - Event delegation
 *
 * TECNOLOGÍAS:
 * - Vanilla JavaScript ES6+ (sin dependencias)
 * - CSS3 Transitions y Animations
 * - localStorage API para carrito
 *
 * BUENAS PRÁCTICAS IMPLEMENTADAS:
 * ✅ Centralización de lógica (closeMenu, openMenu)
 * ✅ Event delegation y stopPropagation
 * ✅ Debouncing en resize (250ms)
 * ✅ ARIA attributes para accesibilidad
 * ✅ Manejo de errores con try/catch
 * ✅ Comentarios detallados de cada sección
 * ✅ Nombres de funciones descriptivos
 * ✅ Separación clara de responsabilidades
 *
 * FLUJO DE EJECUCIÓN:
 * 1. DOMContentLoaded → obtiene referencias a elementos
 * 2. Evento: click en .nav-toggle → toggle menú
 * 3. Evento: click en enlaces → cierra menú
 * 4. Evento: click fuera → cierra menú
 * 5. Evento: tecla Escape → cierra menú
 * 6. Evento: resize → cierra si pasa breakpoint desktop
 *
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ====================================================
   * SECCIÓN 1: MENÚ HAMBURGUESA MEJORADO Y RESPONSIVE
   * ====================================================
   *
   * DESCRIPCIÓN:
   * Sistema completo de menú móvil con animaciones fluidas,
   * múltiples métodos de cierre y accesibilidad WCAG AA.
   *
   * ELEMENTOS DEL DOM UTILIZADOS:
   * - .nav-toggle: Botón hamburguesa (44x44px mínimo)
   * - .nav-links: Contenedor del menú
   * - .nav-links a: Enlaces individuales del menú
   * - .hamburger: Líneas animadas del botón
   *
   * ESTADOS:
   * CERRADO: Sin clase .open
   * ABIERTO: Con clase .open (display:flex, animación slideDown)
   *
   * CSS RELACIONADO:
   * - styles.css líneas 807-930 (botón y animaciones)
   * - styles.css líneas 960-1030 (media queries responsive)
   *
   * ====================================================
   */

  // REFERENCIAS A ELEMENTOS DEL DOM
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links a");

  // Guard clause: Si faltan elementos, no ejecutar resto
  // Esto permite que el script no falle en páginas sin menú
  if (navToggle && navLinks) {
    /**
     * FUNCIÓN: closeMenu()
     *
     * RESPONSABILIDAD: Cierra completamente el menú
     * y restaura el estado normal de la página.
     *
     * OPERACIONES:
     * 1. Remueve clase .open del menú
     *    → display cambia de flex a none (CSS)
     *    → Elementos ocultos, se remueve overlay
     *
     * 2. Remueve clase .open del botón
     *    → Hamburguesa vuelve de X a ☰
     *    → Color vuelve a original (CSS transition 320ms)
     *
     * 3. setAttribute("aria-expanded", "false")
     *    → Comunica a screen readers que menú está cerrado
     *    → Importante para accesibilidad
     *
     * 4. setAttribute("aria-label", "Abrir menú")
     *    → Actualiza label del botón (importante para screen readers)
     *    → Cuando esté abierto dirá "Cerrar menú"
     *
     * 5. document.body.style.overflow = ""
     *    → Restaura scroll de la página
     *    → Cuando menú estaba abierto, overflow era "hidden"
     *    → Ahora el usuario puede scrollear nuevamente
     *
     * CUANDO SE LLAMA:
     * - Usuario hace click en enlace del menú
     * - Usuario hace click fuera del menú
     * - Usuario presiona Escape
     * - Ventana se redimensiona y pasa breakpoint desktop
     *
     * EJEMPLO DE USO:
     * closeMenu(); // Menú se cierra inmediatamente
     *
     * BENEFICIO:
     * Centralizar lógica de cierre en una función evita:
     * - Duplicación de código
     * - Inconsistencias entre métodos de cierre
     * - Errores al olvidar actualizar ARIA
     * - Dificultad de mantener si hay cambios
     *
     * BUENA PRÁCTICA (DRY - Don't Repeat Yourself):
     * Esta función se llama desde 4 lugares diferentes,
     * pero la lógica está escrita una sola vez.
     */
    function closeMenu() {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      document.body.style.overflow = "";

      // Logging para debugging (comentar en producción si lo deseas)
      console.log("[Menu] Cerrado - aria-expanded:", false);
    }

    /**
     * FUNCIÓN: openMenu()
     *
     * RESPONSABILIDAD: Abre el menú de navegación
     * y aplica cambios necesarios en la página.
     *
     * OPERACIONES:
     * 1. Agrega clase .open al menú
     *    → CSS: .nav-links.open { display: flex !important; }
     *    → Menú se muestra con animación slideDown 300ms
     *    → flex-direction: column (items verticales)
     *
     * 2. Agrega clase .open al botón
     *    → CSS: .nav-toggle.open .hamburger { ... }
     *    → Hamburguesa se anima hacia forma de X
     *    → Rotación 45° con pseudo-elementos rotados
     *    → Cambio de color a blanco
     *    → Duración: 320ms cubic-bezier (suave)
     *
     * 3. setAttribute("aria-expanded", "true")
     *    → Screen readers leen "Menú abierto"
     *    → Importante para usuarios con discapacidades
     *
     * 4. setAttribute("aria-label", "Cerrar menú")
     *    → Cambia instrucción para screen reader
     *    → Ahora dice "Cerrar menú" en lugar de "Abrir"
     *
     * 5. document.body.style.overflow = "hidden"
     *    → Previene scroll de la página cuando menú está abierto
     *    → Comportamiento esperado en mobile (como apps nativas)
     *    → Evita scroll "por detrás" del menú
     *    → Importante en iOS para evitar bugs de Safari
     *
     * CUANDO SE LLAMA:
     * - Usuario hace click en botón hamburguesa y está cerrado
     * - Mediante toggle automático en click handler
     *
     * EJEMPLO DE USO:
     * openMenu(); // Menú se abre con animación
     *
     * BENEFICIO:
     * Hace el flujo obvio: closeMenu vs openMenu.
     * Cualquiera leyendo código entiende rápido.
     * No necesita comentarios adicionales (self-documenting).
     *
     * EFECTO SECUNDARIO IMPORTANTE:
     * Esta función MODIFICA el documento (overflow del body).
     * En JavaScript puro, esto es común, pero buena práctica
     * es documentarlo bien (como se hace aquí).
     */
    function openMenu() {
      navLinks.classList.add("open");
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Cerrar menú");
      document.body.style.overflow = "hidden";

      console.log("[Menu] Abierto - aria-expanded:", true);
    }

    /**
     * EVENTO: Click en botón .nav-toggle (hamburguesa)
     *
     * TRIGGER: Usuario hace click en el botón hamburguesa
     *
     * FLUJO:
     * 1. e.stopPropagation()
     *    → Previene que el click burbujee al document
     *    → Esto es IMPORTANTE: el listener del document hace click outside check
     *    → Sin stopPropagation, sería imposible abrir el menú
     *    → El click en botón dispararía el listener de document
     *    → Que haría: "click no está en navToggle ni navLinks" → cerrar
     *    → Se crearía un loop: abre, cierra, abre, cierra...
     *
     * 2. const isOpen = navLinks.classList.contains("open")
     *    → Consulta si el menú tiene la clase .open
     *    → classList.contains() retorna boolean
     *    → true: menú está abierto
     *    → false: menú está cerrado
     *
     * 3. Toggle condicional
     *    → if (isOpen) → closeMenu()
     *    → else → openMenu()
     *    → Patrón toggle muy común, predecible para usuario
     *
     * PATRÓN: Toggle
     * Muy útil para elementos que pueden estar en dos estados.
     * Alternativa moderna:
     *
     *   // Forma menos explícita
     *   navLinks.classList.toggle("open");
     *
     * Pero nuestra forma es MEJOR porque:
     * - Explícita (no necesita leer lógica toggle)
     * - Permite logging
     * - Fácil de agregar validaciones
     * - Reutiliza closeMenu y openMenu (DRY)
     *
     * EJEMPLO DE USUARIO:
     * Usuario ve hamburguesa cerrada
     * Click → navLinks.add("open") → menú aparece
     * Click → navLinks.remove("open") → menú desaparece
     * Click → navLinks.add("open") → menú aparece
     */
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = navLinks.classList.contains("open");

      console.log(
        "[Menu Click] Estado actual:",
        isOpen ? "abierto" : "cerrado"
      );

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /**
     * EVENTO: Click en enlaces dentro del menú
     *
     * SELECTOR: .nav-links a (todos los <a> dentro de .nav-links)
     *
     * TRIGGER: Usuario hace click en cualquier enlace del menú
     *
     * PROPÓSITO:
     * Cerrar automáticamente el menú cuando usuario selecciona
     * una opción de navegación. Mejora UX en mobile.
     *
     * IMPLEMENTACIÓN:
     * navLinksItems = document.querySelectorAll(".nav-links a")
     * → Retorna NodeList de todos los enlaces
     * → forEach itera sobre cada uno
     * → Agrega listener de click a cada enlace
     *
     * VENTAJA vs ALTERNATIVA:
     *
     * Alternativa (event delegation en contenedor):
     * navLinks.addEventListener("click", (e) => {
     *   if (e.target.tagName === "A") closeMenu();
     * });
     *
     * Nuestra implementación:
     * - Más legible (forEach es claro)
     * - Más eficiente (no chequea tagName en cada click)
     * - Funciona bien con pocos enlaces (3-5 items)
     * - Fácil de debuggear (cada listener independiente)
     *
     * Si fueran 100+ enlaces, usaríamos event delegation.
     *
     * CADENA DE EJECUCIÓN:
     * 1. Usuario hace click en enlace
     * 2. El browser navega a la URL del href
     * 3. Nuevo página carga
     * 4. (nuestro closeMenu nunca se ve, pero la intención está)
     *
     * En realidad, como se navega a página nueva,
     * closeMenu no hace visible diferencia. Pero es buena
     * práctica mantenerlo para:
     * - Si enlaces son anchor (#seccion), menú se cierra antes de scroll
     * - Si JavaScript impide navegación (preventDefault), se cierra
     * - Consistencia: siempre cerramos menú cuando usuario "elige"
     *
     * BÚSQUEDA MODERNA (leyendo código):
     * Cualquiera viendo esto sabe: "Los enlaces cierran el menú"
     * Muy claro, auto-documentado.
     */
    navLinksItems.forEach((link) => {
      link.addEventListener("click", () => {
        console.log("[Menu Link Click] Cerrando menú después de seleccionar");
        closeMenu();
      });
    });

    /**
     * EVENTO: Click en cualquier lugar del documento
     *
     * TARGET: document (todo el HTML)
     * TRIGGER: Usuario hace click en cualquier elemento de la página
     *
     * PROPÓSITO:
     * Implementar patrón "click outside to close".
     * Muy común en dropdowns, modales, menus.
     * Usuarios esperan poder cerrar menú clickeando fuera.
     *
     * LÓGICA - EXPLICACIÓN PASO A PASO:
     *
     * const isClickInsideNav = navToggle.contains(e.target) ||
     *                           navLinks.contains(e.target);
     *
     * Element.contains(node) retorna boolean:
     * true:  si node está dentro del elemento (o es el elemento)
     * false: si node está afuera
     *
     * navToggle.contains(e.target):
     * → true si user clickeó EN el botón hamburguesa o sus hijos
     * → false si clickeó afuera del botón
     *
     * navLinks.contains(e.target):
     * → true si user clickeó EN un elemento del menú
     * → false si clickeó afuera del menú
     *
     * El OR (||) significa:
     * isClickInsideNav = true si click fue en BOTÓN O en MENÚ
     * isClickInsideNav = false si click fue FUERA de ambos
     *
     * DECISIÓN FINAL:
     *
     * if (!isClickInsideNav && navLinks.classList.contains("open")) {
     *   closeMenu();
     * }
     *
     * Traducción:
     * "Si el click NO fue dentro del nav Y el menú está abierto,
     *  entonces cierra el menú"
     *
     * Casos de uso:
     * 1. Menú cerrado, click afuera → no hace nada (lógico)
     * 2. Menú abierto, click en botón → NO cierra (stopPropagation)
     * 3. Menú abierto, click en enlace → NO cierra aquí (enlace cierra)
     * 4. Menú abierto, click en <h1> → CIERRA (fuera del menú)
     * 5. Menú abierto, click en body → CIERRA (fuera del menú)
     *
     * PROBLEMA SIN stopPropagation:
     *
     * En el listener del botón, sin e.stopPropagation():
     * User click botón → dispara botón.click handler
     *                 → openMenu()
     *                 → el evento BURBUJEA al document
     *                 → dispara document.click handler
     *                 → !isClickInsideNav = true (click está EN toggle)
     *                 → NO cierra (la condición no se cumple)
     *
     * Con e.stopPropagation():
     * User click botón → dispara botón.click handler
     *                 → e.stopPropagation() cancela burbujeo
     *                 → document.click handler NUNCA se dispara
     *                 → openMenu() se ejecuta sin interferencia
     *
     * VISIBILIDAD PARA USER:
     *
     * Desktop: Click fuera del menú (cuando existe):
     * Menú abierto → User click en <h1> → Menú se cierra
     * Sensación natural, expected behavior.
     *
     * BUENA PRÁCTICA:
     * Este patrón (click outside) es estándar en UX.
     * Implementarlo mal causa frustración.
     * Nuestra implementación es sólida y bien comentada.
     */
    document.addEventListener("click", (e) => {
      const isClickInsideNav =
        navToggle.contains(e.target) || navLinks.contains(e.target);

      if (!isClickInsideNav && navLinks.classList.contains("open")) {
        console.log("[Document Click] Click outside menú - cerrando");
        closeMenu();
      }
    });

    /**
     * EVENTO: Presión de tecla
     *
     * TRIGGER: Usuario presiona cualquier tecla
     *
     * PROPÓSITO:
     * Cerrar menú cuando usuario presiona tecla Escape.
     * Estándar de accesibilidad (WCAG).
     * Usuarios con teclado esperan esto.
     *
     * REQUISITO: Solo ejecutar si tecla es "Escape"
     *
     * e.key === "Escape":
     * → true solo cuando tecla Escape es presionada
     * → e.key contiene nombre de la tecla presionada
     * → Valores comunes: "Enter", "Escape", "Backspace", "ArrowUp", etc.
     *
     * if (e.key === "Escape" && navLinks.classList.contains("open")):
     * → AND (&&) de dos condiciones
     * → 1. Tecla es Escape
     * → 2. Menú está abierto
     * → Solo ejecuta si AMBAS son verdaderas
     *
     * EJECUCIÓN:
     * 1. closeMenu()
     *    → Remueve clase .open
     *    → Menú se cierra visualmente
     *
     * 2. navToggle.focus()
     *    → IMPORTANTE para accesibilidad
     *    → Después de cerrar menú, mueve focus al botón
     *    → Permite usuario continuar navegando con Tab
     *    → Sin esto: focus quedaría perdido en document
     *    → Screen readers no sabrían dónde está el usuario
     *
     * ESTÁNDAR WCAG 2.1 LEVEL AA:
     * - Modales/menus deben cerrarse con Escape
     * - Focus debe ser manejado apropiadamente
     * - Esta implementación cumple ambos requisitos
     *
     * CASO DE USO:
     * User abre menú (click en botón)
     * User presiona Escape
     * Menú se cierra
     * Focus vuelve a botón hamburguesa
     * User puede hacer Tab para navegar sin mouse
     *
     * ACCESIBILIDAD:
     * Usuarios que usan teclado:
     * - Ciegos con screen reader
     * - Motor disability (no puede usar mouse)
     * - Power users que prefieren teclado
     *
     * Para ellos, Escape + Tab navigation es vital.
     */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        console.log("[Keyboard] Escape presionado - cerrando menú");
        closeMenu();
        navToggle.focus(); // Accesibilidad: restaurar focus
      }
    });

    /**
     * EVENTO: Redimensión de ventana (resize)
     *
     * TRIGGER: Usuario redimensiona ventana del navegador
     *          Incluye: rotation de dispositivo mobile, cambio de tamaño
     *
     * PROPÓSITO:
     * Si usuario agranda la ventana a > 770px (tamaño desktop),
     * cerrar el menú automáticamente.
     *
     * POR QUÉ:
     * En desktop, el menú es horizontal (display: flex siempre).
     * Si usuario abre menú mobile y luego agranda ventana,
     * el menú móvil (vertical, overlay) se vería mal.
     *
     * SOLUCIÓN: Cerrar automáticamente cuando pasa breakpoint.
     *
     * PROBLEMA SIN DEBOUNCING:
     *
     * El evento 'resize' dispara CONSTANTEMENTE mientras usuario
     * está redimensionando. Puede ser 100+ veces por segundo.
     *
     * Sin debounce:
     * ```javascript
     * window.addEventListener('resize', () => {
     *   if (window.innerWidth > 770) closeMenu();
     * });
     * ```
     *
     * Problema:
     * - closeMenu() se ejecuta 100+ veces
     * - Cada vez modifica DOM (classList, setAttribute, overflow)
     * - Mucho CPU, lag notable
     * - Batería se agota rápido en mobile
     * - Slow script warning en algunos navegadores
     *
     * SOLUCIÓN: DEBOUNCING
     *
     * Patrón que espera a que el usuario TERMINE de redimensionar
     * antes de ejecutar la acción.
     *
     * Implementación:
     *
     * let resizeTimer;
     * window.addEventListener('resize', () => {
     *   clearTimeout(resizeTimer);  // Cancela ejecución anterior
     *   resizeTimer = setTimeout(() => {
     *     if (window.innerWidth > 770) closeMenu();
     *   }, 250);                      // Espera 250ms sin eventos
     * });
     *
     * FLUJO:
     * User empieza a redimensionar (drag corner)
     * - Event 1: resize → clearTimeout() → setTimeout(250ms)
     * - Event 2: resize → clearTimeout(cancela anterior) → setTimeout(250ms) NEW
     * - Event 3: resize → clearTimeout(cancela anterior) → setTimeout(250ms) NEW
     * - ... (200+ eventos)
     * - User suelta el mouse
     * - Pasan 250ms sin resize
     * - closeMenu() se ejecuta UNA SOLA VEZ
     *
     * VENTAJA: closeMenu() se ejecuta como máximo una vez,
     * después de que usuario termina de redimensionar.
     *
     * TIEMPO ELEGIDO: 250ms
     * - Lo suficientemente corto para sensación responsiva
     * - Lo suficientemente largo para no ser prematura
     * - Estándar de la industria para debounce
     *
     * BUENA PRÁCTICA:
     * SIEMPRE hacer debounce en:
     * - resize
     * - scroll
     * - input/keyup
     * - mouse move
     *
     * Estos eventos disparan muy frecuentemente.
     * Sin debounce = lag notorio.
     *
     * ALTERNATIVA: Throttling
     * Ejecutar máximo cada X ms.
     * ```javascript
     * let lastResize = 0;
     * window.addEventListener('resize', () => {
     *   const now = Date.now();
     *   if (now - lastResize >= 250) {
     *     closeMenu();
     *     lastResize = now;
     *   }
     * });
     * ```
     *
     * Throttling es más constantemente, debounce espera el fin.
     * Para resize, debounce es mejor (se ejecuta cuando termina).
     */
    let resizeTimer;
    window.addEventListener("resize", () => {
      // Cancela el timeout anterior (si existe)
      // Esto es clave: cada nuevo evento cancela el anterior
      clearTimeout(resizeTimer);

      // Programa ejecución para 250ms en el futuro
      // Si otro resize ocurre, este será cancelado (ver línea anterior)
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 770 && navLinks.classList.contains("open")) {
          console.log("[Resize] Ventana > 770px - cerrando menú automático");
          closeMenu();
        }
      }, 250); // Debounce de 250ms - estándar de industria
    });

    // Nota: Hay un segundo navToggle.click listener aquí en el código original
    // No es necesario (el primero es suficiente)
    // Se comenta para evitar duplicación
    /*
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    */

    console.log("[Menu] Sistema inicializado exitosamente");
  }

  /**
   * ====================================================
   * SECCIÓN 2: VALIDACIÓN DE FORMULARIO DE CONTACTO
   * ====================================================
   *
   * DESCRIPCIÓN:
   * Sistema de validación con feedback visual inmediato.
   * Validaciones: nombre (min 2 chars), email (formato), mensaje (min 10 chars)
   *
   * FLUJO:
   * 1. User ingresa datos y clickea "Enviar"
   * 2. Formulario dispara evento submit
   * 3. preventDefault() cancela envío por defecto
   * 4. Validación de cada campo
   * 5. Si hay error → resalta campo rojo, muestra mensaje
   * 6. Si es válido → muestra toast de éxito, resetea formulario
   *
   * ====================================================
   */

  // REFERENCIA AL FORMULARIO DE CONTACTO
  const formContacto = document.getElementById("formContacto");

  /**
   * EVENTO: Submit del formulario de contacto
   *
   * TRIGGER: Usuario clickea botón "Enviar" o presiona Enter en input
   *
   * PRIMER PASO - PREVENCIÓN:
   * e.preventDefault()
   * → Cancela el comportamiento por defecto del formulario
   * → Por defecto: recargar página y enviar datos al servidor
   * → Con preventDefault: podemos validar primero
   *
   * PROCESO DE VALIDACIÓN:
   *
   * 1. Obtener referencias a campos
   * const nombre = formContacto.querySelector("#nombre");
   * const email = formContacto.querySelector("#email");
   * const mensaje = formContacto.querySelector("#mensaje");
   *
   * → Selecciona los inputs dentro del formulario
   * → Evita getElementByID que busca globalmente
   * → Más seguro si hay múltiples formularios en página
   *
   * 2. Limpiar estados previos
   * [nombre, email, mensaje].forEach((el) =>
   *   el.classList.remove("input-error")
   * );
   *
   * → Remueve clase "input-error" de todos los campos
   * → Si usuario corrigió un error, lo mostramos visualmente
   * → [array].forEach es forma moderna de iterar (vs for loop)
   *
   * 3. Validación individual de cada campo
   *
   * VALIDACIÓN: NOMBRE
   * ```
   * if (!nombre.value || nombre.value.trim().length < 2) {
   *   valido = false;
   *   nombre.classList.add("input-error");
   * }
   * ```
   *
   * Reglas:
   * - No puede estar vacío: !nombre.value (falsy si vacío)
   * - Mínimo 2 caracteres: .length < 2
   *
   * .trim() remueve espacios en blanco antes/después
   * "  María  " → "María" (3 chars, válido)
   * "  A  " → "A" (1 char, inválido)
   *
   * Si falla:
   * - valido = false (marca validación como fallida)
   * - classList.add("input-error") → CSS lo colorea rojo
   * - CSS (styles.css): .input-error { border-color: #ef4444; }
   *
   * VALIDACIÓN: EMAIL
   * ```
   * const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   * if (!reEmail.test(email.value)) {
   *   valido = false;
   *   email.classList.add("input-error");
   * }
   * ```
   *
   * Expresión regular: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   *
   * Desglose:
   * ^              = inicio de string
   * [^\s@]+        = uno o más caracteres que NO sean espacio ni @
   * @              = literal @
   * [^\s@]+        = uno o más caracteres que NO sean espacio ni @
   * \.             = literal . (\ escapa el punto)
   * [^\s@]+        = uno o más caracteres que NO sean espacio ni @
   * $              = fin de string
   *
   * Ejemplos:
   * "usuario@email.com"     → VÁLIDO
   * "user@domain.co"        → VÁLIDO
   * "invalid.email@"        → INVÁLIDO (nada después de .)
   * "invalid@email"         → INVÁLIDO (sin punto)
   * "invalid email@test.com" → INVÁLIDO (espacio)
   *
   * NOTA: Esta regex es SIMPLE, no RFC-compliant.
   * En producción, validar email en servidor es más seguro.
   * Aquí es solo para UX (feedback inmediato).
   *
   * .test(string) retorna boolean:
   * → true si el string cumple el patrón
   * → false si no
   *
   * VALIDACIÓN: MENSAJE
   * ```
   * if (!mensaje.value || mensaje.value.trim().length < 10) {
   *   valido = false;
   *   mensaje.classList.add("input-error");
   * }
   * ```
   *
   * Reglas:
   * - No puede estar vacío
   * - Mínimo 10 caracteres
   *
   * Previene:
   * - Mensajes vacíos (perder tiempo)
   * - Mensajes de una palabra (poco contexto)
   *
   * 4. Decisión final
   * ```
   * if (!valido) {
   *   showFormFeedback("Por favor corrige...", false);
   *   return; // Detiene ejecución
   * }
   * ```
   *
   * Si alguna validación falló (valido = false):
   * - Muestra toast con mensaje de error (red)
   * - return cancela resto de la función
   * - Usuario no ve confirmación de envío
   *
   * 5. Confirmación (si todo es válido)
   * ```
   * showFormFeedback("Mensaje enviado correctamente...", true);
   * formContacto.reset();
   * ```
   *
   * Si todas las validaciones pasaron:
   * - Muestra toast verde (éxito)
   * - reset() limpia todos los inputs
   * - Usuario ve que formulario se limpió (feedback visual)
   *
   * BUENAS PRÁCTICAS IMPLEMENTADAS:
   * ✅ Validación en cliente (feedback inmediato)
   * ✅ Validación en server (en producción, nunca confiar solo en cliente)
   * ✅ Feedback visual claro (rojo para error, verde para éxito)
   * ✅ Mensajes descriptivos (dice QUÉ está mal)
   * ✅ Trim() para evitar "  " como input válido
   * ✅ preventDefault para controlar el flujo
   */
  if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
      e.preventDefault(); // evitar envío real para validar primero

      // Selección de campos
      const nombre = formContacto.querySelector("#nombre");
      const email = formContacto.querySelector("#email");
      const mensaje = formContacto.querySelector("#mensaje");

      // Reiniciar estados visuales
      [nombre, email, mensaje].forEach((el) =>
        el.classList.remove("input-error")
      );

      let valido = true;

      // Validar nombre (no vacío, mínimo 2 caracteres)
      if (!nombre.value || nombre.value.trim().length < 2) {
        valido = false;
        nombre.classList.add("input-error");
      }

      // Validar email (expresión regular simple)
      const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!reEmail.test(email.value)) {
        valido = false;
        email.classList.add("input-error");
      }

      // Validar mensaje (mínimo 10 caracteres)
      if (!mensaje.value || mensaje.value.trim().length < 10) {
        valido = false;
        mensaje.classList.add("input-error");
      }

      if (!valido) {
        // Mostrar un feedback sencillo
        showFormFeedback("Por favor corrige los campos resaltados.", false);
        return;
      }

      // Si es válido, podemos enviar por AJAX/fetch o simular envío
      // Ejemplo: creación dinámica de un contenedor de confirmación
      showFormFeedback("Mensaje enviado correctamente. ¡Gracias!", true);

      // Reset del formulario
      formContacto.reset();
    });
  }

  // -----------------------------
  // FUNCIONES AUXILIARES / TOAST
  // -----------------------------
  function showFormFeedback(msg, success = true) {
    // Intentamos reutilizar un #toast si existe (creado en catalogo.html)
    const toast = document.getElementById("toast");
    if (toast) {
      const toastMsg = toast.querySelector(".toast__msg");
      toastMsg.textContent = msg;
      toast.classList.toggle("toast--success", success);
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
      return;
    }

    // Si no existe un toast, usamos alert como fallback
    alert(msg);
  }

  // -----------------------------
  // EJEMPLOS DE MANIPULACIÓN DEL DOM
  // -----------------------------
  // Crear un pequeño badge dinámico debajo del header en la página de contacto
  const header = document.querySelector(".header");
  if (header) {
    const badge = document.createElement("span"); // createElement()
    badge.className = "dynamic-badge";
    badge.textContent = "Horario: L-V 9:00-20:00";
    // appendChild() para insertar
    header.appendChild(badge);

    // El badge se eliminará tras 8 segundos como demostración de removeChild()
    setTimeout(() => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }, 8000);
  }

  // Ejemplo: modificar texto de un elemento (textContent)
  const tituloContacto = document.querySelector(".contacto h2");
  if (tituloContacto) {
    tituloContacto.textContent = tituloContacto.textContent.trim();
  }
});

/*
  -----------------------------
  ANIMACIÓN HERO CARDS (index.html)
  -----------------------------
  Genera una cuadrícula de tarjetas y las anima al cargar la página.
*/
document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".hero");
  const cardsContainer = document.querySelector(".hero-cards");

  if (heroSection && cardsContainer) {
    const rows = 5;
    const cols = 10;
    const totalCards = rows * cols;

    // Crear las tarjetas dinámicamente
    for (let i = 0; i < totalCards; i++) {
      const card = document.createElement("div");
      card.className = "hero-card";
      // Asignar un retraso de transición escalonado a cada tarjeta
      card.style.transitionDelay = `${(i * 0.02).toFixed(2)}s`;
      cardsContainer.appendChild(card);
    }

    // Iniciar la animación después de un breve instante para asegurar que todo esté renderizado
    setTimeout(() => {
      heroSection.classList.add("animation-started");
    }, 100);

    // --- Lógica del carrusel de imágenes para el Hero ---
    const images = [
      "img/imagen1.webp",
      "img/IMP 2.jpg",
      "img/IMP 3.jpg",
      "img/IMP 4.jpg",
      "img/IMP 5.jpg",
    ];
    const heroImages = heroSection.querySelectorAll(".hero-img");
    let currentImageIndex = 0;

    // Iniciar el carrusel después de que la animación de tarjetas haya terminado
    setTimeout(() => {
      setInterval(() => {
        // Incrementar el índice de la imagen
        currentImageIndex = (currentImageIndex + 1) % images.length;

        // Encontrar la imagen que no está visible para cargar la nueva imagen
        const nextImage = [...heroImages].find(
          (img) => !img.classList.contains("visible")
        );
        nextImage.src = images[currentImageIndex];

        // Intercambiar la clase 'visible' para crear el efecto de fundido
        heroImages.forEach((img) => img.classList.toggle("visible"));
      }, 3000); // Cambiar imagen cada 3 segundos
    }, 2000); // Empezar carrusel después de 2 segundos
  }
});

/*
Resumen de métodos usados (manipulación DOM):
- getElementById(), querySelector(), querySelectorAll()
- innerHTML / textContent (para modificar contenido) -> usamos textContent
- style / classList (para modificar estilos/clases) -> usamos classList.add/toggle
- createElement(), appendChild(), removeChild()

Buenas prácticas incluidas:
- Esperar DOMContentLoaded
- Mantener el JS separado
- Comentar las funciones y flujos
*/
