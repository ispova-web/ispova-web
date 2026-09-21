# Sitio Web I.S.P.O.V.A.

Sitio estático (HTML + SCSS/CSS + JS vanilla) armado a partir de los wireframes: Inicio, Propuesta Educativa, Institución, Administración (Pagos/Becas) y Contacto.

## Cómo abrirlo en VS Code

1. Descomprimí la carpeta y abrila en VS Code (`Archivo > Abrir carpeta...`).
2. Instalá la extensión **Live Server** (Ritwick Dey) para ver el sitio con recarga automática: click derecho sobre `index.html` → **Open with Live Server**.
3. Si querés editar los estilos, modificá los archivos en `/scss` (no `/css/main.css`, que es el archivo compilado).

## Compilar el SCSS

**Opción A — Extensión de VS Code:** instalá **Live Sass Compiler** (Glenn Marks). Con `main.scss` abierto, hacé click en "Watch Sass" en la barra inferior. Cada vez que guardes un `.scss`, se regenera `css/main.css` automáticamente.

**Opción B — Terminal (Dart Sass):**
```bash
npm install -g sass
sass scss/main.scss css/main.css --watch
```

## Estructura de carpetas

Sólo `index.html` vive en la raíz. Cada sección con varias páginas
(Propuesta Educativa, Institución, Administración) tiene su propia carpeta
adentro de `pages/`, con un archivo "landing" nombrado igual que la carpeta
(no `index.html` — ese nombre queda reservado para la home) y un archivo
por cada sub-página.

```
├── index.html                                        → Inicio (única página en la raíz)
├── pages/
│   ├── contacto.html                                 → Contacto por nivel + mapa + datos generales
│   ├── inscripciones.html                            → Placeholder
│   ├── espacios.html                                 → Placeholder
│   ├── propuesta-educativa/
│   │   ├── propuesta-educativa.html                  → Landing con links a los 4 niveles
│   │   ├── nivel-inicial.html
│   │   ├── nivel-primario.html
│   │   ├── nivel-secundario.html
│   │   └── modalidad-especial.html
│   ├── institucion/
│   │   ├── institucion.html                          → Landing con links a las 4 secciones
│   │   ├── equipo-directivo.html
│   │   ├── historia.html
│   │   ├── nombre.html
│   │   └── himno.html
│   └── administracion/
│       ├── administracion.html                       → Landing con links a Pagos y Becas
│       ├── pagos.html                                → Autogestión ETNA
│       └── becas.html                                → Becas Escolares
├── pdf/                                                → PDFs referenciados desde Propuesta Educativa (uniforme.pdf, certificado-salud.pdf, etc. — subir a mano)
├── scss/                                               → Código fuente Sass (un partial por página, además de lo compartido)
│   ├── _variables.scss                                → Colores, tipografías, espaciados
│   ├── _base.scss                                     → Reset + utilidades (.btn, .eyebrow, .sunburst, etc.)
│   ├── _header.scss / _footer.scss
│   ├── _components.scss                               → Tabs, acordeón, carrusel, tarjetas, etc. (reutilizables en todo el sitio)
│   ├── _home.scss                                     → Sólo Inicio
│   ├── _institucion.scss                              → Estilos de institución (equipo/historia/nombre/himno)
│   ├── _administracion.scss / _contacto.scss
│   ├── _niveles-compartido.scss                       → Lo que comparten Nivel Inicial/Primario/Secundario (nivel-zone, trámites, etc.)
│   ├── _nivel-inicial.scss                            → Sólo nivel-inicial.html (cita + video)
│   ├── _nivel-primario.scss                           → Sólo nivel-primario.html (vacío por ahora)
│   ├── _nivel-secundario.scss                         → Sólo nivel-secundario.html (vacío por ahora)
│   ├── _modalidad-especial.scss                       → Sólo modalidad-especial.html (todavía con el diseño viejo)
│   └── main.scss                                      → Archivo que importa todo
├── css/main.css                                        → CSS ya compilado (listo para usar sin instalar nada)
├── js/main.js                                          → Nav responsive, dropdown, carrusel, tabs, acordeón, botón "copiar"
└── img/                                                → Logos y fotos placeholder (ver abajo)
```

> Si vas a crear una página nueva o mover una: los `href`/`src` son relativos,
> así que hay que ajustar `../` según la profundidad (`pages/` = un nivel,
> `pages/propuesta-educativa/`, `pages/institucion/` y `pages/administracion/`
> = dos niveles) tanto para `css/main.css` y `js/main.js` como para los links
> entre páginas.

## Pendientes / a completar vos

- **Imágenes reales**: reemplazá todo lo que hay en `/img` (logos y fotos placeholder generados) por las fotos e isologos reales de ISPOVA, Eva Franco e Itatí. Los nombres de archivo ya están referenciados en el HTML, así que alcanza con pisar los archivos manteniendo el mismo nombre, o cambiar el `src` si usás otros nombres.
- **Mapa**: en `contacto.html` el iframe de Google Maps usa una búsqueda por dirección de texto. Si tenés el link "Insertar mapa" real de Google Maps (Compartir → Insertar un mapa), reemplazá el `src` del `<iframe>` por esa URL para más precisión.
- **Videos de YouTube**: los bloques de video (`.video-thumb`) son sólo miniaturas clickeables de ejemplo. Falta linkearlos a los videos/canal reales (envolviendo cada `.video-thumb` en un `<a>` o agregando un modal con el `<iframe>` embebido de YouTube).
- **Botón ETNA**: el link "Ingresar a ETNA Educación" apunta a `https://www.etna.com.ar` como placeholder — reemplazalo por la URL real de acceso de ISPOVA.
- **Reglamento de Becas**: el botón "Ver Reglamento de Becas" apunta a `#` — hay que linkearlo al PDF real una vez que lo tengas.
- **Equipo directivo**: nombres y datos de los directivos (RC, CM, LG) son de ejemplo — reemplazalos por los reales, y podés duplicar el bloque `.team-grid` para cada nivel usando los sub-tabs ya armados (Secundario/Primario/Inicial/Especial).
- **Himno**: quedó con autores de ejemplo ("Letra"/"Música") — poné los nombres reales y el link al video de YouTube.
- **Páginas Inscripciones y Espacios**: no estaban en los wireframes que me pasaste, así que quedaron como placeholders con el mismo header/footer. Decime qué contenido llevan y las completo.

## Funcionalidades ya implementadas en JS

- Menú responsive con hamburguesa en mobile y dropdown "Administración" (Pagos/Becas).
- Carrusel de imágenes en el Inicio (autoplay + flechas + dots).
- Sistema de tabs (Propuesta Educativa por nivel, Institución por sección, Administración Pagos/Becas).
- Acordeón desplegable (biografía de Olegario Andrade en "Nombre").
- Botón "Leer más" en Historia.
- Botones de copiar al portapapeles en los datos de contacto.
- Resaltado automático del link activo en el menú según la página.
