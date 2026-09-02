"use strict";

var CATEGORIAS_POR_SLUG = {
  "tortas-cuadradas": "Tortas Cuadradas",
  "tortas-circulares": "Tortas Circulares",
  "postres-individuales": "Postres Individuales",
  "sin-azucar": "Productos Sin Az\u00e1car",
  "pasteleria-tradicional": "Pasteler\u00eda Tradicional",
  "sin-gluten": "Productos Sin Gluten",
  "veganos": "Productos Vegana",
  "tortas-especiales": "Tortas Especiales"
};

function productosFiltrados(productos, categoria, busqueda) {
  var texto = busqueda.toLowerCase();
  return productos.filter(function (p) {
    var cumpleCat = !categoria || p.categoria === categoria;
    var cumpleBus = !texto ||
      p.nombre.toLowerCase().indexOf(texto) !== -1 ||
      p.codigo.toLowerCase().indexOf(texto) !== -1;
    return cumpleCat && cumpleBus;
  });
}

function crearTarjetaProducto(producto) {
  var articulo = document.createElement("article");
  articulo.className = "producto-card";
  articulo.dataset.codigo = producto.codigo;

  var img = document.createElement("img");
  img.src = producto.imagen;
  img.alt = producto.nombre;
  img.loading = "lazy";

  var info = document.createElement("div");
  info.className = "producto-info";

  var nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;

  var cat = document.createElement("p");
  cat.className = "producto-categoria";
  cat.textContent = producto.categoria;

  var precio = document.createElement("span");
  precio.className = "producto-precio";
  precio.textContent = formatearPrecio(producto.precio);

  var btnDetalle = document.createElement("a");
  btnDetalle.className = "btn-ver-mas";
  btnDetalle.href = "producto-detalle.html?id=" + encodeURIComponent(producto.codigo);
  btnDetalle.textContent = "Ver Detalle";

  var btnCarrito = document.createElement("button");
  btnCarrito.type = "button";
  btnCarrito.className = "btn-primary btn-agregar";
  btnCarrito.dataset.codigo = producto.codigo;
  btnCarrito.textContent = "A\u00f1adir al carrito";

  if (Number(producto.stock) === 0) {
    btnCarrito.disabled = true;
    btnCarrito.textContent = "Agotado";
    btnCarrito.classList.add("btn-agotado");
  }

  info.appendChild(nombre);
  info.appendChild(cat);
  info.appendChild(precio);
  info.appendChild(btnDetalle);
  info.appendChild(btnCarrito);
  articulo.appendChild(img);
  articulo.appendChild(info);

  return articulo;
}

function renderizarProductos() {
  var grid = document.getElementById("productosGrid");
  if (!grid) return;

  var selectCat = document.getElementById("filtroCategoria");
  var inputBus = document.getElementById("filtroBusqueda");

  var productos = obtenerProductos();
  var categoria = selectCat ? selectCat.value : "";
  var busqueda = inputBus ? inputBus.value : "";
  var filtrados = productosFiltrados(productos, categoria, busqueda);

  grid.innerHTML = "";

  if (filtrados.length === 0) {
    grid.innerHTML = '<p class="sin-resultados">No se encontraron productos con esos filtros.</p>';
    return;
  }

  filtrados.forEach(function (p) {
    grid.appendChild(crearTarjetaProducto(p));
  });
}

function poblarSelectCategorias() {
  var select = document.getElementById("filtroCategoria");
  if (!select) return;

  select.innerHTML = '<option value="">Todas las categor\u00edas</option>';
  CATEGORIAS_PRODUCTOS.forEach(function (cat) {
    var opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function aplicarCategoriaDesdeUrl() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("cat");
  var cat = CATEGORIAS_POR_SLUG[slug];
  if (cat) {
    var select = document.getElementById("filtroCategoria");
    if (select) select.value = cat;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("productosGrid");
  if (!grid) return;

  sembrarProductosDemo();
  poblarSelectCategorias();
  aplicarCategoriaDesdeUrl();
  renderizarProductos();
  actualizarContadorCarrito();

  var selectCat = document.getElementById("filtroCategoria");
  var inputBus = document.getElementById("filtroBusqueda");

  if (selectCat) {
    selectCat.addEventListener("change", renderizarProductos);
  }
  if (inputBus) {
    inputBus.addEventListener("input", renderizarProductos);
  }

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-agregar");
    if (btn) {
      e.stopPropagation();
      if (btn.disabled) return;
      agregarAlCarrito(btn.dataset.codigo, 1);
      btn.textContent = "A\u00f1adido \u2713";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = "A\u00f1adir al carrito";
        btn.disabled = false;
      }, 1200);
      return;
    }

    var card = e.target.closest(".producto-card");
    if (card && !e.target.closest("a")) {
      window.location.href = "producto-detalle.html?id=" + encodeURIComponent(card.dataset.codigo);
    }
  });
});