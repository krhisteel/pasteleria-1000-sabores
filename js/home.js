"use strict";

const CODIGOS_DESTACADOS = ["TC001", "TT002", "PI002"];

function actualizarImagenesCategorias() {
  document.querySelectorAll("[data-codigo-muestra]").forEach(function (img) {
    const producto = buscarProducto(img.dataset.codigoMuestra);
    if (producto && producto.imagen) {
      img.src = producto.imagen;
      img.alt = producto.nombre;
    }
  });
}

function crearTarjetaDestacada(producto) {
  const articulo = document.createElement("article");
  articulo.className = "producto-card";

  articulo.innerHTML =
    '<div class="producto-imagen">' +
      '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" loading="lazy">' +
    "</div>" +
    '<div class="producto-info">' +
      "<h3>" + producto.nombre + "</h3>" +
      '<p class="producto-desc">' + producto.descripcion + "</p>" +
      '<span class="producto-precio">' + formatearPrecio(producto.precio) + "</span>" +
      '<a href="producto-detalle.html?id=' + producto.codigo + '" class="btn-ver-mas">Ver Detalle</a>' +
    "</div>";

  return articulo;
}

function renderizarProductosDestacados() {
  const grid = document.getElementById("productosDestacadosGrid");
  if (!grid) return;

  grid.innerHTML = "";

  CODIGOS_DESTACADOS.forEach(function (codigo) {
    const producto = buscarProducto(codigo);
    if (producto) {
      grid.appendChild(crearTarjetaDestacada(producto));
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  sembrarProductosDemo();
  actualizarImagenesCategorias();
  renderizarProductosDestacados();
});