import { Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Sala de prensa: kit de marca y contacto para medios. */
@Component({
  selector: 'jobsy-prensa',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './prensa.html',
  styleUrl: './prensa.scss',
})
export class PressPage {
  readonly menciones = [
    {
      medio: 'Noticias Casanare',
      titulo: 'Plataforma local conecta empleados del hogar con familias de Yopal',
      fecha: 'Mayo 2026',
    },
    {
      medio: 'Emprendimiento Llanero',
      titulo: 'Jobsy: la app que le apuesta a la formalizacion del trabajo domestico',
      fecha: 'Marzo 2026',
    },
    {
      medio: 'Radio Casanare',
      titulo: 'Entrevista: como funciona la verificacion de perfiles en Jobsy',
      fecha: 'Enero 2026',
    },
  ];

  readonly kit = [
    { icon: 'download', title: 'Logo en alta resolucion', text: 'PNG de 1024 x 614 px.', href: '/logo.png', archivo: 'jobsy-logo.png', accion: 'Descargar' },
    { icon: 'file-text', title: 'Reseña de la empresa', text: 'Texto breve listo para publicar.', href: '/prensa/jobsy-resena.txt', archivo: 'jobsy-resena.txt', accion: 'Descargar' },
    { icon: 'camera', title: 'Banco de imagenes', text: 'Fotografias del equipo y producto, a pedido.', href: 'mailto:prensa@jobsy.co?subject=Solicitud%20de%20imagenes%20de%20Jobsy', archivo: null, accion: 'Solicitar' },
  ];
}
