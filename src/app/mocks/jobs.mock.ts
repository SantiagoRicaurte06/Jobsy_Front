import { Job } from '../core/models';
import { IMG_JOBS } from './images.mock';

// Datos de demostración para el modo sin backend. Horarios en el formato del mid.
export const MOCK_JOBS: Job[] = [
  {
    id: 'j1', titulo: 'Casa familiar grande (villa)', tamano: 'grande',
    precioHora: 35000, moneda: 'COP',
    horario: 'Lun, Mie, Vie · 08:30 a 16:30',
    direccion: 'Calle 7 #33, Vía Sirivana', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Zonas verdes', 'Cocina'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-01',
    imagenUrl: IMG_JOBS['j1'],
  },
  {
    id: 'j2', titulo: 'Apartamento mediano · Flor Amarilla', tamano: 'mediano',
    precioHora: 28000, moneda: 'COP',
    horario: 'Mar, Jue · 08:00 a 17:30',
    direccion: 'Cra 19 #35, Barrio Yopal Amarillo', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Planchado'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-02',
    imagenUrl: IMG_JOBS['j2'],
  },
  {
    id: 'j3', titulo: 'Casa grande · El Alcaraván', tamano: 'grande',
    precioHora: 32000, moneda: 'COP',
    horario: 'Lun, Mar, Mie, Jue, Vie, Sab · 09:30 a 16:00',
    direccion: 'Cra 23 #38, Barrio El Trapiche', ciudad: 'Yopal',
    modalidad: 'por_horas', etiquetas: ['Limpieza', 'Cocina'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-03',
    imagenUrl: IMG_JOBS['j3'],
  },
  {
    id: 'j4', titulo: 'Casa grande de lujo · La Decisión', tamano: 'grande', esLujo: true,
    precioHora: 40000, moneda: 'COP',
    horario: 'Jue · 08:00 a 15:30',
    direccion: 'Conjunto La Rochela', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Cocina', 'Zonas verdes'],
    esNuevo: false, empleadorId: 'u3', fechaPublicacion: '2026-02-20',
    imagenUrl: IMG_JOBS['j4'],
  },
  {
    id: 'j5', titulo: 'Apartamento mediano · Las Malvinas', tamano: 'mediano',
    precioHora: 25000, moneda: 'COP',
    horario: 'Sab, Dom · 07:30 a 16:30',
    direccion: 'Calle 21 #2-1, Barrio Los Habitantes', ciudad: 'Yopal',
    modalidad: 'fin_de_semana', etiquetas: ['Limpieza'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-04',
    imagenUrl: IMG_JOBS['j5'],
  },
  {
    id: 'j6', titulo: 'Casa pequeña · Barrio Centro', tamano: 'pequeno',
    precioHora: 20000, moneda: 'COP',
    horario: 'Mar · 14:15 a 17:00',
    direccion: 'Carrera 25 #7-31', ciudad: 'Yopal',
    modalidad: 'por_horas', etiquetas: ['Limpieza'],
    esNuevo: false, empleadorId: 'u3', fechaPublicacion: '2026-02-15',
    imagenUrl: IMG_JOBS['j6'],
  },
];
