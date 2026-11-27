import { Plan } from '../core/models';

// TEMPORAL: reemplazar por suscripciones_API
export const MOCK_PLANS: Plan[] = [
  {
    id: 'pl1', nombre: 'Gratis', tier: 'gratis', precioMensual: 0,
    beneficios: ['Perfil básico', '3 postulaciones al mes'], destacado: false,
  },
  {
    id: 'pl2', nombre: 'Básico', tier: 'basico', precioMensual: 25000,
    beneficios: ['Postulaciones ilimitadas', 'Perfil verificado', 'Soporte por correo'], destacado: true,
  },
  {
    id: 'pl3', nombre: 'Premium', tier: 'premium', precioMensual: 55000,
    beneficios: ['Todo lo del plan Básico', 'Destacado en búsquedas', 'Soporte prioritario', 'Estadísticas'], destacado: false,
  },
];
