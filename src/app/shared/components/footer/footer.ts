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
        { label: 'Sobre Nosotros', path: '/' },
        { label: 'Blog', path: '/' },
        { label: 'Trabaja con Nosotros', path: '/' },
        { label: 'Prensa', path: '/' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Centro de Ayuda', path: '/app/reportes' },
        { label: 'Contacto', path: '/app/reportes' },
        { label: 'Terminos', path: '/' },
        { label: 'Privacidad', path: '/' },
      ],
    },
  ];
}
