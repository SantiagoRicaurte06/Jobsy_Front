# Bitácora del rediseño de Jobsy Front

Registro de las auditorías, los errores encontrados, las acciones aplicadas, el flujo de trabajo, las ideas y las mejoras que faltan. Complementa a `DESIGN.md` (el sistema visual) y a `PRODUCT.md` (la verdad del producto).

Última actualización: 2026-11-26 · Rama `rediseno`.

---

## 1. Flujo de trabajo

- **Rama única:** todo el rediseño vive en `rediseno`. Sin ramas `feature/*` ni prototipos aislados: commits pequeños, cada uno verificable.
- **Solo se toca el front.** El contrato lo define el MID (`MID_JOBSY`, rama `develop`) y los CRUD de `Jobsy_API` (`develop`). Si el MID no lo soporta, la interfaz no lo muestra.
- **Antes de cada commit:**
  1. `npx ng build` limpio, sin errores ni advertencias.
  2. `npx ng test --watch=false` en verde (línea base: 81 archivos, 95 pruebas).
  3. Revisión visual a 1280 px y a 390 px, sin desborde horizontal.
- **Revisión visual sin backend:** `ng serve --configuration mocks`. Los servicios sin mock (contrataciones, saldo) se prueban inyectando la respuesta solo en el navegador, sin tocar el código.
- **Fases:**

| Fase | Alcance | Estado |
|---|---|---|
| 1 | Alinear modelos, paginación y permisos con el MID | Hecha |
| 2 | Sistema visual, cabecera, pie, layouts y componentes base | Hecha |
| 3 | Portada, empleos, empleados, tienda y sus detalles | Hecha |
| 4 | Flujos: contratación, checkout, mis pedidos, registro, postulación | En curso |
| 5 | Paneles privados y administración | Identidad aplicada (`84fc24f`); falta auditar |

---

## 2. Auditorías y errores encontrados

### 2.1 Alineación con el MID (fase 1)

- La modalidad `presencial` se enviaba pero el MID la rechaza: la base no tiene dónde guardarla.
- Los listados no conocían `hasMore`: no ofrecían la página siguiente cuando el total era una estimación.
- "Todas" en la tienda mostraba el total de la página en lugar de la suma de los conteos del catálogo.
- Faltaban en los modelos `usuarioId`, el id de reseña y la fecha de documento.
- Postularse, agendar y contratar no comprobaban el rol.

### 2.2 Datos inventados en la interfaz (fases 2 y 3)

- Cifras falsas en la portada ("miles de empleadores", "66 ciudades con cobertura") y carrusel decorativo.
- Reseñas de producto precargadas con opiniones inventadas; el MID no guarda reseñas de producto.
- Botón "Guardar perfil" que no hacía nada y frases sobre pagos que Jobsy no gestiona.
- La tarjeta de empleado llamaba "reseñas" a los servicios terminados.
- Tablero admin con deltas fijos, fecha fija y un botón "Exportar" sin acción.
- Controles del panel admin que no hacían nada.

### 2.3 Auditoría de interfaz (puntuación inicial 13/20)

**Accesibilidad**
- 13 interruptores de configuración sin enlace con su texto visible.
- Etiquetas de formulario sin `for`/`id` en hoja de vida, perfil, contrataciones, publicar oferta, registro y pagos. Tres apuntaban al campo equivocado (tamaño → precio, días → hora, tareas → descripción).
- El botón de la cuenta no tenía nombre accesible en celular.
- Se usaban `confirm()` y `prompt()` del navegador (reembolso, mis ofertas, tablero).
- Leyenda del gráfico con series que no estaban en los datos; barras sin valor para lectores de pantalla.
- Listas de fichas con `role="group"` que rompía la semántica; `aside` anidado en la bandeja de reportes; encabezados fuera de orden.

**Contraste y jerarquía**
- Verde de verificado a 4.44:1 (no cumplía AA). Ámbar de aviso con contraste insuficiente.
- Textos por debajo de 12 px en el tablero, gráficos, chat de reportes y tabla de productos.
- En las tarjetas, la línea de vivienda/modalidad y la categoría iban antes del título.

**Celular y texto grande**
- Desbordes horizontales a 390 px: tarjetas de acceso y registro con 72 px de relleno fijo, selector de periodo de analíticas, tabla del tablero admin que estiraba la página a 765 px.
- Con la letra del navegador al 200 % el menú no colapsaba a tiempo (breakpoints en px).
- 659 elementos táctiles por debajo de 44 px en celular.

**Rendimiento**
- Logo de 457 KB; imágenes sin carga diferida ni medidas (saltos de diseño).

**Textos**
- Tildes y eñes faltantes en todo el texto visible (sesión, contraseña, dirección, teléfono, configuración, tamaño, niños, reseñas, términos, analíticas…).
- "0 postulacion(es)" en vez de singular o plural.

### 2.4 Pasada de pulido (2026-11-26)

- `DESIGN.md` tenía el verde y el ámbar antiguos (`#1E7A4C`, `#9A5B00`).
- Unos 20 colores escritos a mano en componentes (pie, admin, portada, layouts, confirmación, tablero).
- Hover de los botones de peligro del admin con un rojo distinto (`#b93a3a`) al del diálogo de confirmación.
- Barra morada `#8B5CF6` en el tablero sin token. Se decidió conservarla como color de gráficas (`$color-chart-purple`), nunca como color de marca.

### 2.5 Fase 4: contrataciones y checkout (2026-11-26)

- **Contrataciones:** se pintaba un estado `cancelada` que el MID nunca asigna. "Te contrato" y "aparecera" sin tilde. Los filtros activos usaban azul en vez de tinta y no llegaban a 44 px. La hora se mostraba en 24 h junto a una franja en 12 h.
- **Checkout, saldo:** si la consulta del saldo fallaba, se mostraba "$0", "Saldo faltante" y "Todavía no tienes movimientos" como si fueran datos reales.
- **Checkout, saldo:** botón "Recargar saldo" sin acción; el MID solo expone `GET /api/tienda/saldo`.
- **Checkout, saldo:** la tarjeta de saldo usaba `$gradient-hero` (el sistema prohíbe degradados).
- **Checkout:** el método elegido iba en naranja, compitiendo con la única acción naranja (pagar).
- **Checkout:** en celular el total quedaba debajo del formulario, lejos del botón de pagar.
- **Checkout:** más de 15 textos sin tilde (vacío, dónde, portería, próxima, jurídica, ciudadanía, extranjería, demostración, aprobación, rechazó…). "Tipo de persona" y "Elige tu billetera" eran `label` sin control asociado.

---

### 2.6 Integración de `rediseno` en `develop` (2026-11-27)

`develop` traía `0b7ff42` (guardados, disponibilidad, reseñas de producto, boletín, recarga de saldo, Google, exportar CSV, campana del admin), ya respaldado por el MID (`b1ea562`) y los CRUD (`6aa0bdf`). Hubo 15 conflictos. Criterio: **la función viene de `develop`, el diseño de `rediseno`.**

- `review.service.ts`, el modelo `ProductReview` y su exportación los había quitado `rediseno` (el MID no guardaba reseñas). Ahora el MID las soporta (`/api/tienda/productos/:id/resenas`): se restauraron.
- La plantilla del detalle de producto quedó con un comentario sin cerrar que tapaba el final del bloque `@else`; se reconstruyó sobre la versión de `rediseno` con la sección de reseñas de `develop`. Sus estilos se trajeron con tokens (`$color-star`, tinta y azul en lugar de `#FFB800`, `rgba(0,0,0,.7)` y `$gradient-hero`).
- `admin/productos.ts` quedó con dos constructores (las dos ramas manejaban `?nuevo=1`); se dejó el de `develop`, que además lee `?q=` del buscador.
- Saldo: se combinan la guarda de `rediseno` (sin cifras si la consulta falla) y la recarga real de `develop`.
- Admin: miga de pan de `rediseno` con el buscador, la campana de pendientes y el "+" de `develop`, a 44 px y con el número de pendientes en texto para lectores de pantalla.
- Tablero: "Actualizar", "Exportar CSV" (ahora real) y "Nuevo producto". Encabezados del CSV con tildes.
- Portada: se conserva la de `rediseno`; ya lleva "Solicitar → contratar" en las tarjetas de personas.
- `recarga-saldo.spec.ts` usaba `toBeTrue()`/`toBeFalse()` de Jasmine; el proyecto corre con Vitest: `toBe(true)`/`toBe(false)`.
- Resultado: build sin errores, 83 archivos y 97 pruebas en verde; todas las rutas nuevas del front existen en el MID.

---

## 3. Acciones de mejora aplicadas

| Commit | Acción |
|---|---|
| `e92675e` | Modelos, paginación (`hasMore`, "12+") y permisos por rol alineados con el MID. |
| `7018d5d` | Sistema "cálido y audaz": tokens, Bricolage + Figtree locales, cabecera, pie, layouts, modal accesible, franja de la semana, tarjetas. `PRODUCT.md`. |
| `4c34ffa` | Portada con oferta real, empleos con filtros en la URL, panel del acuerdo en los detalles. Fuera cifras y reseñas inventadas. `DESIGN.md`. |
| `e182132` | Etiquetas enlazadas, interruptores accesibles, componente de confirmación propio, tablero con datos reales. |
| `32c6b2a` | Logo de 457 KB a 15 KB (WebP + PNG de respaldo), carga diferida y prioridad alta en el primer vistazo. |
| `48e1dd0` | Verde `#1A6E44` (5.5:1) y ámbar `#8A5100` (5.5:1); nada por debajo de 12 px; título primero en tarjetas; orden de encabezados. |
| `f9e5e39` | Breakpoints en em, cero desbordes a 390 px, objetivos táctiles de 44 px. |
| `5b0cb8b` | Tildes en todo el texto visible; plurales; tabla del admin sin desborde. |
| `ffe88ea` | Colores sueltos pasados a tokens y `DESIGN.md` al día. Al integrar con `84fc24f` se adoptaron los nombres de ese commit. |
| `84fc24f` | Identidad editorial en páginas privadas y admin. Tokens definitivos: `$color-on-dark`, `-muted`, `-subtle`, `-link`, `-border`, `$color-bg-translucent`, `$color-danger-hover`, `$color-chart-purple`. |
| `e26ede4` | Contrataciones como documento de acuerdo: estado, tarifa en display, franja, fecha/hora/duración, dirección y total estimado ("referencia, no un cobro"). Solo estados activa y completada. |
| `79b9c4e` | Checkout: pasos numerados, método elegido en tinta, resumen con borde tinta y total en display, monto en el botón de pagar, saldo sin cifras falsas, campo azul con horizonte, tildes. |

---

## 4. Decisiones del brief de la fase 4

Dirección: **Editorial Workflows × Warm SaaS**. Se conserva la identidad existente; lo editorial está en la composición y la tipografía, y lo SaaS en la claridad de los procesos.

- **Contratación:** documento de acuerdo, no formulario. El MID la crea directamente como `activa` (al aceptar una postulación o por contratación directa) y `finalizar` la deja en `completada`. No hay aceptación de las dos partes, firma, pago ni historial: no se muestran. Única acción: "Finalizar servicio" y, después, "Dejar reseña".
- **Postulación:** tiene sus propios estados (`pendiente`, `revisando`, `aceptada`, `rechazada`), separados de la contratación.
- **Pago:** en Jobsy es solo el checkout de la tienda (PSE, tarjeta, billetera, saldo) y "Mis pedidos". El naranja nunca representa un estado: verde confirmado, ámbar pendiente, rojo fallido.
- **Paneles privados (fase 5):** una base compartida (app-layout, componentes) con dos composiciones por rol: el empleado gestiona su actividad laboral; el empleador, sus ofertas, candidatos y contrataciones.
- **Referencias de patrón** (no de identidad): Stripe (importes y transacciones), PandaDoc y DocuSign (documentos y estados), Linear y Attio (jerarquía y registros), Vercel y PostHog (consolas y filtros).

---

## 5. Mejoras pendientes

### Fase 4

- [ ] **Mis pedidos:** destino después de pagar (`/app/pedidos?pedido=…`). Destacar el pedido recién creado y su estado real (aprobado, pendiente, rechazado) con texto además de color.
- [ ] **Registro:** los textos usan mayúscula en cada palabra y faltan tildes: "¿Como Quieres Usar Jobsy?", "Elige Tu Rol…", "Modalidad De Trabajo", "Cuentanos Como Prefieres Trabajar. Puedes Elejir Varias", "Este Texto Aparecera En Tu Perfil Público.", "Último Paso. Asi los Empleadores Cercanos Podran Encontrarse.". Pasar a mayúscula inicial, corregir tildes y "Elejir" → "Elegir". Rediseñar con el titular editorial y el progreso visible.
- [ ] **Postulación** (`empleos/:id/postularme`): formulario con el resumen de la oferta al lado (tarifa y franja), revisión antes de enviar y confirmación que diga qué sigue y dónde ver el estado.
- [ ] **Tarjeta:** el formulario es de demostración y no está conectado a una pasarela. Definir con el MID si se mantiene visible en producción o se oculta hasta que exista la integración.

### Fase 5

- [ ] Auditar lo aplicado en `84fc24f` (páginas privadas y admin) con el mismo criterio: datos reales, 44 px, contraste, 390 px.
- [ ] Inicio privado con dos composiciones por rol (empleado y empleador).
- [ ] Mis postulaciones, mis ofertas y candidatos con estados en texto, no solo color.
- [ ] Perfil, hoja de vida y configuración por secciones, con estados de guardado.
- [ ] Admin: tablero, categorías, inventario, productos y reportes con tablas densas, filtros y paginación. Gráficos con la paleta y `$color-chart-purple` solo como serie de datos.

### Coherencia y deuda técnica

- [ ] Reseñas de producto: sacarlas a un componente propio. Hoy los estilos del detalle de producto superan el presupuesto de 8 kB (8,64 kB) y la sección aún usa el estilo anterior al rediseño.
- [ ] Revisar con el nuevo estilo las páginas que llegaron de `develop`: perfiles guardados (`/app/guardados`), disponibilidad (`/app/disponibilidad`), recarga de saldo y boletín.
- [ ] El menú dice "Mis trabajos" y la página dice "Contrataciones" (`header.html`, `inicio-privado.ts`). Unificar el nombre.
- [ ] En `84fc24f` hay una etiqueta en mayúsculas sobre titulares (patrón "kicker"), que `DESIGN.md` descarta. Está en tablero, mis ofertas, asistente de postulación, perfil y mis postulaciones.
- [ ] Quedan 5 usos de tokens `$gradient-*` en componentes. Aunque hoy son colores sólidos, renombrarlos o eliminarlos para que el nombre no invite a usar degradados.
- [ ] `saldo.ts` (`formatear`) aún formatea con `toLocaleString` en lugar del pipe `cop`.
- [ ] Añadir mocks para contrataciones y saldo, para poder revisar esas pantallas en modo `mocks` sin inyectar respuestas a mano.
- [ ] Normalizar finales de línea (Git avisa de LF → CRLF en cada commit): definir `.gitattributes`.
- [ ] `cupones/validar` existe en el MID y en `order.service.ts`; revisar si el carrito lo usa y, si no, decidir si se expone.

### Entorno local

- [ ] Para probar con datos reales hace falta levantar los 7 CRUD (8081–8087) y el MID (9090) contra PostgreSQL. En la máquina de desarrollo no hay Docker; existe un PostgreSQL 17 local en 5432. Se necesitan las credenciales y cargar `Jobsy_API/deploy/initdb` si la base `jobsy_api` no existe.

---

## 6. Ideas

- **Panel del acuerdo como componente:** el mismo bloque (tarifa en display + franja + datos + una acción) se repite en el detalle de oferta, el detalle de empleado y contrataciones. Extraerlo a `shared/components` evitaría que diverjan.
- **Confirmación de compra propia:** en vez de llevar directo a "Mis pedidos", una pantalla breve con el número de pedido, el estado real y qué sigue (entrega, comprobante por correo si aplica).
- **Franja también en mis postulaciones:** mostrar los días y el horario de la oferta en cada postulación, para leer las condiciones sin abrirla.
- **Estado vacío con siguiente paso:** cada lista vacía (contrataciones, pedidos, postulaciones) debería llevar a la acción que la llena (buscar empleos, ir a la tienda).
- **Auditoría automática en CI:** correr axe y una prueba de desborde a 390 px sobre las rutas principales, con la línea base de esta bitácora.
