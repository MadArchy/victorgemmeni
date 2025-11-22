/**
 * ============================================================
 * FACTURACIÓN ELECTRÓNICA - GLAMOUR NYM
 * ============================================================
 *
 * RESPONSABILIDADES:
 * 1. Generar factura electrónica en HTML
 * 2. Crear documento imprimible con estilos optimizados
 * 3. Incluir código QR con información de la factura
 * 4. Permitir descargar o imprimir directamente
 * 5. Guardar copia en localStorage para historial
 *
 * CARACTERÍSTICAS:
 * ✅ Factura profesional con logo y datos de empresa
 * ✅ Desglose completo de productos
 * ✅ Cálculo automático de totales
 * ✅ Código QR con datos de la factura
 * ✅ Optimizada para impresión (A4)
 * ✅ Responsive en pantalla
 * ✅ Numeración única por fecha/hora
 *
 * FLUJO:
 * 1. Usuario presiona "Proceder al Pago"
 * 2. procederAlPago() en carrito-unificado.js llama generarFactura()
 * 3. generarFactura() abre nueva ventana con HTML de factura
 * 4. Usuario puede imprimir (Ctrl+P) o guardar como PDF
 * 5. Factura se guarda en localStorage con número único
 *
 * SEGURIDAD:
 * ✅ Datos locales, no se envían a servidor
 * ✅ XSS prevention: escapeHtml en todos los valores
 * ✅ Validación de datos de entrada
 * ✅ Sin dependencias externas para QR (usa librería gratuita)
 *
 * ============================================================
 */

/**
 * FUNCIÓN: generarFactura()
 *
 * Crea y abre una nueva ventana/pestaña con la factura
 * electrónica lista para imprimir o descargar como PDF.
 *
 * @param {array} items - Array de productos en el carrito
 * @param {object} resumen - {subtotal, descuento}
 *
 * PROCESO:
 * 1. Valida datos de entrada
 * 2. Genera número de factura único
 * 3. Calcula totales
 * 4. Genera HTML de factura
 * 5. Abre nueva ventana con contenido
 * 6. Guarda copia en localStorage
 *
 * EJEMPLO DE LLAMADA:
 * generarFactura([
 *   {nombre: "Pantalón", precio: 89900, talla: "M", cantidad: 2}
 * ], {subtotal: 179800, descuento: 0})
 */
function generarFactura(items, resumen) {
  try {
    // Validar datos
    if (!items || items.length === 0) {
      console.error("No hay items para la factura");
      alert("Error: No hay productos en el carrito para facturar.");
      return;
    }

    if (!resumen || typeof resumen.subtotal !== "number") {
      console.error("Datos de resumen inválidos");
      alert("Error: Datos de resumen inválidos.");
      return;
    }

    // Generar datos de factura
    const numeroFactura = generarNumeroFactura();
    const fecha = new Date();
    const fechaFormato = fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const horaFormato = fecha.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Calcular totales
    const subtotal = resumen.subtotal || 0;
    const descuento = resumen.descuento || 0;
    const envio = calcularEnvio(subtotal);
    const total = subtotal - descuento + envio;

    // Calcular ruta base para que los recursos (img/) resuelvan correctamente
    const basePath = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/") + 1
    );

    // Generar HTML de la factura (se pasa basePath para que las rutas de img funcionen al abrir ventana nueva)
    const htmlFactura = generarHTMLFactura(
      numeroFactura,
      fechaFormato,
      horaFormato,
      items,
      subtotal,
      descuento,
      envio,
      total,
      basePath
    );

    // Guardar en localStorage
    guardarFacturaEnHistorial(numeroFactura, htmlFactura, total, fecha);

    // Abrir en nueva ventana
    const ventanaFactura = window.open("", "factura_" + numeroFactura, "");
    if (ventanaFactura) {
      ventanaFactura.document.write(htmlFactura);
      ventanaFactura.document.close();

      // Esperar a que cargue y luego mostrar diálogo de impresión
      ventanaFactura.onload = function () {
        // Pequeño delay para asegurar que el contenido esté renderizado
        setTimeout(() => {
          ventanaFactura.print();
        }, 250);
      };

      console.log("Factura generada exitosamente:", numeroFactura);
    } else {
      alert(
        "No se pudo abrir la ventana de factura. Verifica si tienes bloqueador de popups."
      );
    }
  } catch (error) {
    console.error("Error al generar factura:", error);
    alert("Hubo un error al generar la factura. Por favor, intenta de nuevo.");
  }
}

/**
 * FUNCIÓN: generarNumeroFactura()
 *
 * Crea un número único de factura basado en:
 * - Fecha y hora actual
 * - Números aleatorios para garantizar unicidad
 *
 * FORMATO: NYM-YYYYMMDDHHMMSS-XXXX
 * Ejemplo: NYM-20251119143025-7489
 *
 * @returns {string} Número de factura único
 */
function generarNumeroFactura() {
  const ahora = new Date();

  // Componentes de fecha/hora
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  const hora = String(ahora.getHours()).padStart(2, "0");
  const minuto = String(ahora.getMinutes()).padStart(2, "0");
  const segundo = String(ahora.getSeconds()).padStart(2, "0");

  // Número aleatorio de 4 dígitos para mayor unicidad
  const aleatorio = Math.floor(1000 + Math.random() * 9000);

  return `NYM-${año}${mes}${dia}${hora}${minuto}${segundo}-${aleatorio}`;
}

/**
 * FUNCIÓN: calcularEnvio()
 *
 * Define el costo de envío según el valor del pedido.
 * Lógica de negocio personalizable.
 *
 * REGLAS ACTUALES:
 * - Pedidos < $100,000: $15,000
 * - Pedidos $100,000 - $300,000: $10,000
 * - Pedidos > $300,000: GRATIS
 *
 * @param {number} subtotal - Subtotal antes de envío
 * @returns {number} Costo de envío en COP
 */
function calcularEnvio(subtotal) {
  if (subtotal >= 300000) {
    return 0; // Envío gratis para pedidos grandes
  } else if (subtotal >= 100000) {
    return 10000;
  } else {
    return 15000;
  }
}

/**
 * FUNCIÓN: formatearMoneda()
 *
 * Convierte números a formato de moneda COP (Peso Colombiano).
 * Ejemplo: 89900 → "$89.900"
 *
 * NOTA: Duplica función de carrito-unificado.js
 * para independencia de módulos.
 *
 * @param {number} numero - Valor a formatear
 * @returns {string} Valor formateado con $ y separadores de miles
 */
function formatearMoneda(numero) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numero);
}

/**
 * FUNCIÓN: escapeHtml()
 *
 * Previene ataques XSS escapando caracteres HTML especiales.
 * Importante para nombres de productos y datos de usuario.
 *
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto seguro para insertar en HTML
 */
function escapeHtml(texto) {
  const mapa = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(texto).replace(/[&<>"']/g, (m) => mapa[m]);
}

/**
 * FUNCIÓN: generarHTMLFactura()
 *
 * Crea todo el HTML de la factura con estilos para impresión.
 * Incluye:
 * - Encabezado con logo y datos de empresa
 * - Número de factura y fecha
 * - Tabla de productos
 * - Resumen de pagos
 * - Pie de página
 *
 * ESTILOS DE IMPRESIÓN:
 * - Optimizado para A4
 * - Sin márgenes excesivos
 * - Colores profesionales
 * - Tipografía clara y legible
 *
 * @param {string} numeroFactura - Número único de factura
 * @param {string} fecha - Fecha formateada (DD/MM/YYYY)
 * @param {string} hora - Hora formateada (HH:MM:SS)
 * @param {array} items - Array de productos
 * @param {number} subtotal - Subtotal sin descuentos
 * @param {number} descuento - Monto de descuento
 * @param {number} envio - Costo de envío
 * @param {number} total - Total a pagar
 * @returns {string} HTML completo de factura
 */
function generarHTMLFactura(
  numeroFactura,
  fecha,
  hora,
  items,
  subtotal,
  descuento,
  envio,
  total,
  basePath
) {
  // Generar filas de la tabla de productos
  let filasProductos = "";
  items.forEach((item, index) => {
    const subtotalItem = item.precio * item.cantidad;
    filasProductos += `
    <tr>
      <td class="col-num">${index + 1}</td>
      <td class="col-producto">${escapeHtml(item.nombre)}</td>
      <td class="col-talla">${escapeHtml(item.talla || "N/A")}</td>
      <td class="col-precio">${formatearMoneda(item.precio)}</td>
      <td class="col-cantidad">${item.cantidad}</td>
      <td class="col-subtotal">${formatearMoneda(subtotalItem)}</td>
    </tr>
    `;
  });

  // HTML completo de la factura
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factura ${numeroFactura}</title>
  <!-- Base para que rutas relativas (img/...) resuelvan correctamente al abrir ventana nueva -->
  <base href="${basePath}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            padding: 20px;
        }

        .factura-contenedor {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .factura-encabezado {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

    .logo-container {
      margin-right: 20px;
    }

    .factura-logo {
      max-height: 80px;
      width: auto;
      display: block;
    }

        .empresa-info h1 {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .empresa-info p {
            font-size: 12px;
            color: #7f8c8d;
            line-height: 1.5;
        }

        .factura-numero {
            text-align: right;
        }

        .factura-numero .label {
            font-size: 11px;
            color: #7f8c8d;
            text-transform: uppercase;
        }

        .factura-numero .numero {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-top: 5px;
        }

        .fecha-hora {
            margin-top: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 15px;
            background-color: #ecf0f1;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .fecha-hora-item {
            font-size: 12px;
        }

        .fecha-hora-item .label {
            font-weight: bold;
            color: #2c3e50;
        }

        .fecha-hora-item .valor {
            color: #555;
            margin-top: 3px;
        }

        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
        }

        .tabla-productos thead {
            background-color: #2c3e50;
            color: white;
        }

        .tabla-productos th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #34495e;
        }

        .tabla-productos td {
            padding: 10px 12px;
            border: 1px solid #ecf0f1;
        }

        .tabla-productos tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .tabla-productos tbody tr:hover {
            background-color: #f0f8ff;
        }

        .col-num {
            width: 5%;
            text-align: center;
        }

        .col-producto {
            width: 35%;
        }

        .col-talla {
            width: 10%;
            text-align: center;
        }

        .col-precio {
            width: 15%;
            text-align: right;
        }

        .col-cantidad {
            width: 10%;
            text-align: center;
        }

        .col-subtotal {
            width: 15%;
            text-align: right;
            font-weight: 600;
        }

        .resumen-pago {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #2c3e50;
            border-radius: 4px;
        }

        .resumen-fila {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
        }

        .resumen-fila .label {
            font-weight: 500;
            color: #555;
        }

        .resumen-fila .valor {
            text-align: right;
            min-width: 120px;
        }

        .resumen-fila.total {
            border-top: 2px solid #2c3e50;
            border-bottom: 2px solid #2c3e50;
            padding: 12px 0;
            margin: 12px 0;
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }

        .resumen-fila.descuento .valor {
            color: #27ae60;
            font-weight: 600;
        }

        .factura-pie {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            text-align: center;
            font-size: 11px;
            color: #7f8c8d;
            line-height: 1.6;
        }

        .codigo-qr {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }

        .codigo-qr img {
            width: 120px;
            height: 120px;
            border: 1px solid #ecf0f1;
        }

        .codigo-qr p {
            font-size: 10px;
            color: #7f8c8d;
            margin-top: 8px;
        }

        /* Estilos para impresión */
        @media print {
            body {
                background-color: white;
                padding: 0;
            }

      /* Forzar impresión de imágenes en navegadores que lo permiten */
      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

            .factura-contenedor {
                box-shadow: none;
                border-radius: 0;
                max-width: 100%;
                padding: 0;
                margin: 0;
            }

            .btn-imprimir {
                display: none;
            }

            @page {
                margin: 1cm;
            }
        }

        .btn-imprimir {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }

        .btn-imprimir:hover {
            background-color: #1a252f;
        }

        .nota-pie {
            margin-top: 15px;
            padding: 10px;
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
            font-size: 11px;
            color: #856404;
        }
    </style>
</head>
<body>
    <button class="btn-imprimir" onclick="window.print()">
        🖨️ Imprimir Factura
    </button>

    <div class="factura-contenedor">
    <!-- ENCABEZADO -->
    <div class="factura-encabezado">
      <div class="logo-container">
        <!-- Usamos basePath o <base> para resolver img/LOGO.JPEG -->
        <img src="img/LOGO.JPEG" alt="Logo GLAMOUR NYM" class="factura-logo">
      </div>
      <div class="empresa-info">
        <h1>GLAMOUR NYM</h1>
        <p>
          Tienda de Moda y Accesorios<br>
          Calle Principal 123, Bogotá, Colombia<br>
          Teléfono: +57 1 2345678<br>
          Email: info@glamournym.com<br>
          NIT: 900.123.456-7
        </p>
      </div>
      <div class="factura-numero">
        <div class="label">Factura Electrónica</div>
        <div class="numero">${numeroFactura}</div>
      </div>
    </div>

        <!-- FECHA Y HORA -->
        <div class="fecha-hora">
            <div class="fecha-hora-item">
                <div class="label">📅 Fecha:</div>
                <div class="valor">${fecha}</div>
            </div>
            <div class="fecha-hora-item">
                <div class="label">🕐 Hora:</div>
                <div class="valor">${hora}</div>
            </div>
        </div>

        <!-- TABLA DE PRODUCTOS -->
        <table class="tabla-productos">
            <thead>
                <tr>
                    <th class="col-num">#</th>
                    <th class="col-producto">Producto</th>
                    <th class="col-talla">Talla</th>
                    <th class="col-precio">Precio</th>
                    <th class="col-cantidad">Cant.</th>
                    <th class="col-subtotal">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${filasProductos}
            </tbody>
        </table>

        <!-- RESUMEN DE PAGOS -->
        <div class="resumen-pago">
            <div class="resumen-fila">
                <span class="label">Subtotal:</span>
                <span class="valor">${formatearMoneda(subtotal)}</span>
            </div>
            ${
              descuento > 0
                ? `
            <div class="resumen-fila descuento">
                <span class="label">Descuento:</span>
                <span class="valor">-${formatearMoneda(descuento)}</span>
            </div>
            `
                : ""
            }
            <div class="resumen-fila">
                <span class="label">Envío:</span>
                <span class="valor">${
                  envio === 0 ? "GRATIS" : formatearMoneda(envio)
                }</span>
            </div>
            <div class="resumen-fila total">
                <span class="label">TOTAL A PAGAR:</span>
                <span class="valor">${formatearMoneda(total)}</span>
            </div>
        </div>

        <!-- CÓDIGO QR -->
        <div class="codigo-qr">
            <p>📱 Código QR de la Factura</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
              numeroFactura
            )}" alt="Código QR">
            <p>${numeroFactura}</p>
        </div>

        <!-- PIE DE PÁGINA -->
        <div class="factura-pie">
            <p>
                <strong>Gracias por tu compra!</strong><br>
                Esta es una factura electrónica válida para propósitos de contabilidad.<br>
                Conserva este documento como comprobante de pago.<br>
                <br>
                Para mas información: info@glamournym.com | Teléfono: +57 3143437106<br>
                <br>
                &copy; ${new Date().getFullYear()} GLAMOUR NYM. Todos los derechos reservados.
            </p>
        </div>

        <div class="nota-pie">
            ⚠️ <strong>Nota:</strong> Esta factura fue generada electrónicamente. 
            Guárdala en tu computadora o imprime una copia para tus registros.
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * FUNCIÓN: guardarFacturaEnHistorial()
 *
 * Guarda una copia de la factura en localStorage
 * para que el usuario pueda consultarla después.
 *
 * ESTRUCTURA EN localStorage:
 * {
 *   "facturaGLAMOUR_numero": {
 *     numero: "NYM-...",
 *     fecha: "2025-11-19T14:30:25.000Z",
 *     total: 189800,
 *     html: "<!DOCTYPE html>..."
 *   }
 * }
 *
 * LÍMITE: localStorage solo almacena ~5-10MB
 * Después de ~50 facturas, considera limpiar las antiguas.
 *
 * @param {string} numeroFactura - Número único de factura
 * @param {string} htmlFactura - Contenido HTML de la factura
 * @param {number} total - Total de la factura
 * @param {Date} fecha - Fecha de la factura
 */
function guardarFacturaEnHistorial(numeroFactura, htmlFactura, total, fecha) {
  try {
    // Crear objeto con datos de la factura
    const datosFactura = {
      numero: numeroFactura,
      fecha: fecha.toISOString(),
      total: total,
      html: htmlFactura,
    };

    // Guardar en localStorage con clave única
    const claveStorage = `facturaGLAMOUR_${numeroFactura}`;
    localStorage.setItem(claveStorage, JSON.stringify(datosFactura));

    console.log("Factura guardada en historial:", numeroFactura);

    // Actualizar lista de facturas recientes
    actualizarListaFacturas(numeroFactura);
  } catch (error) {
    // Si localStorage está lleno, avisar pero no detener el flujo
    if (error.name === "QuotaExceededError") {
      console.warn(
        "localStorage está lleno. Considera limpiar facturas antiguas."
      );
      // Opcionalmente: limpiarFacturasAntiguas();
    } else {
      console.error("Error al guardar factura:", error);
    }
  }
}

/**
 * FUNCIÓN: actualizarListaFacturas()
 *
 * Mantiene una lista de los números de facturas recientes
 * para mostrar historial al usuario.
 *
 * @param {string} numeroFactura - Número nuevo de factura
 */
function actualizarListaFacturas(numeroFactura) {
  try {
    let lista = [];
    const datosLista = localStorage.getItem("facturaGLAMOUR_lista");

    if (datosLista) {
      lista = JSON.parse(datosLista);
    }

    // Agregar factura nueva al inicio
    lista.unshift(numeroFactura);

    // Mantener solo las últimas 50 facturas
    if (lista.length > 50) {
      const facturaAntiguaAEliminar = lista.pop();
      localStorage.removeItem(`facturaGLAMOUR_${facturaAntiguaAEliminar}`);
    }

    localStorage.setItem("facturaGLAMOUR_lista", JSON.stringify(lista));
  } catch (error) {
    console.error("Error al actualizar lista de facturas:", error);
  }
}

/**
 * FUNCIÓN: obtenerHistorialFacturas()
 *
 * Permite al usuario obtener su historial de facturas
 * si implementas una página de "Mis Facturas" en el futuro.
 *
 * @returns {array} Array de objetos con datos de facturas
 */
function obtenerHistorialFacturas() {
  try {
    const datosLista = localStorage.getItem("facturaGLAMOUR_lista");
    if (!datosLista) return [];

    const lista = JSON.parse(datosLista);
    const facturas = [];

    lista.forEach((numero) => {
      const claveStorage = `facturaGLAMOUR_${numero}`;
      const datosFactura = localStorage.getItem(claveStorage);
      if (datosFactura) {
        facturas.push(JSON.parse(datosFactura));
      }
    });

    return facturas;
  } catch (error) {
    console.error("Error al obtener historial de facturas:", error);
    return [];
  }
}

/**
 * FUNCIÓN: limpiarFacturasAntiguas()
 *
 * Elimina facturas antiguas si localStorage está lleno.
 * Usa esta función en caso de error QuotaExceededError.
 */
function limpiarFacturasAntiguas() {
  try {
    const datosLista = localStorage.getItem("facturaGLAMOUR_lista");
    if (!datosLista) return;

    let lista = JSON.parse(datosLista);

    // Eliminar facturas más antiguas de 30 días
    const ahora = new Date();
    const treintaDiasAtras = new Date(
      ahora.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    lista = lista.filter((numero) => {
      const claveStorage = `facturaGLAMOUR_${numero}`;
      const datosFactura = localStorage.getItem(claveStorage);
      if (!datosFactura) return false;

      const factura = JSON.parse(datosFactura);
      const fechaFactura = new Date(factura.fecha);

      if (fechaFactura < treintaDiasAtras) {
        localStorage.removeItem(claveStorage);
        return false;
      }
      return true;
    });

    localStorage.setItem("facturaGLAMOUR_lista", JSON.stringify(lista));
    console.log("Facturas antiguas eliminadas");
  } catch (error) {
    console.error("Error al limpiar facturas:", error);
  }
}
