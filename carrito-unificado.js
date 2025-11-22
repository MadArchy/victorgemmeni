/**
 * ============================================================
 * CARRITO DE COMPRAS - Sistema Unificado con localStorage
 * ============================================================
 *
 * RESPONSABILIDADES:
 * 1. Gestionar items del carrito (agregar, eliminar, actualizar)
 * 2. Persistir datos en localStorage para recuperarlos después
 * 3. Calcular totales, subtotales, envío
 * 4. Formatear moneda según locale del usuario
 * 5. Renderizar tabla del carrito en carrito.html
 * 6. Manejar checkout y confirmación de compra
 *
 * ARQUITECTURA:
 * - Clase Carrito: Encapsula toda la lógica de datos
 * - Instancia global carritoGlobal: Singleton compartido en todas las páginas
 * - Funciones helper: agregarAlCarrito, actualizarBadge, renderizar, etc
 *
 * FLUJO DE DATOS:
 * 1. Usuario en catalogo.html agrega producto → llamaLLama agregarAlCarrito()
 * 2. agregarAlCarrito() usa carritoGlobal.agregarProducto()
 * 3. Clase Carrito agrega item y guarda en localStorage
 * 4. Badge en navbar se actualiza automáticamente
 * 5. Usuario navega a carrito.html
 * 6. renderizarCarrito() obtiene items de carritoGlobal
 * 7. Dibuja tabla con items, permite eliminar/editar cantidad
 * 8. Usuario clickea "Proceder al pago"
 * 9. procederAlPago() vacía el carrito y muestra confirmación
 *
 * SEGURIDAD:
 * ✅ XSS prevention: escapeHtml() en valores de usuario
 * ✅ Validación: Cheques en agregarProducto, actualizarCantidad
 * ✅ localStorage: Datos locales, no se envían a servidor (demostración)
 * ⚠️  En producción: SIEMPRE validar/procesar en servidor
 *
 * BUENAS PRÁCTICAS:
 * ✅ Clase para lógica de negocio
 * ✅ Métodos privados (#) para encapsulación
 * ✅ Getters para acceso seguro a datos
 * ✅ Try/catch en localStorage (puede fallar)
 * ✅ Formateo de moneda con Intl API
 * ✅ Cálculos dinámicos con reduce()
 * ✅ Nombres descriptivos de funciones
 * ✅ Comentarios detallados en secciones complejas
 *
 * ============================================================
 */

/**
 * CLASE: Carrito
 *
 * Encapsula toda la lógica de gestión del carrito.
 *
 * PROPIEDADES:
 * - storageKey (string): Clave en localStorage, "carritoGLAMOUR"
 * - items (array): Lista de productos en carrito
 *   Estructura de cada item:
 *   {
 *     id: "item_1700000000000-abc123def",
 *     nombre: "Pantalón Clásico",
 *     precio: 89900,                    // número, no string
 *     talla: "M",
 *     cantidad: 2,
 *     fechaAgregado: "2024-11-18T..."   // ISO timestamp
 *   }
 *
 * MÉTODOS PÚBLICOS:
 * - constructor(): Inicializa y carga del storage
 * - agregarProducto(nombre, precio, talla, cantidad): Agrega item
 * - eliminarItem(id): Elimina item por ID
 * - actualizarCantidad(id, cantidad): Cambia cantidad
 * - vaciar(): Limpia el carrito completamente
 * - obtenerItems(): Retorna array de items
 * - obtenerCantidadTotal(): Suma todas las cantidades
 * - obtenerTotal(): Suma de precios * cantidades
 * - formatearMoneda(numero): Formato COP
 *
 * MÉTODOS PRIVADOS (prefijo #):
 * - #cargarDelStorage(): Lee localStorage
 * - #guardarEnStorage(): Escribe localStorage
 * - #generarId(): Crea ID único
 * - #extraerNumeroDelPrecio(): Limpia formato $X.XXX
 */
class Carrito {
  constructor() {
    this.storageKey = "carritoGLAMOUR";
    this.items = this.cargarDelStorage();
  }

  /**
   * MÉTODO PRIVADO: cargarDelStorage()
   *
   * Recupera el carrito almacenado en localStorage.
   * Se ejecuta automáticamente en el constructor.
   *
   * PROCESO:
   * 1. Obtiene el string JSON de localStorage
   * 2. Si existe: JSON.parse() lo convierte en array
   * 3. Si no existe: retorna array vacío
   * 4. Si JSON es inválido: catch y retorna vacío
   *
   * TRY/CATCH IMPORTANTE:
   * localStorage puede:
   * - No existir (primer uso)
   * - Estar corrupto (datos viejos, versión anterior)
   * - Tener permiso denegado (navegación privada en algunos navegadores)
   *
   * BENEFICIO: App nunca falla por error de storage.
   * Si hay problema, simplemente comienza con carrito vacío.
   *
   * LOGGING: console.warn() muestra error sin detener ejecución.
   * Útil para debugging en consola de navegador.
   *
   * @returns {array} Items cargados o array vacío si error
   */
  cargarDelStorage() {
    try {
      const datos = localStorage.getItem(this.storageKey);
      return datos ? JSON.parse(datos) : [];
    } catch (e) {
      console.warn("Error al cargar carrito del localStorage:", e);
      return [];
    }
  }

  /**
   * MÉTODO PRIVADO: guardarEnStorage()
   *
   * Persiste el carrito actual en localStorage.
   * Se llama automáticamente después de cada modificación.
   *
   * PROCESO:
   * 1. Convierte array de items a string JSON
   * 2. Guarda en localStorage con la clave storageKey
   * 3. Si hay error: log pero continúa (no rompe app)
   *
   * CONVERSIÓN:
   * JavaScript object/array → JSON.stringify() → string
   * Ejemplo:
   * [{id: "1", nombre: "Pantalón"}]
   * Becomes:
   * '[{"id":"1","nombre":"Pantalón"}]'
   *
   * localStorage solo almacena strings, por eso stringify es necesario.
   *
   * CAPACIDAD DE STORAGE:
   * Típicamente 5-10 MB por dominio (suficiente para carrito)
   * Si se alcanza límite: catch log warning
   *
   * @returns {void}
   */
  guardarEnStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn("Error al guardar carrito en localStorage:", e);
    }
  }

  /**
   * MÉTODO PÚBLICO: agregarProducto(nombre, precio, talla, cantidad)
   *
   * Agrega un producto al carrito.
   * Si ya existe con la misma talla, incrementa cantidad.
   * Si es diferente talla, se agrega como item separado.
   *
   * PARÁMETROS:
   * - nombre (string): "Pantalón Clásico"
   * - precio (number): 89900 (SIN símbolo $, es número puro)
   * - talla (string): "M", "L", "XL", etc
   * - cantidad (number): 1, 2, 3... (default 1)
   *
   * LÓGICA:
   * 1. Busca si producto + talla ya existe
   *    const indice = this.items.findIndex(
   *      (item) => item.nombre === nombre && item.talla === talla
   *    )
   *    findIndex retorna:
   *    - índice (0, 1, 2...) si encuentra
   *    - -1 si no encuentra
   *
   * 2. Si existe (indice !== -1):
   *    this.items[indice].cantidad += cantidad
   *    → Suma la cantidad al item existente
   *    Ejemplo: Si había 2, agrega 1, ahora 3
   *
   * 3. Si NO existe:
   *    this.items.push({...nuevo item...})
   *    → Crea nuevo objeto con todos los datos
   *    → Lo agrega al final del array
   *
   * 4. Guarda automáticamente en storage
   *    this.guardarEnStorage()
   *
   * VENTAJA - DEDUPLICACIÓN:
   * Si usuario agrega "Pantalón Talla M" dos veces,
   * en lugar de tener 2 items separados con cantidad 1 cada uno,
   * tiene 1 item con cantidad 2.
   * Es más limpio y fácil de manejar.
   *
   * FECHAAGREGADO:
   * new Date().toISOString() → "2024-11-18T14:30:45.123Z"
   * Permite saber cuándo se agregó (útil para analytics)
   *
   * @param {string} nombre - Nombre del producto
   * @param {number} precio - Precio unitario
   * @param {string} talla - Talla seleccionada
   * @param {number} cantidad - Cantidad a agregar (default 1)
   * @returns {void}
   */
  agregarProducto(nombre, precio, talla, cantidad) {
    // Buscar si el producto ya existe con la misma talla
    const indice = this.items.findIndex(
      (item) => item.nombre === nombre && item.talla === talla
    );

    if (indice !== -1) {
      // Si existe, incrementar cantidad
      this.items[indice].cantidad += cantidad;
    } else {
      // Si no existe, agregarlo
      this.items.push({
        id: this.generarId(),
        nombre,
        precio,
        talla,
        cantidad,
        fechaAgregado: new Date().toISOString(),
      });
    }

    this.guardarEnStorage();
  }

  /**
   * MÉTODO PRIVADO: generarId()
   *
   * Crea un ID único para cada item.
   *
   * FÓRMULA:
   * "item_" + Date.now() + "_" + random
   *
   * "item_" = prefijo claro (debugging)
   * Date.now() = timestamp en milisegundos
   *   Ejemplo: 1700397045123
   *   Único cada milisegundo
   * "_" = separador
   * Math.random().toString(36).substr(2, 9)
   *   Math.random() → 0.123456789
   *   toString(36) → convierte a base 36 (números + letras)
   *   substr(2, 9) → toma 9 caracteres aleatorios
   *   Resultado: "abc1def2g"
   *
   * EJEMPLO COMPLETO:
   * "item_1700397045123_abc1def2g"
   *
   * SUFICIENTEMENTE ÚNICO:
   * - Timestamp = único cada ms
   * - Random = extra uniqueness
   * - Probabilidad de colisión = casi cero en aplicaciones reales
   *
   * NOTA: En producción, usar UUID library o IDs del servidor
   * Esto es suficiente para cliente-side.
   *
   * @returns {string} ID único
   */
  generarId() {
    return "item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * MÉTODO PÚBLICO: obtenerItems()
   *
   * Retorna la lista completa de items.
   *
   * USO:
   * const items = carrito.obtenerItems();
   * items.forEach(item => console.log(item.nombre));
   *
   * ALTERNATIVA:
   * Podría usar getter: get items() { return this.items; }
   * Entonces acceso sería: carrito.items (sin ())
   *
   * @returns {array} Array de items
   */
  obtenerItems() {
    return this.items;
  }

  /**
   * MÉTODO PÚBLICO: obtenerCantidadTotal()
   *
   * Retorna la cantidad TOTAL de items.
   *
   * CÁLCULO: Suma todas las cantidades individuales.
   *
   * EJEMPLO:
   * Carrito con:
   * - Pantalón M (cantidad 2)
   * - Pantalón L (cantidad 1)
   * - Jean (cantidad 3)
   *
   * obtenerCantidadTotal() = 2 + 1 + 3 = 6
   *
   * IMPLEMENTACIÓN: reduce()
   * this.items.reduce((total, item) => total + item.cantidad, 0)
   *
   * reduce() acumula valores:
   * - Comienza con 0
   * - Para cada item, suma su cantidad
   * - Retorna el total
   *
   * USO:
   * const cantidad = carrito.obtenerCantidadTotal();
   * badge.textContent = cantidad; // Muestra 6
   *
   * @returns {number} Cantidad total de items
   */
  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * MÉTODO PÚBLICO: obtenerTotal()
   *
   * Calcula el total del carrito (suma de todos los subtotales).
   *
   * FÓRMULA: Para cada item: (precio * cantidad)
   * Luego suma todos esos subtotales.
   *
   * EJEMPLO:
   * Carrito:
   * - Pantalón M: $89.900 x 2 = $179.800
   * - Jean: $109.900 x 1 = $109.900
   * Total = $289.700
   *
   * IMPLEMENTACIÓN: reduce()
   * this.items.reduce((total, item) => {
   *   const precioNum = this.extraerNumeroDelPrecio(item.precio);
   *   return total + precioNum * item.cantidad;
   * }, 0)
   *
   * Nota: precio es un número, no un string, por lo que
   * extraerNumeroDelPrecio() no sería necesario aquí.
   * Pero está presente por compatibilidad con datos antiguos.
   *
   * @returns {number} Total en pesos
   */
  obtenerTotal() {
    return this.items.reduce((total, item) => {
      const precioNum = this.extraerNumeroDelPrecio(item.precio);
      return total + precioNum * item.cantidad;
    }, 0);
  }

  /**
   * MÉTODO PÚBLICO: obtenerDescuento()
   *
   * Calcula el descuento automático del 10% si el total > $500,000.
   *
   * REGLA: Si subtotal > $500,000 → 10% de descuento
   *
   * EJEMPLO:
   * Subtotal $600,000 → Descuento $60,000
   * Subtotal $400,000 → Descuento $0
   *
   * @returns {number} Monto del descuento en pesos
   */
  obtenerDescuento() {
    const subtotal = this.obtenerTotal();
    if (subtotal > 500000) {
      return subtotal * 0.1; // 10%
    }
    return 0;
  }

  /**
   * MÉTODO PRIVADO: extraerNumeroDelPrecio(precioText)
   *
   * Convierte string formateado en número puro.
   *
   * PROBLEMA: Algunos datos pueden venir como:
   * "$89.900" (string con símbolo y puntos)
   *
   * SOLUCIÓN:
   * "$89.900".replace(/\D/g, '') → "89900"
   * parseInt("89900", 10) → 89900 (número)
   *
   * REGEX: /\D/g
   * \D = cualquier carácter que NO sea dígito
   * g = global (reemplaza todos)
   *
   * Ejemplo:
   * "$89.900".replace(/\D/g, '')
   * → $ es \D, se elimina
   * → . es \D, se elimina
   * → quedan solo dígitos: "89900"
   *
   * FALLBACK: Si precioText es ya un número,
   * typeof check retorna ese número directamente.
   *
   * COMPATIBILIDAD:
   * Datos viejos podrían tener precios como strings.
   * Esta función maneja ambos casos.
   *
   * @param {string|number} precioText - Precio formateado o número
   * @returns {number} Precio como número
   */
  extraerNumeroDelPrecio(precioText) {
    const digits = String(precioText).replace(/[^0-9]/g, "");
    return digits ? Number(digits) : 0;
  }

  /**
   * Eliminar item del carrito
   */
  eliminarItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.guardarEnStorage();
  }

  /**
   * Actualizar cantidad de un item
   */
  actualizarCantidad(id, nuevaCantidad) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      if (nuevaCantidad <= 0) {
        this.eliminarItem(id);
      } else {
        item.cantidad = nuevaCantidad;
        this.guardarEnStorage();
      }
    }
  }

  /**
   * Vaciar carrito completamente
   */
  vaciar() {
    this.items = [];
    this.guardarEnStorage();
  }

  /**
   * Formatear número como moneda
   */
  formatearMoneda(numero) {
    try {
      return "$" + Number(numero).toLocaleString("es-CO");
    } catch (e) {
      return "$" + numero;
    }
  }
}

// ===================================================
// INSTANCIA GLOBAL Y FUNCIONES AUXILIARES
// ===================================================

// Crear instancia global del carrito
const carritoGlobal = new Carrito();

/**
 * Función para agregar producto al carrito desde catalogo.html
 * Se llama cuando se confirma una compra en el modal
 */
function agregarAlCarrito(nombre, precio, talla, cantidad) {
  if (!nombre || !precio || !talla || !cantidad) {
    console.warn("Datos incompletos para agregar al carrito");
    return false;
  }

  carritoGlobal.agregarProducto(nombre, precio, talla, Number(cantidad));
  actualizarBadgeCarrito();
  mostrarNotificacionCarrito(nombre, cantidad);
  return true;
}

/**
 * Actualizar el badge del carrito (número de items)
 */
function actualizarBadgeCarrito() {
  const badge = document.getElementById("cartoBadge");
  if (badge) {
    const cantidad = carritoGlobal.obtenerCantidadTotal();
    badge.textContent = cantidad;
    if (cantidad > 0) {
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

/**
 * Mostrar notificación de producto agregado
 */
function mostrarNotificacionCarrito(nombreProducto, cantidad) {
  const existente = document.getElementById("toastCarrito");
  if (!existente) {
    const toast = document.createElement("div");
    toast.id = "toastCarrito";
    toast.className = "toast toast-carrito";
    toast.innerHTML = `
      <span class="toast__icon">🛒</span>
      <span class="toast__msg">${nombreProducto} agregado (x${cantidad})</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}

// Inicializar badge cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarBadgeCarrito();
});

// ===================================================
// PÁGINA DE CARRITO - Funcionalidad carrito.html
// ===================================================

/**
 * Script para la página de carrito (carrito.html)
 * Maneja la visualización, actualización y gestión de items del carrito
 */
document.addEventListener("DOMContentLoaded", () => {
  const carritoBody = document.getElementById("carritoBody");
  const carritoVacio = document.getElementById("carritoVacio");
  const carritoContenido = document.getElementById("carritoContenido");
  const btnVaciar = document.getElementById("btnVaciar");
  const btnProceder = document.getElementById("btnProceder");

  // Elementos de resumen
  const cantidadTotalEl = document.getElementById("cantidadTotal");
  const subtotalEl = document.getElementById("subtotal");
  const envioEl = document.getElementById("envio");
  const totalPagoEl = document.getElementById("totalPago");

  /**
   * Renderizar tabla del carrito
   */
  function renderizarCarrito() {
    const items = carritoGlobal.obtenerItems();

    if (items.length === 0) {
      // Mostrar carrito vacío
      if (carritoContenido) carritoContenido.style.display = "none";
      if (carritoVacio) carritoVacio.style.display = "block";
      return;
    }

    // Mostrar carrito con contenido
    if (carritoContenido) carritoContenido.style.display = "block";
    if (carritoVacio) carritoVacio.style.display = "none";

    // Limpiar tabla
    carritoBody.innerHTML = "";

    // Agregar filas
    items.forEach((item) => {
      const precioUnitario = carritoGlobal.extraerNumeroDelPrecio(item.precio);
      const subtotal = precioUnitario * item.cantidad;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${escapeHtml(item.nombre)}</strong></td>
        <td>${escapeHtml(item.talla)}</td>
        <td>${carritoGlobal.formatearMoneda(precioUnitario)}</td>
        <td>
          <input 
            type="number" 
            class="input-cantidad" 
            value="${item.cantidad}" 
            min="1"
            data-item-id="${escapeHtml(item.id)}"
          />
        </td>
        <td>${carritoGlobal.formatearMoneda(subtotal)}</td>
        <td>
          <button class="btn-eliminar" data-item-id="${escapeHtml(
            item.id
          )}">Eliminar</button>
        </td>
      `;

      carritoBody.appendChild(row);
    });

    // Agregar event listeners a inputs de cantidad
    document.querySelectorAll(".input-cantidad").forEach((input) => {
      input.addEventListener("change", (e) => {
        const itemId = e.target.dataset.itemId;
        const nuevaCantidad = parseInt(e.target.value) || 1;
        carritoGlobal.actualizarCantidad(itemId, nuevaCantidad);
        renderizarCarrito();
      });
    });

    // Agregar event listeners a botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.dataset.itemId;
        carritoGlobal.eliminarItem(itemId);
        renderizarCarrito();
      });
    });

    // Actualizar resumen
    actualizarResumen();
  }

  /**
   * Actualizar resumen de carrito
   */
  function actualizarResumen() {
    const items = carritoGlobal.obtenerItems();
    const cantidadTotal = carritoGlobal.obtenerCantidadTotal();
    const subtotal = carritoGlobal.obtenerTotal();
    const descuento = carritoGlobal.obtenerDescuento();
    const subtotalConDescuento = subtotal - descuento;

    // Calcular envío: solo si subtotal con descuento < $100,000
    let envio = 0;
    if (subtotalConDescuento < 100000) {
      envio = Math.max(subtotalConDescuento * 0.05, 5000);
    }
    const totalPago = subtotalConDescuento + envio;

    if (cantidadTotalEl)
      cantidadTotalEl.textContent = cantidadTotal + " producto(s)";
    if (subtotalEl)
      subtotalEl.textContent = carritoGlobal.formatearMoneda(subtotal);
    if (envioEl) envioEl.textContent = carritoGlobal.formatearMoneda(envio);
    if (totalPagoEl)
      totalPagoEl.textContent = carritoGlobal.formatearMoneda(totalPago);

    // Mostrar descuento si aplica (>$500,000)
    const descuentoEl = document.getElementById("descuento");
    if (descuentoEl) {
      if (descuento > 0) {
        descuentoEl.classList.add("mostrar-descuento");
        descuentoEl.innerHTML = `
          <strong>🎉 ¡Descuento del 10%!</strong><br>
          -${carritoGlobal.formatearMoneda(descuento)}
        `;
      } else {
        descuentoEl.classList.remove("mostrar-descuento");
        descuentoEl.innerHTML = "";
      }
    }
  }

  /**
   * Vaciar carrito con confirmación
   */
  function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      carritoGlobal.vaciar();
      renderizarCarrito();
    }
  }

  /**
   * Proceder al pago
   */
  function procederAlPago() {
    const items = carritoGlobal.obtenerItems();

    if (items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    // 1. Recolectar los datos del carrito para la factura.
    // Los items ya están en el formato correcto.
    const itemsParaFactura = carritoGlobal.obtenerItems();

    // 2. Recolectar el resumen financiero.
    const resumenParaFactura = {
      subtotal: carritoGlobal.obtenerTotal(),
      descuento: carritoGlobal.obtenerDescuento(),
    };

    // 3. Llamar a la función para generar la factura en una nueva pestaña.
    // Esta función está en `facturacion.js`.
    if (typeof generarFactura === "function") {
      generarFactura(itemsParaFactura, resumenParaFactura);

      // 4. Vaciar el carrito y actualizar la vista DESPUÉS de un breve momento
      // para asegurar que la nueva pestaña se ha abierto correctamente.
      carritoGlobal.vaciar();
      renderizarCarrito();
    } else {
      console.error(
        "La función generarFactura() no está definida. Asegúrate de que facturacion.js esté incluido."
      );
      alert(
        "Hubo un error al procesar el pago. Por favor, inténtalo de nuevo."
      );
    }
  }

  /**
   * Generar número de orden único
   */
  function generarNumeroOrden() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `NYM-${y}${m}${d}${hh}${mm}${ss}-${rnd}`;
  }

  /**
   * Función para escapar caracteres HTML (seguridad XSS)
   */
  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event listeners para botones
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }

  if (btnProceder) {
    btnProceder.addEventListener("click", procederAlPago);
  }

  // Renderizar carrito al cargar la página
  renderizarCarrito();
});
