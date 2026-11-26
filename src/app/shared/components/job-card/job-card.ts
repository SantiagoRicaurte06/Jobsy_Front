import { Component, input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job, MODALIDAD_TEXTO, TAMANO_TEXTO } from '../../../core/models';
import { HORAS_DEFECTO, pagoSemana } from '../../../core/utils/semana';
import { DiaSemana } from '../../../core/utils/horario';
import { AuthService } from '../../../core/services';
import { CopPipe } from '../../pipes';
import { IconComponent } from '../icon/icon';
import { FranjaSemanaComponent } from '../franja-semana/franja-semana';

/**
 * Tarjeta de oferta de empleo: tarifa, días y horario a la vista.
 * Toda la tarjeta lleva al detalle; "Postularme" solo aparece a quien puede
 * postularse (visitantes y cuentas de empleado).
 */
@Component({
  selector: 'jobsy-job-card',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe, FranjaSemanaComponent],
  templateUrl: './job-card.html',
  styleUrl: './job-card.scss',
})
export class JobCardComponent {
  private auth = inject(AuthService);

  readonly job = input.required<Job>();
  /** Días que puede trabajar quien mira; la tarjeta dice cuánto le pagaría esa semana. */
  readonly misDias = input<DiaSemana[] | null>(null);

  readonly coincidencia = computed(() => {
    const dias = this.misDias();
    if (!dias?.length) return null;
    const j = this.job();
    return { ...pagoSemana(j.horario, j.precioHora, { dias, horas: HORAS_DEFECTO }), elegidos: dias.length };
  });

  readonly vivienda = computed(() => {
    const j = this.job();
    return `${j.esLujo ? 'Vivienda de lujo' : 'Vivienda'} ${TAMANO_TEXTO[j.tamano].toLowerCase()}`;
  });

  readonly modalidad = computed(() => MODALIDAD_TEXTO[this.job().modalidad] ?? '');

  readonly puedePostularse = computed(() => {
    const rol = this.auth.role();
    return !rol || rol === 'empleado';
  });
}
