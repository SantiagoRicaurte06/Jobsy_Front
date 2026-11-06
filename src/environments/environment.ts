/**
 * Entorno de desarrollo: el frontend contra el backend real.
 *
 * useMocks en false significa que cada servicio de dominio sale por HTTP al
 * middleware, que a su vez consulta los siete servicios CRUD y PostgreSQL.
 * Requiere la pila levantada (middleware en 9090, CRUD en 8081-8087, base en
 * 55432).
 *
 * Para trabajar sin backend existe la configuracion `mocks`:
 *     ng serve --configuration mocks
 */
export const environment = {
  production: false,
  useMocks: false,
  /** Middleware de Jobsy. No es ninguno de los CRUD: los orquesta a todos. */
  apiUrl: 'http://localhost:9090/api',
  endpoints: {
    usuarios: '/usuarios',
    empleo: '/empleo',
    tienda: '/tienda',
    catalogo: '/catalogo',
    suscripciones: '/suscripciones',
    soporte: '/soporte',
  },
};
