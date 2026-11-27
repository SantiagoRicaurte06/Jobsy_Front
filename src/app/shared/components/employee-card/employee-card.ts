import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../core/models';
import { Semana } from '../../../core/utils/semana';
import { AuthService } from '../../../core/services';
import { CopPipe } from '../../pipes';
import { IconComponent } from '../icon/icon';

/**
 * Tarjeta de persona en formato retrato: la cara primero, luego verificación,
 * reseñas reales y tarifa. Con una semana elegida (días y horas) dice cuánto
 * costaría esa semana con esa persona. "Contratar" solo aparece a visitantes
 * y cuentas de hogar.
 */
@Component({
  selector: 'jobsy-employee-card',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe],
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.scss',
})
export class EmployeeCardComponent {
  private auth = inject(AuthService);

  readonly employee = input.required<Employee>();
  /** Semana elegida en la portada o en la lista; null si no hay. */
  readonly semana = input<Semana | null>(null);
  /** La descripción va en el perfil; en las listas solo carga la tarjeta. */
  readonly conDescripcion = input(false);

  readonly solicitar = output<Employee>();

  readonly horasSemana = computed(() => {
    const s = this.semana();
    return s ? s.dias.length * s.horas : 0;
  });

  readonly costoSemana = computed(() => (this.employee().tarifaHora ?? 0) * this.horasSemana());

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
