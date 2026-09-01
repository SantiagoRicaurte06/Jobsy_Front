
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { RegistrationService } from '../../../core/services';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-checklist',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './lista-pasos.html',
  styleUrl: './lista-pasos.scss',
})

export class ChecklistPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly rol = this.registration.rol;

  private readonly itemsEmpleado = [
    { icon: '\u{1F464}', title: 'Datos Personales', text: 'Nacionalidad, Genero Y Fecha De Nacimiento.' },
    { icon: '\u{1F4BC}', title: 'Modalidad De Trabajo', text: 'Como Y Cuando Puedes Trabajar.' },
    { icon: '\u{1F4CD}', title: 'Ubicacion Y Foto', text: 'Tu Ciudad, Radio De Trabajo Y Foto De Perfil.' },
  ];

  private readonly itemsEmpleador = [
    { icon: '\u{1F464}', title: 'Datos Personales', text: 'Nacionalidad, Genero Y Fecha De Nacimiento.' },
    { icon: '\u{1F4CD}', title: 'Ubicacion Y Foto', text: 'Tu Ciudad Y Foto De Perfil.' },
  ];

  readonly items = computed(() =>
    this.rol() === 'empleador' ? this.itemsEmpleador : this.itemsEmpleado
  );

  readonly cantidadTexto = computed(() => (this.items().length === 2 ? 'Dos' : 'Tres'));

  start(): void {
    this.router.navigate(['/registro/paso-1']);
  } 
}