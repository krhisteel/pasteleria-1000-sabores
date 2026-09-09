"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formRegistro");
  if (!formulario) return;

  const campoRun = document.getElementById("run");
  const campoNombre = document.getElementById("nombre");
  const campoApellidos = document.getElementById("apellidos");
  const campoCorreo = document.getElementById("correo");
  const campoFecha = document.getElementById("fechaNacimiento");
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");
  const campoDireccion = document.getElementById("direccion");
  const campoTelefono = document.getElementById("telefono");
  const campoPassword = document.getElementById("password");
  const campoConfirm = document.getElementById("confirmPassword");
  const campoPromocion = document.getElementById("codigoPromocional");
  const bloqueBeneficios = document.getElementById("beneficiosDetectados");
  const mensajeExito = document.getElementById("mensajeExitoRegistro");
  const listaBeneficios = document.getElementById("listaBeneficios");

  cargarRegiones();
  conectarContador(campoDireccion, LARGOS.direccion);

  selectRegion.addEventListener("change", function () {
    cargarComunas(selectRegion.value);
    validarCampoRegion();
  });

  campoRun.addEventListener("input", validarCampoRun);
  campoNombre.addEventListener("input", validarCampoNombre);
  campoApellidos.addEventListener("input", validarCampoApellidos);
  campoCorreo.addEventListener("input", function () {
    validarCampoCorreo();
    refrescarBeneficios();
  });
  campoFecha.addEventListener("change", function () {
    validarCampoFecha();
    refrescarBeneficios();
  });
  selectComuna.addEventListener("change", validarCampoComuna);
  campoDireccion.addEventListener("input", validarCampoDireccion);
  campoTelefono.addEventListener("input", validarCampoTelefono);
  campoPassword.addEventListener("input", function () {
    validarCampoPassword();
    // Si ya escribió la confirmación, se revisa de nuevo al cambiar la contraseña
    if (campoConfirm.value.length > 0) validarCampoConfirmPassword();
  });
  campoConfirm.addEventListener("input", validarCampoConfirmPassword);

  if (campoPromocion) {
    campoPromocion.addEventListener("input", function () {
      validarCampoPromocion();
      refrescarBeneficios();
    });
  }

  // Sugerencia: al salir del campo, el RUN se muestra con formato de lectura
  campoRun.addEventListener("blur", function () {
    if (validarRun(campoRun.value)) {
      campoRun.value = normalizarRun(campoRun.value);
    }
  });

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const validaciones = [
      validarCampoRun(),
      validarCampoNombre(),
      validarCampoApellidos(),
      validarCampoCorreo(),
      validarCampoFecha(),
      validarCampoRegion(),
      validarCampoComuna(),
      validarCampoDireccion(),
      validarCampoTelefono(),
      validarCampoPassword(),
      validarCampoConfirmPassword(),
      validarCampoPromocion()
    ];

    if (validaciones.indexOf(false) !== -1) {
      // Llevar al usuario al primer campo con error
      const primerError = formulario.querySelector(".campo-error");
      if (primerError) primerError.focus();
      return;
    }

    const beneficios = calcularBeneficios();

    var descuentoEdad = 0;
    if (campoFecha.value && calcularEdad(campoFecha.value) >= 50) {
      descuentoEdad = 50;
    }

    var descuentoCodigo = 0;
    if (campoPromocion && campoPromocion.value.trim().toUpperCase() === "FELICES50") {
      descuentoCodigo = 10;
    }

    var correoUsuario = campoCorreo.value.trim().toLowerCase();
    var esCorreoDuoc = correoUsuario.endsWith("@duocuc.cl") || correoUsuario.endsWith("@duoc.cl") || correoUsuario.endsWith("@profesor.duoc.cl");

    const usuario = {
      run: normalizarRun(campoRun.value),
      nombre: campoNombre.value.trim(),
      apellidos: campoApellidos.value.trim(),
      correo: campoCorreo.value.trim().toLowerCase(),
      password: campoPassword.value,
      fechaNacimiento: campoFecha.value || null,
      region: selectRegion.value,
      comuna: selectComuna.value,
      direccion: campoDireccion.value.trim(),
      telefono: campoTelefono.value.trim() || null,
      codigoPromocional: campoPromocion ? campoPromocion.value.trim().toUpperCase() : "",
      beneficios: beneficios,
      descuentoEdad: descuentoEdad,
      descuentoCodigo: descuentoCodigo,
      tortaGratisDuoc: esCorreoDuoc,
      tipo: "Cliente",
      fechaRegistro: new Date().toISOString()
    };

    if (!guardarUsuario(usuario)) return;

    mostrarExito(usuario, beneficios);
  });

  // Pobla el select de regiones desde REGIONES_COMUNAS
  function cargarRegiones() {
    selectRegion.innerHTML = '<option value="">Selecciona una región</option>';

    REGIONES_COMUNAS.forEach(function (item) {
      const opcion = document.createElement("option");
      opcion.value = item.region;
      opcion.textContent = item.region;
      selectRegion.appendChild(opcion);
    });
  }

  // Pobla el select de comunas según la región seleccionada
  function cargarComunas(regionNombre) {
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    selectComuna.disabled = true;
    limpiarEstado(selectComuna);

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

  // Valida el RUN: obligatorio, 7-9 caracteres, dígito verificador válido
  function validarCampoRun() {
    const valor = campoRun.value.trim();
    const limpio = normalizarRun(valor);

    if (!validarNoVacio(valor)) {
      return mostrarError(campoRun, "El RUN es obligatorio.");
    }
    if (limpio.length < 7) {
      return mostrarError(campoRun, "El RUN debe tener al menos 7 caracteres (sin puntos ni guion).");
    }
    if (limpio.length > 9) {
      return mostrarError(campoRun, "El RUN no puede tener más de 9 caracteres (sin puntos ni guion).");
    }
    if (!validarRun(valor)) {
      return mostrarError(campoRun, "El RUN no es válido: revisa el dígito verificador. Ejemplo válido: 190110222");
    }
    return marcarValido(campoRun);
  }

  // Valida el nombre: obligatorio, 2-50 caracteres
  function validarCampoNombre() {
    const valor = campoNombre.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoNombre, "El nombre es obligatorio.");
    }
    if (!validarLargoMinimo(valor, 2)) {
      return mostrarError(campoNombre, "El nombre debe tener al menos 2 caracteres.");
    }
    if (!validarLargoMaximo(valor, LARGOS.nombreRegistro)) {
      return mostrarError(campoNombre, "El nombre no puede superar los " + LARGOS.nombreRegistro + " caracteres.");
    }
    return marcarValido(campoNombre);
  }

  // Valida los apellidos: obligatorio, máx. 100 caracteres
  function validarCampoApellidos() {
    const valor = campoApellidos.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoApellidos, "Los apellidos son obligatorios.");
    }
    if (!validarLargoMaximo(valor, LARGOS.apellidos)) {
      return mostrarError(campoApellidos, "Los apellidos no pueden superar los " + LARGOS.apellidos + " caracteres.");
    }
    return marcarValido(campoApellidos);
  }

  // Valida el correo: obligatorio, dominios permitidos, máx. 100
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

  // Valida la fecha de nacimiento: opcional, no futura, edad ≤ 120
  function validarCampoFecha() {
    const valor = campoFecha.value;

    if (!valor) {
      limpiarEstado(campoFecha);
      return true;
    }

    const fecha = new Date(valor + "T00:00:00");
    const hoy = new Date();

    if (isNaN(fecha.getTime())) {
      return mostrarError(campoFecha, "Ingresa una fecha válida.");
    }
    if (fecha > hoy) {
      return mostrarError(campoFecha, "La fecha de nacimiento no puede ser futura.");
    }
    if (calcularEdad(valor) > 120) {
      return mostrarError(campoFecha, "Revisa la fecha: la edad calculada no es válida.");
    }
    return marcarValido(campoFecha);
  }

  // Valida que se haya seleccionado una región
  function validarCampoRegion() {
    if (!selectRegion.value) {
      return mostrarError(selectRegion, "Selecciona una región.");
    }
    return marcarValido(selectRegion);
  }

  // Valida que se haya seleccionado una comuna
  function validarCampoComuna() {
    if (!selectRegion.value) {
      return mostrarError(selectComuna, "Primero selecciona una región.");
    }
    if (!selectComuna.value) {
      return mostrarError(selectComuna, "Selecciona una comuna.");
    }
    return marcarValido(selectComuna);
  }

  // Valida la dirección: obligatoria, máx. 300 caracteres
  function validarCampoDireccion() {
    const valor = campoDireccion.value.trim();

    if (!validarNoVacio(valor)) {
      return mostrarError(campoDireccion, "La dirección es obligatoria.");
    }
    if (!validarLargoMaximo(valor, LARGOS.direccion)) {
      return mostrarError(campoDireccion, "La dirección no puede superar los " + LARGOS.direccion + " caracteres.");
    }
    return marcarValido(campoDireccion);
  }

  // Valida el teléfono: opcional, 8-15 dígitos
  function validarCampoTelefono() {
    const valor = campoTelefono.value.trim();

    if (valor === "") {
      limpiarEstado(campoTelefono);
      return true;
    }
    if (!validarLargoMaximo(valor, LARGOS.telefono)) {
      return mostrarError(campoTelefono, "El teléfono no puede superar los " + LARGOS.telefono + " caracteres.");
    }
    if (!validarTelefono(valor)) {
      return mostrarError(campoTelefono, "Ingresa un teléfono válido, entre 8 y 15 dígitos. Ejemplo: +56 9 1234 5678");
    }
    return marcarValido(campoTelefono);
  }

  // Valida la contraseña: obligatoria, 4-10 caracteres
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

  // Valida que la confirmación coincida con la contraseña
  function validarCampoConfirmPassword() {
    const valor = campoConfirm.value;

    if (!validarNoVacio(valor)) {
      return mostrarError(campoConfirm, "Debes repetir la contraseña.");
    }
    if (valor !== campoPassword.value) {
      return mostrarError(campoConfirm, "Las contraseñas no coinciden.");
    }
    return marcarValido(campoConfirm);
  }

  // Valida el código promocional: opcional, solo "FELICES50"
  function validarCampoPromocion() {
    if (!campoPromocion) return true;

    const valor = campoPromocion.value.trim().toUpperCase();

    if (valor === "") {
      limpiarEstado(campoPromocion);
      return true;
    }
    if (valor !== "FELICES50") {
      return mostrarError(campoPromocion, "El código no existe. El código vigente es FELICES50.");
    }
    return marcarValido(campoPromocion);
  }

  // Calcula la edad en años a partir de una fecha de nacimiento
  function calcularEdad(fechaTexto) {
    const nacimiento = new Date(fechaTexto + "T00:00:00");
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  // Determina los descuentos aplicables según edad, código y correo
  function calcularBeneficios() {
    const beneficios = [];
    const correo = campoCorreo.value.trim().toLowerCase();
    const codigo = campoPromocion ? campoPromocion.value.trim().toUpperCase() : "";

    if (campoFecha.value && calcularEdad(campoFecha.value) >= 50) {
      beneficios.push("50% de descuento de por vida por ser mayor de 50 años");
    }
    if (codigo === "FELICES50") {
      beneficios.push("10% de descuento de por vida por el código FELICES50");
    }
    if (correo.endsWith("@duocuc.cl") || correo.endsWith("@duoc.cl") || correo.endsWith("@profesor.duoc.cl")) {
      beneficios.push("Torta gratis en tu cumpleaños por ser de la comunidad Duoc UC");
    }

    return beneficios;
  }

  // Actualiza el bloque visual que muestra los beneficios detectados
  function refrescarBeneficios() {
    if (!bloqueBeneficios) return;

    const beneficios = calcularBeneficios();

    if (beneficios.length === 0) {
      bloqueBeneficios.classList.add("hidden");
      bloqueBeneficios.innerHTML = "";
      return;
    }

    bloqueBeneficios.innerHTML =
      "<strong>Beneficios que obtendrás:</strong><ul>" +
      beneficios.map(function (b) { return "<li>" + b + "</li>"; }).join("") +
      "</ul>";
    bloqueBeneficios.classList.remove("hidden");
  }

  // Guarda el usuario en localStorage verificando duplicados
  function guardarUsuario(usuario) {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      const correoRepetido = usuarios.some(function (u) {
        return String(u.correo).toLowerCase() === usuario.correo;
      });
      if (correoRepetido) {
        mostrarError(campoCorreo, "Ya existe una cuenta registrada con este correo.");
        campoCorreo.focus();
        return false;
      }

      const runRepetido = usuarios.some(function (u) {
        return normalizarRun(u.run) === usuario.run;
      });
      if (runRepetido) {
        mostrarError(campoRun, "Ya existe una cuenta registrada con este RUN.");
        campoRun.focus();
        return false;
      }

      usuarios.push(usuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return true;
    } catch (e) {
      mostrarError(campoCorreo, "No se pudo guardar el registro en este navegador.");
      return false;
    }
  }

  // Oculta el formulario y muestra el mensaje de registro exitoso
  function mostrarExito(usuario, beneficios) {
    if (!mensajeExito) return;

    if (listaBeneficios) {
      listaBeneficios.innerHTML = beneficios.length === 0
        ? "<li>Cuenta de cliente creada correctamente.</li>"
        : beneficios.map(function (b) { return "<li>" + b + "</li>"; }).join("");
    }

    formulario.classList.add("hidden");
    if (bloqueBeneficios) bloqueBeneficios.classList.add("hidden");
    mensajeExito.classList.remove("hidden");
    mensajeExito.focus();
    mensajeExito.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
