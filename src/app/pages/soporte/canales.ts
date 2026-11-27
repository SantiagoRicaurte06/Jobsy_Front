/** Canales de soporte: los muestran el centro de ayuda y la página de contacto. */
export interface CanalSoporte {
  icon: string;
  title: string;
  text: string;
  nota: string;
}

export const CANALES_SOPORTE: CanalSoporte[] = [
  {
    icon: 'mail',
    title: 'Correo electrónico',
    text: 'soporte@jobsy.co',
    nota: 'Respuesta en menos de 24 horas hábiles.',
  },
  {
    icon: 'message-circle',
    title: 'Chat en la app',
    text: 'Desde el Centro de Ayuda',
    nota: 'Lunes a sábado, 8:00 a. m. a 6:00 p. m.',
  },
  {
    icon: 'map-pin',
    title: 'Oficina Yopal',
    text: 'Calle 8 #23-15, Yopal, Casanare',
    nota: 'Visitas con cita previa.',
  },
];
