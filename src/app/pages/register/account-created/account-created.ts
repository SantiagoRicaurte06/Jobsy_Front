import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-account-created',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './account-created.html',
  styleUrl: './account-created.scss',
})
export class AccountCreatedPage {
  readonly nextSteps = [
    { icon: '\u{1F4C4}', title: 'Completa tu hoja de vida', path: '/app/hoja-de-vida' },
    { icon: '\u{1F50D}', title: 'Explora empleos disponibles', path: '/empleos' },
    { icon: '\u{2699}', title: 'Configura tus preferencias', path: '/app/configuracion' },
  ];
}
