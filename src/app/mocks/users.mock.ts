import { User } from '../core/models';

// TEMPORAL: reemplazar por Usuarios_Api
export const MOCK_USERS: User[] = [
  {
    id: 'u1', nombre: 'Admin', apellido: 'Jobsy', email: 'admin@jobsy.com',
    rol: 'admin', verificado: true, ciudad: 'Yopal', departamento: 'Casanare',
    fechaRegistro: '2026-01-15',
  },
  {
    id: 'u2', nombre: 'Victor', apellido: 'Mariño', email: 'martha@jobsy.com',
    rol: 'empleado', verificado: true, ciudad: 'Yopal', departamento: 'Casanare',
    fechaRegistro: '2026-02-01',
  },
  {
    id: 'u3', nombre: 'Esteban', apellido: 'Mcgregor', email: 'pedro@jobsy.com',
    rol: 'empleador', verificado: true, ciudad: 'Yopal', departamento: 'Casanare',
    fechaRegistro: '2026-03-01',
  },
];
