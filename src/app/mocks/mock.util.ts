import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Simula la latencia de red de una llamada real al backend. */
export function mockResponse<T>(data: T, ms = 400): Observable<T> {
  return of(data).pipe(delay(ms));
}

/** Pagina un arreglo en memoria como lo haría el backend. */
export function paginate<T>(items: T[], page = 1, pageSize = 6) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
