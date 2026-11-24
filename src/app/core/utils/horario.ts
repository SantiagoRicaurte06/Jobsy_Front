/**
 * Lectura del horario de una oferta.
 *
 * El middleware valida el formato "Lun, Mie · 08:00 a 12:00" (ver
 * MID_JOBSY/services/validacion.go, ValidarHorario). Aquí se lee ese formato
 * y, por tolerancia, rangos ("Lun-Sab"), nombres completos ("sábados") y
 * horas con am/pm, para pintar la franja de la semana.
 */

export const DIAS_SEMANA = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'] as const;
export type DiaSemana = (typeof DIAS_SEMANA)[number];

export const DIA_NOMBRE: Record<DiaSemana, string> = {
  Lun: 'lunes', Mar: 'martes', Mie: 'miércoles', Jue: 'jueves',
  Vie: 'viernes', Sab: 'sábado', Dom: 'domingo',
};

export const DIA_INICIAL: Record<DiaSemana, string> = {
  Lun: 'L', Mar: 'M', Mie: 'M', Jue: 'J', Vie: 'V', Sab: 'S', Dom: 'D',
};

export interface HorarioLeido {
  dias: DiaSemana[];
  /** "08:00" en 24 h, o null si el texto no trae horas. */
  inicio: string | null;
  fin: string | null;
}

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** "Miércoles", "mie", "MIÉ" → "Mie". */
export function diaDe(token: string): DiaSemana | null {
  const t = sinTildes(token).slice(0, 3);
  const i = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].indexOf(t);
  return i >= 0 ? DIAS_SEMANA[i] : null;
}

function a24(h: string, m: string | undefined, sufijo: string | undefined): string {
  let hora = Number(h);
  const s = sufijo ? sinTildes(sufijo).replace(/\./g, '') : '';
  if (s.startsWith('p') && hora < 12) hora += 12;
  if (s.startsWith('a') && hora === 12) hora = 0;
  return `${String(hora).padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}`;
}

export function leerHorario(texto: string | null | undefined): HorarioLeido {
  const vacio: HorarioLeido = { dias: [], inicio: null, fin: null };
  if (!texto) return vacio;
  const t = sinTildes(texto);

  // ---- Horas: "08:00 a 12:00", "8:30 am - 4:30 pm" ----
  const reHora = /(\d{1,2})(?::(\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?\s*(?:a|-|–|hasta)\s*(\d{1,2})(?::(\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?/;
  const h = t.match(reHora);
  let inicio: string | null = null;
  let fin: string | null = null;
  if (h && (h[2] || h[5] || h[3] || h[6])) {
    inicio = a24(h[1], h[2], h[3]);
    fin = a24(h[4], h[5], h[6]);
  }

  // ---- Días ----
  const parteDias = h ? t.slice(0, h.index) : t;
  const dias = new Set<DiaSemana>();

  if (/fin(es)? de semana/.test(t) && !/[a-z]{3}/.test(parteDias.replace(/fin(es)? de semana/g, ''))) {
    dias.add('Sab');
    dias.add('Dom');
  }

  // Rangos tipo "lun-sab" o "lunes a viernes".
  for (const r of parteDias.matchAll(/([a-z]{3})[a-z]*\s*(?:-|–|a)\s*([a-z]{3})[a-z]*/g)) {
    const a = diaDe(r[1]);
    const b = diaDe(r[2]);
    if (a && b) {
      const ia = DIAS_SEMANA.indexOf(a);
      const ib = DIAS_SEMANA.indexOf(b);
      for (let i = ia; i <= ib; i++) dias.add(DIAS_SEMANA[i]);
    }
  }

  for (const palabra of parteDias.split(/[^a-z]+/)) {
    if (palabra.length < 3) continue;
    const d = diaDe(palabra);
    if (d) dias.add(d);
  }

  return { dias: DIAS_SEMANA.filter((d) => dias.has(d)), inicio, fin };
}

/** "8:00 a. m." legible para personas a partir de "08:00". */
export function horaLegible(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${sufijo}` : `${h12} ${sufijo}`;
}

/** Frase para lectores de pantalla: "lunes, miércoles y viernes, de 8 a. m. a 12 p. m.". */
export function describirHorario(h: HorarioLeido): string {
  const nombres = h.dias.map((d) => DIA_NOMBRE[d]);
  const dias =
    nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}` : (nombres[0] ?? 'días por acordar');
  const horas = h.inicio && h.fin ? `, de ${horaLegible(h.inicio)} a ${horaLegible(h.fin)}` : '';
  return dias + horas;
}
