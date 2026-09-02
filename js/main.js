/* ============================================================================
   MAIN.JS — Funciones globales del sitio
   ----------------------------------------------------------------------------
   Aileen Oyaneder (Módulo 1). Se carga en TODAS las páginas del sitio.
     - Menú responsive (hamburguesa)
     - Contador de carrito (lee de localStorage)
     - Sesión de usuario y rol persistente (clave "usuarioActivo")

   Acuerdos de integración con el equipo:
     - "carrito"       -> arreglo del carrito (Benjamín Riquelme, js/carrito.js)
     - "usuarioActivo" -> sesión iniciada (Aileen Oyaneder, js/login.js)
     - "usuarios"      -> usuarios registrados (Aileen Oyaneder / Jael Reyes)
   ========================================================================== */

"use strict";

/* ============================================================================
   SESIÓN DE USUARIO
   Estas funciones viven aquí (y no en login.js) porque main.js se carga en
   todas las páginas: así Jael Reyes puede leer el rol desde el panel
   de administración sin depender de la página de login.
   ========================================================================== */

/** Clave acordada por el equipo para guardar la sesión. */
const CLAVE_SESION = "usuarioActivo";

/**
 * Devuelve el usuario con sesión iniciada, o null si no hay ninguno.
 * @returns {object|null}
 */
function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");
  } catch (e) {
    return null;
  }
}

/** @returns {boolean} true si hay una sesión iniciada. */
function haySesion() {
  return obtenerUsuarioActual() !== null;
}

/** Cierra la sesión y vuelve al inicio. */
function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "index.html";
}

/** @returns {boolean} true si el usuario activo es Administrador. */
function esAdministrador() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Administrador";
}

/** @returns {boolean} true si el usuario activo es Vendedor. */
function esVendedor() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Vendedor";
}

/** @returns {boolean} true si el usuario activo es Cliente. */
function esCliente() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Cliente";
}

/**
 * Ajusta el header según la sesión activa.
 * Sin sesión: se ven "Iniciar Sesión" y "Registrarse".
 * Con sesión: se ve el nombre del usuario, su rol y el botón de cerrar sesión.
 * Administrador y Vendedor ven además el acceso al panel.
 */
function renderizarSesionEnHeader() {
  const acciones = document.querySelector(".nav-acciones");
  if (!acciones) return;

  const usuario = obtenerUsuarioActual();
  const botonLogin = acciones.querySelector(".btn-login");
  const botonRegistro = acciones.querySelector(".btn-registro");

  // Sin sesión: el header se queda tal cual está en el HTML
  if (!usuario) return;

  if (botonLogin) botonLogin.hidden = true;
  if (botonRegistro) botonRegistro.hidden = true;

  const bloque = document.createElement("div");
  bloque.className = "sesion-activa";

  const saludo = document.createElement("span");
  saludo.className = "sesion-nombre";
  saludo.textContent = "Hola, " + usuario.nombre;

  const rol = document.createElement("span");
  rol.className = "sesion-rol";
  rol.textContent = usuario.tipo;

  bloque.appendChild(saludo);
  bloque.appendChild(rol);

  // Acceso al panel solo para los roles que corresponde
  if (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor") {
    const panel = document.createElement("a");
    panel.className = "btn-panel";
    panel.href = "admin-home.html";
    panel.textContent = "Panel";
    bloque.appendChild(panel);
  }

  const salir = document.createElement("button");
  salir.type = "button";
  salir.className = "btn-salir";
  salir.textContent = "Cerrar Sesión";
  salir.addEventListener("click", cerrarSesion);
  bloque.appendChild(salir);

  acciones.insertBefore(bloque, acciones.firstChild);
}

/* ============================================================================
   CARRITO
   ========================================================================== */

/**
 * Actualiza el número del carrito en el header.
 * Lee la cantidad total desde localStorage.
 * Benjamín Riquelme crea la función original en js/carrito.js;
 * Aileen Oyaneder la reimplementa aquí para que el contador funcione en
 * todas las páginas del Módulo 1 aunque carrito.js no esté cargado.
 */
function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const total = carrito.reduce(function (suma, item) {
      return suma + (item.cantidad || 1);
    }, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = total;
  } catch (e) {
    // Si el localStorage tiene datos corruptos, el contador se queda en 0
  }
}

/* ============================================================================
   NEWSLETTER DEL FOOTER
   El footer es compartido, así que el formulario existe en las 8 páginas.
   Usa las funciones de js/validaciones.js (rol especialista).
   ========================================================================== */

/**
 * Conecta la validación del formulario de suscripción del footer.
 * Aplica la misma regla de dominios que el resto del sitio.
 */
function conectarNewsletter() {
  const formulario = document.getElementById("formNewsletter");
  if (!formulario) return;

  // Si validaciones.js no está cargado, no se engancha nada
  if (typeof validarCorreo !== "function") return;

  const campo = document.getElementById("correoNewsletter");
  const exito = document.getElementById("newsletterExito");

  function validarCampo() {
    const valor = campo.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campo, "Escribe tu correo para suscribirte.");
    }
    if (!validarLargoMaximo(valor, LARGOS.correo)) {
      return mostrarError(campo, "El correo no puede superar los " + LARGOS.correo + " caracteres.");
    }
    if (!validarCorreo(valor)) {
      return mostrarError(campo, "Solo se aceptan correos " + TEXTO_DOMINIOS + ".");
    }
    return marcarValido(campo);
  }

  campo.addEventListener("input", validarCampo);

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validarCampo()) return;

    // Suscripción simulada: no hay backend en esta entrega
    guardarSuscriptor(campo.value.trim().toLowerCase());

    formulario.classList.add("hidden");
    if (exito) exito.classList.remove("hidden");
  });
}

/**
 * Guarda el correo suscrito en localStorage, sin duplicados.
 * @param {string} correo
 */
function guardarSuscriptor(correo) {
  try {
    const suscriptores = JSON.parse(localStorage.getItem("suscriptores") || "[]");
    if (suscriptores.indexOf(correo) === -1) {
      suscriptores.push(correo);
      localStorage.setItem("suscriptores", JSON.stringify(suscriptores));
    }
  } catch (e) {
    // Si el navegador bloquea localStorage, la suscripción igual se confirma en pantalla
  }
}

/* ============================================================================
   PANEL DESPLEGABLE DE CARRITO / MIS PEDIDOS
   Se muestra en todas las páginas de la tienda (header compartido).
   Pestaña "Carrito": lista los productos del carrito.
   Pestaña "Mis pedidos": lista los pedidos por enviar (no entregados).
   ========================================================================== */

function leerDatosLocal(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || "[]");
  } catch (e) {
    return [];
  }
}

function leerPedidoActual() {
  try {
    return JSON.parse(localStorage.getItem("pedidoActual") || "null");
  } catch (e) {
    return null;
  }
}

function formatearMoneda(valor) {
  if (typeof formatearPrecio === "function") return formatearPrecio(valor);
  return "$" + Number(valor || 0).toLocaleString("es-CL");
}

function renderizarPanelCarrito() {
  const cont = document.getElementById("panelCarrito");
  if (!cont) return;

  const carrito = leerDatosLocal("carrito");

  if (carrito.length === 0) {
    cont.innerHTML = '<p class="carrito-panel-vacio">Tu carrito está vacío.</p>';
    return;
  }

  let html = "";
  carrito.forEach(function (item) {
    const sub = item.precio * item.cantidad;
    html += '<div class="carrito-panel-item">';
    html += '  <img src="' + item.imagen + '" alt="' + item.nombre + '">';
    html += '  <div class="carrito-panel-item-info">';
    html += '    <span class="carrito-panel-item-nombre">' + item.nombre + '</span>';
    html += '    <span class="carrito-panel-item-detalle">' + item.cantidad + ' × ' + formatearMoneda(item.precio) + '</span>';
    html += '  </div>';
    html += '  <span class="carrito-panel-item-total">' + formatearMoneda(sub) + '</span>';
    html += '</div>';
  });

  cont.innerHTML = html;
}

function renderizarPanelPedidos() {
  const cont = document.getElementById("panelPedidos");
  if (!cont) return;

  // Pedidos por enviar: todos los envíos registrados + el pedido actual
  const envios = leerDatosLocal("envios");
  const pedidoActual = leerPedidoActual();
  const entregados = ["Entregado"];
  const pendientes = [];

  if (pedidoActual && entregados.indexOf(pedidoActual.estado) === -1) {
    pendientes.push(pedidoActual);
  }
  envios.forEach(function (e) {
    if (entregados.indexOf(e.estado) === -1) {
      const yaExiste = pendientes.some(function (p) { return p.numero === e.numero; });
      if (!yaExiste) pendientes.push(e);
    }
  });

  if (pendientes.length === 0) {
    cont.innerHTML = '<p class="carrito-panel-vacio">No tienes pedidos por enviar.</p>';
    return;
  }

  let html = "";
  pendientes.forEach(function (p) {
    const total = p.productos ? p.productos.length : 0;
    html += '<div class="carrito-panel-item">';
    html += '  <div class="carrito-panel-item-info">';
    html += '    <span class="carrito-panel-item-nombre">' + p.numero + '</span>';
    html += '    <span class="carrito-panel-item-detalle">' + total + ' producto(s) · ' + (p.estado || "Pedido recibido") + '</span>';
    html += '  </div>';
    html += '  <span class="carrito-panel-estado pendiente">Por enviar</span>';
    html += '</div>';
  });

  cont.innerHTML = html;
}

function inicializarCarritoDropdown() {
  const dropdown = document.getElementById("carritoDropdown");
  if (!dropdown) return;

  const boton = document.getElementById("btnAbrirCarrito");
  const panel = document.getElementById("carritoPanel");
  if (!boton || !panel) return;

  function cerrar() {
    panel.classList.add("hidden");
    boton.setAttribute("aria-expanded", "false");
  }

  boton.addEventListener("click", function (e) {
    e.stopPropagation();
    const abriendo = panel.classList.contains("hidden");
    if (abriendo) {
      renderizarPanelCarrito();
      renderizarPanelPedidos();
    }
    panel.classList.toggle("hidden", !abriendo);
    boton.setAttribute("aria-expanded", String(abriendo));
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) cerrar();
  });

  // Pestañas
  panel.querySelectorAll(".carrito-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      panel.querySelectorAll(".carrito-tab").forEach(function (t) {
        t.classList.toggle("activo", t === tab);
      });
      const objetivo = tab.getAttribute("data-tab");
      const panelCarrito = document.getElementById("panelCarrito");
      const panelPedidos = document.getElementById("panelPedidos");
      if (panelCarrito) panelCarrito.classList.toggle("hidden", objetivo !== "carrito");
      if (panelPedidos) panelPedidos.classList.toggle("hidden", objetivo !== "pedidos");
    });
  });
}

/* ============================================================================
   ARRANQUE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------- Menú responsive ---------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const abierto = navLinks.classList.toggle("activo");
      menuToggle.classList.toggle("activo", abierto);
      menuToggle.setAttribute("aria-expanded", String(abierto));
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        navLinks.classList.remove("activo");
        menuToggle.classList.remove("activo");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  renderizarSesionEnHeader();
  actualizarContadorCarrito();
  conectarNewsletter();
  inicializarCarritoDropdown();
});
