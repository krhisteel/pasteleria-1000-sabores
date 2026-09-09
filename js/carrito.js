"use strict";

var CLAVE_CARRITO = "carrito";
var CLAVE_PEDIDO = "pedidoActual";

/* Operaciones básicas del carrito (localStorage "carrito") */

function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (e) {
    /* sin acceso a localStorage */
  }
}

function contarCarrito() {
  try {
    var carrito = cargarCarrito();
    return carrito.reduce(function (s, item) {
      return s + (item.cantidad || 1);
    }, 0);
  } catch (e) {
    return 0;
  }
}

function actualizarContadorCarrito() {
  var el = document.getElementById("contador-carrito");
  if (el) el.textContent = contarCarrito();
}

function agregarAlCarrito(codigo, cantidad) {
  var carrito = cargarCarrito();
  var producto = typeof buscarProducto === "function" ? buscarProducto(codigo) : null;
  if (!producto) return;

  var descuentoEdad = typeof obtenerDescuentoEdad === "function" ? obtenerDescuentoEdad() : 0;
  var descuentoCodigo = typeof obtenerDescuentoCodigo === "function" ? obtenerDescuentoCodigo() : 0;

  var existente = carrito.find(function (item) {
    return item.codigo === codigo;
  });

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, Number(producto.stock));
    existente.descuento = Number(producto.descuento) || 0;
    existente.descuentoEdad = descuentoEdad;
    existente.descuentoCodigo = descuentoCodigo;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descuento: Number(producto.descuento) || 0,
      descuentoEdad: descuentoEdad,
      descuentoCodigo: descuentoCodigo,
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function modificarCantidadCarrito(codigo, nuevaCantidad) {
  var carrito = cargarCarrito();
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      if (nuevaCantidad <= 0) {
        carrito.splice(i, 1);
      } else {
        var stockMax = carrito[i].stock || 999;
        carrito[i].cantidad = Math.min(nuevaCantidad, stockMax);
      }
      break;
    }
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function eliminarDelCarrito(codigo) {
  var carrito = cargarCarrito().filter(function (item) {
    return item.codigo !== codigo;
  });
  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function subtotalCarrito() {
  return cargarCarrito().reduce(function (s, item) {
    var precio = Number(item.precio) || 0;
    var descuento = Number(item.descuento) || 0;
    var descuentoEdad = Number(item.descuentoEdad) || 0;
    var descuentoCodigo = Number(item.descuentoCodigo) || 0;
    var descuentoTotal = Math.min(descuento + descuentoEdad + descuentoCodigo, 100);
    var precioFinal = descuentoTotal > 0 ? Math.round(precio * (1 - descuentoTotal / 100)) : precio;
    return s + precioFinal * item.cantidad;
  }, 0);
}

function totalDescuentoCarrito() {
  return cargarCarrito().reduce(function (s, item) {
    var precio = Number(item.precio) || 0;
    var descuento = Number(item.descuento) || 0;
    var descuentoEdad = Number(item.descuentoEdad) || 0;
    var descuentoCodigo = Number(item.descuentoCodigo) || 0;
    var descuentoTotal = Math.min(descuento + descuentoEdad + descuentoCodigo, 100);
    if (descuentoTotal <= 0) return s;
    var ahorro = Math.round(precio * descuentoTotal / 100);
    return s + ahorro * item.cantidad;
  }, 0);
}

function vaciarCarritoCompleto() {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarContadorCarrito();
}

/* Pedido (localStorage "pedidoActual") */

function generarNumeroPedido() {
  var fecha = new Date();
  var num = "P" + fecha.getFullYear() +
    String(fecha.getMonth() + 1).padStart(2, "0") +
    String(fecha.getDate()).padStart(2, "0") +
    String(Math.floor(Math.random() * 9000) + 1000);
  return num;
}

function guardarPedido(pedido) {
  try {
    localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
  } catch (e) { /* sin localStorage */ }
}

function cargarPedido() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PEDIDO) || "null");
  } catch (e) {
    return null;
  }
}

/* Renderizado de la página carrito (solo carrito.html) */

function renderizarPaginaCarrito() {
  var lista = document.getElementById("carritoLista");
  var vacio = document.getElementById("carritoVacio");
  var resumen = document.getElementById("resumenCompra");
  if (!lista) return;

  var carrito = cargarCarrito();

  if (carrito.length === 0) {
    lista.innerHTML = "";
    if (vacio) vacio.classList.remove("hidden");
    if (resumen) resumen.classList.add("hidden");
    return;
  }

  if (vacio) vacio.classList.add("hidden");
  if (resumen) resumen.classList.remove("hidden");

  var html = "";
  carrito.forEach(function (item) {
    var precio = Number(item.precio) || 0;
    var descuento = Number(item.descuento) || 0;
    var descuentoEdad = Number(item.descuentoEdad) || 0;
    var descuentoCodigo = Number(item.descuentoCodigo) || 0;
    var descuentoTotal = Math.min(descuento + descuentoEdad + descuentoCodigo, 100);
    var precioFinal = descuentoTotal > 0 ? Math.round(precio * (1 - descuentoTotal / 100)) : precio;
    var subtotal = precioFinal * item.cantidad;

    html += '<div class="carrito-item" data-codigo="' + item.codigo + '">';
    html += '  <img src="' + item.imagen + '" alt="' + item.nombre + '" class="carrito-item-img">';
    html += '  <div class="carrito-item-info">';
    html += '    <h3>' + item.nombre + '</h3>';
    html += '    <p class="carrito-item-cat">' + item.categoria + '</p>';
    if (descuentoTotal > 0) {
      html += '    <p class="carrito-item-precio-original">' + formatearPrecio(precio) + ' c/u</p>';
      html += '    <p class="carrito-item-precio">' + formatearPrecio(precioFinal) + ' c/u <span class="carrito-item-descuento">-' + descuentoTotal + '%</span></p>';
    } else {
      html += '    <p class="carrito-item-precio">' + formatearPrecio(precio) + ' c/u</p>';
    }
    html += '  </div>';
    html += '  <div class="carrito-item-cantidad">';
    html += '    <button type="button" class="btn-cantidad" data-accion="restar" data-codigo="' + item.codigo + '">\u2212</button>';
    html += '    <span class="cantidad-valor">' + item.cantidad + '</span>';
    html += '    <button type="button" class="btn-cantidad" data-accion="sumar" data-codigo="' + item.codigo + '">+</button>';
    html += '  </div>';
    html += '  <p class="carrito-item-subtotal">' + formatearPrecio(subtotal) + '</p>';
    html += '  <button type="button" class="btn-eliminar" data-codigo="' + item.codigo + '">Eliminar</button>';
    html += '</div>';
  });

  lista.innerHTML = html;
  renderizarResumen();
}

function renderizarResumen() {
  var sub = subtotalCarrito();
  var total = sub;
  var ahorro = totalDescuentoCarrito();

  document.getElementById("subtotalCarrito").textContent = formatearPrecio(sub);

  var ahorroEl = document.getElementById("ahorroCarrito");
  var filaAhorro = document.getElementById("filaAhorro");
  if (ahorroEl && filaAhorro) {
    if (ahorro > 0) {
      ahorroEl.textContent = "-" + formatearPrecio(ahorro);
      filaAhorro.classList.remove("hidden");
    } else {
      filaAhorro.classList.add("hidden");
    }
  }

  document.getElementById("totalCarrito").textContent = formatearPrecio(total);
}

/* Pagar: crea el pedido y va a pedido.html */

function finalizarCompra() {
  var carrito = cargarCarrito();
  if (carrito.length === 0) return;

  var total = subtotalCarrito();
  var ok = confirm("\u00bfConfirmas tu compra por " + formatearPrecio(total) + "?");
  if (!ok) return;

  var hoy = new Date();
  var entrega = new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000);
  var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
               "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  var pedido = {
    numero: generarNumeroPedido(),
    fecha: hoy.toLocaleDateString("es-CL"),
    fechaEntrega: entrega.getDate() + " de " + meses[entrega.getMonth()] + " " + entrega.getFullYear(),
    estado: "Pedido recibido",
    pasoActual: 0,
    productos: carrito,
    total: total
  };

  guardarPedido(pedido);
  vaciarCarritoCompleto();

  window.location.href = "pedido.html";
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("carritoLista")) return;

  renderizarPaginaCarrito();
  actualizarContadorCarrito();

  document.getElementById("carritoLista").addEventListener("click", function (e) {
    var btn = e.target;
    if (!btn.dataset.codigo) return;

    if (btn.dataset.accion === "sumar") {
      var itemActual = cargarCarrito().find(function (i) { return i.codigo === btn.dataset.codigo; });
      if (itemActual) modificarCantidadCarrito(btn.dataset.codigo, itemActual.cantidad + 1);
    } else if (btn.dataset.accion === "restar") {
      var itemR = cargarCarrito().find(function (i) { return i.codigo === btn.dataset.codigo; });
      if (itemR) modificarCantidadCarrito(btn.dataset.codigo, itemR.cantidad - 1);
    } else if (btn.classList.contains("btn-eliminar")) {
      eliminarDelCarrito(btn.dataset.codigo);
    }

    renderizarPaginaCarrito();
    actualizarContadorCarrito();
  });

  var btnPagar = document.getElementById("btnPagar");
  if (btnPagar) {
    btnPagar.addEventListener("click", finalizarCompra);
  }
});