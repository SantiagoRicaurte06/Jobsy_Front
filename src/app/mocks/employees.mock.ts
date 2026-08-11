import { Employee } from '../core/models';

// TEMPORAL: reemplazar por Usuarios_Api
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e1', nombre: 'Martha C.',
    descripcion: 'Anos de experiencia en el cuidado de grandes superficies y entornos, con mucho carino y profundidad.',
    calificacion: 5.0, totalServicios: 23, verificado: true,
    especialidades: ['Limpieza profunda', 'Zonas verdes', 'Cocina'],
    experiencia: '6 anos trabajando en Sirivana y Manchas, Yopal',
    ciudad: 'Yopal', disponible: true,
  },
  {
    id: 'e2', nombre: 'Jose Luis R.',
    descripcion: 'Eficiente, puntual y especializado en protocolos de limpieza avanzados. Certificado en bioseguridad.',
    calificacion: 5.0, totalServicios: 19, verificado: true,
    especialidades: ['Limpieza profunda', 'Bioseguridad', 'Mantenimiento'],
    experiencia: 'Ideal para apartamentos modernos y oficinas en el Centro, Yopal',
    ciudad: 'Yopal', disponible: true,
  },
  {
    id: 'e3', nombre: 'Carmen E.',
    descripcion: 'Amante de los animales, dedicada a dejar los hogares libres de pelos y alergias.',
    calificacion: 4.8, totalServicios: 15, verificado: true,
    especialidades: ['Limpieza', 'Mascotas', 'Planchado'],
    experiencia: 'Preferida por familias en El Alcaravan por su buen trato',
    ciudad: 'Yopal', disponible: true,
  },
];
