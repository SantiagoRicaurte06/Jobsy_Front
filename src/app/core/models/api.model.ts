/** Envoltorios genéricos de respuesta del backend */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  /**
   * Los servicios CRUD no informan cuantas filas hay: el middleware pide una
   * de mas y estima. Cuando `hasMore` es true, `total` es una cota inferior.
   */
  total: number;
  totalPages: number;
  /** Hay al menos una pagina despues de esta. Es el unico dato exacto. */
  hasMore?: boolean;
}
