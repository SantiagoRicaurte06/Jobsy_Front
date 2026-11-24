# Producto

## Plataforma

web (Angular 22, pensada primero para celular)

## Usuarios

- **Hogares que contratan (empleadores):** familias de Yopal que necesitan ayuda en casa —limpieza, cocina, planchado, zonas verdes, cuidado de niños o mascotas— y quieren saber a quién dejan entrar a su casa, cuánto van a pagar y en qué horario.
- **Trabajadoras y trabajadores del hogar (empleados):** personas que buscan trabajos por horas, por jornada o de fin de semana, normalmente desde un celular Android de gama media, muchas veces al aire libre o en movimiento.
- **Administración de Jobsy:** gestiona la tienda (productos, inventario, pedidos) y atiende reportes de soporte.

## Propósito

Conectar hogares con trabajadores del hogar verificados y llevar toda la relación dentro de la plataforma: publicar la oferta, postularse, contratar, terminar el servicio y dejar una reseña. El éxito es que un hogar contrate con confianza y que el trabajador reciba un trato y un pago claros.

## Posicionamiento

Frente a un clasificado o un grupo de Facebook:

1. **Perfiles verificados:** documentos, antecedentes y reseñas de otros hogares.
2. **Contratación completa:** oferta → postulación → contratación → servicio terminado → reseña, sin salir de la app.
3. **Trabajo digno y justo:** tarifa por hora visible, días y horario explícitos y condiciones que también protegen al trabajador.

La tienda de insumos (aseo, equipos, uniformes, protección) existe, pero es un servicio complementario, no la razón de ser.

## Contexto de uso

- Arranca en **Yopal (Casanare)**; ciudades, barrios y direcciones colombianas (`Calle 10 # 20-30`), precios en COP.
- Tres roles con paneles distintos: empleador, empleado y admin.
- Flujos principales: registro en pasos, publicar oferta, asistente de postulación, contratación directa o desde postulación, checkout de la tienda (PSE, tarjeta, billetera, saldo), centro de reportes con chat.

## Capacidades y restricciones

- El front habla solo con el middleware (MID_JOBSY), que valida, autoriza por rol y traduce catálogos. Las reglas de validación del front calcan las del middleware.
- Modalidades: `por_horas`, `jornada_completa`, `fin_de_semana`. "Presencial" no existe en la base.
- Los listados no traen un total exacto: `hasMore` es el único dato fiable.
- Hay un modo sin backend (`ng serve --configuration mocks`).

## Compromisos de marca

- Nombre y logo de Jobsy (azul `#1668B3`, naranja `#F5821F`, verde en el trazo).
- Idioma: español de Colombia, con tildes y ñ correctas; tuteo cercano.
- Dirección visual elegida por el equipo: **cálida y audaz**.

## Evidencia disponible

- Solo datos reales que devuelve la API: conteos, reseñas y calificaciones reales.
- **No inventar** cifras de hogares, calificaciones promedio, testimonios ni clientes. Los datos de los mocks son de demostración y no se presentan como reales.
- Las fotos actuales de viviendas y productos son de stock (Unsplash).

## Principios

1. **Confianza a la vista:** verificación, reseñas y condiciones se ven antes de decidir, no detrás de un clic.
2. **Condiciones claras para las dos partes:** tarifa, días y horario siempre explícitos.
3. **Cada rol ve su camino:** nadie encuentra un botón que lo lleve a una acción que no puede hacer.
4. **Celular primero:** se usa con una mano, con sol y con datos móviles.

## Accesibilidad

WCAG 2.2 AA: contraste 4.5:1 en texto, objetivos táctiles de 44 px, navegación completa con teclado, `lang="es"` y errores ligados a su campo.
