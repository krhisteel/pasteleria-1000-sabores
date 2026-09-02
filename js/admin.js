/* admin.js — Panel de administración: sesión, menú, portada */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Sesión
  var usuario = window.obtenerUsuarioActual ? obtenerUsuarioActual() : null;
  if (!usuario) { window.location.href = "login.html"; return; }
  if (usuario.tipo === "Cliente") { window.location.href = "index.html"; return; }

  // Barra superior: nombre + rol
  var bloque = document.getElementById("adminUsuario");
  if (bloque) {
    var s = document.createElement("span");
    s.textContent = "Hola, " + (usuario.nombre || "Usuario");
    var r = document.createElement("span");
    r.className = "admin-usuario-rol";
    r.textContent = usuario.tipo;
    r.setAttribute("aria-label", "Rol: " + usuario.tipo);
    bloque.appendChild(s);
    bloque.appendChild(r);
  }

  // Cerrar sesión
  var btn = document.getElementById("btnCerrarSesion");
  if (btn && typeof cerrarSesion === "function") {
    btn.addEventListener("click", cerrarSesion);
  }

  // Menú: ocultar enlaces que no corresponden al rol
  document.querySelectorAll("[data-roles]").forEach(function (el) {
    var roles = el.getAttribute("data-roles").split(",");
    if (roles.indexOf(usuario.tipo) === -1) {
      (el.closest("li") || el).classList.add("hidden");
    }
  });

  // Menú responsive
  var toggle = document.getElementById("adminToggle");
  var menu = document.getElementById("adminMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var abierto = menu.classList.toggle("activo");
      toggle.setAttribute("aria-expanded", String(abierto));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("activo");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Contador carrito (compartido con tienda)
  if (typeof actualizarContadorCarrito === "function") actualizarContadorCarrito();

  // Portada: resumen
  if (document.getElementById("tarjetasResumen")) renderizarPortadaAdmin();
});

// Portada: muestra totales de productos, stock y usuarios
function renderizarPortadaAdmin() {
  var productos = (typeof obtenerProductos === "function") ? obtenerProductos() : [];
  var totalStock = 0, totalCritico = 0;
  productos.forEach(function (p) {
    var stock = Number(p.stock) || 0;
    totalStock += stock;
    var critico = p.stockCritico !== undefined && p.stockCritico !== "" ? Number(p.stockCritico) : 0;
    if (critico > 0 && stock <= critico) totalCritico += 1;
  });
  var usuarios = (typeof obtenerUsuarios === "function") ? obtenerUsuarios() : [];
  var ids = ["totalProductos", "totalStock", "totalCritico", "totalUsuarios"];
  var vals = [productos.length, totalStock, totalCritico, usuarios.length];
  ids.forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) el.textContent = vals[i];
  });
}