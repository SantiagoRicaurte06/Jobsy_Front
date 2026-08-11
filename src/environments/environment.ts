export const environment = {
  production: false,
  /** Cuando exista el backend real, poner false para que los servicios usen HTTP. */
  useMocks: true,
  /** Gateway de los microservicios (Core_api). */
  apiUrl: 'http://localhost:8080/api',
  endpoints: {
    usuarios: '/usuarios',
    empleo: '/empleo',
    tienda: '/tienda',
    catalogo: '/catalogo',
    suscripciones: '/suscripciones',
    soporte: '/soporte',
  },
};
