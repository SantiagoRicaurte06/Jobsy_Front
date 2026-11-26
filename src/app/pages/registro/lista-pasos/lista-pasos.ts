
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { RegistrationService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-checklist',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './lista-pasos.html',
  styleUrl: './lista-pasos.scss',
})

export class ChecklistPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly rol = this.registration.rol;

  private readonly itemsEmpleado = [
    { icon: 'user', title: 'Datos personales', text: 'Nacionalidad, género y fecha de nacimiento.' },
    { icon: 'briefcase', title: 'Modalidad de trabajo', text: 'Cómo y cuándo puedes trabajar.' },
    { icon: 'map-pin', title: 'Ubicación y foto', text: 'Tu ciudad, radio de trabajo y foto de perfil.' },
  ];

  private readonly itemsEmpleador = [
    { icon: 'user', title: 'Datos personales', text: 'Nacionalidad, género y fecha de nacimiento.' },
    { icon: 'map-pin', title: 'Ubicación y foto', text: 'Tu ciudad y foto de perfil.' },
  ];

  readonly items = computed(() =>
    this.rol() === 'empleador' ? this.itemsEmpleador : this.itemsEmpleado
  );

  readonly cantidadTexto = computed(() => (this.items().length === 2 ? 'dos' : 'tres'));

  start(): void {
    this.router.navigate(['/registro/paso-1']);
  } 
}