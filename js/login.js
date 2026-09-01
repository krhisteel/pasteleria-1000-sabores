/* ============================================================================
   LOGIN.JS — Validación del formulario de inicio de sesión
   ---------------------------------------------------------------------------
   Utiliza js/validaciones.js (especialista)
   
   Guarda la sesión activa y el rol del usuario en localStorage con la clave
   "usuarioActivo" (acuerdo del equipo para integración con módulos).
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formLogin");

  if (!formulario) return;

  /* ---------- Validación en tiempo real ---------- */
  document.getElementById("correo").addEventListener("input", function () {
    validarCampoCorreo();
  });

  document.getElementById("password").addEventListener("input", function () {
    validarCampoPassword();
  });

  /* ---------- Envío del formulario ---------- */
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const correoOk = validarCampoCorreo();
    const passwordOk = validarCampoPassword();

    if (correoOk && passwordOk) {
      const correo = document.getElementById("correo").value.trim();
      const password = document.getElementById("password").value;

      // Buscar usuario en localStorage
      const usuario = buscarUsuario(correo, password);

      if (usuario) {
        // Guardar sesión activa
        guardarSesion(usuario);

        // Redirigir según el tipo de usuario
        if (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor") {
          window.location.href = "admin-home.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        mostrarError(document.getElementById("password"), "Correo o contraseña incorrectos");
      }
    }
  });

  /* ---------- Funciones de validación ---------- */
  function validarCampoCorreo() {
    const valor = document.getElementById("correo").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("correo"), "El correo es obligatorio");
      return false;
    }
    if (!validarCorreo(valor)) {
      mostrarError(document.getElementById("correo"), "Ingrese un correo válido");
      return false;
    }
    marcarValido(document.getElementById("correo"));
    return true;
  }

  function validarCampoPassword() {
    const valor = document.getElementById("password").value;
    if (!validarPassword(valor)) {
      mostrarError(document.getElementById("password"), "La contraseña debe tener entre 4 y 10 caracteres");
      return false;
    }
    marcarValido(document.getElementById("password"));
    return true;
  }

  /* ---------- Buscar Usuario ---------- */
  function buscarUsuario(correo, password) {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      return usuarios.find(function (u) {
        return u.correo === correo && u.password === password;
      });
    } catch (e) {
      return null;
    }
  }

  /* ---------- Guardar Sesión ---------- */
  function guardarSesion(usuario) {
    try {
      const sesion = {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        tipo: usuario.tipo || "Cliente",
        fechaLogin: new Date().toISOString()
      };
      localStorage.setItem("usuarioActivo", JSON.stringify(sesion));
    } catch (e) {
      console.error("Error al guardar sesión:", e);
    }
  }
});

/* ---------- Función global para cerrar sesión ---------- */
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
}

/* ---------- Función global para obtener el usuario actual ---------- */
function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
  } catch (e) {
    return null;
  }
}

/* ---------- Función global para verificar si hay sesión ---------- */
function haySesion() {
  return obtenerUsuarioActual() !== null;
}

/* ---------- Función global para verificar el rol ---------- */
function esAdministrador() {
  const usuario = obtenerUsuarioActual();
  return usuario && usuario.tipo === "Administrador";
}

function esVendedor() {
  const usuario = obtenerUsuarioActual();
  return usuario && usuario.tipo === "Vendedor";
}

function esCliente() {
  const usuario = obtenerUsuarioActual();
  return usuario && usuario.tipo === "Cliente";
}
