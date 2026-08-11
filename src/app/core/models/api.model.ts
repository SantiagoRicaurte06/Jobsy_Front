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
  total: number;
  totalPages: number;
}
