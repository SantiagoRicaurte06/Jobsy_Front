/** Empleo_API — postulaciones */
export type ApplicationStatus = 'pendiente' | 'en_revision' | 'aceptada' | 'rechazada';

export interface Application {
  id: string;
  jobId: string;
  empleadoId: string;
  estado: ApplicationStatus;
  fechaPostulacion: string;
  mensaje?: string;
}
