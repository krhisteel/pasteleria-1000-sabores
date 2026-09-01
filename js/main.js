/* ============================================================================
   MAIN.JS — Funciones globales del sitio
   ----------------------------------------------------------------------------
   Integrante A (Módulo 1). Se carga en TODAS las páginas del sitio.
     - Menú responsive (hamburguesa)
     - Contador de carrito (lee de localStorage)
     - Sesión de usuario y rol persistente (clave "usuarioActivo")

   Acuerdos de integración con el equipo:
     - "carrito"       -> arreglo del carrito (Integrante B, js/carrito.js)
     - "usuarioActivo" -> sesión iniciada (Integrante A, js/login.js)
     - "usuarios"      -> usuarios registrados (Integrante A / Integrante C)
   ========================================================================== */

"use strict";

/* ============================================================================
   SESIÓN DE USUARIO
   Estas funciones viven aquí (y no en login.js) porque main.js se carga en
   todas las páginas: así el Integrante C puede leer el rol desde el panel
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
 * El Integrante B crea la función original en js/carrito.js;
 * el Integrante A la reimplementa aquí para que el contador funcione en
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
});
