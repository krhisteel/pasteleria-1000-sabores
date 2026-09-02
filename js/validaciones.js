/* ============================================================================
   VALIDACIONES REUTILIZABLES
   ----------------------------------------------------------------------------
   Archivo especialista creado por Aileen Oyaneder (Módulo 1).
   Utilizado por:
     - Aileen Oyaneder: js/registro.js, js/contacto.js, js/login.js
     - Jael Reyes: js/admin-usuarios.js

   Reglas de negocio tomadas del Anexo 1 de la evaluación:
     - Correo: solo @duoc.cl, @profesor.duoc.cl y @gmail.com (máx. 100)
     - Contraseña: entre 4 y 10 caracteres
     - RUN: sin puntos ni guion (ej: 19011022K), mín. 7 y máx. 9 caracteres
   ========================================================================== */

"use strict";

/* ---------- Reglas de negocio centralizadas ---------- */

/** Dominios de correo autorizados por el enunciado. */
const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

/** Texto reutilizable para los mensajes de error y las sugerencias. */
const TEXTO_DOMINIOS = "@duoc.cl, @profesor.duoc.cl o @gmail.com";

/** Largos máximos por campo, según el Anexo 1. */
const LARGOS = {
  correo: 100,
  nombreRegistro: 50,
  nombreContacto: 100,
  apellidos: 100,
  direccion: 300,
  comentario: 500,
  telefono: 20,
  password: 10
};

/* ---------- Validaciones de datos ---------- */

/**
 * Quita puntos, guiones y espacios de un RUN para poder compararlo.
 * @param {string} run - RUN en cualquier formato
 * @returns {string} RUN limpio en mayúsculas (ej: "190110229")
 */
function normalizarRun(run) {
  if (!run || typeof run !== "string") return "";
  return run.replace(/[.\-\s]/g, "").toUpperCase();
}

/**
 * Calcula el dígito verificador de un RUN (algoritmo módulo 11).
 * @param {string} cuerpo - Solo los números del RUN
 * @returns {string} Dígito verificador ("0"-"9" o "K")
 */
function calcularDV(cuerpo) {
  let suma = 0;
  let multiplicador = 2;

  // Recorrer de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const residuo = 11 - (suma % 11);

  if (residuo === 11) return "0";
  if (residuo === 10) return "K";
  return String(residuo);
}

/**
 * Valida un RUN chileno.
 * Formato pedido por el enunciado: sin puntos ni guion (ej: 19011022K).
 * También se aceptan los formatos con puntos/guion para no penalizar al usuario.
 * @param {string} run - El RUN a validar
 * @returns {boolean} true si es válido
 */
function validarRun(run) {
  const limpio = normalizarRun(run);

  // Mín. 7 y máx. 9 caracteres (cuerpo + dígito verificador)
  if (limpio.length < 7 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  // El cuerpo solo debe tener números
  if (!/^\d+$/.test(cuerpo)) return false;

  // El dígito verificador debe ser un número o K
  if (!/^[0-9K]$/.test(dv)) return false;

  return dv === calcularDV(cuerpo);
}

/**
 * Da formato de lectura a un RUN válido (ej: "19011022K" -> "19.011.022-K").
 * Se usa solo como sugerencia visual, no como formato de guardado.
 * @param {string} run - RUN en cualquier formato
 * @returns {string} RUN formateado, o el original si no se puede formatear
 */
function formatearRun(run) {
  const limpio = normalizarRun(run);
  if (limpio.length < 7) return run;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return cuerpoConPuntos + "-" + dv;
}

/**
 * Valida un correo electrónico contra los dominios autorizados.
 * @param {string} correo - El correo a validar
 * @returns {boolean} true si es válido
 */
function validarCorreo(correo) {
  if (!correo || typeof correo !== "string") return false;

  const correoLimpio = correo.trim().toLowerCase();

  // Formato general de correo
  const formatoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formatoValido.test(correoLimpio)) return false;

  const dominio = correoLimpio.split("@")[1];
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

/**
 * Valida una contraseña: entre 4 y 10 caracteres.
 * @param {string} password - La contraseña a validar
 * @returns {boolean} true si es válida
 */
function validarPassword(password) {
  if (!password || typeof password !== "string") return false;
  const longitud = password.trim().length;
  return longitud >= 4 && longitud <= 10;
}

/**
 * Valida un teléfono. Acepta dígitos, espacios, guiones, paréntesis y el signo +.
 * Debe contener entre 8 y 15 dígitos (formato chileno: +56 9 1234 5678).
 * @param {string} telefono - El teléfono a validar
 * @returns {boolean} true si es válido
 */
function validarTelefono(telefono) {
  if (!telefono || typeof telefono !== "string") return false;

  // Solo se permiten dígitos y los separadores habituales
  if (!/^[\d\s+()-]+$/.test(telefono.trim())) return false;

  const digitos = telefono.replace(/\D/g, "");
  return digitos.length >= 8 && digitos.length <= 15;
}

/**
 * Valida que un campo no esté vacío.
 * @param {string} valor - El valor a validar
 * @returns {boolean} true si no está vacío
 */
function validarNoVacio(valor) {
  return valor !== null && valor !== undefined && String(valor).trim().length > 0;
}

/**
 * Valida que un texto no supere el largo máximo permitido.
 * @param {string} valor - El valor a validar
 * @param {number} maximo - Cantidad máxima de caracteres
 * @returns {boolean} true si está dentro del límite
 */
function validarLargoMaximo(valor, maximo) {
  return String(valor == null ? "" : valor).trim().length <= maximo;
}

/**
 * Valida que un texto alcance el largo mínimo pedido.
 * @param {string} valor - El valor a validar
 * @param {number} minimo - Cantidad mínima de caracteres
 * @returns {boolean} true si alcanza el mínimo
 */
function validarLargoMinimo(valor, minimo) {
  return String(valor == null ? "" : valor).trim().length >= minimo;
}

/* ---------- Mensajes de error y sugerencias en pantalla ---------- */

/**
 * Busca el contenedor de error que ya existe en el HTML del campo.
 * Si la página no lo declaró, lo crea una sola vez.
 * @param {HTMLElement} campo - El elemento input/select/textarea
 * @returns {HTMLElement} El contenedor donde se escribe el mensaje
 */
function obtenerContenedorError(campo) {
  const grupo = campo.closest(".campo-grupo") || campo.parentNode;
  let contenedor = grupo.querySelector(".mensaje-error");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.className = "mensaje-error";
    contenedor.setAttribute("role", "alert");
    contenedor.setAttribute("aria-live", "polite");
    grupo.appendChild(contenedor);
  }

  return contenedor;
}

/**
 * Muestra un mensaje de error personalizado bajo el campo.
 * @param {HTMLElement} campo - El elemento input/select/textarea
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {boolean} siempre false, para poder escribir "return mostrarError(...)"
 */
function mostrarError(campo, mensaje) {
  const contenedor = obtenerContenedorError(campo);

  campo.classList.remove("campo-valido");
  campo.classList.add("campo-error");
  campo.setAttribute("aria-invalid", "true");

  contenedor.textContent = mensaje;
  contenedor.classList.add("visible");

  // Enlaza el mensaje con el campo para lectores de pantalla,
  // sin pisar los aria-describedby que ya declaró el HTML.
  if (contenedor.id && !campo.hasAttribute("aria-describedby")) {
    campo.setAttribute("aria-describedby", contenedor.id);
  }

  return false;
}

/**
 * Limpia el estado de error de un campo (sin borrar el contenedor del HTML).
 * @param {HTMLElement} campo - El elemento input/select/textarea
 */
function limpiarError(campo) {
  const contenedor = obtenerContenedorError(campo);

  campo.classList.remove("campo-error");
  campo.removeAttribute("aria-invalid");

  contenedor.textContent = "";
  contenedor.classList.remove("visible");
}

/**
 * Marca un campo como válido.
 * @param {HTMLElement} campo - El elemento input/select/textarea
 * @returns {boolean} siempre true, para poder escribir "return marcarValido(...)"
 */
function marcarValido(campo) {
  limpiarError(campo);
  campo.classList.add("campo-valido");
  return true;
}

/**
 * Quita cualquier marca (error o válido) de un campo opcional vacío.
 * @param {HTMLElement} campo - El elemento input/select/textarea
 */
function limpiarEstado(campo) {
  limpiarError(campo);
  campo.classList.remove("campo-valido");
}

/**
 * Conecta un contador de caracteres a un campo con largo máximo.
 * Es la "sugerencia" en vivo que pide la rúbrica: el usuario ve cuánto le queda.
 * @param {HTMLElement} campo - El input o textarea
 * @param {number} maximo - Largo máximo permitido
 */
function conectarContador(campo, maximo) {
  if (!campo) return;

  const grupo = campo.closest(".campo-grupo") || campo.parentNode;
  const contador = grupo.querySelector(".contador-caracteres");
  if (!contador) return;

  function refrescar() {
    const usados = campo.value.length;
    contador.textContent = usados + " / " + maximo;
    contador.classList.toggle("contador-limite", usados >= maximo);
  }

  campo.addEventListener("input", refrescar);
  refrescar();
}
