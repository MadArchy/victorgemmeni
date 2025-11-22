document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias seguras al modal y elementos relacionados
  const modal = document.getElementById("modalCompra");
  if (!modal) return; // nada que hacer si no existe

  const cerrar = modal.querySelector(".cerrar");
  const nombreProducto = document.getElementById("nombreProducto");
  const botonesComprar = document.querySelectorAll(".btn-comprar");
  // mantener referencia al producto seleccionado cuando se abre el modal
  let selectedProduct = null;
  // acción solicitada por el modal: 'add' -> añadir y quedarse, 'buy' -> añadir y proceder a pago
  let actionType = null;
  // Variables para manejar release functions del focus trap
  let releaseFocusModal = null;
  let releaseFocusConfirm = null;

  // Helpers para animar apertura/cierre de modales
  /**
   * openModalElement
   * Abre un modal (establece display:flex y añade clase para animación).
   * @param {HTMLElement} modalEl - Elemento modal a abrir
   */
  function openModalElement(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "flex";
    // Añadimos clase en el siguiente frame para disparar la transición
    requestAnimationFrame(() => modalEl.classList.add("modal--open"));
  }

  /**
   * closeModalElement
   * Cierra un modal con animación y ejecuta callback opcional al finalizar.
   * @param {HTMLElement} modalEl - Elemento modal a cerrar
   * @param {Function} [cb] - Callback que se ejecuta al cerrar
   */
  function closeModalElement(modalEl, cb) {
    if (!modalEl) {
      if (cb) cb();
      return;
    }
    // quitar clase para iniciar animación de cierre
    modalEl.classList.remove("modal--open");
    let handled = false;
    function onTransition(e) {
      if (e.target !== modalEl) return;
      if (handled) return;
      handled = true;
      modalEl.style.display = "none";
      modalEl.removeEventListener("transitionend", onTransition);
      if (cb) cb();
    }
    modalEl.addEventListener("transitionend", onTransition);
    // Fallback: si no hay transición, asegurar ocultado
    setTimeout(() => {
      if (!handled) {
        handled = true;
        modalEl.style.display = "none";
        modalEl.removeEventListener("transitionend", onTransition);
        if (cb) cb();
      }
    }, 450);
  }

  // Nuevo comportamiento solicitado:
  // - Añadir dinámicamente un botón "Añadir al carrito" en cada .producto
  // - El botón existente "Comprar" añadirá el producto al carrito y redirigirá a la página de carrito (carrito.html)

  /**
   * parsePriceToNumber
   * Convierte texto de precio formateado (por ejemplo "$89.900") a número (89900).
   * Retorna 0 si no puede parsear.
   * @param {string} priceText
   * @returns {number}
   */
  function parsePriceToNumber(priceText) {
    if (!priceText) return 0;
    const digits = String(priceText).replace(/[^0-9]/g, "");
    return digits ? Number(digits) : 0;
  }

  // Añadir botón "Añadir al carrito" a cada producto y enlazar comportamiento
  document.querySelectorAll('.producto').forEach(prod => {
    // Crear botón solo si no existe ya (evita duplicados al recargar listeners)
    if (!prod.querySelector('.btn-addcarrito')) {
      const btnAdd = document.createElement('button');
      btnAdd.className = 'btn btn-addcarrito';
      btnAdd.type = 'button';
      // Icono SVG (carrito con +) para identificar acción de agregar al carrito
      btnAdd.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:18px;height:18px;vertical-align:middle;margin-right:8px">
          <path d="M7 4h-2l-3 7v2h2l3-7h11l1.2 4H9v2h10a1 1 0 0 1 .98 1.2l-1.5 6A1 1 0 0 1 17.5 19H8a1 1 0 0 1-.98-.8L5 6H3V4h4zm0 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 .001-4.001A2 2 0 0 0 17 20z"/>
        </svg>
        <span style="vertical-align:middle">Añadir al carrito</span>
      `;
      // Asegurar un contenedor de acciones para los botones y insertar en orden
      let actions = prod.querySelector('.producto-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'producto-actions';
        prod.appendChild(actions);
      }

      // Mover (o insertar) botones dentro del contenedor: Añadir al carrito a la izquierda, Comprar a la derecha
      const btnComprarExist = prod.querySelector('.btn-comprar');
      // Añadimos primero el botón 'Añadir', luego movemos el botón 'Comprar' dentro del contenedor
      actions.appendChild(btnAdd);
      if (btnComprarExist) {
        actions.appendChild(btnComprarExist);
      }

  // Al hacer click en "Añadir al carrito" abrimos el modal para elegir talla/cantidad
      // Usamos un icono SVG (carrito con +) para mejor apariencia
      btnAdd.addEventListener('click', (e) => {
        const productoEl = e.target.closest('.producto');
        selectedProduct = productoEl || null;
        const nombre = selectedProduct
          ? selectedProduct.dataset.nombre || selectedProduct.querySelector('h3')?.textContent
          : 'Producto';
        if (nombreProducto) nombreProducto.textContent = nombre;

        // Limpiar/ajustar campos del modal
        const tallaField = modal.querySelector('#talla');
        const cantidadField = modal.querySelector('#cantidad');
        if (tallaField) tallaField.value = '';
        if (cantidadField) cantidadField.value = 1;

        const compraPrecioEl = modal.querySelector('#compraPrecio');
        const compraTotalEl = modal.querySelector('#compraTotal');
        if (compraPrecioEl) compraPrecioEl.textContent = '';
        if (compraTotalEl) compraTotalEl.textContent = '';
        if (selectedProduct && compraPrecioEl) {
          const precioEl = selectedProduct.querySelector('.precio');
          if (precioEl)
            compraPrecioEl.textContent = `Precio unitario: ${precioEl.textContent.trim()}`;
        }

        actionType = 'add';
        openModalElement(modal);
        document.body.style.overflow = 'hidden';
        const confirmar = modal.querySelector('.btn-confirmar');
        if (confirmar) confirmar.focus();
        if (typeof trapFocus === 'function') {
          if (releaseFocusModal) releaseFocusModal();
          releaseFocusModal = trapFocus(modal);
        }
      });
    }
  });

  // Ajustar el texto/icono de los botones "Comprar" y enlazar para abrir modal en modo 'buy'
  botonesComprar.forEach((btn) => {
    // Añadir icono SVG de tarjeta para consistencia visual
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;vertical-align:middle;margin-right:8px">
        <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3H2V7zm0 5h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5zM6 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
      <span>Comprar</span>
    `;
    // Remover listeners antiguos si existieran (defensivo)
    btn.replaceWith(btn.cloneNode(true));
  });

  // Re-obtener botones porque los hemos clonado
  const botonesComprarNuevo = document.querySelectorAll('.btn-comprar');
  botonesComprarNuevo.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const producto = e.target.closest('.producto');
      selectedProduct = producto || null;
      const nombre = selectedProduct
        ? selectedProduct.dataset.nombre || selectedProduct.querySelector('h3')?.textContent
        : 'Producto';
      if (nombreProducto) nombreProducto.textContent = nombre;

      // preparar modal
      const tallaField = modal.querySelector('#talla');
      const cantidadField = modal.querySelector('#cantidad');
      if (tallaField) tallaField.value = '';
      if (cantidadField) cantidadField.value = 1;
      const compraPrecioEl = modal.querySelector('#compraPrecio');
      const compraTotalEl = modal.querySelector('#compraTotal');
      if (compraPrecioEl) compraPrecioEl.textContent = '';
      if (compraTotalEl) compraTotalEl.textContent = '';
      if (selectedProduct && compraPrecioEl) {
        const precioEl = selectedProduct.querySelector('.precio');
        if (precioEl)
          compraPrecioEl.textContent = `Precio unitario: ${precioEl.textContent.trim()}`;
      }

      actionType = 'buy';
      openModalElement(modal);
      document.body.style.overflow = 'hidden';
      const confirmar = modal.querySelector('.btn-confirmar');
      if (confirmar) confirmar.focus();
      if (typeof trapFocus === 'function') {
        if (releaseFocusModal) releaseFocusModal();
        releaseFocusModal = trapFocus(modal);
      }
    });
  });

  // Función de cierre reutilizable
  /**
   * closeModal
   * Cierra el modal principal de compra y restaura el scroll del body.
   */
  function closeModal() {
    closeModalElement(modal, () => {
      document.body.style.overflow = "";
      // Desactivar trap de foco si está activo
      if (releaseFocusModal) {
        releaseFocusModal();
        releaseFocusModal = null;
      }
    });
  }

  if (cerrar) {
    cerrar.addEventListener("click", closeModal);
  }

  // Cerrar al hacer clic fuera del contenido del modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar con la tecla Escape (accesibilidad)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* -----------------------------
     Actualizar total en tiempo real
     ----------------------------- */
  const cantidadFieldGlobal = modal.querySelector("#cantidad");
  const compraPrecioGlobal = modal.querySelector("#compraPrecio");
  const compraTotalGlobal = modal.querySelector("#compraTotal");

  /**
   * formatNumber
   * Formatea número a cadena de moneda COP.
   * @param {number} n
   * @returns {string}
   */
  function formatNumber(n) {
    try {
      return "$" + Number(n).toLocaleString("es-CO");
    } catch (e) {
      return String(n);
    }
  }

  /**
   * updateTotalPreview
   * Calcula y muestra el total en el modal según la cantidad seleccionada y el precio unitario.
   */
  function updateTotalPreview() {
    if (!compraTotalGlobal) return;
    const cantidadVal = cantidadFieldGlobal
      ? Number(cantidadFieldGlobal.value)
      : NaN;
    let unitNum = NaN;
    if (selectedProduct) {
      const p = selectedProduct.querySelector(".precio");
      unitNum = p ? parsePriceToNumber(p.textContent) : NaN;
    }
    // Si no hay selectedProduct activo, intentar extraer del texto de compraPrecioGlobal
    if (
      isNaN(unitNum) &&
      compraPrecioGlobal &&
      compraPrecioGlobal.textContent
    ) {
      const match = compraPrecioGlobal.textContent.match(/\$?([0-9.,]+)/);
      unitNum = match ? parsePriceToNumber(match[1]) : NaN;
    }

    if (isNaN(unitNum) || isNaN(cantidadVal) || cantidadVal < 1) {
      compraTotalGlobal.textContent = "";
      return;
    }

    const total = unitNum * cantidadVal;
    compraTotalGlobal.textContent = `Total: ${formatNumber(total)}`;
  }

  if (cantidadFieldGlobal) {
    cantidadFieldGlobal.addEventListener("input", updateTotalPreview);
  }

  // Toast
  const toast = document.getElementById("toast");
  const toastMsg = toast ? toast.querySelector(".toast__msg") : null;

  /**
   * showToast
   * Muestra un mensaje toast temporal en la pantalla.
   * @param {string} message - Mensaje a mostrar
   * @param {number} [timeout=2500] - Duración en ms
   */
  function showToast(message, timeout = 2500) {
    if (!toast || !toastMsg) return;
    toast.classList.toggle("toast--success", true);
    toastMsg.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, timeout);
  }

  // Botón confirmar: comprobar existencia antes de usar
  const btnConfirmar = document.querySelector(".btn-confirmar");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      // Obtener datos seleccionados
      const tallaEl = document.getElementById("talla");
      const cantidadEl = document.getElementById("cantidad");
      const compraErrorEl = document.getElementById("compraError");

      // limpiar estados previos
      if (compraErrorEl) compraErrorEl.textContent = "";
      if (tallaEl) tallaEl.classList.remove("input-error");
      if (cantidadEl) cantidadEl.classList.remove("input-error");

      const talla = tallaEl ? tallaEl.value : "";
      const cantidad = cantidadEl ? cantidadEl.value : "";

      // Validación: impedir confirmar si no hay talla o cantidad válida
      let invalido = false;
      if (!talla || talla.trim() === "") {
        invalido = true;
        if (tallaEl) tallaEl.classList.add("input-error");
      }
      const cantidadNum = cantidad !== "" ? Number(cantidad) : NaN;
      if (isNaN(cantidadNum) || cantidadNum < 1) {
        invalido = true;
        if (cantidadEl) cantidadEl.classList.add("input-error");
      }

      if (invalido) {
        if (compraErrorEl) {
          compraErrorEl.textContent =
            "Por favor seleccione una talla y una cantidad válidas.";
        }
        // enfocar primer campo inválido
        if (tallaEl && tallaEl.classList.contains("input-error")) {
          tallaEl.focus();
        } else if (cantidadEl && cantidadEl.classList.contains("input-error")) {
          cantidadEl.focus();
        }
        return; // no continuar con la confirmación
      }
      const productoNombre = nombreProducto
        ? nombreProducto.textContent.trim()
        : "Producto";

      // Intentar obtener el precio unitario desde el producto seleccionado
      let precioUnitarioNum = NaN;
      let precioUnitarioText = "";
      if (selectedProduct) {
        const precioEl = selectedProduct.querySelector(".precio");
        if (precioEl) {
          precioUnitarioText = precioEl.textContent.trim();
          // Extraer solo dígitos para convertir a número (quitar símbolos y separadores)
          const digits = precioUnitarioText.replace(/[^0-9]/g, "");
          if (digits) {
            precioUnitarioNum = Number(digits);
          }
        }
      }
      // Si no encontramos precio por selectedProduct, intentar extraer del DOM por nombre
      if (isNaN(precioUnitarioNum) || precioUnitarioNum === 0) {
        const posible = document.querySelector(
          `.producto[data-nombre="${productoNombre.replace(
            /"/g,
            '\\"'
          )}"] .precio`
        );
        if (posible) {
          precioUnitarioText = posible.textContent.trim();
          const digits = precioUnitarioText.replace(/[^0-9]/g, "");
          if (digits) precioUnitarioNum = Number(digits);
        }
      }

      // Calcular total (precioUnitarioNum ya está en centenares si originalmente tenía separador de miles)
      // Ej: precioUnitarioText '$89.900' -> digits '89900' -> precioUnitarioNum 89900
      const totalNum =
        !isNaN(precioUnitarioNum) && !isNaN(cantidadNum)
          ? precioUnitarioNum * cantidadNum
          : NaN;
      // Formatear números para mostrar (usar notación local con separador de miles)
      const formatNumber = (n) => {
        try {
          return "$" + Number(n).toLocaleString("es-CO");
        } catch (e) {
          return String(n);
        }
      };

      // Cerrar modal de compra
      closeModal();

      // Preparar y mostrar modal de confirmación con detalles
      const modalConfirm = document.getElementById("modalConfirm");
      const confirmDetails = modalConfirm
        ? modalConfirm.querySelector("#confirmDetails")
        : null;
      const confirmarCloseBtn = modalConfirm
        ? modalConfirm.querySelector(".btn-close-confirm")
        : null;
      const cerrarConfirm = modalConfirm
        ? modalConfirm.querySelector(".cerrar-confirm")
        : null;

      if (confirmDetails) {
        // Generar número de pedido simulado
        const orderId = generateOrderId();
        // Construir markup de detalles, incluyendo precio unitario y total si están disponibles
        let precioHtml = "";
        if (!isNaN(precioUnitarioNum)) {
          precioHtml = `Precio unitario: <strong>${escapeHtml(
            formatNumber(precioUnitarioNum)
          )}</strong><br/>`;
        }
        let totalHtml = "";
        if (!isNaN(totalNum)) {
          totalHtml = `Total: <strong>${escapeHtml(
            formatNumber(totalNum)
          )}</strong><br/>`;
        }

        confirmDetails.innerHTML = `Producto: <strong>${escapeHtml(
          productoNombre
        )}</strong><br/>${precioHtml}Talla: <strong>${escapeHtml(
          talla
        )}</strong><br/>Cantidad: <strong>${escapeHtml(
          cantidad
        )}</strong><br/>${totalHtml}<span class="order-number">Número de pedido: <strong>${escapeHtml(
          orderId
        )}</strong></span>`;
      }

      if (modalConfirm) {
        openModalElement(modalConfirm);
        document.body.style.overflow = "hidden";
        if (confirmarCloseBtn) confirmarCloseBtn.focus();
        // activar trap de foco para modalConfirm
        if (typeof trapFocus === "function") {
          if (releaseFocusConfirm) releaseFocusConfirm();
          releaseFocusConfirm = trapFocus(modalConfirm);
        }

        // Agregar producto al carrito (nuevo código)
        if (typeof agregarAlCarrito === "function") {
          // CORRECCIÓN: Asegurarse de pasar el precio como un número.
          agregarAlCarrito(
            productoNombre,
            precioUnitarioNum,
            talla,
            cantidadNum
          );

          // Si el flujo fue iniciado por el botón 'Comprar', procedemos al pago
          if (actionType === 'buy') {
            // Navegar a la página de carrito/pago
            window.location.href = 'carrito.html';
          }
        }
      } else {
        // Fallback al toast si no existe modalConfirm
        showToast("Compra confirmada", true);
      }

      // Cerrar modal de confirmación handlers
      function closeConfirm() {
        closeModalElement(modalConfirm, () => {
          document.body.style.overflow = "";
        });
        if (releaseFocusConfirm) {
          releaseFocusConfirm();
          releaseFocusConfirm = null;
        }
      }

      if (cerrarConfirm) cerrarConfirm.addEventListener("click", closeConfirm);
      if (confirmarCloseBtn)
        confirmarCloseBtn.addEventListener("click", closeConfirm);

      // Cerrar al clic fuera del contenido
      window.addEventListener("click", function onWindowClick(e) {
        if (modalConfirm && e.target === modalConfirm) {
          closeConfirm();
          window.removeEventListener("click", onWindowClick);
        }
      });

      // Cerrar con Escape (también soporta cerrar modalCompra)
      window.addEventListener("keydown", function onKeydown(e) {
        if (e.key === "Escape") {
          closeConfirm();
          window.removeEventListener("keydown", onKeydown);
        }
      });
    });
  }

  /**
   * escapeHtml
   * Escapa caracteres especiales para prevenir XSS al insertar en innerHTML.
   * @param {string} unsafe
   * @returns {string}
   */
  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * generateOrderId
   * Genera un identificador único simple para pedidos (prefijo + timestamp + 4 dígitos aleatorios).
   * @returns {string}
   */
  function generateOrderId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const rnd = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
    return `NYM-${y}${m}${d}${hh}${mm}${ss}-${rnd}`;
  }

  // -----------------------------
  // FOCUS TRAP - mantiene el foco dentro de un modal mientras está abierto
  // Devuelve una función para desactivar el trap
  // -----------------------------

  /**
   * trapFocus
   * Mantiene el foco dentro de un modal mientras está abierto. Devuelve función para liberar el trap.
   * @param {HTMLElement} modalElement
   * @returns {Function|null} release function
   */
  function trapFocus(modalElement) {
    if (!modalElement) return null;
    const focusableSelectors =
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    // obtener nodos enfocables actuales dentro del modal
    const nodes = Array.from(
      modalElement.querySelectorAll(focusableSelectors)
    ).filter(
      (n) => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length)
    );
    if (nodes.length === 0) return null;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    // Handler de teclado para gestionar Tab y Shift+Tab
    /**
     * handleKey
     * Gestiona navegación con Tab/Shift+Tab dentro del trap de foco.
     */
    function handleKey(e) {
      if (e.key !== "Tab") return;
      if (nodes.length === 1) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Forzamos el foco al primer elemento
    first.focus();
    document.addEventListener("keydown", handleKey);

    // Retornar función que quita el listener
    return function release() {
      document.removeEventListener("keydown", handleKey);
    };
  }
});

/*
  -----------------------------
  CARRUSEL HEADER (catalogo.html)
  -----------------------------
  Cambia las imágenes de fondo del encabezado de la página de catálogo.
*/
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const headerImages = header.querySelectorAll(".header-img");
  if (headerImages.length < 2) return;

  const images = [
    "img/IMP 2.jpg",
    "img/IMP 3.jpg",
    "img/IMP 4.jpg",
    "img/IMP 5.jpg",
    "img/imagen1.webp",
  ];
  let currentImageIndex = 0;

  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = [...headerImages].find(
      (img) => !img.classList.contains("visible")
    );
    nextImage.src = images[currentImageIndex];
    headerImages.forEach((img) => img.classList.toggle("visible"));
  }, 5000); // Cambia la imagen cada 5 segundos
});
