/* ============================================================================
   REGISTRO.JS — Validación del formulario de registro
   ---------------------------------------------------------------------------
   Utiliza js/validaciones.js (especialista) y js/regiones-comunas.js (Integrante C)
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formRegistro");
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");

  if (!formulario) return;

  /* ---------- Cargar Regiones ---------- */
  cargarRegiones();

  /* ---------- Evento cambio de Región ---------- */
  selectRegion.addEventListener("change", function () {
    const regionSeleccionada = selectRegion.value;
    cargarComunas(regionSeleccionada);
    limpiarError(selectRegion);
  });

  /* ---------- Validación en tiempo real ---------- */
  document.getElementById("run").addEventListener("input", function () {
    validarCampoRun();
  });

  document.getElementById("nombre").addEventListener("input", function () {
    validarCampoNombre();
  });

  document.getElementById("apellidos").addEventListener("input", function () {
    validarCampoApellidos();
  });

  document.getElementById("correo").addEventListener("input", function () {
    validarCampoCorreo();
  });

  document.getElementById("fechaNacimiento").addEventListener("change", function () {
    validarCampoFecha();
  });

  document.getElementById("comuna").addEventListener("change", function () {
    validarCampoComuna();
  });

  document.getElementById("direccion").addEventListener("input", function () {
    validarCampoDireccion();
  });

  document.getElementById("password").addEventListener("input", function () {
    validarCampoPassword();
  });

  document.getElementById("confirmPassword").addEventListener("input", function () {
    validarCampoConfirmPassword();
  });

  /* ---------- Envío del formulario ---------- */
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const runOk = validarCampoRun();
    const nombreOk = validarCampoNombre();
    const apellidosOk = validarCampoApellidos();
    const correoOk = validarCampoCorreo();
    const fechaOk = validarCampoFecha();
    const comunaOk = validarCampoComuna();
    const direccionOk = validarCampoDireccion();
    const passwordOk = validarCampoPassword();
    const confirmOk = validarCampoConfirmPassword();

    if (runOk && nombreOk && apellidosOk && correoOk && fechaOk && comunaOk && direccionOk && passwordOk && confirmOk) {
      // Guardar usuario en localStorage
      const usuario = {
        run: document.getElementById("run").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        region: selectRegion.value,
        comuna: selectComuna.value,
        direccion: document.getElementById("direccion").value.trim(),
        tipo: "Cliente",
        fechaRegistro: new Date().toISOString()
      };

      guardarUsuario(usuario);

      // Mostrar mensaje de éxito
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");

      // Redirigir a login
      window.location.href = "login.html";
    }
  });

  /* ---------- Cargar Regiones ---------- */
  function cargarRegiones() {
    selectRegion.innerHTML = '<option value="">Selecciona una región</option>';
    
    REGIONES_COMUNAS.forEach(function (item) {
      const opcion = document.createElement("option");
      opcion.value = item.region;
      opcion.textContent = item.region;
      selectRegion.appendChild(opcion);
    });
  }

  /* ---------- Cargar Comunas ---------- */
  function cargarComunas(regionNombre) {
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    selectComuna.disabled = true;

    if (!regionNombre) return;

    const region = REGIONES_COMUNAS.find(function (item) {
      return item.region === regionNombre;
    });

    if (!region) return;

    region.comunas.forEach(function (comuna) {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      selectComuna.appendChild(opcion);
    });

    selectComuna.disabled = false;
  }

  /* ---------- Funciones de validación ---------- */
  function validarCampoRun() {
    const valor = document.getElementById("run").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("run"), "El RUN es obligatorio");
      return false;
    }
    if (!validarRun(valor)) {
      mostrarError(document.getElementById("run"), "Formato de RUN inválido (ej: 12.345.678-5)");
      return false;
    }
    marcarValido(document.getElementById("run"));
    return true;
  }

  function validarCampoNombre() {
    const valor = document.getElementById("nombre").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("nombre"), "El nombre es obligatorio");
      return false;
    }
    if (valor.length < 2) {
      mostrarError(document.getElementById("nombre"), "El nombre debe tener al menos 2 caracteres");
      return false;
    }
    marcarValido(document.getElementById("nombre"));
    return true;
  }

  function validarCampoApellidos() {
    const valor = document.getElementById("apellidos").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("apellidos"), "Los apellidos son obligatorios");
      return false;
    }
    marcarValido(document.getElementById("apellidos"));
    return true;
  }

  function validarCampoCorreo() {
    const valor = document.getElementById("correo").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("correo"), "El correo es obligatorio");
      return false;
    }
    if (!validarCorreo(valor)) {
      mostrarError(document.getElementById("correo"), "Correo inválido (dominios: gmail.com, outlook.com, duoc.cl, etc.)");
      return false;
    }
    marcarValido(document.getElementById("correo"));
    return true;
  }

  function validarCampoFecha() {
    const valor = document.getElementById("fechaNacimiento").value;
    if (!valor) {
      mostrarError(document.getElementById("fechaNacimiento"), "La fecha de nacimiento es obligatoria");
      return false;
    }
    const fecha = new Date(valor);
    const hoy = new Date();
    if (fecha >= hoy) {
      mostrarError(document.getElementById("fechaNacimiento"), "La fecha debe ser en el pasado");
      return false;
    }
    marcarValido(document.getElementById("fechaNacimiento"));
    return true;
  }

  function validarCampoComuna() {
    if (!selectComuna.value) {
      mostrarError(selectComuna, "Selecciona una comuna");
      return false;
    }
    marcarValido(selectComuna);
    return true;
  }

  function validarCampoDireccion() {
    const valor = document.getElementById("direccion").value.trim();
    if (!validarNoVacio(valor)) {
      mostrarError(document.getElementById("direccion"), "La dirección es obligatoria");
      return false;
    }
    marcarValido(document.getElementById("direccion"));
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

  function validarCampoConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    if (confirm !== password) {
      mostrarError(document.getElementById("confirmPassword"), "Las contraseñas no coinciden");
      return false;
    }
    marcarValido(document.getElementById("confirmPassword"));
    return true;
  }

  /* ---------- Guardar Usuario en localStorage ---------- */
  function guardarUsuario(usuario) {
    try {
      let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      
      // Verificar si el correo ya existe
      const existe = usuarios.some(function (u) {
        return u.correo === usuario.correo;
      });
      
      if (existe) {
        alert("Ya existe una cuenta con este correo electrónico.");
        return false;
      }

      usuarios.push(usuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return true;
    } catch (e) {
      console.error("Error al guardar usuario:", e);
      return false;
    }
  }
});
