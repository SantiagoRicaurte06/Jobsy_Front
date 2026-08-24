import { Job } from '../core/models';
import { IMG_JOBS } from './images.mock';

// TEMPORAL: reemplazar por Empleo_API
export const MOCK_JOBS: Job[] = [
  {
    id: 'j1', titulo: 'Casa Familiar Grande (Villa)', tamano: 'grande',
    precioHora: 35000, moneda: 'COP',
    horario: 'Sabados: 8:00 am - 4:00 pm (Jornada completa con fin de semana)',
    direccion: 'Calle 7 #33, Via Sirivana', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Zonas verdes', 'Cocina'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-01',
    imagenUrl: IMG_JOBS['j1'],
  },
  {
    id: 'j2', titulo: 'Apartamento Mediano - Flor Amarilla', tamano: 'mediano',
    precioHora: 28000, moneda: 'COP',
    horario: 'Sabados: 8:00 am - 5:00 pm (Jornada completa, fines libres)',
    direccion: 'Cra 19 #35, Barrio Yopal Amarillo', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Planchado'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-02',
    imagenUrl: IMG_JOBS['j2'],
  },
  {
    id: 'j3', titulo: 'Casa Grande - El Alcaravan', tamano: 'grande',
    precioHora: 32000, moneda: 'COP',
    horario: 'Lun-Sab: 9:00 am - 3:00 pm',
    direccion: 'Cra 23 #38, Barrio El Trapiche', ciudad: 'Yopal',
    modalidad: 'por_horas', etiquetas: ['Limpieza', 'Cocina'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-03',
    imagenUrl: IMG_JOBS['j3'],
  },
  {
    id: 'j4', titulo: 'Casa Grande (Lujo) - La Decision', tamano: 'lujoso',
    precioHora: 40000, moneda: 'COP',
    horario: 'Jueves: 8:00 am - 3:00 pm (ver detalles)',
    direccion: 'Conjunto La Rochela', ciudad: 'Yopal',
    modalidad: 'jornada_completa', etiquetas: ['Limpieza', 'Cocina', 'Zonas verdes'],
    esNuevo: false, empleadorId: 'u3', fechaPublicacion: '2026-02-20',
    imagenUrl: IMG_JOBS['j4'],
  },
  {
    id: 'j5', titulo: 'Apartamento Mediano - Las Malvinas', tamano: 'mediano',
    precioHora: 25000, moneda: 'COP',
    horario: 'Sabados: 7:00 am - 4:00 pm (fin de semana)',
    direccion: 'Calle 21 #2-1, Barrio Los Habitantes', ciudad: 'Yopal',
    modalidad: 'fin_de_semana', etiquetas: ['Limpieza'],
    esNuevo: true, empleadorId: 'u3', fechaPublicacion: '2026-03-04',
    imagenUrl: IMG_JOBS['j5'],
  },
  {
    id: 'j6', titulo: 'Casa Pequena - Barrio Centro', tamano: 'pequeno',
    precioHora: 20000, moneda: 'COP',
    horario: 'Martes: 2:00 pm - 6:00 pm (fines de semana, dias especiales)',
    direccion: 'Carrera 25 #7-31', ciudad: 'Yopal',
    modalidad: 'por_horas', etiquetas: ['Limpieza'],
    esNuevo: false, empleadorId: 'u3', fechaPublicacion: '2026-02-15',
    imagenUrl: IMG_JOBS['j6'],
  },
];
