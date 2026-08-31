
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { RegistrationService } from '../../../core/services';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-checklist',
  standalone: true,
  imports: [IconComponent, RouterLink, LogoComponent],
  templateUrl: './lista-pasos.html',
  styleUrl: './lista-pasos.scss',
})

export class ChecklistPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly rol = this.registration.rol;

  readonly items = [
    { icon: 'user', title: 'Datos Personales', text: 'Nacionalidad, Genero Y Fecha De Nacimiento.' },
    { icon: 'briefcase', title: 'Modalidad De Trabajo', text: 'Como Y Cuando Puedes Trabajar.' },
    { icon: 'map-pin', title: 'Ubicacion Y Foto', text: 'Tu Ciudad, Radio De Trabajo Y Foto De Perfil.' },
  ];

  start(): void {
    this.router.navigate(['/registro/paso-1']);
  } 
}
