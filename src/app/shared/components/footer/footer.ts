import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo';

/** Pie de pagina azul con columnas de enlaces. */
@Component({
  selector: 'jobsy-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly columns = [
    {
      title: 'Servicios',
      links: [
        { label: 'Buscar Empleo', path: '/empleos' },
        { label: 'Buscar Empleados', path: '/empleados' },
        { label: 'Publicar Oferta', path: '/publicar-oferta' },
        { label: 'Tienda', path: '/tienda' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nosotros', path: '/empresa/sobre-nosotros' },
        { label: 'Blog', path: '/empresa/blog' },
        { label: 'Trabaja con Nosotros', path: '/empresa/trabaja-con-nosotros' },
        { label: 'Prensa', path: '/empresa/prensa' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        // Publicas: llevar a /app/reportes mandaba al login a quien no tiene cuenta.
        { label: 'Centro de Ayuda', path: '/soporte/centro-ayuda' },
        { label: 'Contacto', path: '/soporte/contacto' },
        { label: 'Terminos', path: '/legal/terminos' },
        { label: 'Privacidad', path: '/legal/privacidad' },
      ],
    },
  ];
}
