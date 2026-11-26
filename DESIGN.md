# Sistema de diseño de Jobsy

Mundo **cálido y audaz**: un acuerdo de trabajo a la vista. Cada oferta muestra quién, cuánto por hora y qué días; la interfaz existe para que esas condiciones se lean antes que cualquier adorno.

Los valores viven en `src/styles/_variables.scss` y los patrones en `src/styles/_mixins.scss`. Ningún componente debería escribir un color en crudo.

## Color

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Suelo | `$color-bg` | `#FBF5EC` | Fondo de todo el sitio (crema). |
| Arena | `$color-sand` | `#F3E7D3` | Cabezas de listados, bandas alternas, fichas. |
| Superficie | `$color-surface` | `#FFFDF9` | Tarjetas y paneles sobre la crema. |
| Borde | `$color-border` / `-strong` | `#E8DCC8` / `#D3BF9F` | Bordes de 2 px. |
| Tinta | `$color-ink` / `$color-text` | `#13233A` | Texto, menú activo, pie, panel admin. |
| Texto secundario | `$color-text-muted` | `#5B6676` | 5.4:1 sobre crema. |
| Azul Jobsy | `$color-primary` | `#1668B3` | Campos de "cielo" (portada, acceso), enlaces, foco. |
| Naranja de marca | `$color-cta` | `#F5821F` | Acción principal y campos; **siempre con texto tinta** (6:1). |
| Naranja tostado | `$color-accent` | `#B84F06` | Naranja como texto o fondo con blanco (AA). |
| Verde morichal | `$color-success` | `#1A6E44` | Verificado, disponible, aceptado. |
| Ámbar / Rojo | `$color-warning` / `$color-danger` | `#8A5100` / `#B42318` | Avisos y errores. |
| Peligro hover | `$color-danger-hover` | `#8E1B12` | Hover de acciones destructivas. |
| Texto sobre tinta | `$color-on-dark` | `#D9DEE6` | Texto en pie de página y barra lateral admin. |
| Texto tinta tenue | `$color-on-dark-muted` | `#9AA6B8` | Secundario sobre fondo tinta. |
| Fondo translúcido | `$color-bg-translucent` | `rgba(251, 245, 236, 0.94)` | Cabecera sticky y barra superior admin. |
| Gráfica lila | `$color-chart-purple` | `#8B5CF6` | Barras del tablero admin. |

Reglas:

- El naranja vivo nunca lleva texto blanco.
- El azul se usa como **campo** (regiones completas), no como adorno suelto. Bajo el campo azul va el "horizonte": una franja naranja de 8–14 px.
- Sin degradados ni cristal: las superficies son sólidas.

## Tipografía

- **Display:** Bricolage Grotesque (variable, con tamaño óptico), peso 700–800, tracking `-0.035em`. Para titulares, tarifas y cifras. Mixin `m.display($tamaño)`.
- **Interfaz:** Figtree (variable), 17 px de base, interlineado 1.55.
- Las dos se sirven desde el propio sitio (`@fontsource-variable`).
- Cifras con `tabular-nums` (`.cifra`, `.precio`, tablas).
- **Kicker editorial:** sobre el titular de cada página va una etiqueta corta en mayúsculas y azul (`m.kicker` o la clase global `.kicker`). Es la única etiqueta en mayúsculas permitida sobre un titular.
- **Cabecera editorial:** kicker + titular cerrados por un acento naranja de 3 px (`m.cabecera-editorial`).

## Forma y profundidad

- Radios: 8 / 12 / 18 / 26 px y píldora. Las tarjetas usan 18 px y los campos de color 26 px.
- Bordes de 2 px en arena. Al pasar el puntero, el borde pasa a tinta y la tarjeta sube 3 px.
- Sombras cálidas con desplazamiento (`$shadow-sm/md/lg`), nunca halos sin desplazamiento.

## Movimiento

Curva `cubic-bezier(0.16, 1, 0.3, 1)`. Un solo momento por pantalla:

- La franja de la semana enciende sus días en ola.
- La oferta de la portada "se apoya" girada y se endereza al pasar el puntero.
- Hojas y modales suben desde abajo.

Con `prefers-reduced-motion` todo se reduce a casi cero.

## Componentes de firma

- **Franja de la semana** (`jobsy-franja-semana`): L M M J V S D, con los días trabajados en naranja y el horario debajo. Tamaños `chica` (tarjetas) y `grande` (detalle, perfil, portada). Lee el formato del middleware `Lun, Mie · 08:00 a 12:00`.
- **Tarifa en display:** `$35.000` grande en tinta y "por hora" pequeño al lado.
- **Panel del acuerdo:** en los detalles, un panel fijo con borde tinta que agrupa tarifa, franja y la única acción.

## Patrones

- **Botones** (`.boton_principal`, `.boton_secundario`, `.boton_borde`, `.boton_simple`): píldora de 44 px mínimo. Una sola acción naranja por vista.
- **Acciones según el rol:** "Postularme" solo para visitantes y empleados; "Contratar" y "Publicar oferta" solo para visitantes y hogares.
- **Fichas** de filtro y categoría: píldora con borde; activa = fondo tinta y texto crema.
- **Listados:** la URL guarda búsqueda, filtros y página. En celular, los filtros son una hoja que sube desde abajo.
- **Formularios:** etiqueta visible en negrita (nunca solo placeholder), campos de 48 px, error con ícono debajo del campo.
- **Accesibilidad:**
  - Foco de 3 px en azul (en naranja sobre fondos oscuros).
  - Enlace "Saltar al contenido" y `lang="es-CO"`.
  - Objetivos táctiles de 44 px.
  - El modal se cierra con Esc y atrapa el foco.

## Contenido

- Español de Colombia, con tildes y ñ; tuteo.
- Solo datos reales de la API: nada de cifras, testimonios ni promesas que el backend no respalde. Cuando un total es una estimación del middleware, se muestra con "+".
