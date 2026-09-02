/*
  MAIN.JS — Funciones globales del sitio
  Aileen Oyaneder (Módulo 1). Se carga en todas las páginas.
  Menú responsive, sesión de usuario, contador del carrito y newsletter.
  Claves de localStorage: "usuarioActivo", "carrito", "suscriptores".
*/

"use strict";

const CLAVE_SESION = "usuarioActivo";

function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");
  } catch (e) {
    return null;
  }
}

function haySesion() {
  return obtenerUsuarioActual() !== null;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "index.html";
}

function esAdministrador() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Administrador";
}

function esVendedor() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Vendedor";
}

function esCliente() {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.tipo === "Cliente";
}

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

document.addEventListener("DOMContentLoaded", function () {

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
});
