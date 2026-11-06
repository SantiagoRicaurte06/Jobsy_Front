/**
 * Entorno sin backend: todos los servicios responden con los datos de
 * src/app/mocks. Util para trabajar en la interfaz sin levantar la pila.
 *
 * Se usa con `ng serve --configuration mocks`.
 */
export const environment = {
  production: false,
  useMocks: true,
  /** No se llama a ninguna URL en este modo; se declara por completitud. */
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
