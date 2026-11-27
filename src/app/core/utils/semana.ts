import { ParamMap } from '@angular/router';
import { DIAS_SEMANA, DiaSemana, diaDe, leerHorario } from './horario';

/**
 * La semana que arma el visitante en la portada (días, horas por día y
 * oficio) viaja por la URL a las listas de personas y de ofertas:
 *
 *   /empleados?oficio=Limpieza&dias=Lun,Mie,Vie&horas=6
 *
 * Así cada tarjeta puede decir cuánto cuesta o cuánto paga esa semana.
 */
export interface Semana {
  dias: DiaSemana[];
  horas: number;
}

export const HORAS_MIN = 2;
export const HORAS_MAX = 10;
export const HORAS_DEFECTO = 6;

/** Horas entre "08:00" y "12:00"; null si falta alguna. */
export function horasDe(inicio: string | null, fin: string | null): number | null {
  if (!inicio || !fin) return null;
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fin.split(':').map(Number);
  const h = (hf * 60 + mf - (hi * 60 + mi)) / 60;
  return h > 0 ? h : null;
}

/** Lee `dias` y `horas` de la URL; null si no hay días elegidos. */
export function leerSemana(q: ParamMap): Semana | null {
  const dias = (q.get('dias') ?? '')
    .split(',')
    .map((d) => diaDe(d.trim()))
    .filter((d): d is DiaSemana => !!d);
  if (!dias.length) return null;
  const h = Number(q.get('horas'));
  const horas = h >= HORAS_MIN && h <= HORAS_MAX ? Math.round(h) : HORAS_DEFECTO;
  return { dias: DIAS_SEMANA.filter((d) => dias.includes(d)), horas };
}

/** Query params de una semana, listos para `router.navigate`. */
export function semanaEnUrl(s: Semana | null): { dias: string | null; horas: number | null } {
  return s && s.dias.length ? { dias: s.dias.join(','), horas: s.horas } : { dias: null, horas: null };
}

/** Lo que paga una oferta en los días que coinciden con la semana elegida. */
export function pagoSemana(horario: string, precioHora: number, s: Semana): { comunes: DiaSemana[]; total: number } {
  const h = leerHorario(horario);
  const comunes = h.dias.filter((d) => s.dias.includes(d));
  const horasDia = horasDe(h.inicio, h.fin) ?? s.horas;
  return { comunes, total: Math.round(precioHora * horasDia * comunes.length) };
}

/** ¿Alguna de las etiquetas corresponde al oficio? Sin oficio, todo vale. */
export function coincideOficio(etiquetas: string[], oficio: string | null | undefined): boolean {
  if (!oficio || oficio === 'Todos') return true;
  const k = sinTildes(oficio);
  return etiquetas.some((t) => sinTildes(t).includes(k) || k.includes(sinTildes(t)));
}

export const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

/** Oficios distintos que aparecen en una lista de etiquetas, sin repetir por tildes. */
export function oficiosDe(listas: string[][], max = 6): string[] {
  const vistos = new Map<string, string>();
  for (const l of listas) for (const t of l) {
    const k = sinTildes(t);
    if (k && !vistos.has(k)) vistos.set(k, t.trim());
  }
  return Array.from(vistos.values()).slice(0, max);
}
