/* ============================================================================
   CONTACTO.JS — Validación del formulario de contacto
   ---------------------------------------------------------------------------
   Integrante A (Módulo 1). Usa js/validaciones.js (rol especialista).

   Reglas del Anexo 1:
     - Nombre: requerido, máx. 100 caracteres
     - Correo: máx. 100, solo @duoc.cl, @profesor.duoc.cl y @gmail.com
     - Comentario: requerido, máx. 500 caracteres
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formContacto");
  if (!formulario) return;

  const campoNombre = document.getElementById("nombre");
  const campoCorreo = document.getElementById("correo");
  const campoComentario = document.getElementById("comentario");
  const mensajeExito = document.getElementById("mensajeExito");
  const botonOtro = document.getElementById("btnOtroMensaje");

  /* ---------- Contadores de caracteres (sugerencia en vivo) ---------- */
  conectarContador(campoNombre, LARGOS.nombreContacto);
  conectarContador(campoComentario, LARGOS.comentario);

  /* ---------- Validación en tiempo real ---------- */
  campoNombre.addEventListener("input", validarCampoNombre);
  campoCorreo.addEventListener("input", validarCampoCorreo);
  campoComentario.addEventListener("input", validarCampoComentario);

  /* ---------- Envío del formulario ---------- */
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreOk = validarCampoNombre();
    const correoOk = validarCampoCorreo();
    const comentarioOk = validarCampoComentario();

    if (!nombreOk || !correoOk || !comentarioOk) {
      const primerError = formulario.querySelector(".campo-error");
      if (primerError) primerError.focus();
      return;
    }

    // Envío simulado: no hay backend en esta entrega
    formulario.classList.add("hidden");
    mensajeExito.classList.remove("hidden");
    mensajeExito.scrollIntoView({ behavior: "smooth", block: "center" });
    formulario.reset();
    limpiarMarcas();
  });

  /* ---------- Permitir escribir otro mensaje ---------- */
  if (botonOtro) {
    botonOtro.addEventListener("click", function () {
      mensajeExito.classList.add("hidden");
      formulario.classList.remove("hidden");
      campoNombre.focus();
    });
  }

  /* ---------- Funciones de validación ---------- */
  function validarCampoNombre() {
    const valor = campoNombre.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoNombre, "El nombre es obligatorio.");
    }
    if (!validarLargoMinimo(valor, 3)) {
      return mostrarError(campoNombre, "El nombre debe tener al menos 3 caracteres.");
    }
    if (!validarLargoMaximo(valor, LARGOS.nombreContacto)) {
      return mostrarError(campoNombre, "El nombre no puede superar los " + LARGOS.nombreContacto + " caracteres.");
    }
    return marcarValido(campoNombre);
  }

  function validarCampoCorreo() {
    const valor = campoCorreo.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoCorreo, "El correo es obligatorio para poder responderte.");
    }
    if (!validarLargoMaximo(valor, LARGOS.correo)) {
      return mostrarError(campoCorreo, "El correo no puede superar los " + LARGOS.correo + " caracteres.");
    }
    if (!validarCorreo(valor)) {
      return mostrarError(campoCorreo, "Solo se aceptan correos " + TEXTO_DOMINIOS + ".");
    }
    return marcarValido(campoCorreo);
  }

  function validarCampoComentario() {
    const valor = campoComentario.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoComentario, "El comentario es obligatorio.");
    }
    if (!validarLargoMinimo(valor, 10)) {
      return mostrarError(campoComentario, "El comentario debe tener al menos 10 caracteres.");
    }
    if (!validarLargoMaximo(valor, LARGOS.comentario)) {
      return mostrarError(campoComentario, "El comentario no puede superar los " + LARGOS.comentario + " caracteres.");
    }
    return marcarValido(campoComentario);
  }

  /** Deja los campos sin marca de error ni de válido después de enviar. */
  function limpiarMarcas() {
    [campoNombre, campoCorreo, campoComentario].forEach(limpiarEstado);
  }
});
