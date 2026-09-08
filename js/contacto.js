"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formContacto");
  if (!formulario) return;

  const campoNombre = document.getElementById("nombre");
  const campoCorreo = document.getElementById("correo");
  const campoComentario = document.getElementById("comentario");
  const mensajeExito = document.getElementById("mensajeExito");
  const botonOtro = document.getElementById("btnOtroMensaje");

  conectarContador(campoNombre, LARGOS.nombreContacto);
  conectarContador(campoComentario, LARGOS.comentario);

  campoNombre.addEventListener("input", validarCampoNombre);
  campoCorreo.addEventListener("input", validarCampoCorreo);
  campoComentario.addEventListener("input", validarCampoComentario);

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

  if (botonOtro) {
    botonOtro.addEventListener("click", function () {
      mensajeExito.classList.add("hidden");
      formulario.classList.remove("hidden");
      campoNombre.focus();
    });
  }

  // Valida el nombre: obligatorio, 3-100 caracteres
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

  // Valida el correo: obligatorio, dominios permitidos, máx. 100
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

  // Valida el comentario: obligatorio, 10-500 caracteres
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

  // Limpia los estados de error/validez de todos los campos
  function limpiarMarcas() {
    [campoNombre, campoCorreo, campoComentario].forEach(limpiarEstado);
  }
});
