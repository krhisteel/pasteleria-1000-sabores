"use strict";

var ETAPAS_ENVIO = [
  { nombre: "Pedido recibido",
    detalle: "Hemos recibido tu pedido y confirmado el pago. Estamos preparando tus dulces.",
    icono: "🧾" },
  { nombre: "En preparación",
    detalle: "Nuestros reposteros están elaborando tus productos con mucho cariño.",
    icono: "👨‍🍳" },
  { nombre: "Enviado",
    detalle: "Tu pedido salió de nuestra pastelería. Lo recibirás en la fecha estimada.",
    icono: "🚚" },
  { nombre: "Entregado",
    detalle: "¡Tu pedido fue entregado! Disfruta cada bocado de Pastelería 1000 Sabores.",
    icono: "📦" }
];

function fechaHoraEtapa(paso) {
  var d = new Date();
  d.setDate(d.getDate() + paso);
  var dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  var meses = ["ene", "feb", "mar", "abr", "may", "jun",
               "jul", "ago", "sep", "oct", "nov", "dic"];
  return dias[d.getDay()] + " " + d.getDate() + " " + meses[d.getMonth()];
}

function renderizarPedido() {
  var panel = document.getElementById("seguimientoEnvio");
  var vacio = document.getElementById("seguimientoVacio");
  if (!panel && !vacio) return;

  var pedido = cargarPedido();
  var hayPedido = !!pedido;

  if (panel) panel.classList.toggle("hidden", !hayPedido);
  if (vacio) vacio.classList.toggle("hidden", hayPedido);

  if (!hayPedido) return;

  var pasoActual = pedido.pasoActual || 0;
  var etapa = ETAPAS_ENVIO[pasoActual] || ETAPAS_ENVIO[0];
  var totalEtapas = ETAPAS_ENVIO.length - 1;
  var pctCompleto = Math.round((pasoActual / totalEtapas) * 100);

  /* ---------- Datos generales ---------- */
  document.getElementById("seguimientoPedido").textContent = pedido.numero;
  document.getElementById("seguimientoFecha").textContent = pedido.fechaEntrega;
  document.getElementById("seguimientoEstado").textContent = pasoActual >= totalEtapas ? "Entregado" : etapa.nombre;
  document.getElementById("seguimientoDetalle").textContent = etapa.detalle;
  document.getElementById("seguimientoTotal").textContent = formatearPrecio(pedido.total || 0);
  document.getElementById("seguimientoMilestone").textContent = "Avance: " + pctCompleto + "%";

  /* ---------- Badge de estado ---------- */
  var badgeEstado = document.querySelector(".seguimiento-badge");
  if (badgeEstado) {
    if (pasoActual >= totalEtapas) {
      badgeEstado.innerHTML = '<span class="seguimiento-dot entregado"></span> Entregado';
    } else {
      badgeEstado.innerHTML = '<span class="seguimiento-dot"></span> En curso';
    }
  }

  /* ---------- Barra de progreso ---------- */
  var prog = document.getElementById("seguimientoProgreso");
  if (prog) {
    prog.innerHTML = '<div class="seguimiento-bar"><div class="seguimiento-bar-fill" style="width:' + pctCompleto + '%"></div></div>';
  }

  /* ---------- Etapas ---------- */
  var cont = document.getElementById("seguimientoEtapas");
  if (cont) {
    var html = "";
    ETAPAS_ENVIO.forEach(function (et, i) {
      var esActual = i === pasoActual;
      var esCompleta = i <= pasoActual;
      var clase = "seguimiento-etapa";
      if (esActual) clase += " actual";
      else if (esCompleta) clase += " completa";
      else if (pasoActual >= totalEtapas && i === totalEtapas) clase += " actual";

      html += '<div class="' + clase + '">';
      html += '  <div class="etapa-circulo">' + et.icono + '</div>';
      html += '  <div class="etapa-contenido">';
      html += '    <span class="etapa-titulo">' + et.nombre + '</span>';
      html += '    <span class="etapa-fecha">' + fechaHoraEtapa(i) + '</span>';
      html += '  </div>';
      html += '  <span class="etapa-estado">' +
        (esCompleta && !esActual ? "✓" : (esActual && pasoActual >= totalEtapas ? "✓" : (esActual ? "Actual" : ""))) + '</span>';
      html += '</div>';
    });
    cont.innerHTML = html;
  }

  /* ---------- Productos ---------- */
  var prodCont = document.getElementById("seguimientoProductos");
  if (prodCont) {
    var productos = pedido.productos || [];
    var ph = "";
    productos.forEach(function (p) {
      var sub = p.precio * p.cantidad;
      ph += '<div class="sp-producto">';
      ph += '  <img src="' + p.imagen + '" alt="' + p.nombre + '">';
      ph += '  <div class="sp-info">';
      ph += '    <span class="sp-nombre">' + p.nombre + '</span>';
      ph += '    <span class="sp-cant">' + p.cantidad + ' × ' + formatearPrecio(p.precio) + '</span>';
      ph += '  </div>';
      ph += '  <strong>' + formatearPrecio(sub) + '</strong>';
      ph += '</div>';
    });
    prodCont.innerHTML = ph;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarContadorCarrito();
  renderizarPedido();
});