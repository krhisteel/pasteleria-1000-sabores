/* ============================================================================
   MAIN.JS — Funciones globales del sitio
   ----------------------------------------------------------------------------
   - Menú responsive (hamburguesa)
   - Contador de carrito (lee de localStorage)
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------- Menú Responsive ---------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("activo");
      menuToggle.classList.toggle("activo");
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        navLinks.classList.remove("activo");
        menuToggle.classList.remove("activo");
      });
    });
  }

  /* ---------------------- Contador de Carrito ---------------------- */
  actualizarContadorCarrito();
});

/**
 * Actualiza el número del carrito en el header.
 * Lee la cantidad total desde localStorage.
 * Integrante B crea la función original en js/carrito.js
 * Integrante A la importa y ejecuta al cargar cada página.
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
    // Si hay error, dejar el contador en 0
  }
}
