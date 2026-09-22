import { Component } from '@angular/core';

interface Seccion {
  id: string;
  titulo: string;
  parrafos: string[];
}

/** Politica de tratamiento de datos personales de Jobsy. */
@Component({
  selector: 'jobsy-privacidad',
  standalone: true,
  imports: [],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.scss',
})
export class PrivacyPage {
  readonly actualizado = '1 de agosto de 2026';

  readonly secciones: Seccion[] = [
    {
      id: 'introduccion',
      titulo: '1. Introduccion',
      parrafos: [
        'En Jobsy nos tomamos en serio la proteccion de tus datos personales, en linea con la Ley 1581 de 2012 y demas normas aplicables en Colombia sobre proteccion de datos.',
        'Esta politica explica que informacion recogemos, para que la usamos y que derechos tienes sobre ella.',
      ],
    },
    {
      id: 'datos-recogidos',
      titulo: '2. Datos que recogemos',
      parrafos: [
        'Datos de registro: nombre, correo electronico, telefono y ciudad.',
        'Datos de perfil: fotografia, experiencia, documento de identidad y referencias, en el caso de empleados que se verifican en la plataforma.',
        'Datos de uso: paginas visitadas, busquedas realizadas y compras en la tienda, para mejorar la experiencia de la plataforma.',
      ],
    },
    {
      id: 'finalidad',
      titulo: '3. Para que usamos tus datos',
      parrafos: [
        'Para crear y administrar tu cuenta, verificar perfiles de empleados, procesar pagos en la tienda, mostrarte ofertas relevantes y comunicarnos contigo sobre tu actividad en Jobsy.',
        'No vendemos tus datos personales a terceros. Solo los compartimos con proveedores necesarios para operar la plataforma (por ejemplo, pasarelas de pago) bajo acuerdos de confidencialidad.',
      ],
    },
    {
      id: 'derechos',
      titulo: '4. Tus derechos',
      parrafos: [
        'Puedes conocer, actualizar, rectificar o solicitar la eliminacion de tus datos personales en cualquier momento desde "Mi Cuenta" o escribiendo a soporte@jobsy.co.',
        'Tambien puedes revocar la autorizacion para el tratamiento de tus datos, sujeto a las obligaciones legales que Jobsy deba conservar (por ejemplo, registros de pagos).',
      ],
    },
    {
      id: 'seguridad',
      titulo: '5. Seguridad de la informacion',
      parrafos: [
        'Aplicamos medidas tecnicas y organizativas razonables para proteger tus datos frente a acceso no autorizado, perdida o alteracion, incluyendo cifrado en el transporte de la informacion.',
      ],
    },
    {
      id: 'cookies',
      titulo: '6. Cookies y tecnologias similares',
      parrafos: [
        'Usamos cookies esenciales para el funcionamiento de la plataforma (por ejemplo, mantener tu sesion iniciada) y cookies analiticas para entender como se usa Jobsy y mejorar el producto.',
      ],
    },
    {
      id: 'menores',
      titulo: '7. Menores de edad',
      parrafos: [
        'Jobsy no esta dirigido a menores de 18 anos. Si detectamos una cuenta creada por un menor sin autorizacion, procederemos a eliminarla.',
      ],
    },
    {
      id: 'contacto',
      titulo: '8. Contacto',
      parrafos: [
        'Para cualquier solicitud relacionada con tus datos personales, escribenos a soporte@jobsy.co o visita nuestro Centro de Ayuda.',
      ],
    },
  ];
}
