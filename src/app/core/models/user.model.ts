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

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole;
}
