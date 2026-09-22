/** Usuarios_Api — perfil de empleado */
export interface Employee {
  id: string;
  nombre: string;
  fotoUrl?: string;
  descripcion: string;
  calificacion: number;
  totalServicios: number;
  verificado: boolean;
  especialidades: string[];
  experiencia: string;
  ciudad: string;
  disponible: boolean;
}

/** Resena que un usuario deja en el perfil de un empleado. */
export interface EmployeeReview {
  autor: string;
  estrellas: number;
  texto: string;
  fecha: string;
}
