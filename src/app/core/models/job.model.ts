/** Empleo_API */
export type JobSize = 'pequeno' | 'mediano' | 'grande' | 'lujoso';
export type WorkModality = 'presencial' | 'por_horas' | 'jornada_completa' | 'fin_de_semana';

export interface Job {
  id: string;
  titulo: string;
  tamano: JobSize;
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
