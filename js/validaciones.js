/* ============================================================================
   VALIDACIONES REUTILIZABLES
   ----------------------------------------------------------------------------
   Archivo especialista creado por Integrante A.
   Utilizado por:
     - Integrante A: js/registro.js, js/contacto.js, js/login.js
     - Integrante C: js/admin-usuarios.js
   ========================================================================== */

"use strict";

/**
 * Valida un RUN chileno.
 * Formatos aceptados: 12345678-5 / 12.345.678-5 / 1-9
 * @param {string} run - El RUN a validar
 * @returns {boolean} true si es válido
 */
function validarRun(run) {
  if (!run || typeof run !== "string") return false;

  // Limpiar puntos y guión
  let limpio = run.replace(/\./g, "").replace(/-/g, "").trim();

  // Debe tener entre 7 y 9 caracteres (cuerpo + dígito verificador)
  if (limpio.length < 7 || limpio.length > 9) return false;

  // Separar cuerpo y dígito verificador
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();

  // El cuerpo solo debe tener números
  if (!/^\d+$/.test(cuerpo)) return false;

  // El dígito verificador debe ser un número o K
  if (!/^[0-9K]$/.test(dv)) return false;

  // Calcular dígito verificador esperado
  const dvEsperado = calcularDV(cuerpo);
  return dv === dvEsperado;
}

/**
 * Calcula el dígito verificador de un RUN
 * @param {string} cuerpo - Solo los números del RUN
 * @returns {string} Dígito verificador ('0'-'9' o 'K')
 */
function calcularDV(cuerpo) {
  let suma = 0;
  let multiplicador = 2;

  // Recorrer de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const residuo = 11 - (suma % 11);

  if (residuo === 11) return "0";
  if (residuo === 10) return "K";
  return String(residuo);
}

/**
 * Valida un correo electrónico.
 * Dominios permitidos: duoc.cl, duocuc.cl, gmail.com, outlook.com,hotmail.com, yahoo.com
 * @param {string} correo - El correo a validar
 * @returns {boolean} true si es válido
 */
function validarCorreo(correo) {
  if (!correo || typeof correo !== "string") return false;

  const correoLimpio = correo.trim().toLowerCase();

  // Expresión regular básica para formato de correo
  const formatoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formatoValido.test(correoLimpio)) return false;

  // Dominios permitidos
  const dominiosPermitidos = [
    "duoc.cl",
    "duocuc.cl",
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com"
  ];

  const dominio = correoLimpio.split("@")[1];
  return dominiosPermitidos.includes(dominio);
}

/**
 * Valida una contraseña.
 * Debe tener entre 4 y 10 caracteres.
 * @param {string} password - La contraseña a validar
 * @returns {boolean} true si es válida
 */
function validarPassword(password) {
  if (!password || typeof password !== "string") return false;
  const longitud = password.trim().length;
  return longitud >= 4 && longitud <= 10;
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
 * Muestra un mensaje de error junto a un campo.
 * @param {HTMLElement} campo - El elemento input
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(campo, mensaje) {
  limpiarError(campo);
  campo.classList.add("campo-error");

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("mensaje-error");
  errorDiv.textContent = mensaje;
  campo.parentNode.appendChild(errorDiv);
}

/**
 * Limpia el error de un campo.
 * @param {HTMLElement} campo - El elemento input
 */
function limpiarError(campo) {
  campo.classList.remove("campo-error");
  const errorExistente = campo.parentNode.querySelector(".mensaje-error");
  if (errorExistente) errorExistente.remove();
}

/**
 * Marca un campo como válido.
 * @param {HTMLElement} campo - El elemento input
 */
function marcarValido(campo) {
  limpiarError(campo);
  campo.classList.add("campo-valido");
}
