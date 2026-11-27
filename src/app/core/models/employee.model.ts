/** Usuarios_Api — perfil de empleado */
export interface Employee {
  id: string;
  /** Id de la cuenta en Core; `id` es el del perfil de empleado. */
  usuarioId?: string;
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
  /** Lo que cobra por hora. Ausente si todavia no tiene perfil. */
  tarifaHora?: number;
}

/** Resena que un usuario deja en el perfil de un empleado. */
export interface EmployeeReview {
  id?: string;
  autor: string;
  estrellas: number;
  texto: string;
  fecha: string;
}
