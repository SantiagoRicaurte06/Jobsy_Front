import { WorkModality } from './job.model';

/** Usuarios_Api */
export type UserRole = 'empleador' | 'empleado' | 'admin';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: UserRole;
  fotoUrl?: string;
  verificado: boolean;
  ciudad?: string;
  departamento?: string;
  fechaRegistro: string;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/** Documento que el usuario sube para verificar su identidad. */
export type UserDocumentType = 'antecedentes' | 'foto' | 'hoja_vida';

export interface UserDocument {
  id: string;
  tipo: UserDocumentType;
  archivoUrl: string;
  estado: 'pendiente' | 'verificado' | 'rechazado';
  notas?: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole;
  // Opcionales: el resto del asistente de registro. El middleware los guarda
  // en el usuario, su documento y (si es empleado) su perfil de empleo.
  nacionalidad?: string;
  genero?: string;
  fechaNacimiento?: string;
  documento?: string;
  ciudad?: string;
  barrio?: string;
  distanciaKm?: number;
  modalidades?: WorkModality[];
  experiencia?: string;
  especialidades?: string[];
}
