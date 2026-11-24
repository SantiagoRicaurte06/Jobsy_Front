import { Component } from '@angular/core';

interface Seccion {
  id: string;
  titulo: string;
  parrafos: string[];
}

/** Terminos y condiciones de uso de Jobsy. */
@Component({
  selector: 'jobsy-terminos',
  standalone: true,
  imports: [],
  templateUrl: './terminos.html',
  styleUrl: './terminos.scss',
})
export class TermsPage {
  readonly actualizado = '1 de agosto de 2026';

  readonly secciones: Seccion[] = [
    {
      id: 'objeto',
      titulo: '1. Objeto',
      parrafos: [
        'Jobsy es una plataforma digital que conecta a personas que ofrecen servicios de hogar (empleados) con personas o familias que los requieren (empleadores) en Yopal y Casanare, y que además ofrece una tienda de insumos relacionados.',
        'Al crear una cuenta o usar cualquier funcion de Jobsy, aceptas estos términos en su totalidad. Si no estas de acuerdo, te pedimos no utilizar la plataforma.',
      ],
    },
    {
      id: 'cuentas',
      titulo: '2. Cuentas de usuario',
      parrafos: [
        'Para publicar ofertas, postularte a un empleo o comprar en la tienda necesitas crear una cuenta con datos veridicos y actualizados.',
        'Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra bajo tu cuenta. Notificanos de inmediato si detectas un uso no autorizado.',
      ],
    },
    {
      id: 'verificacion',
      titulo: '3. Verificación de perfiles',
      parrafos: [
        'Los perfiles de empleados pasan por un proceso de verificación de identidad y referencias antes de ser publicados. Jobsy no garantiza el desempeño de ningún usuario, pero se reserva el derecho de suspender cuentas que incumplan estos términos o reciban reportes fundamentados.',
      ],
    },
    {
      id: 'pagos',
      titulo: '4. Pagos y tienda',
      parrafos: [
        'Los pagos realizados dentro de la tienda de Jobsy se procesan a traves de pasarelas de pago autorizadas (PSE, tarjeta, billetera digital). Los precios se muestran en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda.',
        'Las devoluciones se rigen por la política de la tienda vigente al momento de la compra, disponible en el Centro de Ayuda.',
      ],
    },
    {
      id: 'conducta',
      titulo: '5. Conducta esperada',
      parrafos: [
        'No esta permitido publicar información falsa, acosar a otros usuarios, ni usar la plataforma para fines distintos a la contratación de servicios de hogar o la compra de productos relacionados.',
        'Jobsy puede suspender o cerrar cuentas que incumplan estas reglas, sin perjuicio de las acciones legales que correspondan.',
      ],
    },
    {
      id: 'responsabilidad',
      titulo: '6. Limitacion de responsabilidad',
      parrafos: [
        'Jobsy actua como intermediario tecnologico. La relación contractual del servicio de hogar se establece directamente entre empleador y empleado; Jobsy no es parte de dicha relación laboral ni garantiza resultados especificos.',
      ],
    },
    {
      id: 'cambios',
      titulo: '7. Cambios en estos términos',
      parrafos: [
        'Podemos actualizar estos términos ocasionalmente. Publicaremos la nueva versión en esta página indicando la fecha de la última actualización. El uso continuado de Jobsy después de un cambio implica su aceptacion.',
      ],
    },
    {
      id: 'contacto',
      titulo: '8. Contacto',
      parrafos: [
        'Si tienes preguntas sobre estos términos, escribenos a soporte@jobsy.co o visita nuestro Centro de Ayuda.',
      ],
    },
  ];
}
