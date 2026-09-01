/* ============================================================================
   CONTACTO.JS — Validación del formulario de contacto
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formContacto");
  const campoNombre = document.getElementById("nombre");
  const campoCorreo = document.getElementById("correo");
  const campoComentario = document.getElementById("comentario");
  const mensajeExito = document.getElementById("mensajeExito");

  if (!formulario) return;

  /* ---------- Validación en tiempo real ---------- */
  campoNombre.addEventListener("input", function () {
    validarCampoNombre();
  });

  campoCorreo.addEventListener("input", function () {
    validarCampoCorreo();
  });

  campoComentario.addEventListener("input", function () {
    validarCampoComentario();
  });

  /* ---------- Envío del formulario ---------- */
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreOk = validarCampoNombre();
    const correoOk = validarCampoCorreo();
    const comentarioOk = validarCampoComentario();

    if (nombreOk && correoOk && comentarioOk) {
      // Simular envío exitoso
      formulario.classList.add("hidden");
      mensajeExito.classList.remove("hidden");

      // Limpiar formulario
      formulario.reset();
    }
  });

  /* ---------- Funciones de validación ---------- */
  function validarCampoNombre() {
    const valor = campoNombre.value.trim();

    if (!validarNoVacio(valor)) {
      mostrarError(campoNombre, "El nombre es obligatorio");
      return false;
    }

    if (valor.length < 3) {
      mostrarError(campoNombre, "El nombre debe tener al menos 3 caracteres");
      return false;
    }

    marcarValido(campoNombre);
    return true;
  }

  function validarCampoCorreo() {
    const valor = campoCorreo.value.trim();

    if (!validarNoVacio(valor)) {
      mostrarError(campoCorreo, "El correo es obligatorio");
      return false;
    }

    if (!validarCorreo(valor)) {
      mostrarError(campoCorreo, "Ingrese un correo válido (dominios: gmail.com, outlook.com, duoc.cl, etc.)");
      return false;
    }

    marcarValido(campoCorreo);
    return true;
  }

  function validarCampoComentario() {
    const valor = campoComentario.value.trim();

    if (!validarNoVacio(valor)) {
      mostrarError(campoComentario, "El comentario es obligatorio");
      return false;
    }

    if (valor.length < 10) {
      mostrarError(campoComentario, "El comentario debe tener al menos 10 caracteres");
      return false;
    }

    marcarValido(campoComentario);
    return true;
  }
});
