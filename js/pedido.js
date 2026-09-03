"use strict";

var ETAPAS_ENVIO = [
  {
    nombre: "Pedido recibido",
    detalle: "Hemos recibido tu pedido y confirmado el pago. Estamos preparando tus dulces.",
    icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>'
  },
  {
    nombre: "En preparación",
    detalle: "Nuestros reposteros están elaborando tus productos con mucho cariño.",
    icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10h12v2a6 6 0 0 1-12 0v-2Z"/><path d="M8 7c0-2 1-3 3-3M12 7c0-2 1-3 3-3M7 19h10"/></svg>'
  },
  {
    nombre: "Enviado",
    detalle: "Tu pedido salió de nuestra pastelería. Lo recibirás en la fecha estimada.",
    icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>'
  },
  {
    nombre: "Entregado",
    detalle: "¡Tu pedido fue entregado! Disfruta cada bocado de Pastelería 1000 Sabores.",
    icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z"/><path d="m4 7 8 4 8-4M12 11v10"/><path d="m8 15 2 2 5-5"/></svg>'
  }
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
  document.getElementById("seguimientoEstado").textContent =
    pasoActual >= totalEtapas ? "Entregado" : etapa.nombre;

  document.getElementById("seguimientoDetalle").textContent = etapa.detalle;

  document.getElementById("seguimientoTotal").textContent =
    formatearPrecio(pedido.total || 0);

  document.getElementById("seguimientoMilestone").textContent =
    "Avance: " + pctCompleto + "%";

  /* ---------- Badge de estado ---------- */

  var badgeEstado = document.querySelector(".seguimiento-badge");

  if (badgeEstado) {
    if (pasoActual >= totalEtapas) {
      badgeEstado.innerHTML =
        '<span class="seguimiento-dot entregado"></span> Entregado';
    } else {
      badgeEstado.innerHTML =
        '<span class="seguimiento-dot"></span> En curso';
    }
  }

  /* ---------- Barra de progreso ---------- */

  var prog = document.getElementById("seguimientoProgreso");

  if (prog) {
    prog.innerHTML =
      '<div class="seguimiento-bar">' +
        '<div class="seguimiento-bar-fill" style="width:' +
        pctCompleto +
        '%"></div>' +
      '</div>';
  }

  /* ---------- Etapas ---------- */

  var cont = document.getElementById("seguimientoEtapas");

  if (cont) {
    var html = "";

    ETAPAS_ENVIO.forEach(function (et, i) {

      var esActual = i === pasoActual;
      var esCompleta = i < pasoActual;

      var clase = "seguimiento-etapa";

      if (esActual) {
        clase += " actual";
      } else if (esCompleta) {
        clase += " completa";
      }

      html += '<div class="' + clase + '">';

      html +=
        '  <div class="etapa-circulo">' +
        et.icono +
        '</div>';

      html +=
        '  <div class="etapa-contenido">' +
          '<span class="etapa-titulo">' +
            et.nombre +
          '</span>' +
          '<span class="etapa-fecha">' +
            fechaHoraEtapa(i) +
          '</span>' +
        '</div>';

      html +=
        '  <span class="etapa-estado">' +
        (
          esCompleta
            ? "✓"
            : esActual
              ? "Actual"
              : ""
        ) +
        '</span>';

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

      ph +=
        '  <img src="' +
        p.imagen +
        '" alt="' +
        p.nombre +
        '">';

      ph +=
        '  <div class="sp-info">' +
          '<span class="sp-nombre">' +
            p.nombre +
          '</span>' +
          '<span class="sp-cant">' +
            p.cantidad +
            ' × ' +
            formatearPrecio(p.precio) +
          '</span>' +
        '</div>';

      ph +=
        '  <strong>' +
        formatearPrecio(sub) +
        '</strong>';

      ph += '</div>';
    });

    prodCont.innerHTML = ph;
  }

  /* ---------- Icono del estado actual ---------- */

  var estadoIcono = document.querySelector(".seguimiento-estado-ic");

  if (estadoIcono) {
    estadoIcono.innerHTML = etapa.icono;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarContadorCarrito();
  renderizarPedido();
});