/** suscripciones_API */
export type PlanTier = 'gratis' | 'basico' | 'premium';

export interface Plan {
  id: string;
  nombre: string;
  tier: PlanTier;
  precioMensual: number;
  beneficios: string[];
  destacado: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  activa: boolean;
  fechaInicio: string;
  fechaRenovacion: string;
}
