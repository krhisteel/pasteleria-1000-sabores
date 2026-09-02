# Pastelería 1000 Sabores — Tienda Online

Evaluación Parcial N° 1 — DSY1104 Desarrollo Fullstack II — Duoc UC

Tienda online desarrollada con HTML5, CSS3 y JavaScript sin frameworks.

## Integrantes del equipo

| Nombre | Rol de especialista | Módulo |
|--------|---------------------|--------|
| Aileen Oyaneder | Estructura HTML semántica + validaciones JS | Módulo 1 — Contenido y Acceso |
| Jael Reyes | Lógica de negocio (catálogo y carrito) | Módulo 2 — Compra |
| Benjamín Riquelme | Hoja de estilos global | Módulo 3 — Administración |

## Cómo ejecutar

1. Clonar el repositorio.
2. Abrir `index.html` en el navegador. No se requiere servidor local ni instalar nada.

Si prefieres levantar un servidor local (recomendado para que el navegador no
restrinja `localStorage` en algunos casos):

```bash
python -m http.server 8000
```

Luego abrir <http://localhost:8000>.

## Cuentas de prueba

La primera vez que se abre `login.html` se crean automáticamente tres cuentas
para poder demostrar los tres roles del sistema:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | venta123 |
| Cliente | cliente@gmail.com | cliente1 |

## Estructura del proyecto

```
pasteleria mil sabores/
├── index.html              Home (hero, categorías, productos, video, CTA)
├── nosotros.html           Historia, video, valores, equipo y desarrolladores
├── blogs.html              Listado de artículos
├── blog-detalle-1.html     Artículo: chocolate artesanal
├── blog-detalle-2.html     Artículo: tendencias 2026
├── contacto.html           Formulario de contacto validado
├── registro.html           Registro de usuario validado
├── login.html              Inicio de sesión validado
├── admin-home.html         Panel: portada con resumen (Benjamín Riquelme)
├── admin-productos.html    Panel: listado de productos (Benjamín Riquelme)
├── admin-producto-nuevo.html   Panel: crear producto (Benjamín Riquelme)
├── admin-producto-editar.html  Panel: editar producto (Benjamín Riquelme)
├── admin-producto-mostrar.html Panel: detalle de producto (Benjamín Riquelme)
├── admin-usuarios.html     Panel: listado de usuarios (Benjamín Riquelme)
├── admin-usuario-nuevo.html    Panel: crear usuario (Benjamín Riquelme)
├── admin-usuario-editar.html   Panel: editar usuario (Benjamín Riquelme)
├── admin-usuario-mostrar.html  Panel: detalle de usuario (Benjamín Riquelme)
├── css/
│   ├── global.css          Variables, reset, header, footer y utilidades (Benjamín Riquelme)
│   ├── home.css            Estilos de index.html
│   ├── nosotros.css        Estilos de nosotros.html
│   ├── blogs.css           Estilos de blogs.html y de los detalles
│   ├── contacto.css        Estilos de contacto.html
│   ├── auth.css            Estilos de registro.html y login.html
│   ├── admin.css           Panel: layout general y menú lateral (Benjamín Riquelme)
│   ├── admin-productos.css Panel: mantenedor de productos (Benjamín Riquelme)
│   └── admin-usuarios.css  Panel: mantenedor de usuarios (Benjamín Riquelme)
├── js/
│   ├── main.js             Menú responsive, sesión de usuario y contador de carrito
│   ├── validaciones.js     Funciones de validación reutilizables (Aileen Oyaneder)
│   ├── contacto.js         Validación del formulario de contacto
│   ├── registro.js         Validación del registro y cálculo de beneficios
│   ├── login.js            Validación del login y guardado de la sesión
│   ├── regiones-comunas.js Arreglo de regiones y comunas (Benjamín Riquelme)
│   ├── admin.js            Panel: protección por rol, menú y portada (Benjamín Riquelme)
│   ├── admin-productos.js  Panel: CRUD de productos + validaciones (Benjamín Riquelme)
│   └── admin-usuarios.js   Panel: CRUD de usuarios + validaciones (Benjamín Riquelme)
├── img/                    Imágenes propias del proyecto
└── README.md
```

## Módulo 1 — Contenido y Acceso

### Estructura y etiquetado (HTML5)

- Las 8 páginas usan `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`,
  `<figure>`, `<figcaption>` y `<footer>`.
- Header y footer semánticos compartidos, reutilizados por los Módulos 2 y 3.
- Navegación por hipervínculos entre todas las páginas, menú responsive,
  imágenes con texto alternativo, botones operativos y footer informativo.
- Video embebido en `index.html` y en `nosotros.html` dentro de un contenedor
  responsivo 16:9.
- Accesibilidad: enlace "saltar al contenido", `aria-label`, `aria-expanded`,
  `aria-describedby` y mensajes de error con `role="alert"`.

### Diseño (CSS externo)

- Seis hojas de estilo externas; ninguna página usa estilos en línea ni `<style>`.
- `global.css` define las variables de marca y es importada por todas las páginas.
- Diseño responsivo con `@media` en todas las hojas.

Colores de la marca:

| Nombre | Valor |
|--------|-------|
| Crema pastel | `#FFF5E1` |
| Rosa | `#FFC0CB` |
| Chocolate | `#8B4513` |
| Texto | `#5D4037` |

Tipografías: **Pacifico** para títulos decorativos y **Lato** para el cuerpo.

### Validaciones con JavaScript

Todas las reglas provienen del Anexo 1 de la evaluación y están centralizadas en
`js/validaciones.js`:

| Campo | Regla |
|-------|-------|
| RUN | Requerido, dígito verificador válido, sin puntos ni guion, entre 7 y 9 caracteres |
| Nombre (registro) | Requerido, máx. 50 caracteres |
| Nombre (contacto) | Requerido, entre 3 y 100 caracteres |
| Apellidos | Requerido, máx. 100 caracteres |
| Correo | Requerido, máx. 100, solo `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com` |
| Fecha de nacimiento | Opcional, no puede ser futura |
| Región y Comuna | Requeridas; las comunas se cargan según la región elegida |
| Dirección | Requerida, máx. 300 caracteres |
| Comentario | Requerido, entre 10 y 500 caracteres |
| Contraseña | Requerida, entre 4 y 10 caracteres |

Cada formulario valida en tiempo real mientras el usuario escribe, muestra
mensajes de error personalizados junto al campo, incluye textos de ayuda,
contadores de caracteres y sugerencias de dominio mediante `<datalist>`.
Los formularios usan `novalidate` para que la validación la controle
JavaScript y no el navegador.

### Beneficios del caso (Forma C)

Se implementan en `registro.html` y se calculan en vivo mientras el usuario
completa el formulario:

- 50% de descuento de por vida para personas de 50 años o más.
- 10% de descuento de por vida con el código promocional `FELICES50`.
- Torta gratis de cumpleaños para correos de la comunidad Duoc.

## Módulo 3 — Administración

### Panel de administración

Nueve páginas protegidas (`admin-*.html`) con un menú lateral visible y
contenido al centro, según el mockup (Figura 11). Comparten su propio layout
en `css/admin.css` e importan `css/global.css` (variables, tipografías y
botones de la marca).

| Vista | Archivo |
|-------|---------|
| Portada | `admin-home.html` |
| Productos (listado, nuevo, editar, detalle) | `admin-productos.html`, `admin-producto-nuevo.html`, `admin-producto-editar.html`, `admin-producto-mostrar.html` |
| Usuarios (listado, nuevo, editar, detalle) | `admin-usuarios.html`, `admin-usuario-nuevo.html`, `admin-usuario-editar.html`, `admin-usuario-mostrar.html` |

### Permisos por rol

`js/admin.js` se carga en todas las páginas del panel y, usando la sesión que
guarda Aileen en `localStorage` (clave `usuarioActivo`):

- Sin sesión iniciada, redirige a `login.html`.
- Con sesión de **Cliente**, redirige a `index.html` (el cliente solo usa la tienda).
- El menú se filtra con `data-roles` en cada enlace: el **Vendedor** solo ve
  Productos (listado y detalle); el **Administrador** ve todo.
- Además, `admin-usuarios.js` y `admin-productos.js` vuelven a validar el rol
  en cada página, por si se accede directo por URL.

### CRUD de productos (`js/admin-productos.js`)

CRUD simulado sobre la clave `productos` de `localStorage`. Si la clave no
existe, se siembran los 16 productos del caso (códigos TC001...TE002). Reglas
validadas en tiempo real:

| Campo | Regla |
|-------|-------|
| Código | Requerido, texto, mín. 3, sin espacios, no repetible |
| Nombre | Requerido, máx. 100 |
| Descripción | Opcional, máx. 500 |
| Precio | Requerido, mín. 0, decimales permitidos |
| Stock | Requerido, mín. 0, solo enteros |
| Stock crítico | Opcional, mín. 0, enteros; alerta cuando stock ≤ crítico |
| Categoría | Requerida (select con las 8 categorías del caso) |
| Imagen | Opcional (URL) |

### CRUD de usuarios (`js/admin-usuarios.js`)

CRUD simulado sobre la clave `usuarios` de `localStorage` (la misma que usa el
registro del Módulo 1). Reutiliza `js/validaciones.js` de Aileen y
`js/regiones-comunas.js`:

| Campo | Regla |
|-------|-------|
| RUN | Requerido, DV válido, sin puntos ni guion, 7-9 caracteres |
| Nombre | Requerido, máx. 50 |
| Apellidos | Requerido, máx. 100 |
| Correo | Requerido, máx. 100, solo `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com` |
| Fecha nacimiento | Opcional, no futura |
| Tipo de usuario | Select: Administrador, Cliente, Vendedor |
| Región / Comuna | Requeridas; las comunas se cargan según la región |
| Dirección | Requerida, máx. 300 |
| Contraseña | Requerida (nuevo) / opcional (editar), 4-10 caracteres |

No se permite eliminar el usuario con la sesión activa. Los usuarios creados
aquí pueden iniciar sesión en la tienda porque comparten la clave `usuarios`.

## Cómo trabajar en equipo

### 1. Aceptar la invitación

Aileen invita a cada integrante como colaborador del repositorio. Llega un correo
de GitHub con el asunto *"invited you to collaborate"*: hay que aceptarlo antes de
poder subir cambios.

### 2. Clonar el proyecto

```bash
git clone https://github.com/krhisteel/pasteleria-1000-sabores.git
cd pasteleria-1000-sabores
```

### 3. Configurar tu identidad (IMPORTANTE)

Sin este paso tus commits quedan a nombre de otra persona, y la evaluación
revisa explícitamente que las tareas estén distribuidas entre el equipo
(indicadores IE1.3.1 e IE1.3.2). Házlo **una sola vez**, dentro de la carpeta
del proyecto:

```bash
git config user.name "Tu Nombre Apellido"
```

```bash
git config user.email "tu.correo@duocuc.cl"
```

Usa el mismo correo con el que está registrada tu cuenta de GitHub, para que los
commits aparezcan asociados a tu perfil. Para comprobarlo:

```bash
git config user.name && git config user.email
```

### 4. Trabajar en tu propia rama

Cada integrante trabaja en la rama de su módulo, para no pisarse:

| Integrante | Rama |
|------------|------|
| Aileen Oyaneder | `modulo-1-contenido` |
| Jael Reyes | `modulo-2-compra` |
| Benjamín Riquelme | `modulo-3-admin` |

```bash
git checkout -b modulo-2-compra
```

### 5. Guardar y subir tus cambios

```bash
git add .
```

```bash
git commit -m "Agregar productos.html con el listado del catalogo"
```

```bash
git push -u origin modulo-2-compra
```

El mensaje del commit debe decir **qué hiciste**, no "cambios" ni "avance".
La rúbrica evalúa que sean claros y coherentes.

### 6. Integrar tu rama a master

Cuando tu parte funcione:

```bash
git checkout master && git pull && git merge modulo-2-compra && git push
```

### 7. Antes de empezar a trabajar cada día

Trae lo que subieron los demás, para evitar conflictos:

```bash
git checkout master && git pull
```

### Reglas acordadas

- **Cada integrante hace sus propios commits.** No sirve que una persona suba el
  trabajo de otra: la evaluación es individual y se revisa el historial.
- No editar archivos de otro módulo sin avisar. Si necesitas tocar
  `css/global.css` o el header, coordínalo antes.
- Al integrar un recurso compartido en tus páginas, haz **tu propio commit**:
  así queda evidencia individual de los indicadores IE1.1.2 e IE1.3.1.

## Acuerdos de integración entre módulos

Claves compartidas en `localStorage`:

| Clave | La escribe | La leen |
|-------|------------|---------|
| `usuarios` | Aileen Oyaneder (`registro.js`) | Aileen Oyaneder (`login.js`), Benjamín Riquelme (`admin-usuarios.js`) |
| `usuarioActivo` | Aileen Oyaneder (`login.js`) | Aileen Oyaneder (`main.js`), Benjamín Riquelme (panel admin) |
| `carrito` | Jael Reyes (`carrito.js`) | Aileen Oyaneder (`main.js`, contador del header) |
| `productos` | Benjamín Riquelme (`admin-productos.js`) | Jael Reyes (`productos-data.js`, catálogo) |

Funciones globales expuestas por `js/main.js` para el resto del equipo:
`obtenerUsuarioActual()`, `haySesion()`, `cerrarSesion()`, `esAdministrador()`,
`esVendedor()`, `esCliente()` y `actualizarContadorCarrito()`.

Funciones globales expuestas por `js/validaciones.js` (integradas en el panel):
`validarRun()`, `validarCorreo()`, `validarPassword()`, `validarNoVacio()`,
`validarLargoMinimo()`, `validarLargoMaximo()`, `mostrarError()`,
`marcarValido()`, `limpiarEstado()` y `conectarContador()`.

## Pendiente de otros módulos

Los enlaces `productos.html`, `producto-detalle.html` y `carrito.html` ya están
en la navegación de las 8 páginas, pero esas vistas corresponden al Módulo 2
(Benjamín). El catálogo de esas páginas debe leer la clave `productos` de
`localStorage` que ya siembra el panel.

## Tecnologías

- HTML5 semántico
- CSS3 externo con variables y diseño responsivo
- JavaScript vanilla (ES6+)
- `localStorage` para la persistencia
