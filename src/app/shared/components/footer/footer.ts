import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { IconComponent } from '../icon/icon';

/** Pie de página en tinta: cierre de marca y enlaces. */
@Component({
  selector: 'jobsy-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent, IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly columns = [
    {
      title: 'Jobsy',
      links: [
        { label: 'Buscar empleo', path: '/empleos' },
        { label: 'Buscar empleados', path: '/empleados' },
        { label: 'Publicar una oferta', path: '/publicar-oferta' },
        { label: 'Tienda', path: '/tienda' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre nosotros', path: '/empresa/sobre-nosotros' },
        { label: 'Blog', path: '/empresa/blog' },
        { label: 'Trabaja con nosotros', path: '/empresa/trabaja-con-nosotros' },
        { label: 'Prensa', path: '/empresa/prensa' },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        // Públicas: llevar a /app/reportes mandaba al login a quien no tiene cuenta.
        { label: 'Centro de ayuda', path: '/soporte/centro-ayuda' },
        { label: 'Contacto', path: '/soporte/contacto' },
        { label: 'Términos', path: '/legal/terminos' },
        { label: 'Privacidad', path: '/legal/privacidad' },
      ],
    },
  ];
}
