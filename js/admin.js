/* ============================================================================
   ADMIN.JS — Lógica compartida del panel de administración
   ----------------------------------------------------------------------------
   Jael Reyes (Módulo 3).
   Se carga en TODAS las páginas del panel (admin-*.html) junto con
   js/main.js. Aquí vive lo transversal del panel:

     - Protección: sin sesión se va a login; un Cliente no entra al panel.
     - Render del usuario activo y su rol en la barra superior.
     - Filtro del menú lateral por rol: el Vendedor solo ve Productos
       (regla de roles del Anexo 1), Administrador ve todo.
     - Menú lateral responsive (hamburguesa).
     - Contador del carrito reutilizado desde js/main.js para el header
       compartido de la tienda (acuerdo de integración del equipo).

   Roles definidos en el sistema:
     - "Administrador" -> acceso total.
     - "Vendedor"      -> solo listado y detalle de productos (y órdenes).
     - "Cliente"       -> solo la tienda, no entra al panel.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Protección del panel por sesión y rol ---------- */
  const usuario = window.obtenerUsuarioActual ? obtenerUsuarioActual() : null;

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  if (usuario.tipo === "Cliente") {
    window.location.href = "index.html";
    return;
  }

  /* ---------- Usuario activo en la barra superior ---------- */
  const bloqueUsuario = document.getElementById("adminUsuario");
  if (bloqueUsuario) {
    const saludo = document.createElement("span");
    saludo.textContent = "Hola, " + (usuario.nombre || "Usuario");

    const rol = document.createElement("span");
    rol.className = "admin-usuario-rol";
    rol.textContent = usuario.tipo;
    rol.setAttribute("aria-label", "Rol: " + usuario.tipo);

    bloqueUsuario.appendChild(saludo);
    bloqueUsuario.appendChild(rol);
  }

  /* ---------- Botón cerrar sesión ---------- */
  const btnSalir = document.getElementById("btnCerrarSesion");
  if (btnSalir && typeof cerrarSesion === "function") {
    btnSalir.addEventListener("click", cerrarSesion);
  }

  /* ---------- Filtrar el menú según el rol ----------
     Cada enlace del menú declara data-roles con los roles que pueden verlo,
     por ejemplo data-roles="Administrador" o data-roles="Administrador,Vendedor".
     Si el rol activo no está en la lista, el enlace se oculta.               */
  const enlacesMenu = document.querySelectorAll("[data-roles]");
  enlacesMenu.forEach(function (enlace) {
    const permitidos = enlace.getAttribute("data-roles").split(",");
    if (permitidos.indexOf(usuario.tipo) === -1) {
      const contenedor = enlace.closest("li") || enlace;
      contenedor.classList.add("hidden");
    }
  });

  /* ---------- Menú lateral responsive ---------- */
  const menuToggle = document.getElementById("adminToggle");
  const menu = document.getElementById("adminMenu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      const abierto = menu.classList.toggle("activo");
      menuToggle.setAttribute("aria-expanded", String(abierto));
    });

    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("activo");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Contador de carrito compartido ----------
     La función está en js/main.js (Aileen Oyaneder) y es la que mantiene el
     acuerdo del equipo de mostrar "Cart (n)" en todas las páginas. La
     llamamos aquí para que el panel también actualice el contador del header
     compartido de la tienda.                                                     */
  if (typeof actualizarContadorCarrito === "function") {
    actualizarContadorCarrito();
  }

  /* ---------- Portada (solo si la página tiene las tarjetas) ---------- */
  if (document.getElementById("tarjetasResumen")) {
    renderizarPortadaAdmin();
  }
});

/* ============================================================================
   PORTADA ADMIN (admin-home.html)
   Muestra el resumen de la tienda usando los datos compartidos del panel.
   Depende de js/admin-productos.js (obtenerProductos) y js/admin-usuarios.js
   (obtenerUsuarios); si alguno no está cargado, la tarjeta queda en 0.
   ========================================================================== */

/**
 * Devuelve el total de productos, unidades en stock y productos con stock
 * crítico, y lo pinta en las tarjetas de la portada.
 */
function renderizarPortadaAdmin() {
  const productos = (typeof obtenerProductos === "function") ? obtenerProductos() : [];

  let totalStock = 0;
  let totalCritico = 0;

  productos.forEach(function (p) {
    const stock = Number(p.stock) || 0;
    totalStock += stock;

    const critico = p.stockCritico !== undefined && p.stockCritico !== "" ? Number(p.stockCritico) : 0;
    if (critico > 0 && stock <= critico) totalCritico += 1;
  });

  const usuarios = (typeof obtenerUsuarios === "function") ? obtenerUsuarios() : [];

  const elementos = {
    totalProductos: document.getElementById("totalProductos"),
    totalStock: document.getElementById("totalStock"),
    totalCritico: document.getElementById("totalCritico"),
    totalUsuarios: document.getElementById("totalUsuarios")
  };

  if (elementos.totalProductos) elementos.totalProductos.textContent = productos.length;
  if (elementos.totalStock) elementos.totalStock.textContent = totalStock;
  if (elementos.totalCritico) elementos.totalCritico.textContent = totalCritico;
  if (elementos.totalUsuarios) elementos.totalUsuarios.textContent = usuarios.length;
}