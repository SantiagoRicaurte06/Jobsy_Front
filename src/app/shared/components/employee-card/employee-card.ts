import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../core/models';
import { AuthService } from '../../../core/services';
import { CopPipe } from '../../pipes';
import { RatingStarsComponent } from '../rating-stars/rating-stars';
import { IconComponent } from '../icon/icon';

/**
 * Tarjeta de empleado: verificación, reseñas reales y tarifa antes de abrir
 * el perfil. "Contratar" solo aparece a visitantes y cuentas de hogar.
 */
@Component({
  selector: 'jobsy-employee-card',
  standalone: true,
  imports: [IconComponent, RouterLink, RatingStarsComponent, CopPipe],
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.scss',
})
export class EmployeeCardComponent {
  private auth = inject(AuthService);

  readonly employee = input.required<Employee>();

  readonly solicitar = output<Employee>();

  readonly puedeContratar = computed(() => {
    const rol = this.auth.role();
    return !rol || rol === 'empleador';
  });

  /** Iniciales de nombre y apellido ("Martha C." → "MC"). */
  initials(nombre: string): string {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
