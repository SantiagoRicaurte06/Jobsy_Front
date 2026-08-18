
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../core/services';
import { UserRole } from '../../../core/models';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-select-role',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './select-role.html',
  styleUrl: './select-role.scss',
})
export class SelectRolePage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly selected = signal<UserRole | null>(null);

  readonly roles: { value: UserRole; icon: string; title: string; text: string; perks: string[] }[] = [
    {
      value: 'empleado',
      icon: '\u{1F9F9}',
      title: 'Busco trabajo',
      text: 'Soy profesional del hogar y quiero recibir ofertas.',
      perks: ['Perfil verificado', 'Postulaciones ilimitadas', 'Hoja de vida en linea'],
    },
    {
      value: 'empleador',
      icon: '\u{1F3E0}',
      title: 'Busco empleado',
      text: 'Necesito contratar personal para mi hogar.',
      perks: ['Publicar ofertas', 'Perfiles verificados', 'Agendar horarios'],
    },
  ];

  select(rol: UserRole): void {
    this.selected.set(rol);
  }

  continue(): void {
    if (!this.selected()) return;
    this.registration.patch({ rol: this.selected() });
    this.router.navigate(['/registro/checklist']);
  }
}
