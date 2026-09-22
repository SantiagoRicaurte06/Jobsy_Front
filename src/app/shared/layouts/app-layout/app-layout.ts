import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { IconComponent } from '../../components/icon/icon';

/** Layout del area privada: header + menu lateral del usuario + contenido. */
@Component({
  selector: 'jobsy-app-layout',
  standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent {
  readonly menu = [
    { path: '/app/inicio', label: 'Inicio', icon: 'house' },
    { path: '/app/mis-postulaciones', label: 'Mis postulaciones', icon: 'clipboard-list' },
    { path: '/app/perfil', label: 'Perfil', icon: 'user' },
    { path: '/app/hoja-de-vida', label: 'Hoja de vida', icon: 'file-text' },
    { path: '/app/reportes', label: 'Reportes', icon: 'chart-column' },
    { path: '/app/cuenta', label: 'Cuenta', icon: 'credit-card' },
    { path: '/app/configuracion', label: 'Configuracion', icon: 'settings' },
  ];
}
