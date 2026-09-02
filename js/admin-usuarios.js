/* ============================================================================
   ADMIN-USUARIOS.JS — Mantenedor de usuarios (CRUD simulado)
   ----------------------------------------------------------------------------
   Jael Reyes (Módulo 3). Usa js/validaciones.js (Aileen Oyaneder) y
   js/regiones-comunas.js (Jael Reyes). Comparte la clave "usuarios" de
   localStorage con el registro del Módulo 1 (acuerdo del equipo).

   Reglas de negocio del Anexo 1 (usuarios):
     - RUN: requerido, dígito verificador válido, sin puntos ni guion,
       entre 7 y 9 caracteres.
     - Nombre: requerido, máx. 50 caracteres.
     - Apellidos: requerido, máx. 100 caracteres.
     - Correo: requerido, máx. 100, solo @duoc.cl, @profesor.duoc.cl y
       @gmail.com (validado con validarCorreo).
     - Fecha de nacimiento: opcional, no puede ser futura.
     - Tipo de usuario: select con Administrador, Cliente y Vendedor.
     - Región y Comuna: requeridas; las comunas cambian según la región.
     - Dirección: requerida, máx. 300 caracteres.
     - Contraseña: entre 4 y 10 caracteres (reutiliza validarPassword).

   Roles del sistema (Anexo 1):
     - Administrador: acceso total al panel.
     - Vendedor: solo visualiza productos y sus detalles (y órdenes).
     - Cliente: solo la tienda.
   ========================================================================== */

"use strict";

/* ---------- Clave compartida con el registro del Módulo 1 ---------- */
const CLAVE_USUARIOS = "usuarios";

/* ---------- Tipos de usuario de la aplicación ---------- */
const TIPOS_USUARIOS = ["Administrador", "Vendedor", "Cliente"];

/* ---------- Límites de validación ---------- */
const USUARIO_LIMITES = {
  runMin: 7,
  runMax: 9,
  nombre: 50,
  apellidos: 100,
  correo: 100,
  direccion: 300
};

/* ---------- Texto de ayuda para los perfiles ---------- */
const DESCRIPCION_PERFIL = {
  Administrador: "Acceso total al sistema de administración.",
  Vendedor: "Solo puede visualizar el listado y el detalle de productos (y de órdenes).",
  Cliente: "Solo accede a la tienda."
};

/* ============================================================================
   ACCESO A LOS DATOS
   ========================================================================== */

/**
 * Devuelve el arreglo de usuarios guardado en localStorage.
 * Si la clave aún no existe, entra vacío (los usuarios de prueba los sella
 * el propio login.js del Módulo 1).
 * @returns {Array<object>}
 */
function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
  } catch (e) {
    return [];
  }
}

/**
 * Guarda el arreglo completo de usuarios en localStorage.
 * @param {Array<object>} usuarios
 * @returns {boolean} true si se guardó
 */
function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Busca un usuario por su RUN normalizado.
 * @param {string} run
 * @returns {object|null}
 */
function buscarUsuarioPorRun(run) {
  const limpiar = typeof normalizarRun === "function" ? normalizarRun(run) : String(run);
  const usuarios = obtenerUsuarios();
  return usuarios.find(function (u) {
    const runUsuario = typeof normalizarRun === "function" ? normalizarRun(u.run) : String(u.run);
    return runUsuario === limpiar;
  }) || null;
}

/**
 * Busca un usuario por su correo (sin importar mayúsculas).
 * @param {string} correo
 * @returns {object|null}
 */
function buscarUsuarioPorCorreo(correo) {
  const correoBuscado = String(correo || "").trim().toLowerCase();
  const usuarios = obtenerUsuarios();
  return usuarios.find(function (u) {
    return String(u.correo || "").trim().toLowerCase() === correoBuscado;
  }) || null;
}

/**
 * Rellena un select con las regiones disponibles.
 * @param {HTMLElement} select - El select de región
 * @param {string} [seleccionado] - Región que debe quedar seleccionada
 */
function llenarSelectRegiones(select, seleccionado) {
  if (!select || typeof REGIONES_COMUNAS === "undefined") return;

  select.innerHTML = "";
  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Selecciona una región";
  select.appendChild(opcionVacia);

  REGIONES_COMUNAS.forEach(function (item) {
    const opcion = document.createElement("option");
    opcion.value = item.region;
    opcion.textContent = item.region;
    if (item.region === seleccionado) opcion.selected = true;
    select.appendChild(opcion);
  });
}

/**
 * Rellena el select de comunas según la región elegida.
 * @param {HTMLElement} selectRegion - El select de región
 * @param {HTMLElement} selectComuna - El select de comuna
 * @param {string} [seleccionada] - Comuna que debe quedar seleccionada
 */
function llenarSelectComunas(selectRegion, selectComuna, seleccionada) {
  if (!selectRegion || !selectComuna || typeof REGIONES_COMUNAS === "undefined") return;

  const regionBuscar = selectRegion.value;
  selectComuna.innerHTML = "";
  selectComuna.disabled = !regionBuscar;

  if (!regionBuscar) {
    const opcion = document.createElement("option");
    opcion.value = "";
    opcion.textContent = "Primero elige una región";
    selectComuna.appendChild(opcion);
    return;
  }

  const regionEncontrada = REGIONES_COMUNAS.find(function (item) {
    return item.region === regionBuscar;
  });

  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Selecciona una comuna";
  selectComuna.appendChild(opcionVacia);

  if (regionEncontrada) {
    regionEncontrada.comunas.forEach(function (comuna) {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      if (comuna === seleccionada) opcion.selected = true;
      selectComuna.appendChild(opcion);
    });
  }
}

/**
 * Da formato de RUN legible usando la utilidad de validaciones.js.
 * @param {string} run
 * @returns {string}
 */
function runLegible(run) {
  return (typeof formatearRun === "function") ? formatearRun(run) : run;
}

/**
 * Busca el nombre de un mes para la fecha de nacimiento legible.
 * @param {string} fecha - Fecha ISO (ej: 1995-05-10)
 * @returns {string}
 */
function fechaLegible(fecha) {
  if (!fecha) return "—";
  try {
    const partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const anio = partes[0];
    const mes = parseInt(partes[1], 10);
    const dia = parseInt(partes[2], 10);
    if (!anio || !mes || !dia) return fecha;
    return dia + " de " + meses[mes - 1] + " de " + anio;
  } catch (e) {
    return fecha;
  }
}

/* ============================================================================
   LISTADO (admin-usuarios.html)
   ========================================================================== */

/**
 * Rellena un select con los tipos de usuario.
 * @param {HTMLElement} select
 * @param {string} [seleccionado]
 */
function llenarSelectTipos(select, seleccionado) {
  if (!select) return;
  select.innerHTML = "";

  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Selecciona un perfil";
  select.appendChild(opcionVacia);

  TIPOS_USUARIOS.forEach(function (tipo) {
    const opcion = document.createElement("option");
    opcion.value = tipo;
    opcion.textContent = tipo;
    if (tipo === seleccionado) opcion.selected = true;
    select.appendChild(opcion);
  });
}

/**
 * Devuelve el badge según el tipo de usuario.
 * @param {string} tipo
 * @returns {string} HTML del badge
 */
function badgeTipoUsuario(tipo) {
  let clase = "admin-badge-cliente";
  if (tipo === "Administrador") clase = "admin-badge-admin";
  if (tipo === "Vendedor") clase = "admin-badge-vendedor";

  return '<span class="admin-badge ' + clase + '">' + tipo + "</span>";
}

/**
 * Renderiza la tabla completa del listado de usuarios.
 * @param {Array<object>} usuarios - Arreglo a mostrar
 */
function renderListadoUsuarios(usuarios) {
  const contenedor = document.getElementById("listaUsuarios");
  if (!contenedor) return;

  if (usuarios.length === 0) {
    contenedor.innerHTML = '<p class="admin-vacio">No hay usuarios que coincidan con el filtro.</p>';
    return;
  }

  const usuarioActivo = (typeof obtenerUsuarioActual === "function") ? obtenerUsuarioActual() : null;

  let html = '<div class="admin-tabla-contenedor"><table class="admin-tabla">';
  html += "<thead><tr>";
  html += "<th scope=\"col\">RUN</th>";
  html += "<th scope=\"col\">Nombre</th>";
  html += "<th scope=\"col\">Correo</th>";
  html += "<th scope=\"col\" class=\"oculto-movil\">Región / Comuna</th>";
  html += "<th scope=\"col\">Perfil</th>";
  html += "<th scope=\"col\">Acciones</th>";
  html += "</tr></thead><tbody>";

  usuarios.forEach(function (usuario) {
    const esActivo = usuarioActivo && String(usuarioActivo.run) === String(usuario.run);

    html += '<tr class="' + (esActivo ? "usuario-activo" : "") + '">';
    html += "<td><strong>" + runLegible(usuario.run) + "</strong></td>";
    html += "<td>" + usuario.nombre + " " + (usuario.apellidos || "") + "</td>";
    html += "<td>" + usuario.correo + "</td>";
    html += '<td class="oculto-movil">' + (usuario.region || "—") + " / " + (usuario.comuna || "—") + "</td>";
    html += "<td>" + badgeTipoUsuario(usuario.tipo) + "</td>";

    html += '<td><div class="admin-acciones-fila">';
    const ver = "admin-usuario-mostrar.html?run=" + encodeURIComponent(usuario.run);
    html += '<a class="btn-accion btn-ver" href="' + ver + '">Ver</a>';

    const editar = "admin-usuario-editar.html?run=" + encodeURIComponent(usuario.run);
    html += '<a class="btn-accion btn-editar" href="' + editar + '">Editar</a>';

    html += '<button type="button" class="btn-accion btn-eliminar" data-eliminar="' + usuario.run + '">Eliminar</button>';

    html += "</div></td>";
    html += "</tr>";
  });

  html += "</tbody></table></div>";
  contenedor.innerHTML = html;

  contenedor.querySelectorAll("[data-eliminar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarUsuarioHandler(boton.getAttribute("data-eliminar"));
    });
  });
}

/**
 * Filtra el listado según el rol (y el buscador).
 * @param {HTMLElement} selectTipo - Select de perfil
 * @param {HTMLElement} [buscador] - Input de búsqueda (nombre, correo o RUN)
 */
function aplicarFiltrosUsuarios(selectTipo, buscador) {
  let usuarios = obtenerUsuarios();
  const tipo = selectTipo ? selectTipo.value : "";

  if (tipo) {
    usuarios = usuarios.filter(function (u) { return u.tipo === tipo; });
  }

  if (buscador && buscador.value.trim()) {
    const termino = buscador.value.trim().toLowerCase();
    usuarios = usuarios.filter(function (u) {
      return String(u.nombre).toLowerCase().indexOf(termino) !== -1 ||
             String(u.apellidos || "").toLowerCase().indexOf(termino) !== -1 ||
             String(u.correo).toLowerCase().indexOf(termino) !== -1 ||
             String(u.run).toLowerCase().indexOf(termino) !== -1;
    });
  }

  renderListadoUsuarios(usuarios);
}

/**
 * Elimina un usuario tras confirmar. No permite eliminar la propia sesión.
 * @param {string} run
 */
function eliminarUsuarioHandler(run) {
  const usuario = buscarUsuarioPorRun(run);
  if (!usuario) return;

  const sesion = (typeof obtenerUsuarioActual === "function") ? obtenerUsuarioActual() : null;
  if (sesion && String(sesion.run) === String(run)) {
    window.alert("No puedes eliminar el usuario con el que iniciaste sesión.");
    return;
  }

  const confirmar = window.confirm("¿Eliminar al usuario '" + usuario.nombre + " " + (usuario.apellidos || "") + "'? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  const usuarios = obtenerUsuarios().filter(function (u) {
    const limpiar = typeof normalizarRun === "function" ? normalizarRun(u.run) : String(u.run);
    return limpiar !== normalizarRun(run);
  });

  if (guardarUsuarios(usuarios)) {
    aplicarFiltrosUsuarios(document.getElementById("filtroTipo"), document.getElementById("buscadorUsuario"));
  }
}

/**
 * Inicializa la página de listado de usuarios (solo Administrador).
 */
function inicializarListadoUsuarios() {
  const esAdmin = (typeof esAdministrador === "function") && esAdministrador();
  if (!esAdmin) {
    window.location.href = "admin-home.html";
    return;
  }

  const selectTipo = document.getElementById("filtroTipo");
  const buscador = document.getElementById("buscadorUsuario");

  if (selectTipo) {
    llenarSelectTipos(selectTipo);
    selectTipo.addEventListener("change", function () {
      aplicarFiltrosUsuarios(selectTipo, buscador);
    });
  }

  if (buscador) {
    buscador.addEventListener("input", function () {
      aplicarFiltrosUsuarios(selectTipo, buscador);
    });
  }

  aplicarFiltrosUsuarios(selectTipo, buscador);
}

/* ============================================================================
   VALIDACIONES DEL FORMULARIO (nuevo / editar)
   ========================================================================== */

/**
 * Actualiza la pista del perfil seleccionado en el formulario.
 */
function actualizarPistaPerfil(campoTipo) {
  const pista = document.getElementById("pistaPerfil");
  if (!pista) return;
  const descripcion = DESCRIPCION_PERFIL[campoTipo.value];
  pista.textContent = descripcion ? "Perfil: " + descripcion : "";
}

/**
 * Valida el RUN en tiempo real.
 * @param {HTMLElement} campo
 * @param {string} [runOriginal] - RUN que se está editando
 * @returns {boolean}
 */
function validarCampoRunUsuario(campo, runOriginal) {
  const valor = campo.value.trim();
  const limpio = typeof normalizarRun === "function" ? normalizarRun(valor) : valor;

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El RUN es obligatorio.");
  }
  if (limpio.length < USUARIO_LIMITES.runMin || limpio.length > USUARIO_LIMITES.runMax) {
    return mostrarError(campo, "El RUN debe tener entre " + USUARIO_LIMITES.runMin + " y " + USUARIO_LIMITES.runMax + " caracteres.");
  }
  if (typeof validarRun === "function" && !validarRun(valor)) {
    return mostrarError(campo, "El dígito verificador del RUN no es válido.");
  }

  // El RUN no puede repetirse (excepto en edición con el mismo usuario)
  const duplicado = buscarUsuarioPorRun(valor);
  if (duplicado && String(duplicado.run) !== String(runOriginal)) {
    return mostrarError(campo, "Ya existe un usuario con el RUN '" + runLegible(valor) + "'.");
  }

  return marcarValido(campo);
}

/**
 * Valida el nombre (requerido, máx. 50).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoNombreUsuario(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El nombre es obligatorio.");
  }
  if (!validarLargoMaximo(valor, USUARIO_LIMITES.nombre)) {
    return mostrarError(campo, "El nombre no puede superar los " + USUARIO_LIMITES.nombre + " caracteres.");
  }
  return marcarValido(campo);
}

/**
 * Valida los apellidos (requerido, máx. 100).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoApellidosUsuario(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "Los apellidos son obligatorios.");
  }
  if (!validarLargoMaximo(valor, USUARIO_LIMITES.apellidos)) {
    return mostrarError(campo, "Los apellidos no pueden superar los " + USUARIO_LIMITES.apellidos + " caracteres.");
  }
  return marcarValido(campo);
}

/**
 * Valida el correo (requerido, máx. 100, dominios permitidos, sin repetir).
 * @param {HTMLElement} campo
 * @param {string} [correoOriginal] - Correo del usuario en edición
 * @returns {boolean}
 */
function validarCampoCorreoUsuario(campo, correoOriginal) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "El correo es obligatorio.");
  }
  if (!validarLargoMaximo(valor, USUARIO_LIMITES.correo)) {
    return mostrarError(campo, "El correo no puede superar los " + USUARIO_LIMITES.correo + " caracteres.");
  }
  if (typeof validarCorreo === "function" && !validarCorreo(valor)) {
    return mostrarError(campo, "Solo se aceptan correos " + (typeof TEXTO_DOMINIOS !== "undefined" ? TEXTO_DOMINIOS : "con dominios permitidos") + ".");
  }

  const duplicado = buscarUsuarioPorCorreo(valor);
  if (duplicado && String(duplicado.correo).toLowerCase() !== String(correoOriginal || "").toLowerCase()) {
    return mostrarError(campo, "Ya existe un usuario con ese correo.");
  }

  return marcarValido(campo);
}

/**
 * Valida la fecha de nacimiento (opcional, no futura).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoFechaNacimiento(campo) {
  const valor = campo.value.trim();
  if (!validarNoVacio(valor)) return limpiarEstado(campo);

  const fecha = new Date(valor);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (isNaN(fecha.getTime())) {
    return mostrarError(campo, "Elige una fecha válida.");
  }
  if (fecha > hoy) {
    return mostrarError(campo, "La fecha de nacimiento no puede ser futura.");
  }
  return marcarValido(campo);
}

/**
 * Valida el tipo de usuario (select requerido).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoTipoUsuario(campo) {
  if (!validarNoVacio(campo.value)) {
    return mostrarError(campo, "Selecciona un perfil para el usuario.");
  }
  return marcarValido(campo);
}

/**
 * Valida la región (requerida).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoRegionUsuario(campo) {
  if (!validarNoVacio(campo.value)) {
    return mostrarError(campo, "Selecciona una región.");
  }
  return marcarValido(campo);
}

/**
 * Valida la comuna (requerida y coherente con la región).
 * @param {HTMLElement} campoComuna
 * @param {HTMLElement} campoRegion
 * @returns {boolean}
 */
function validarCampoComunaUsuario(campoComuna, campoRegion) {
  if (!validarNoVacio(campoComuna.value)) {
    return mostrarError(campoComuna, "Elige una comuna de la región seleccionada.");
  }
  if (!validarNoVacio(campoRegion.value)) {
    return mostrarError(campoComuna, "Primero selecciona la región.");
  }
  return marcarValido(campoComuna);
}

/**
 * Valida la dirección (requerida, máx. 300).
 * @param {HTMLElement} campo
 * @returns {boolean}
 */
function validarCampoDireccionUsuario(campo) {
  const valor = campo.value.trim();

  if (!validarNoVacio(valor)) {
    return mostrarError(campo, "La dirección es obligatoria.");
  }
  if (!validarLargoMaximo(valor, USUARIO_LIMITES.direccion)) {
    return mostrarError(campo, "La dirección no puede superar los " + USUARIO_LIMITES.direccion + " caracteres.");
  }
  return marcarValido(campo);
}

/**
 * Valida la contraseña. En "crear" es obligatoria; en "editar" opcional.
 * @param {HTMLElement} campo
 * @param {boolean} obligatoria
 * @param {HTMLElement} [campoConfirmar] - Campo de confirmación
 * @returns {boolean}
 */
function validarCampoPasswordUsuario(campo, obligatoria, campoConfirmar) {
  const valor = campo.value;

  if (!validarNoVacio(valor)) {
    if (!obligatoria) return limpiarEstado(campo);
    return mostrarError(campo, "La contraseña es obligatoria.");
  }
  if (typeof validarPassword === "function" && !validarPassword(valor)) {
    return mostrarError(campo, "La contraseña debe tener entre 4 y 10 caracteres.");
  }

  if (campoConfirmar && campoConfirmar.value && campoConfirmar.value !== valor) {
    return mostrarError(campoConfirmar, "Las contraseñas no coinciden.");
  }

  return marcarValido(campo);
}

/**
 * Valida la confirmación de la contraseña.
 * @param {HTMLElement} campoConfirmar
 * @param {HTMLElement} campoPassword
 * @returns {boolean}
 */
function validarCampoConfirmarPassword(campoConfirmar, campoPassword) {
  const valor = campoConfirmar.value;

  if (!validarNoVacio(valor)) {
    return mostrarError(campoConfirmar, "Repite la contraseña.");
  }
  if (valor !== campoPassword.value) {
    return mostrarError(campoConfirmar, "Las contraseñas no coinciden.");
  }
  return marcarValido(campoConfirmar);
}

/* ============================================================================
   FORMULARIO NUEVO / EDITAR (admin-usuario-nuevo.html / ...-editar.html)
   ========================================================================== */

/**
 * Inicializa el formulario de usuario en modo "crear" o "editar".
 * @param {string} modo - "crear" o "editar"
 */
function inicializarFormularioUsuario(modo) {
  const form = document.getElementById("formUsuario");
  if (!form) return;

  // Nuevo y editar solo disponibles para el Administrador
  const esAdmin = (typeof esAdministrador === "function") && esAdministrador();
  if (!esAdmin) {
    window.location.href = "admin-usuarios.html";
    return;
  }

  const aviso = document.getElementById("avisoUsuario");
  const titulo = document.getElementById("tituloPagina");

  const campoRun = document.getElementById("run");
  const campoNombre = document.getElementById("nombreUsuario");
  const campoApellidos = document.getElementById("apellidosUsuario");
  const campoCorreo = document.getElementById("correoUsuario");
  const campoFecha = document.getElementById("fechaNacimiento");
  const campoTipo = document.getElementById("tipoUsuario");
  const campoRegion = document.getElementById("region");
  const campoComuna = document.getElementById("comuna");
  const campoDireccion = document.getElementById("direccionUsuario");
  const campoPassword = document.getElementById("passwordUsuario");
  const campoConfirmar = document.getElementById("confirmarPassword");

  const obligatoriaPassword = modo === "crear";

  llenarSelectTipos(campoTipo);
  llenarSelectRegiones(campoRegion);

  let runOriginal = null;
  let correoOriginal = null;

  // Modo editar: se cargan los datos desde la URL (?run=...)
  if (modo === "editar") {
    const params = new URLSearchParams(window.location.search);
    const runParam = params.get("run");
    const usuario = runParam ? buscarUsuarioPorRun(runParam) : null;

    if (!usuario) {
      window.location.href = "admin-usuarios.html";
      return;
    }

    runOriginal = usuario.run;
    correoOriginal = usuario.correo;
    if (titulo) titulo.textContent = "Editar Usuario";

    campoRun.value = usuario.run;
    campoRun.setAttribute("readonly", "readonly");
    campoNombre.value = usuario.nombre || "";
    campoApellidos.value = usuario.apellidos || "";
    campoCorreo.value = usuario.correo || "";
    campoFecha.value = usuario.fechaNacimiento || "";
    campoDireccion.value = usuario.direccion || "";

    llenarSelectTipos(campoTipo, usuario.tipo);
    llenarSelectRegiones(campoRegion, usuario.region);
    llenarSelectComunas(campoRegion, campoComuna, usuario.comuna);
  } else {
    llenarSelectComunas(campoRegion, campoComuna);
  }

  /* ---------- Región/comuna vinculadas ---------- */
  campoRegion.addEventListener("change", function () {
    llenarSelectComunas(campoRegion, campoComuna);
    validarCampoRegionUsuario(campoRegion);
  });

  campoComuna.addEventListener("change", function () {
    validarCampoComunaUsuario(campoComuna, campoRegion);
  });

  /* ---------- Pista del perfil ---------- */
  campoTipo.addEventListener("change", function () {
    validarCampoTipoUsuario(campoTipo);
    actualizarPistaPerfil(campoTipo);
  });
  actualizarPistaPerfil(campoTipo);

  /* ---------- Validación en tiempo real ---------- */
  campoRun.addEventListener("input", function () {
    validarCampoRunUsuario(campoRun, runOriginal);
  });
  if (campoRun.hasAttribute("readonly")) marcarValido(campoRun);

  campoNombre.addEventListener("input", function () {
    validarCampoNombreUsuario(campoNombre);
  });

  campoApellidos.addEventListener("input", function () {
    validarCampoApellidosUsuario(campoApellidos);
  });

  campoCorreo.addEventListener("input", function () {
    validarCampoCorreoUsuario(campoCorreo, correoOriginal);
  });

  campoFecha.addEventListener("input", function () {
    validarCampoFechaNacimiento(campoFecha);
  });

  campoDireccion.addEventListener("input", function () {
    validarCampoDireccionUsuario(campoDireccion);
  });

  campoPassword.addEventListener("input", function () {
    validarCampoPasswordUsuario(campoPassword, obligatoriaPassword, campoConfirmar);
  });

  campoConfirmar.addEventListener("input", function () {
    validarCampoConfirmarPassword(campoConfirmar, campoPassword);
  });

  /* ---------- Contadores de caracteres ---------- */
  if (typeof conectarContador === "function") {
    conectarContador(campoNombre, USUARIO_LIMITES.nombre);
    conectarContador(campoApellidos, USUARIO_LIMITES.apellidos);
    conectarContador(campoCorreo, USUARIO_LIMITES.correo);
    conectarContador(campoDireccion, USUARIO_LIMITES.direccion);
  }

  /* ---------- Envío ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarAvisoUsuario();

    const runOk = validarCampoRunUsuario(campoRun, runOriginal);
    const nombreOk = validarCampoNombreUsuario(campoNombre);
    const apellidosOk = validarCampoApellidosUsuario(campoApellidos);
    const correoOk = validarCampoCorreoUsuario(campoCorreo, correoOriginal);
    const fechaOk = validarCampoFechaNacimiento(campoFecha);
    const tipoOk = validarCampoTipoUsuario(campoTipo);
    const regionOk = validarCampoRegionUsuario(campoRegion);
    const comunaOk = validarCampoComunaUsuario(campoComuna, campoRegion);
    const direccionOk = validarCampoDireccionUsuario(campoDireccion);
    const passwordOk = validarCampoPasswordUsuario(campoPassword, obligatoriaPassword, campoConfirmar);
    const hayPassword = typeof validarNoVacio === "function" && validarNoVacio(campoPassword.value);
    const confirmarOk = hayPassword
      ? validarCampoConfirmarPassword(campoConfirmar, campoPassword)
      : limpiarEstado(campoConfirmar);

    if (!runOk || !nombreOk || !apellidosOk || !correoOk || !fechaOk || !tipoOk ||
        !regionOk || !comunaOk || !direccionOk || !passwordOk || !confirmarOk) {
      mostrarAvisoUsuario("Revisa los campos marcados en rojo antes de guardar.");
      return;
    }

    const usuario = {
      run: (typeof normalizarRun === "function") ? normalizarRun(campoRun.value) : campoRun.value.trim(),
      nombre: campoNombre.value.trim(),
      apellidos: campoApellidos.value.trim(),
      correo: campoCorreo.value.trim().toLowerCase(),
      fechaNacimiento: campoFecha.value || "",
      tipo: campoTipo.value,
      region: campoRegion.value,
      comuna: campoComuna.value,
      direccion: campoDireccion.value.trim(),
      password: campoPassword.value || "",
      beneficios: []
    };

    if (modo === "crear") {
      guardarNuevoUsuario(usuario);
    } else {
      actualizarUsuarioGuardado(usuario, runOriginal);
    }
  });

  /* ---------- Aviso general ---------- */
  function mostrarAvisoUsuario(texto) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.remove("hidden");
  }

  function ocultarAvisoUsuario() {
    if (!aviso) return;
    aviso.textContent = "";
    aviso.classList.add("hidden");
  }

  function redirigirAlListado() {
    window.location.href = "admin-usuarios.html";
  }

  function guardarNuevoUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    if (guardarUsuarios(usuarios)) redirigirAlListado();
  }

  function actualizarUsuarioGuardado(usuario, runOriginalValue) {
    const usuarios = obtenerUsuarios().map(function (u) {
      const limpiar = typeof normalizarRun === "function" ? normalizarRun(u.run) : String(u.run);
      if (limpiar === normalizarRun(runOriginalValue)) {
        // Si no se escribió contraseña nueva, se conserva la actual
        if (!usuario.password) usuario.password = u.password;
        return usuario;
      }
      return u;
    });
    if (guardarUsuarios(usuarios)) redirigirAlListado();
  }
}

/* ============================================================================
   DETALLE (admin-usuario-mostrar.html)
   ========================================================================== */

/**
 * Inicializa la vista de detalle de un usuario (solo Administrador).
 */
function inicializarDetalleUsuario() {
  const esAdmin = (typeof esAdministrador === "function") && esAdministrador();
  if (!esAdmin) {
    window.location.href = "admin-usuarios.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const run = params.get("run");
  const usuario = run ? buscarUsuarioPorRun(run) : null;

  if (!usuario) {
    window.location.href = "admin-usuarios.html";
    return;
  }

  const titulo = document.getElementById("detalleTitulo");
  const cuerpo = document.getElementById("detalleContenido");
  if (!titulo || !cuerpo) return;

  titulo.textContent = usuario.nombre + " " + (usuario.apellidos || "");

  const esActivo = (function () {
    const activo = (typeof obtenerUsuarioActual === "function") ? obtenerUsuarioActual() : null;
    return activo && String(activo.run) === String(usuario.run);
  })();

  cuerpo.innerHTML =
    '<div class="admin-detalle">' +
      '<div class="admin-detalle-imagen admin-detalle-usuario">' +
        '<div class="admin-avatar" role="img" aria-label="Avatar de ' + usuario.nombre + '">' +
          (usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "?") +
        "</div>" +
      "</div>" +
      '<dl class="admin-detalle-lista">' +
        '<div class="admin-detalle-fila"><dt>RUN</dt><dd>' + runLegible(usuario.run) + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Nombre completo</dt><dd>' + usuario.nombre + " " + (usuario.apellidos || "") + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Correo</dt><dd>' + usuario.correo + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Perfil</dt><dd>' + badgeTipoUsuario(usuario.tipo) + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Fecha de nacimiento</dt><dd>' + fechaLegible(usuario.fechaNacimiento) + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Región / Comuna</dt><dd>' + (usuario.region || "—") + " / " + (usuario.comuna || "—") + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Dirección</dt><dd>' + (usuario.direccion || "—") + '</dd></div>' +
        '<div class="admin-detalle-fila"><dt>Sesión activa</dt><dd>' + (esActivo ? "Este es el usuario conectado." : "No conectado actualmente.") + '</dd></div>' +
      '</dl>' +
    '</div>' +
    '<div class="admin-detalle-acciones">' +
      '<a href="admin-usuarios.html" class="btn-secondary">Volver al listado</a>' +
      '<a href="admin-usuario-editar.html?run=' + encodeURIComponent(usuario.run) + '" class="btn-accion btn-editar" style="text-align:center;">Editar</a>' +
    '</div>';
}

/* ============================================================================
   ARRANQUE SEGÚN LA PÁGINA
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("listaUsuarios")) inicializarListadoUsuarios();
  if (document.getElementById("formUsuario")) {
    const params = new URLSearchParams(window.location.search);
    const esEdicion = params.has("run") || document.title.indexOf("Editar Usuario") !== -1;
    inicializarFormularioUsuario(esEdicion ? "editar" : "crear");
  }
  if (document.getElementById("detalleContenido")) inicializarDetalleUsuario();
});