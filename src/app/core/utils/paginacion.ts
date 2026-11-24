import { Paginated } from '../models';

/**
 * Paginas que se pueden ofrecer. El total que manda el middleware es una
 * estimacion cuando `hasMore` es true, asi que se garantiza al menos una
 * pagina despues de la actual para no esconder resultados.
 */
export function paginasDisponibles(res: Paginated<unknown>): number {
  const minimo = res.page + (res.hasMore ? 1 : 0);
  return Math.max(res.totalPages, minimo, 1);
}

/** "12 ofertas", o "12+ ofertas" cuando el total es solo una cota inferior. */
export function textoTotal(total: number, hayMas: boolean, singular: string, plural: string): string {
  const palabra = total === 1 && !hayMas ? singular : plural;
  return `${total}${hayMas ? '+' : ''} ${palabra}`;
}
