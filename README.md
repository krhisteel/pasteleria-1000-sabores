# Pastelería 1000 Sabores — Tienda Online

**Evaluación Parcial N° 1 — DSY1104 Desarrollo Fullstack II — Duoc UC**

Sitio web desarrollado con HTML5, CSS3 y JavaScript vanilla (sin frameworks).

**GitHub Pages:** https://krhisteel.github.io/pasteleria-1000-sabores/

---

## Integrantes del equipo

| Nombre | Rol | Módulo |
|--------|-----|--------|
| Aileen Oyaneder | HTML + validaciones JS | Módulo 1 — Contenido y Acceso |
| Jael Reyes | Lógica de negocio JS | Módulo 2 — Compra |
| Benjamín Riquelme | CSS + panel admin | Módulo 3 — Administración |

---

## Cómo ejecutar

1. Clonar el repositorio.
2. Abrir `index.html` en el navegador.

```bash
git clone https://github.com/krhisteel/pasteleria-1000-sabores.git
cd pasteleria-1000-sabores
```

Para servidor local (recomendado para `localStorage`):

```bash
python -m http.server 8000
```

Abrir http://localhost:8000

---

## Cuentas de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | venta123 |
| Cliente | cliente@gmail.com | cliente1 |

---

## Estructura del proyecto

```
pasteleria-1000-sabores/
├── index.html                  Home (hero, categorías, productos, video, CTA)
├── nosotros.html               Historia, video, valores, equipo
├── blogs.html                  Listado de artículos
├── blog-detalle-1.html         Artículo: chocolate artesanal
├── blog-detalle-2.html         Artículo: tendencias 2026
├── contacto.html               Formulario de contacto
├── registro.html               Registro de usuario
├── login.html                  Inicio de sesión
├── productos.html              Catálogo de productos
├── producto-detalle.html       Detalle de producto
├── carrito.html                Carrito de compras
├── pedido.html                 Confirmación de pedido
├── admin-home.html             Panel: portada
├── admin-productos.html        Panel: listado productos
├── admin-producto-nuevo.html   Panel: crear producto
├── admin-producto-editar.html  Panel: editar producto
├── admin-producto-mostrar.html Panel: detalle producto
├── admin-usuarios.html         Panel: listado usuarios
├── admin-usuario-nuevo.html    Panel: crear usuario
├── admin-usuario-editar.html   Panel: editar usuario
├── admin-usuario-mostrar.html  Panel: detalle usuario
├── css/
│   ├── global.css              Variables, reset, header, footer
│   ├── home.css                Estilos home
│   ├── nosotros.css            Estilos nosotros
│   ├── blogs.css               Estilos blogs
│   ├── contacto.css            Estilos contacto
│   ├── auth.css                Estilos registro/login
│   ├── productos.css           Estilos catálogo
│   ├── producto-detalle.css    Estilos detalle producto
│   ├── carrito.css             Estilos carrito
│   ├── pedido.css              Estilos pedido
│   ├── admin.css               Panel: layout general
│   ├── admin-productos.css     Panel: mantenedor productos
│   └── admin-usuarios.css      Panel: mantenedor usuarios
├── js/
│   ├── main.js                 Menú responsive, sesión, contador carrito
│   ├── validaciones.js         Funciones de validación reutilizables
│   ├── registro.js             Validación registro
│   ├── login.js                Validación login
│   ├── contacto.js             Validación contacto
│   ├── regiones-comunas.js     Regiones y comunas de Chile
│   ├── home.js                 Lógica del home
│   ├── productos.js            Lógica catálogo
│   ├── producto-detalle.js     Lógica detalle producto
│   ├── carrito.js              Lógica carrito
│   ├── pedido.js               Lógica pedido
│   ├── admin.js                Panel: protección por rol
│   ├── admin-productos.js      Panel: CRUD productos
│   └── admin-usuarios.js       Panel: CRUD usuarios
├── img/                        Imágenes del proyecto
└── README.md
```

---

## Indicador IE1.1.1 — Estructura HTML5 semántica

Todas las páginas utilizan etiquetas semánticas HTML5:

| Etiqueta | Uso |
|----------|-----|
| `<header>` | Encabezado de cada página con logo, navegación y carrito |
| `<nav>` | Menú principal de navegación |
| `<main>` | Contenido principal de cada vista |
| `<section>` | Secciones temáticas (hero, categorías, productos, etc.) |
| `<article>` | Entradas de blog, tarjetas de productos |
| `<figure>` / `<figcaption>` | Imágenes con descripción |
| `<footer>` | Pie de página con información de contacto |

Elementos implementados:
- Navegación por hipervínculos entre todas las páginas
- Imágenes con texto alternativo (`alt`)
- Botones operativos
- Video embebido (YouTube) en `index.html` y `nosotros.html`
- Formularios interactivos en `contacto.html`, `registro.html` y `login.html`
- Footer informativo con datos de la pastelería
- Accesibilidad: enlace "saltar al contenido", `aria-label`, `aria-expanded`, `role="alert"`

---

## Indicador IE1.1.2 — CSS externo personalizado

Todas las páginas usan hojas de estilos CSS externas. Ninguna página usa estilos en línea ni `<style>`.

**Hoja de estilos global:** `css/global.css`
- Variables CSS para colores de marca
- Reset de estilos
- Estilos de header y footer
- Botones y utilidades
- Importada por todas las páginas

**Diseño responsivo:** Todas las hojas incluyen `@media` para tablet y móvil.

**Colores de la marca:**

| Nombre | Valor |
|--------|-------|
| Crema pastel | `#FFF5E1` |
| Rosa | `#FFC0CB` |
| Chocolate | `#8B4513` |
| Texto | `#5D4037` |

**Tipografías:** Pacifico (títulos) y Lato (cuerpo).

---

## Indicador IE1.2.1 — Validaciones JavaScript

Todos los formularios implementan validaciones en JavaScript con mensajes personalizados.

### Formulario de registro (`registro.html`)

| Campo | Regla de validación |
|-------|---------------------|
| RUN | Requerido, dígito verificador válido (módulo 11), 7-9 caracteres, sin puntos ni guion |
| Nombre | Requerido, máximo 50 caracteres |
| Apellidos | Requerido, máximo 100 caracteres |
| Correo | Requerido, máximo 100, solo dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) |
| Fecha nacimiento | Opcional, no puede ser futura |
| Región y Comuna | Requeridas; comunas se cargan según región seleccionada |
| Dirección | Requerida, máximo 300 caracteres |
| Contraseña | Requerida, 4-10 caracteres |

### Formulario de login (`login.html`)

| Campo | Regla de validación |
|-------|---------------------|
| Correo | Requerido, formato válido |
| Contraseña | Requerida |

### Formulario de contacto (`contacto.html`)

| Campo | Regla de validación |
|-------|---------------------|
| Nombre | Requerido, 3-100 caracteres |
| Correo | Requerido, formato válido |
| Comentario | Requerido, 10-500 caracteres |

**Características de las validaciones:**
- Validación en tiempo real mientras el usuario escribe
- Mensajes de error personalizados junto a cada campo
- Textos de ayuda y sugerencias
- Contadores de caracteres
- Formularios con `novalidate` para control total desde JavaScript

---

## Indicador IE1.3.1 — Repositorio colaborativo

### Historial de commits

Todos los commits tienen mensajes claros y descriptivos que reflejan los cambios realizados:

```bash
git log --oneline
```

### Distribución de tareas

| Integrante | Responsabilidades |
|------------|-------------------|
| Aileen Oyaneder | HTML semántico, validaciones JS, header/footer, estructura de páginas |
| Jael Reyes | Lógica de negocio, carrito de compras, catálogo de productos |
| Benjamín Riquelme | CSS global, diseño responsivo, panel de administración |

### Flujo de trabajo

1. Cada integrante trabaja en su propia rama
2. Los commits se hacen individualmente (evaluación individual)
3. Se integran cambios a `master` cuando funcionan
4. Se hace `pull` antes de trabajar para evitar conflictos

### Ramas

| Rama | Propósito |
|------|-----------|
| `master` | Desarrollo principal |
| `modulo-1-contenido` | Trabajo de Aileen |
| `modulo-2-compra` | Trabajo de Jael |
| `modulo-3-admin` | Trabajo de Benjamín |
| `gh-pages` | Despliegue en GitHub Pages |

---

## Acuerdos de integración

### Claves compartidas en localStorage

| Clave | Escrita por | Leída por |
|-------|-------------|-----------|
| `usuarios` | Aileen (`registro.js`) | Aileen (`login.js`), Benjamín (`admin-usuarios.js`) |
| `usuarioActivo` | Aileen (`login.js`) | Aileen (`main.js`), Benjamín (panel admin) |
| `carrito` | Jael (`carrito.js`) | Aileen (`main.js`, contador header) |
| `productos` | Benjamín (`admin-productos.js`) | Jael (`productos.js`, catálogo) |

### Funciones globales compartidas

**De `js/main.js`:**
- `obtenerUsuarioActual()` — obtiene usuario logueado
- `haySesion()` — verifica si hay sesión activa
- `cerrarSesion()` — cierra la sesión
- `actualizarContadorCarrito()` — actualiza contador del header

**De `js/validaciones.js`:**
- `normalizarRun()`, `calcularDV()`, `validarRun()`
- `validarCorreo()`, `validarPassword()`
- `validarNoVacio()`, `validarLargoMinimo()`, `validarLargoMaximo()`
- `mostrarError()`, `marcarValido()`, `limpiarEstado()`

---

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 externo con variables y diseño responsivo
- JavaScript vanilla (ES6+)
- `localStorage` para persistencia de datos
- GitHub para control de versiones
- GitHub Pages para despliegue
