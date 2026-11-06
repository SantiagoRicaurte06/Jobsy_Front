/**
 * Reglas de validacion de los formularios.
 *
 * Son las mismas que aplica el middleware (MID_JOBSY/services/validacion.go),
 * que es quien decide de verdad: aqui solo se avisa antes de enviar. Si se
 * cambia una regla alli hay que cambiarla aqui.
 *
 * Cada funcion devuelve el mensaje de error, o null si el valor es valido.
 */

export const LIMITES = {
  tarifaMin: 5000,
  tarifaMax: 200000,
  horasMin: 1,
  horasMax: 12,
  edadMin: 18,
  edadMax: 80,
  distanciaMax: 100,
} as const;

/** Dias que admite un horario, en el orden de la semana. */
export const DIAS_SEMANA = [
  { value: 'lun', label: 'Lun' },
  { value: 'mar', label: 'Mar' },
  { value: 'mie', label: 'Mie' },
  { value: 'jue', label: 'Jue' },
  { value: 'vie', label: 'Vie' },
  { value: 'sab', label: 'Sab' },
  { value: 'dom', label: 'Dom' },
] as const;

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const normalizar = (s: string) => sinTildes(s.toLowerCase()).replace(/\s+/g, ' ').trim();

const RE_DIRECCION_URBANA =
  /^(avenida calle|avenida carrera|calle|cll|cl|carrera|cra|cr|kra|kr|avenida|av|ac|ak|diagonal|diag|dg|transversal|transv|tv|tr|circular|cq|autopista|via)\.?\s*\d{1,3}\s?[a-z]?(\s?bis)?(\s?[a-z])?\s*(#|no\.?|n°|numero)\s*\d{1,3}\s?[a-z]?\s*-\s*\d{1,3}\b/;
const RE_DIRECCION_RURAL = /^(vereda\s+\S+|km\.?\s*\d+|kilometro\s*\d+|(manzana|mz)\.?\s*\w+\s+(casa|lote)\s*\w+)/;
const RE_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const RE_NOMBRE = /^\p{L}+([ '\-]\p{L}+)*$/u;
const RE_CIUDAD = /^\p{L}+([ .\-]\p{L}+)*$/u;

/** Ejemplo que se muestra junto a los campos de direccion. */
export const EJEMPLO_DIRECCION = 'Ej: Calle 10 # 20-30, Cra 84 # 65-22 o Vereda La Esperanza';

export function texto(etiqueta: string, valor: string | null | undefined, min: number, max: number): string | null {
  const n = [...(valor ?? '').trim()].length;
  if (n === 0 && min > 0) return `${etiqueta} es obligatorio.`;
  if (n > 0 && n < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
  if (n > max) return `${etiqueta} admite como maximo ${max} caracteres.`;
  return null;
}

const miles = (n: number) => n.toLocaleString('es-CO');

export function rango(etiqueta: string, valor: number | null | undefined, min: number, max: number): string | null {
  if (valor == null || Number.isNaN(valor) || valor < min || valor > max) {
    return `${etiqueta} debe estar entre ${miles(min)} y ${miles(max)}.`;
  }
  return null;
}

export const tarifa = (valor: number | null | undefined) =>
  rango('La tarifa por hora', valor, LIMITES.tarifaMin, LIMITES.tarifaMax);

export function direccion(valor: string | null | undefined): string | null {
  const err = texto('La direccion', valor, 6, 120);
  if (err) return err;
  const n = normalizar(valor ?? '');
  if (!RE_DIRECCION_URBANA.test(n) && !RE_DIRECCION_RURAL.test(n)) {
    return 'Escribe una direccion valida, por ejemplo: Calle 10 # 20-30, Cra 84 # 65-22 o Vereda La Esperanza.';
  }
  return null;
}

export function hora(valor: string | null | undefined): string | null {
  return RE_HORA.test((valor ?? '').trim()) ? null : 'La hora debe tener el formato HH:MM (por ejemplo 08:00).';
}

const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** La franja de inicio a fin: ambas horas validas y el fin despues del inicio. */
export function franja(inicio: string, fin: string): string | null {
  return hora(inicio) ?? hora(fin) ?? (minutos(fin) <= minutos(inicio) ? 'La hora de fin debe ser posterior a la de inicio.' : null);
}

/** Construye el horario con el formato que valida el servidor: "Lun, Mie · 08:00 a 12:00". */
export function componerHorario(dias: string[], inicio: string, fin: string): string {
  const etiquetas = DIAS_SEMANA.filter((d) => dias.includes(d.value)).map((d) => d.label);
  return `${etiquetas.join(', ')} · ${inicio} a ${fin}`;
}

export function horario(dias: string[], inicio: string, fin: string): string | null {
  if (!dias.length) return 'Elige al menos un dia del horario.';
  return franja(inicio, fin);
}

export function nombrePersona(etiqueta: string, valor: string | null | undefined): string | null {
  const err = texto(etiqueta, valor, 2, 60);
  if (err) return err;
  return RE_NOMBRE.test((valor ?? '').trim()) ? null : `${etiqueta} solo puede tener letras.`;
}

export function ciudad(valor: string | null | undefined): string | null {
  const err = texto('La ciudad', valor, 3, 60);
  if (err) return err;
  return RE_CIUDAD.test((valor ?? '').trim()) ? null : 'La ciudad solo puede tener letras.';
}

/** Celular (3xx) o fijo (60x) colombiano de 10 digitos; admite espacios, guiones y +57. */
export function telefono(valor: string | null | undefined): string | null {
  let v = (valor ?? '').replace(/[\s\-().]/g, '');
  v = v.replace(/^\+?57(?=\d{10}$)/, '');
  return /^(3\d{9}|60\d{8})$/.test(v) ? null : 'Escribe un telefono colombiano de 10 digitos (celular 3xx o fijo 60x).';
}

export function documento(valor: string | null | undefined, esCedula: boolean): string | null {
  const v = (valor ?? '').trim();
  if (esCedula) return /^\d{6,10}$/.test(v) ? null : 'La cedula debe tener entre 6 y 10 digitos, sin puntos.';
  return /^[A-Za-z0-9]{5,15}$/.test(v) ? null : 'El documento debe tener entre 5 y 15 letras o numeros.';
}

/** Fecha de hoy en Colombia como AAAA-MM-DD (sirve para min/max de los <input type="date">). */
export function hoyISO(desplazarDias = 0, desplazarAnios = 0): string {
  const d = new Date(Date.now() - 5 * 3600 * 1000);
  d.setUTCDate(d.getUTCDate() + desplazarDias);
  d.setUTCFullYear(d.getUTCFullYear() + desplazarAnios);
  return d.toISOString().slice(0, 10);
}

/** Mes actual como AAAA-MM (max de los <input type="month">). */
export const mesActual = () => hoyISO().slice(0, 7);

export function fechaNacimiento(valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Indica tu fecha de nacimiento.';
  if (v > hoyISO(0, -LIMITES.edadMin) || v < hoyISO(0, -LIMITES.edadMax)) {
    return `Para registrarte debes tener entre ${LIMITES.edadMin} y ${LIMITES.edadMax} anos.`;
  }
  return null;
}

export function fechaServicio(valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'La fecha debe tener el formato AAAA-MM-DD.';
  if (v < hoyISO()) return 'La fecha del servicio no puede estar en el pasado.';
  if (v > hoyISO(0, 1)) return 'La fecha del servicio no puede ser de mas de un ano adelante.';
  return null;
}

export function mesPasado(etiqueta: string, valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(v)) return `${etiqueta} debe tener el formato AAAA-MM.`;
  if (v > mesActual()) return `${etiqueta} no puede estar en el futuro.`;
  if (v < '1950-01') return `${etiqueta} no es valida.`;
  return null;
}

export function anio(valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim();
  const a = Number(v);
  const max = Number(hoyISO().slice(0, 4));
  return /^\d{4}$/.test(v) && a >= 1950 && a <= max ? null : `El ano debe estar entre 1950 y ${max}.`;
}

export function correo(valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 150 ? null : 'Escribe un correo valido.';
}

/** Devuelve el primer error de la lista, o null si todo es valido. */
export const primero = (...errores: (string | null)[]) => errores.find((e) => e) ?? null;

/** Ciudades donde opera Jobsy; el servidor rechaza cualquier otra (CiudadesServicio en el mid). */
export const CIUDADES = [
  'Yopal', 'Aguazul', 'Chámeza', 'Hato Corozal', 'La Salina', 'Maní', 'Monterrey', 'Nunchía', 'Orocué',
  'Paz de Ariporo', 'Pore', 'Recetor', 'Sabanalarga', 'Sácama', 'San Luis de Palenque', 'Támara',
  'Tauramena', 'Trinidad', 'Villanueva',
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Cúcuta', 'Pereira',
  'Manizales', 'Armenia', 'Ibagué', 'Villavicencio', 'Neiva', 'Pasto', 'Popayán', 'Santa Marta',
  'Montería', 'Sincelejo', 'Valledupar', 'Riohacha', 'Tunja', 'Florencia', 'Quibdó', 'Arauca', 'Mocoa',
  'Leticia', 'San José del Guaviare', 'Mitú', 'Puerto Carreño', 'Inírida', 'San Andrés',
  'Envigado', 'Itagüí', 'Bello', 'Sabaneta', 'Soacha', 'Chía', 'Zipaquirá', 'Soledad', 'Floridablanca',
  'Girón', 'Piedecuesta', 'Palmira', 'Jamundí', 'Dosquebradas', 'Sogamoso', 'Duitama',
] as const;
