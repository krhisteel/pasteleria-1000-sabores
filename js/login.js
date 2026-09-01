/* ============================================================================
   LOGIN.JS — Validación del formulario de inicio de sesión
   ---------------------------------------------------------------------------
   Integrante A (Módulo 1). Usa js/validaciones.js (rol especialista).

   Reglas del Anexo 1:
     - Correo: requerido, máx. 100, solo @duoc.cl, @profesor.duoc.cl y @gmail.com
     - Contraseña: requerida, entre 4 y 10 caracteres

   Al iniciar sesión guarda el usuario y su rol en localStorage con la clave
   "usuarioActivo" (acuerdo del equipo). El Integrante C lee esa clave desde
   el panel de administración para mostrar u ocultar el menú según el rol.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formLogin");
  if (!formulario) return;

  const campoCorreo = document.getElementById("correo");
  const campoPassword = document.getElementById("password");
  const avisoLogin = document.getElementById("avisoLogin");

  sembrarUsuariosDemo();

  /* ---------- Validación en tiempo real ---------- */
  campoCorreo.addEventListener("input", validarCampoCorreo);
  campoPassword.addEventListener("input", validarCampoPassword);

  /* ---------- Envío del formulario ---------- */
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarAviso();

    const correoOk = validarCampoCorreo();
    const passwordOk = validarCampoPassword();

    if (!correoOk || !passwordOk) {
      mostrarAviso("Revisa los campos marcados en rojo antes de continuar.");
      return;
    }

    const usuario = buscarUsuario(campoCorreo.value.trim(), campoPassword.value);

    if (!usuario) {
      mostrarAviso("Correo o contraseña incorrectos. Verifica tus datos o regístrate.");
      campoPassword.focus();
      return;
    }

    guardarSesion(usuario);

    // Redirigir según el rol (Anexo 1: Administrador y Vendedor van al panel)
    if (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor") {
      window.location.href = "admin-home.html";
    } else {
      window.location.href = "index.html";
    }
  });

  /* ---------- Funciones de validación ---------- */
  function validarCampoCorreo() {
    const valor = campoCorreo.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoCorreo, "El correo es obligatorio.");
    }
    if (!validarLargoMaximo(valor, LARGOS.correo)) {
      return mostrarError(campoCorreo, "El correo no puede superar los " + LARGOS.correo + " caracteres.");
    }
    if (!validarCorreo(valor)) {
      return mostrarError(campoCorreo, "Solo se aceptan correos " + TEXTO_DOMINIOS + ".");
    }
    return marcarValido(campoCorreo);
  }

  function validarCampoPassword() {
    const valor = campoPassword.value;

    if (!validarNoVacio(valor)) {
      return mostrarError(campoPassword, "La contraseña es obligatoria.");
    }
    if (!validarPassword(valor)) {
      return mostrarError(campoPassword, "La contraseña debe tener entre 4 y 10 caracteres.");
    }
    return marcarValido(campoPassword);
  }

  /* ---------- Aviso general del formulario ---------- */
  function mostrarAviso(texto) {
    if (!avisoLogin) return;
    avisoLogin.textContent = texto;
    avisoLogin.classList.remove("hidden");
  }

  function ocultarAviso() {
    if (!avisoLogin) return;
    avisoLogin.textContent = "";
    avisoLogin.classList.add("hidden");
  }

  /* ---------- Buscar usuario registrado ---------- */
  function buscarUsuario(correo, password) {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      const correoBuscado = correo.toLowerCase();
      return usuarios.find(function (u) {
        return String(u.correo).toLowerCase() === correoBuscado && u.password === password;
      }) || null;
    } catch (e) {
      return null;
    }
  }

  /* ---------- Guardar sesión activa ---------- */
  function guardarSesion(usuario) {
    try {
      const sesion = {
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        tipo: usuario.tipo || "Cliente",
        beneficios: usuario.beneficios || [],
        fechaLogin: new Date().toISOString()
      };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch (e) {
      mostrarAviso("No se pudo guardar la sesión en este navegador.");
    }
  }

  /* ---------- Usuarios de demostración ----------
     Solo se crean la primera vez, si aún no hay ningún usuario registrado.
     Sirven para poder demostrar los tres roles del Anexo 1 en la presentación
     sin tener que registrarse antes.                                        */
  function sembrarUsuariosDemo() {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      if (usuarios.length > 0) return;

      const demo = [
        {
          run: "190110222", nombre: "Ana", apellidos: "Soto Pérez",
          correo: "admin@duoc.cl", password: "admin123",
          region: "Metropolitana de Santiago", comuna: "Santiago",
          direccion: "Av. Dulce 123", tipo: "Administrador", beneficios: []
        },
        {
          run: "156789011", nombre: "Luis", apellidos: "Vera Rojas",
          correo: "vendedor@duoc.cl", password: "venta123",
          region: "Metropolitana de Santiago", comuna: "Providencia",
          direccion: "Av. Dulce 123", tipo: "Vendedor", beneficios: []
        },
        {
          run: "123456785", nombre: "Camila", apellidos: "Díaz Muñoz",
          correo: "cliente@gmail.com", password: "cliente1",
          region: "Valparaíso", comuna: "Viña del Mar",
          direccion: "Calle Las Flores 45", tipo: "Cliente", beneficios: []
        }
      ];

      localStorage.setItem("usuarios", JSON.stringify(demo));
    } catch (e) {
      // Si el navegador bloquea localStorage, el login simplemente no encontrará usuarios
    }
  }
});
