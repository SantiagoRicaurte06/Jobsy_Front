import { Employee } from './employee.model';

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

/** Postulacion recibida en una oferta propia, con la ficha de quien se postulo. */
export interface ReceivedApplication extends Application {
  empleado?: Employee;
  /** Presente si esta postulacion ya se convirtio en contratacion. */
  contratacionId?: string;
}
