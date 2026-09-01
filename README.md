# Pastelería 1000 Sabores — Tienda Online

Evaluación Parcial N° 1 — DSY1104 Desarrollo Fullstack II — Duoc UC

Tienda online desarrollada con HTML5, CSS3 y JavaScript sin frameworks.

## Integrantes del equipo

> Reemplazar los nombres antes de la entrega.

| Nombre | Rol de especialista | Módulo |
|--------|---------------------|--------|
| *(Integrante A)* | Estructura HTML semántica + validaciones JS | Módulo 1 — Contenido y Acceso |
| *(Integrante B)* | Lógica de negocio (catálogo y carrito) | Módulo 2 — Compra |
| *(Integrante C)* | Hoja de estilos global | Módulo 3 — Administración |

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
├── css/
│   ├── global.css          Variables, reset, header, footer y utilidades (Integrante C)
│   ├── home.css            Estilos de index.html
│   ├── nosotros.css        Estilos de nosotros.html
│   ├── blogs.css           Estilos de blogs.html y de los detalles
│   ├── contacto.css        Estilos de contacto.html
│   └── auth.css            Estilos de registro.html y login.html
├── js/
│   ├── main.js             Menú responsive, sesión de usuario y contador de carrito
│   ├── validaciones.js     Funciones de validación reutilizables (Integrante A)
│   ├── contacto.js         Validación del formulario de contacto
│   ├── registro.js         Validación del registro y cálculo de beneficios
│   ├── login.js            Validación del login y guardado de la sesión
│   └── regiones-comunas.js Arreglo de regiones y comunas (Integrante C)
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

## Acuerdos de integración entre módulos

Claves compartidas en `localStorage`:

| Clave | La escribe | La leen |
|-------|------------|---------|
| `usuarios` | Integrante A (`registro.js`) | Integrante A (`login.js`), Integrante C (`admin-usuarios.js`) |
| `usuarioActivo` | Integrante A (`login.js`) | Integrante A (`main.js`), Integrante C (panel admin) |
| `carrito` | Integrante B (`carrito.js`) | Integrante A (`main.js`, contador del header) |

Funciones globales expuestas por `js/main.js` para el resto del equipo:
`obtenerUsuarioActual()`, `haySesion()`, `cerrarSesion()`, `esAdministrador()`,
`esVendedor()`, `esCliente()` y `actualizarContadorCarrito()`.

## Pendiente de otros módulos

Los enlaces `productos.html`, `producto-detalle.html` y `carrito.html` ya están
en la navegación de las 8 páginas, pero esas vistas corresponden al Módulo 2.
El panel `admin-*.html` corresponde al Módulo 3.

## Tecnologías

- HTML5 semántico
- CSS3 externo con variables y diseño responsivo
- JavaScript vanilla (ES6+)
- `localStorage` para la persistencia
