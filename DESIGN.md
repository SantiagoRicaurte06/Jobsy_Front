# Sistema de diseño de Jobsy

Mundo **cálido y audaz**: un acuerdo de trabajo a la vista. Cada oferta muestra quién, cuánto por hora y qué días; la interfaz existe para que esas condiciones se lean antes que cualquier adorno.

Los valores viven en `src/styles/_variables.scss` y los patrones en `src/styles/_mixins.scss`. Ningún componente debería escribir un color en crudo.

## Color

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Suelo | `$color-bg` | `#F7F5F0` | Fondo de todo el sitio (hueso). |
| Piedra | `$color-sand` | `#ECE8DF` | Cabezas de listados, bandas alternas, fichas. |
| Superficie | `$color-surface` | `#FFFFFF` | Tarjetas y paneles sobre el fondo. |
| Borde | `$color-border` / `-strong` | `#DDD8CC` / `#C6BEAE` | Bordes. |
| Tinta | `$color-ink` / `$color-text` | `#13233A` | Texto, menú activo, pie, paneles de resultado, panel admin. |
| Texto secundario | `$color-text-muted` | `#5B6676` | Texto de apoyo. |
| Azul del logo | `$color-primary` / `$color-cta` | `#0058DC` | Botón principal (con texto blanco, 6,1:1), enlaces, campos azules. |
| Verde del logo | `$color-select` / `$color-accent` | `#238303` | Lo elegido y lo que coincide: días, franja de la semana, íconos de acento. Con texto blanco (4,9:1). |
| Lima del logo | `$color-on-dark-accent` | `#8FE218` | El único acento sobre tinta: días en la barra oscura, cifras, foco y enlaces del pie. Siempre con texto tinta. |
| Estrellas | `$color-star` | `#C7851A` | Calificaciones. |
| Verde morichal | `$color-success` | `#1A6E44` | Verificado, disponible, aceptado. |
| Ámbar / Rojo | `$color-warning` / `$color-danger` | `#8A5100` / `#B42318` | Avisos (pocas existencias) y errores. |
| Peligro hover | `$color-danger-hover` | `#8E1B12` | Hover de acciones destructivas. |
| Texto sobre tinta | `$color-on-dark` | `#D9DEE6` | Texto en pie de página y barra lateral admin. |
| Texto tinta tenue | `$color-on-dark-muted` | `#9AA6B8` | Secundario sobre fondo tinta. |
| Fondo translúcido | `$color-bg-translucent` | `rgba(247, 245, 240, 0.94)` | Cabecera sticky y barra superior admin. |
| Gráfica lila | `$color-chart-purple` | `#8B5CF6` | Barras del tablero admin. |

Reglas:

- La paleta sale del logo: azul para actuar, verde para lo elegido. El naranja se retiró el 2026-11-27: no venía del logo, se perdía sobre la crema (2,4:1) y estaba en 92 lugares.
- El lima solo va sobre tinta; sobre fondos claros no se lee.
- El azul se usa como **campo** (regiones completas), no como adorno suelto. Bajo el campo azul va el "horizonte": una franja lima de 8–14 px.
- Sin degradados ni cristal: las superficies son sólidas.

## Tipografía

- **Una sola familia: Archivo** (variable, de Omnibus-Type, Buenos Aires; paquete `@fontsource-variable/archivo`, eje de ancho incluido).
- **Titulares:** Archivo en su versión ancha (`font-stretch: 115%`, `$font-stretch-display`), peso 700, tracking `-0.015em`. Mixin `m.display($tamaño)`. Reemplazó a Bricolage Grotesque el 2026-11-27: sus formas irregulares y el peso 800 apretado se leían informales.
- **Interfaz:** Archivo en ancho normal, 17 px de base, interlineado 1.55. Cifras sueltas sin `tabular-nums`; solo en columnas.
- Las dos se sirven desde el propio sitio (`@fontsource-variable`).
- Cifras con `tabular-nums` (`.cifra`, `.precio`, tablas).
- **Sin etiquetas decorativas sobre los titulares.** El titular va solo; nada de rótulos en mayúsculas encima ("kicker"). Se probó y se leía como plantilla.
- **Etiqueta de dato:** solo cuando nombra algo real (un paso, una categoría, una cifra), en frase normal y color apagado (`m.etiqueta` o la clase global `.etiqueta`).
- **Cabecera de página:** titular y bajada cerrados por un acento azul de 3 px (`m.cabecera-editorial`).

## Forma y profundidad

- Radios: 8 / 12 / 18 / 26 px y píldora. Las tarjetas usan 18 px y los campos de color 26 px.
- **Una receta de tarjeta:** borde de 1 px (`$color-border`), radio 18 px, sin sombra en reposo; al pasar el puntero, sombra media y sube 3 px.
- Títulos de tarjeta con alto fijo de dos renglones, para que precio y botón queden alineados en toda la fila.
- Campos de formulario con borde de 1 px más oscuro (`$color-border-input`, 3:1 sobre blanco).
- Nada se repite en la misma pantalla (el destacado no vuelve a salir en la cuadrícula) y las cuadrículas no dejan huérfanos.
- Sombras cálidas con desplazamiento (`$shadow-sm/md/lg`), nunca halos sin desplazamiento.

## Movimiento

Curva `cubic-bezier(0.16, 1, 0.3, 1)`. Un solo momento por pantalla:

- La franja de la semana enciende sus días en ola.
- La oferta de la portada "se apoya" girada y se endereza al pasar el puntero.
- Hojas y modales suben desde abajo.

Con `prefers-reduced-motion` todo se reduce a casi cero.

## Componentes de firma

- **Franja de la semana** (`jobsy-franja-semana`): L M M J V S D, con los días trabajados en verde y el horario debajo. Tamaños `chica` (tarjetas) y `grande` (detalle, perfil, portada). Lee el formato del middleware `Lun, Mie · 08:00 a 12:00`.
- **Tarifa en display:** `$35.000` grande en tinta y "por hora" pequeño al lado.
- **Panel del acuerdo:** en los detalles, un panel fijo con borde tinta que agrupa tarifa, franja y la única acción.

## Patrones

- **Botones** (`.boton_principal`, `.boton_secundario`, `.boton_borde`, `.boton_simple`): píldora de 44 px mínimo. Una sola acción azul llena por vista.
- **Acciones según el rol:** "Postularme" solo para visitantes y empleados; "Contratar" y "Publicar oferta" solo para visitantes y hogares.
- **Fichas** de filtro y categoría: píldora con borde; activa = fondo tinta y texto hueso.
- **Listados:** la URL guarda búsqueda, filtros y página. En celular, los filtros son una hoja que sube desde abajo.
- **Formularios:** etiqueta visible en negrita (nunca solo placeholder), campos de 48 px, error con ícono debajo del campo.
- **Accesibilidad:**
  - Foco de 3 px en azul (en lima sobre fondos oscuros).
  - Enlace "Saltar al contenido" y `lang="es-CO"`.
  - Objetivos táctiles de 44 px.
  - El modal se cierra con Esc y atrapa el foco.

## Contenido

- Español de Colombia, con tildes y ñ; tuteo.
- Solo datos reales de la API: nada de cifras, testimonios ni promesas que el backend no respalde. Cuando un total es una estimación del middleware, se muestra con "+".
