"use strict";

const CLAVE_SESION = "usuarioActivo";

// Devuelve el usuario con sesión activa desde localStorage, o null
function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");
  } catch (e) {
    return null;
  }
}

// Verifica si hay un usuario con sesión iniciada
function haySesion() {
  return obtenerUsuarioActual() !== null;
}

// Devuelve el descuento por edad del usuario activo (0 si no tiene)
function obtenerDescuentoEdad() {
  var usuario = obtenerUsuarioActual();
  if (!usuario) return 0;
  return Number(usuario.descuentoEdad) || 0;
}

// Elimina la sesión y redirige al inicio
function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "index.html";
}

// Comprueba si el usuario activo tiene rol de Administrador
function esAdministrador() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Administrador";
}

// Actualiza el header mostrando nombre, rol y botón de cerrar sesión
function renderizarSesionEnHeader() {
  const acciones = document.querySelector(".nav-acciones");
  if (!acciones) return;

  const usuario = obtenerUsuarioActual();
  const botonLogin = acciones.querySelector(".btn-login");
  const botonRegistro = acciones.querySelector(".btn-registro");

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

// Lee el carrito de localStorage y actualiza el número en el header
function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const total = carrito.reduce(function (suma, item) {
      return suma + (item.cantidad || 1);
    }, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = total;
  } catch (e) {
  }
}

// Valida y procesa la suscripción al newsletter del footer
function conectarNewsletter() {
  const formulario = document.getElementById("formNewsletter");
  if (!formulario) return;

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

    guardarSuscriptor(campo.value.trim().toLowerCase());

    formulario.classList.add("hidden");
    if (exito) exito.classList.remove("hidden");
  });
}

// Guarda el correo suscrito en localStorage sin duplicados
function guardarSuscriptor(correo) {
  try {
    const suscriptores = JSON.parse(localStorage.getItem("suscriptores") || "[]");
    if (suscriptores.indexOf(correo) === -1) {
      suscriptores.push(correo);
      localStorage.setItem("suscriptores", JSON.stringify(suscriptores));
    }
  } catch (e) {
  }
}

// Lee y parsea un arreglo desde localStorage de forma segura
function leerDatosLocal(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || "[]");
  } catch (e) {
    return [];
  }
}

// Lee el pedido en curso desde localStorage
function leerPedidoActual() {
  try {
    return JSON.parse(localStorage.getItem("pedidoActual") || "null");
  } catch (e) {
    return null;
  }
}

// Formatea un número como precio chileno ($XX.XXX)
function formatearMoneda(valor) {
  if (typeof formatearPrecio === "function") return formatearPrecio(valor);
  return "$" + Number(valor || 0).toLocaleString("es-CL");
}

// Renderiza los productos del carrito en el panel desplegable
function renderizarPanelCarrito() {
  const cont = document.getElementById("panelCarrito");
  const footer = document.getElementById("carritoFooter");
  if (!cont) return;

  const carrito = leerDatosLocal("carrito");

  if (carrito.length === 0) {
    cont.innerHTML = "";
    if (footer) footer.classList.add("hidden");
    return;
  }

  if (footer) footer.classList.remove("hidden");

  let total = 0;
  let html = "";
  carrito.forEach(function (item) {
    const precio = Number(item.precio) || 0;
    const descuento = Number(item.descuento) || 0;
    const descuentoEdad = Number(item.descuentoEdad) || 0;
    const descuentoTotal = Math.min(descuento + descuentoEdad, 100);
    const precioFinal = descuentoTotal > 0 ? Math.round(precio * (1 - descuentoTotal / 100)) : precio;
    const sub = precioFinal * item.cantidad;
    total += sub;
    html += '<div class="carrito-panel-item">';
    html += '  <img src="' + item.imagen + '" alt="' + item.nombre + '">';
    html += '  <div class="carrito-panel-item-info">';
    html += '    <span class="carrito-panel-item-nombre">' + item.nombre + '</span>';
    html += '    <span class="carrito-panel-item-detalle">' + item.cantidad + ' × ' + formatearMoneda(precioFinal) + '</span>';
    html += '  </div>';
    html += '  <span class="carrito-panel-item-total">' + formatearMoneda(sub) + '</span>';
    html += '</div>';
  });

  html += '<div class="carrito-panel-total">';
  html += '  <span>Total</span>';
  html += '  <strong>' + formatearMoneda(total) + '</strong>';
  html += '</div>';

  cont.innerHTML = html;
}

// Renderiza los pedidos pendientes de envío en el panel
function renderizarPanelPedidos() {
  const cont = document.getElementById("panelPedidos");
  if (!cont) return;

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

// Configura el panel desplegable del carrito (abrir/cerrar)
function inicializarCarritoDropdown() {
  const dropdown = document.getElementById("carritoDropdown");
  if (!dropdown) return;

  const boton = document.getElementById("btnAbrirCarrito");
  const panel = document.getElementById("carritoPanel");
  if (!boton || !panel) return;

  let ultimoCierre = 0;

  function cerrar() {
    panel.classList.add("hidden");
    boton.setAttribute("aria-expanded", "false");
    ultimoCierre = Date.now();
  }

  function abrir() {
    // No abrir si se cerró hace menos de 300ms (evita clics accidentales)
    if (Date.now() - ultimoCierre < 300) return;
    renderizarPanelCarrito();
    panel.classList.remove("hidden");
    boton.setAttribute("aria-expanded", "true");
  }

  boton.addEventListener("click", function (e) {
    e.stopPropagation();

    // Si ya está abierto, cerrar
    if (!panel.classList.contains("hidden")) {
      cerrar();
      return;
    }

    // Si no hay productos, no abrir nada
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    if (carrito.length === 0) return;

    // Abrir y renderizar
    renderizarPanelCarrito();
    panel.classList.remove("hidden");
    boton.setAttribute("aria-expanded", "true");
  });

  // Cerrar automáticamente si no hay productos
  setInterval(function () {
    if (panel.classList.contains("hidden")) return;
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    if (carrito.length === 0) cerrar();
  }, 1000);

  // Cerrar al hacer scroll
  window.addEventListener("scroll", function () {
    if (!panel.classList.contains("hidden")) cerrar();
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", function () {

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const abierto = navLinks.classList.toggle("activo");
      menuToggle.classList.toggle("activo", abierto);
      menuToggle.setAttribute("aria-expanded", String(abierto));
    });

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
