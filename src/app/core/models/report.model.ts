/** Soporte_API — reportes */
export type ReportStatus = 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';

/** Autor de cada mensaje del hilo de un reporte. */
export type ReportAuthor = 'usuario' | 'soporte';

/** Un mensaje dentro de la conversacion de un reporte. */
export interface ReportMessage {
  autor: ReportAuthor;
  texto: string;
  fecha: string;
}

export interface Report {
  id: string;
  tipo: string;
  asunto: string;
  descripcion: string;
  estado: ReportStatus;
  reportanteId: string;
  fecha: string;
  /** Conversacion del reporte. El primer mensaje suele ser la descripcion inicial. */
  mensajes?: ReportMessage[];
}
