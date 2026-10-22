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
  /** Mensajes del hilo, sin contar la descripcion (que abre la conversacion). */
  totalMensajes?: number;
  /** Ultimo mensaje del hilo, para la bandeja; no viene si aun no hay respuestas. */
  ultimoMensaje?: ReportMessage;
  /** Fecha del ultimo mensaje, o la de creacion si no hay. */
  actividad?: string;
  /** Nombre de quien reporta (solo en el panel admin). */
  reportante?: string;
  /** Conversacion del reporte, cargada al abrirlo. No incluye la descripcion. */
  mensajes?: ReportMessage[];
}
