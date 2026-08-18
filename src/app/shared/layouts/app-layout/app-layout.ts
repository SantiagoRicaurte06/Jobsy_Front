import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

/** Layout del area privada: header + menu lateral del usuario + contenido. */
@Component({
  selector: 'jobsy-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent {
  readonly menu = [
    { path: '/app/inicio', label: 'Inicio', icon: '\u{1F3E0}' },
    { path: '/app/mis-postulaciones', label: 'Mis postulaciones', icon: '\u{1F4CB}' },
    { path: '/app/perfil', label: 'Perfil', icon: '\u{1F464}' },
    { path: '/app/hoja-de-vida', label: 'Hoja de vida', icon: '\u{1F4C4}' },
    { path: '/app/reportes', label: 'Reportes', icon: '\u{1F4CA}' },
    { path: '/app/cuenta', label: 'Cuenta', icon: '\u{1F4B3}' },
    { path: '/app/configuracion', label: 'Configuracion', icon: '\u{2699}' },
  ];
}
