/**
 * Entorno de integracion local: el frontend contra el middleware real.
 *
 * Se usa con `ng serve --configuration local` o `ng build --configuration local`.
 * No sustituye al entorno de desarrollo por defecto, que sigue trabajando con
 * los mocks en memoria y por tanto no necesita backend levantado.
 *
 * Requiere que esten corriendo el middleware (puerto 9090), los 7 servicios de
 * Jobsy_API (8081-8087) y PostgreSQL.
 */
export const environment = {
  production: false,
  useMocks: false,
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
