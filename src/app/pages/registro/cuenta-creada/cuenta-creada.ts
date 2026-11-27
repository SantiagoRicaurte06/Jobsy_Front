import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-account-created',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './cuenta-creada.html',
  styleUrl: './cuenta-creada.scss',
})
export class AccountCreatedPage {
  readonly nextSteps = [
    { icon: 'file-text', title: 'Completa tu hoja de vida', path: '/app/hoja-de-vida' },
    { icon: 'search', title: 'Explora empleos disponibles', path: '/empleos' },
    { icon: 'settings', title: 'Configura tus preferencias', path: '/app/configuracion' },
  ];
}
