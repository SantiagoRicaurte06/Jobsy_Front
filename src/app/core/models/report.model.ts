/** Soporte_API — reportes */
export type ReportStatus = 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';

export interface Report {
  id: string;
  tipo: string;
  asunto: string;
  descripcion: string;
  estado: ReportStatus;
  reportanteId: string;
  fecha: string;
}
