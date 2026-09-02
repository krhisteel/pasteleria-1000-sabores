// admin-productos.js — CRUD de productos con ordenamiento
"use strict";

// Clave de integración en localStorage (la lee la tienda también)
const CLAVE_PRODUCTOS = "productos";

// Categorías del caso (Forma C)
const CATEGORIAS_PRODUCTOS = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales"
];

// Límites de validación (sin máximo para código según anexo)
const PRODUCTO_LIMITES = {
  codigo: 3,
  nombre: 100,
  descripcion: 500
};

// 16 productos del caso. Se siembran solo la primera vez.
const PRODUCTOS_INICIALES = [
  { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.", precio: 45000, stock: 25, stockCritico: 6, imagen: "img/productos/TC001.jpg" },
  { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.", precio: 50000, stock: 4, stockCritico: 6, imagen: "img/productos/TC002.jpg" },
  { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.", precio: 40000, stock: 0, stockCritico: 5, imagen: "img/productos/TT001.jpg" },
  { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.", precio: 42000, stock: 18, stockCritico: 5, imagen: "img/productos/TT002.jpg" },
  { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.", precio: 5000, stock: 40, stockCritico: 10, imagen: "img/productos/PI001.jpg" },
  { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.", precio: 5500, stock: 35, stockCritico: 10, imagen: "img/productos/PI002.jpg" },
  { codigo: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja", descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.", precio: 48000, stock: 12, stockCritico: 5, imagen: "img/productos/PSA001.jpg" },
  { codigo: "PSA002", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.", precio: 47000, stock: 4, stockCritico: 8, imagen: "img/productos/PSA002.jpg" },
  { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Empanada de Manzana", descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.", precio: 3000, stock: 50, stockCritico: 10, imagen: "img/productos/PT001.jpg" },
  { codigo: "PT002", categoria: "Pastelería Tradicional", nombre: "Tarta de Santiago", descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.", precio: 6000, stock: 22, stockCritico: 6, imagen: "img/productos/PT002.jpg" },
  { codigo: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.", precio: 4000, stock: 30, stockCritico: 8, imagen: "img/productos/PG001.jpg" },
  { codigo: "PG002", categoria: "Productos Sin Gluten", nombre: "Pan Sin Gluten", descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.", precio: 3500, stock: 15, stockCritico: 6, imagen: "img/productos/PG002.jpg" },
  { codigo: "PV001", categoria: "Productos Vegana", nombre: "Torta Vegana de Chocolate", descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.", precio: 50000, stock: 10, stockCritico: 5, imagen: "img/productos/PV001.jpg" },
  { codigo: "PV002", categoria: "Productos Vegana", nombre: "Galletas Veganas de Avena", descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.", precio: 4500, stock: 28, stockCritico: 8, imagen: "img/productos/PV002.jpg" },
  { codigo: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.", precio: 55000, stock: 6, stockCritico: 6, imagen: "img/productos/TE001.jpg" },
  { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", precio: 60000, stock: 9, stockCritico: 5, imagen: "img/productos/TE002.jpg" }
];

// --- Acceso a los datos ---

// Siembra productos demo solo si la clave no existe en localStorage
function sembrarProductosDemo() {
  try {
    if (localStorage.getItem(CLAVE_PRODUCTOS) === null) {
      localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    }
  } catch (e) {
    // Navegador bloquea localStorage: se trabaja solo en memoria
  }
}

// Devuelve el arreglo de productos de localStorage
function obtenerProductos() {
  sembrarProductosDemo();
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS) || "[]");
  } catch (e) {
    return [];
  }
}

// Guarda el arreglo completo de productos
function guardarProductos(productos) {
  try {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    return true;
  } catch (e) {
    return false;
  }
}

// Busca un producto por código (case-insensitive)
function buscarProducto(codigo) {
  const productos = obtenerProductos();
  return productos.find(function (p) {
    return String(p.codigo).toLowerCase() === String(codigo).toLowerCase();
  }) || null;
}

// Formatea un precio como CLP
function formatearPrecio(precio) {
  return "$" + Number(precio || 0).toLocaleString("es-CL");
}

// Indica si el stock es igual o menor al crítico
function esStockCritico(producto) {
  const stock = Number(producto.stock) || 0;
  const critico = (producto.stockCritico !== undefined && producto.stockCritico !== "" && producto.stockCritico !== null)
    ? Number(producto.stockCritico)
    : 0;
  return critico > 0 && stock <= critico;
}

// Indica si el producto está agotado (stock 0)
function esStockAgotado(producto) {
  return Number(producto.stock) === 0;
}

// --- Ordenamiento del listado ---

let ordenProductos = { campo: null, direccion: 1 };

// Devuelve copia ordenada según la columna y dirección actuales
function ordenarProductos(lista) {
  const campo = ordenProductos.campo;
  if (!campo) return lista;

  const dir = ordenProductos.direccion;
  return lista.slice().sort(function (a, b) {
    if (campo === "precio" || campo === "stock") {
      const av = Number(a[campo]) || 0;
      const bv = Number(b[campo]) || 0;
      return (av - bv) * dir;
    }
    if (campo === "estado") {
      const av = rangoEstado(a);
      const bv = rangoEstado(b);
      return (av - bv) * dir;
    }
    const av = String(a[campo] || "").toLowerCase();
    const bv = String(b[campo] || "").toLowerCase();
    return av.localeCompare(bv, "es") * dir;
  });
}

// Orden lógico de estados: Agotado (0) < Stock crítico (1) < Disponible (2)
function rangoEstado(producto) {
  if (esStockAgotado(producto)) return 0;
  if (esStockCritico(producto)) return 1;
  return 2;
}

// Devuelve HTML de un <th> ordenable con flecha y aria-sort
function thOrdenable(texto, campo, clase) {
  const activo = ordenProductos.campo === campo;
  const flecha = activo ? (ordenProductos.direccion === 1 ? ' <span class="admin-flecha up"></span>' : ' <span class="admin-flecha down"></span>') : "";
  const ariaSort = activo ? (ordenProductos.direccion === 1 ? "ascending" : "descending") : "none";
  const clases = ["admin-col-orden"].concat(clase ? [clase] : []).join(" ");
  return '<th scope="col" class="' + clases + '" data-orden="' + campo + '" tabindex="0" role="button" aria-sort="' + ariaSort + '">' + texto + flecha + '</th>';
}

// --- Listado (admin-productos.html) ---

// Llena un select con las categorías del caso
function llenarSelectCategorias(select, seleccionado) {
  if (!select) return;
  select.innerHTML = "";

  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Selecciona una categoría";
  select.appendChild(opcionVacia);

  CATEGORIAS_PRODUCTOS.forEach(function (categoria) {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    if (categoria === seleccionado) opcion.selected = true;
    select.appendChild(opcion);
  });
}

// Badge de stock: Agotado / Stock crítico / Disponible
function badgeStock(producto) {
  if (esStockAgotado(producto)) {
    return '<span class="admin-badge admin-badge-stock-agotado">Agotado</span>';
  }
  if (esStockCritico(producto)) {
    return '<span class="admin-badge admin-badge-stock-critico">Stock crítico</span>';
  }
  return '<span class="admin-badge admin-badge-stock">Disponible</span>';
}

// Celda de imagen del producto (o placeholder si no tiene)
function celdaImagen(producto) {
  if (producto.imagen) {
    return '<img src="' + producto.imagen + '" alt="Imagen de ' + producto.nombre + '" class="admin-tabla-img">';
  }
  return '<span class="admin-sin-imagen" role="img" aria-label="Producto ' + producto.nombre + ' sin imagen">Sin imagen</span>';
}

// Renderiza la tabla completa del listado de productos
function renderListadoProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId || "listaProductos");
  if (!contenedor) return;

  const esAdmin = (typeof esAdministrador === "function") && esAdministrador();

  if (productos.length === 0) {
    contenedor.innerHTML = '<p class="admin-vacio">No hay productos en esta categoría. Crea uno con el botón "Nuevo Producto".</p>';
    return;
  }

  let html = '<div class="admin-tabla-contenedor"><table class="admin-tabla">';
  html += "<thead><tr>";
  html += "<th scope=\"col\">Imagen</th>";
  html += thOrdenable("Código", "codigo");
  html += thOrdenable("Nombre", "nombre");
  html += thOrdenable("Categoría", "categoria", "oculto-movil");
  html += thOrdenable("Precio", "precio");
  html += thOrdenable("Stock", "stock");
  html += thOrdenable("Estado", "estado");
  html += "<th scope=\"col\">Acciones</th>";
  html += "</tr></thead><tbody>";

  const productosOrdenados = ordenarProductos(productos);

  productosOrdenados.forEach(function (producto) {
    let filaClase = "";
    if (esStockAgotado(producto)) filaClase = "stock-agotado";
    else if (esStockCritico(producto)) filaClase = "stock-critico";

    html += '<tr class="' + filaClase + '">';
    html += "<td>" + celdaImagen(producto) + "</td>";
    html += "<td><strong>" + producto.codigo + "</strong></td>";
    html += "<td>" + producto.nombre + "</td>";
    html += '<td class="oculto-movil"><span class="admin-badge admin-badge-categoria">' + producto.categoria + "</span></td>";
    html += '<td class="admin-precio">' + formatearPrecio(producto.precio) + "</td>";
    html += "<td>" + producto.stock + "</td>";
    html += "<td>" + badgeStock(producto) + "</td>";

    html += '<td><div class="admin-acciones-fila">';
    const ver = "admin-producto-mostrar.html?codigo=" + encodeURIComponent(producto.codigo);
    html += '<a class="btn-accion btn-ver" href="' + ver + '">Ver</a>';

    if (esAdmin) {
      const editar = "admin-producto-editar.html?codigo=" + encodeURIComponent(producto.codigo);
      html += '<a class="btn-accion btn-editar" href="' + editar + '">Editar</a>';
      html += '<button type="button" class="btn-accion btn-eliminar" data-eliminar="' + producto.codigo + '">Eliminar</button>';
    }

    html += "</div></td>";
    html += "</tr>";
  });

  html += "</tbody></table></div>";
  contenedor.innerHTML = html;

  // Clic/tecla en encabezados cambia el orden
  contenedor.querySelectorAll("th[data-orden]").forEach(function (th) {
    function cambiarOrden() {
      const campo = th.getAttribute("data-orden");
      if (ordenProductos.campo === campo) {
        ordenProductos.direccion = ordenProductos.direccion === 1 ? -1 : 1;
      } else {
        ordenProductos.campo = campo;
        ordenProductos.direccion = 1;
      }
      aplicarFiltrosProductos(
        document.getElementById("filtroCategoria"),
        document.getElementById("buscadorProducto")
      );
    }
    th.addEventListener("click", cambiarOrden);
    th.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cambiarOrden();
      }
    });
  });

  // Botones eliminar
  contenedor.querySelectorAll("[data-eliminar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarProductoHandler(boton.getAttribute("data-eliminar"));
    });
  });
}

// Muestra alerta de productos con stock crítico o agotado
function mostrarAlertaStockCritico() {
  const alerta = document.getElementById("alertaStockCritico");
  const lista = document.getElementById("listaStockCritico");
  if (!alerta || !lista) return;

  const productos = obtenerProductos();
  const criticos = productos.filter(function (p) {
    return esStockCritico(p) || esStockAgotado(p);
  });

  if (criticos.length === 0) {
    alerta.classList.add("hidden");
    return;
  }

  alerta.classList.remove("hidden");
  lista.innerHTML = "";

  criticos.forEach(function (producto) {
    const li = document.createElement("li");
    if (esStockAgotado(producto)) {
      li.textContent = producto.nombre + " (agotado).";
    } else {
      li.textContent = producto.nombre + " (stock " + producto.stock + " de un crítico de " + producto.stockCritico + ").";
    }
    const enlace = document.createElement("a");
    enlace.href = "admin-producto-mostrar.html?codigo=" + encodeURIComponent(producto.codigo);
    enlace.textContent = " Ver detalle.";
    li.appendChild(enlace);
    lista.appendChild(li);
  });
}

// Filtra por categoría y buscador, luego renderiza
function aplicarFiltrosProductos(selectFiltro, buscador) {
  let productos = obtenerProductos();
  const categoria = selectFiltro ? selectFiltro.value : "";

  if (categoria) {
    productos = productos.filter(function (p) { return p.categoria === categoria; });
  }

  if (buscador && buscador.value.trim()) {
    const termino = buscador.value.trim().toLowerCase();
    productos = productos.filter(function (p) {
      return String(p.nombre).toLowerCase().indexOf(termino) !== -1 ||
             String(p.codigo).toLowerCase().indexOf(termino) !== -1;
    });
  }

  renderListadoProductos(productos);
}

// Elimina un producto tras confirmar y refresca el listado
function eliminarProductoHandler(codigo) {
  const producto = buscarProducto(codigo);
  if (!producto) return;

  const confirmar = window.confirm("¿Eliminar el producto '" + producto.nombre + "'? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  const productos = obtenerProductos().filter(function (p) {
    return String(p.codigo) !== String(codigo);
  });

  if (guardarProductos(productos)) {
    aplicarFiltrosProductos(document.getElementById("filtroCategoria"), document.getElementById("buscadorProducto"));
    mostrarAlertaStockCritico();
  }
}

// Inicializa la página de listado de productos
function inicializarListadoProductos() {
  sembrarProductosDemo();

  const selectFiltro = document.getElementById("filtroCategoria");
  const buscador = document.getElementById("buscadorProducto");

  if (selectFiltro) {
    llenarSelectCategorias(selectFiltro);
    selectFiltro.addEventListener("change", function () {
      aplicarFiltrosProductos(selectFiltro, buscador);
    });
  }

  if (buscador) {
    buscador.addEventListener("input", function () {
      aplicarFiltrosProductos(selectFiltro, buscador);
    });
  }

  aplicarFiltrosProductos(selectFiltro, buscador);
  mostrarAlertaStockCritico();
}

// --- Validaciones del formulario (nuevo / editar) ---

// Devuelve el valor numérico de un campo (acepta coma o punto decimal)
function numeroDe(campo) {
  const valor = campo.value.replace(/\./g, "").replace(",", ".");
  return parseFloat(valor) || 0;
}

// Valida código: requerido, mín. 3, sin espacios, sin duplicados
function validarCampoCodigoProducto(campo, codigoOriginal) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El código es obligatorio.");
  }
  if (!validarLargoMinimo(valor, PRODUCTO_LIMITES.codigo)) {
    return mostrarError(campo, "El código debe tener al menos " + PRODUCTO_LIMITES.codigo + " caracteres.");
  }

  if (/\s/.test(valor)) {
    return mostrarError(campo, "El código no puede contener espacios.");
  }

  const duplicado = buscarProducto(valor);
  if (duplicado && duplicado.codigo !== codigoOriginal) {
    return mostrarError(campo, "Ya existe un producto con el código '" + valor + "'.");
  }

  return marcarValido(campo);
}

// Valida nombre: requerido, máx. 100
function validarCampoNombreProducto(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El nombre es obligatorio.");
  }
  if (!validarLargoMaximo(valor, PRODUCTO_LIMITES.nombre)) {
    return mostrarError(campo, "El nombre no puede superar los " + PRODUCTO_LIMITES.nombre + " caracteres.");
  }
  return marcarValido(campo);
}

// Valida descripción: opcional, máx. 500
function validarCampoDescripcionProducto(campo) {
  const valor = campo.value.trim();
  if (!validarNoVacio(valor)) return limpiarEstado(campo);

  if (!validarLargoMaximo(valor, PRODUCTO_LIMITES.descripcion)) {
    return mostrarError(campo, "La descripción no puede superar los " + PRODUCTO_LIMITES.descripcion + " caracteres.");
  }
  return marcarValido(campo);
}

// Valida precio: requerido, mín. 0, decimales permitidos
function validarCampoPrecioProducto(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El precio es obligatorio.");
  }
  if (!/^\d+([.,]\d+)?$/.test(valor)) {
    return mostrarError(campo, "El precio solo acepta números (puede tener decimales).");
  }
  if (numeroDe(campo) < 0) {
    return mostrarError(campo, "El precio no puede ser negativo.");
  }
  return marcarValido(campo);
}

// Valida stock: requerido, mín. 0, solo enteros
function validarCampoStockProducto(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El stock es obligatorio.");
  }
  if (!/^\d+$/.test(valor)) {
    return mostrarError(campo, "El stock solo acepta números enteros.");
  }
  if (parseInt(valor, 10) < 0) {
    return mostrarError(campo, "El stock no puede ser negativo.");
  }
  return marcarValido(campo);
}

// Valida stock crítico: opcional, enteros, sugiere que sea menor al stock
function validarCampoStockCritico(campo, campoStock) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) return limpiarEstado(campo);

  if (!/^\d+$/.test(valor)) {
    return mostrarError(campo, "El stock crítico solo acepta números enteros.");
  }
  if (parseInt(valor, 10) < 0) {
    return mostrarError(campo, "El stock crítico no puede ser negativo.");
  }

  // Sugerencia: comparado con el stock actual
  if (campoStock && campoStock.value.trim()) {
    const stock = parseInt(campoStock.value, 10);
    const critico = parseInt(valor, 10);
    if (stock <= critico) {
      return mostrarError(campo, "Sugerencia: el stock crítico debería ser menor que el stock actual para activar la alerta.");
    }
  }
  return marcarValido(campo);
}

// Valida categoría: select requerido
function validarCampoCategoriaProducto(campo) {
  if (!validarNoVacio(campo.value)) {
    return mostrarError(campo, "Selecciona una categoría para el producto.");
  }
  return marcarValido(campo);
}

// Valida imagen: opcional, acepta rutas locales y URLs
function validarCampoImagenProducto(campo) {
  const valor = campo.value.trim();
  if (!validarNoVacio(valor)) return limpiarEstado(campo);

  const ok = /(\.(png|jpe?g|gif|webp|svg|avif)|img\/productos\/)/i.test(valor);
  if (!ok) return mostrarError(campo, "Escribe una ruta válida de imagen (png, jpg, gif, webp, svg, avif) o déjalo vacío.");

  return marcarValido(campo);
}

// --- Formulario nuevo / editar ---

// Inicializa el formulario de producto (modo "crear" o "editar")
function inicializarFormularioProducto(modo) {
  const form = document.getElementById("formProducto");
  if (!form) return;

  // Solo admin puede crear o editar
  const esAdmin = (typeof esAdministrador === "function") && esAdministrador();
  if (!esAdmin) {
    window.location.href = "admin-productos.html";
    return;
  }

  const aviso = document.getElementById("avisoProducto");
  const titulo = document.getElementById("tituloPagina");

  const campoCodigo = document.getElementById("codigo");
  const campoNombre = document.getElementById("nombreProducto");
  const campoDescripcion = document.getElementById("descripcionProducto");
  const campoPrecio = document.getElementById("precioProducto");
  const campoStock = document.getElementById("stockProducto");
  const campoStockCritico = document.getElementById("stockCriticoProducto");
  const campoCategoria = document.getElementById("categoriaProducto");
  const campoImagen = document.getElementById("imagenProducto");

  llenarSelectCategorias(campoCategoria);

  let codigoOriginal = null;

  // Modo editar: carga datos desde la URL
  if (modo === "editar") {
    const params = new URLSearchParams(window.location.search);
    const codigoParam = params.get("codigo");
    const producto = codigoParam ? buscarProducto(codigoParam) : null;

    if (!producto) {
      window.location.href = "admin-productos.html";
      return;
    }

    codigoOriginal = producto.codigo;
    if (titulo) titulo.textContent = "Editar Producto";
    campoCodigo.value = producto.codigo;
    campoCodigo.setAttribute("readonly", "readonly");
    campoNombre.value = producto.nombre || "";
    campoDescripcion.value = producto.descripcion || "";
    campoPrecio.value = producto.precio;
    campoStock.value = producto.stock;
    campoStockCritico.value = (producto.stockCritico !== undefined && producto.stockCritico !== null && producto.stockCritico !== "")
      ? producto.stockCritico
      : "";
    campoImagen.value = producto.imagen || "";
    llenarSelectCategorias(campoCategoria, producto.categoria);
  }

  // Validación en tiempo real
  campoCodigo.addEventListener("input", function () {
    validarCampoCodigoProducto(campoCodigo, codigoOriginal);
  });
  if (campoCodigo.hasAttribute("readonly")) {
    marcarValido(campoCodigo);
  }

  campoNombre.addEventListener("input", function () {
    validarCampoNombreProducto(campoNombre);
  });

  campoDescripcion.addEventListener("input", function () {
    validarCampoDescripcionProducto(campoDescripcion);
  });

  campoPrecio.addEventListener("input", function () {
    validarCampoPrecioProducto(campoPrecio);
  });

  campoStock.addEventListener("input", function () {
    validarCampoStockProducto(campoStock);
  });

  campoStockCritico.addEventListener("input", function () {
    validarCampoStockCritico(campoStockCritico, campoStock);
  });

  campoCategoria.addEventListener("change", function () {
    validarCampoCategoriaProducto(campoCategoria);
  });

  campoImagen.addEventListener("input", function () {
    validarCampoImagenProducto(campoImagen);
  });

  // Contadores de caracteres (sugerencias en vivo)
  if (typeof conectarContador === "function") {
    conectarContador(campoNombre, PRODUCTO_LIMITES.nombre);
    conectarContador(campoDescripcion, PRODUCTO_LIMITES.descripcion);
  }

  // Envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarAvisoProducto();

    const codigoOk = validarCampoCodigoProducto(campoCodigo, codigoOriginal);
    const nombreOk = validarCampoNombreProducto(campoNombre);
    const descripcionOk = validarCampoDescripcionProducto(campoDescripcion);
    const precioOk = validarCampoPrecioProducto(campoPrecio);
    const stockOk = validarCampoStockProducto(campoStock);
    const criticoOk = validarCampoStockCritico(campoStockCritico, campoStock);
    const categoriaOk = validarCampoCategoriaProducto(campoCategoria);
    const imagenOk = validarCampoImagenProducto(campoImagen);

    if (!codigoOk || !nombreOk || !descripcionOk || !precioOk || !stockOk || !criticoOk || !categoriaOk || !imagenOk) {
      mostrarAvisoProducto("Revisa los campos marcados en rojo antes de guardar.");
      return;
    }

    const producto = {
      codigo: campoCodigo.value.trim(),
      nombre: campoNombre.value.trim(),
      descripcion: campoDescripcion.value.trim(),
      precio: numeroDe(campoPrecio),
      stock: parseInt(campoStock.value, 10),
      stockCritico: campoStockCritico.value.trim() ? parseInt(campoStockCritico.value, 10) : "",
      categoria: campoCategoria.value,
      imagen: campoImagen.value.trim()
    };

    if (modo === "crear") {
      guardarNuevoProducto(producto);
    } else {
      actualizarProductoGuardado(producto, codigoOriginal);
    }
  });

  // Avisos del formulario
  function mostrarAvisoProducto(texto) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.remove("hidden");
  }

  function ocultarAvisoProducto() {
    if (!aviso) return;
    aviso.textContent = "";
    aviso.classList.add("hidden");
  }

  function redirigirAlListado() {
    window.location.href = "admin-productos.html";
  }

  function guardarNuevoProducto(producto) {
    const productos = obtenerProductos();
    productos.push(producto);
    if (guardarProductos(productos)) redirigirAlListado();
  }

  function actualizarProductoGuardado(producto, codigoOriginal) {
    const productos = obtenerProductos().map(function (p) {
      if (String(p.codigo) === String(codigoOriginal)) return producto;
      return p;
    });
    if (guardarProductos(productos)) redirigirAlListado();
  }
}

// --- Detalle (admin-producto-mostrar.html) ---

// Inicializa la vista de detalle. Disponible para admin y vendedor.
function inicializarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const producto = codigo ? buscarProducto(codigo) : null;

  if (!producto) {
    window.location.href = "admin-productos.html";
    return;
  }

  const titulo = document.getElementById("detalleTitulo");
  const cuerpo = document.getElementById("detalleContenido");
  if (!titulo || !cuerpo) return;

  titulo.textContent = producto.nombre;

  const imagen = producto.imagen
    ? '<img src="' + producto.imagen + '" alt="Imagen de ' + producto.nombre + '">'
    : '<div class="admin-sin-imagen admin-sin-imagen-grande" role="img" aria-label="Producto sin imagen">Producto sin imagen</div>';

  let filaStock = '<div class="admin-detalle-fila"><dt>Stock</dt><dd>' + producto.stock + '</dd></div>';
  if (esStockAgotado(producto)) {
    filaStock = '<div class="admin-detalle-fila stock-critico"><dt>Stock</dt><dd>' + producto.stock +
      ' <span class="admin-badge admin-badge-stock-agotado">Agotado</span></dd></div>';
  } else if (esStockCritico(producto)) {
    filaStock = '<div class="admin-detalle-fila stock-critico"><dt>Stock</dt><dd>' + producto.stock +
      ' <span class="admin-badge admin-badge-stock-critico">Stock crítico</span></dd></div>';
  }

  const stockCriticoTexto = (producto.stockCritico !== "" && producto.stockCritico !== null && producto.stockCritico !== undefined)
    ? producto.stockCritico
    : "—";

  cuerpo.innerHTML =
    '<div class="admin-detalle">' +
      '<figure class="admin-detalle-imagen">' + imagen +
        '<figcaption>' + producto.nombre + ' (' + producto.codigo + ')</figcaption>' +
      '</figure>' +
      '<dl class="admin-detalle-lista">' +
        '<div class="admin-detalle-fila"><dt>Código</dt><dd>' + producto.codigo + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Categoría</dt><dd><span class="admin-badge admin-badge-categoria">' + producto.categoria + '</span></dd></div>' +
        '<div class="admin-detalle-fila"><dt>Precio</dt><dd class="admin-precio">' + formatearPrecio(producto.precio) + '</dd></div>' +
        filaStock +
        '<div class="admin-detalle-fila"><dt>Stock crítico</dt><dd>' + stockCriticoTexto + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Descripción</dt><dd>' + (producto.descripcion || "Sin descripción.") + '</dd></div>' +
      '</dl>' +
    '</div>' +
    '<div class="admin-detalle-acciones">' +
      '<a href="admin-productos.html" class="btn-secondary">Volver al listado</a>' +
      (esAdministrador() ? '<a href="admin-producto-editar.html?codigo=' + encodeURIComponent(producto.codigo) + '" class="btn-accion btn-editar">Editar</a>' : "") +
    '</div>';
}

// --- Arranque según la página ---

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("listaProductos")) inicializarListadoProductos();
  if (document.getElementById("formProducto")) {
    const params = new URLSearchParams(window.location.search);
    const esEdicion = params.has("codigo") || document.title.indexOf("Editar Producto") !== -1;
    inicializarFormularioProducto(esEdicion ? "editar" : "crear");
  }
  if (document.getElementById("detalleContenido")) inicializarDetalleProducto();
});