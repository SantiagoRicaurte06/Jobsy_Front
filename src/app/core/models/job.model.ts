/** Empleo_API */

/**
 * Tamano de la vivienda. Solo magnitud.
 *
 * Antes incluia 'lujoso', que es gama y no tamano. El propio mock lo
 * desmentia: la oferta j4 se titula "Casa Grande (Lujo)" pero tenia
 * tamano: 'lujoso'. Con el tipo anterior era imposible decir que una casa es
 * grande Y de lujo; ahora la gama vive en `esLujo`.
 */
export type JobSize = 'pequeno' | 'mediano' | 'grande';

export type WorkModality = 'presencial' | 'por_horas' | 'jornada_completa' | 'fin_de_semana';

/** Textos para mostrar. En femenino porque acompanan a "casa" o "vivienda". */
export const TAMANO_TEXTO: Record<JobSize, string> = {
  pequeno: 'Pequena',
  mediano: 'Mediana',
  grande: 'Grande',
};

/** Orden en que se ofrecen en filtros y formularios. */
export const TAMANOS: JobSize[] = ['pequeno', 'mediano', 'grande'];

/** Sin esto la vista pinta el valor crudo: "jornada_completa" con guion bajo. */
export const MODALIDAD_TEXTO: Record<WorkModality, string> = {
  presencial: 'Presencial',
  por_horas: 'Por horas',
  jornada_completa: 'Jornada completa',
  fin_de_semana: 'Fin de semana',
};

export const MODALIDADES: WorkModality[] = [
  'por_horas', 'jornada_completa', 'fin_de_semana', 'presencial',
];

export interface Job {
  id: string;
  titulo: string;
  /** Detalles del hogar y del trabajo que escribe el empleador. */
  descripcion?: string;
  tamano: JobSize;
  /** Gama alta. Independiente del tamano. */
  esLujo?: boolean;
  precioHora: number;
  moneda: 'COP';
  horario: string;
  direccion: string;
  ciudad: string;
  modalidad: WorkModality;
  etiquetas: string[];
  imagenUrl?: string;
  esNuevo: boolean;
  empleadorId: string;
  fechaPublicacion: string;
}

export interface JobFilters {
  tamano?: JobSize[];
  precioMin?: number;
  precioMax?: number;
  ciudad?: string;
  modalidad?: WorkModality[];
  busqueda?: string;
}

/** Estado de una oferta que su empleador puede cambiar. */
export type OfferStatus = 'activa' | 'pausada' | 'cerrada';

/** Oferta vista por su empleador: estado, fotos y cuantas postulaciones tiene. */
export interface OwnJob extends Job {
  estado: OfferStatus;
  postulaciones: number;
  /** Postulaciones pendientes o en revision: las que esperan respuesta. */
  pendientes: number;
  fotos: string[];
}
