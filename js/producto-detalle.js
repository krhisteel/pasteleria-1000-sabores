"use strict";

function renderizarDetalleProducto() {
  var params = new URLSearchParams(window.location.search);
  var codigo = params.get("id") || params.get("codigo");
  var producto = codigo ? buscarProducto(codigo) : null;

  var contenedor = document.getElementById("detalleProducto");
  if (!contenedor) return;

  if (!producto) {
    contenedor.innerHTML = '<p class="sin-resultados">No se encontr\u00f3 el producto solicitado.</p>';
    return;
  }

  document.title = producto.nombre + " | Pasteler\u00eda 1000 Sabores";

  var agotado = Number(producto.stock) === 0;

  var html = '';
  html += '<div class="detalle-grid">';
  html += '  <figure class="detalle-imagen">';
  html += '    <img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
  html += '  </figure>';
  html += '  <div class="detalle-info">';
  html += '    <span class="detalle-categoria">' + producto.categoria + '</span>';
  html += '    <h1 class="detalle-nombre">' + producto.nombre + '</h1>';
  html += '    <span class="detalle-precio">' + formatearPrecio(producto.precio) + '</span>';
  html += '    <p class="detalle-descripcion">' + (producto.descripcion || "Sin descripci\u00f3n.") + '</p>';
  html += '    <p class="detalle-stock">Stock disponible: <strong>' + producto.stock + '</strong> unidades</p>';

  if (!agotado) {
    html += '    <form id="formAgregarCarrito" class="detalle-form" novalidate>';
    html += '      <label for="cantidadProducto">Cantidad</label>';
    html += '      <input type="number" id="cantidadProducto" class="campo campo-cantidad" value="1" min="1" max="' + producto.stock + '">';
    html += '      <button type="submit" class="btn-primary">A\u00f1adir al carrito</button>';
    html += '    </form>';
  } else {
    html += '    <p class="detalle-agotado">Este producto est\u00e1 agotado.</p>';
  }

  html += '    <a href="productos.html" class="btn-secondary detalle-volver">Volver a productos</a>';
  html += '  </div>';
  html += '</div>';

  contenedor.innerHTML = html;

  if (!agotado) {
    var form = document.getElementById("formAgregarCarrito");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("cantidadProducto");
        var cantidad = parseInt(input.value, 10) || 1;
        cantidad = Math.max(1, Math.min(cantidad, Number(producto.stock)));

        agregarAlCarrito(producto.codigo, cantidad);

        var btn = form.querySelector("button[type='submit']");
        btn.textContent = "A\u00f1adido \u2713";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = "A\u00f1adir al carrito";
          btn.disabled = false;
        }, 1500);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  sembrarProductosDemo();
  renderizarDetalleProducto();
  actualizarContadorCarrito();
});