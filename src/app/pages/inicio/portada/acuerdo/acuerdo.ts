import { Component, input } from '@angular/core';
import { Employee, Job } from '../../../../core/models';
import { CopPipe } from '../../../../shared/pipes';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { FranjaSemanaComponent } from '../../../../shared/components/franja-semana/franja-semana';

/**
 * Tres lienzos de color con la app adentro: una oferta, un perfil y una
 * contratación, pintados con datos reales de la portada.
 */
@Component({
  selector: 'jobsy-acuerdo-app',
  standalone: true,
  imports: [CopPipe, IconComponent, FranjaSemanaComponent],
  templateUrl: './acuerdo.html',
  styleUrl: './acuerdo.scss',
})
export class AcuerdoAppComponent {
  readonly oferta = input<Job | null>(null);
  readonly persona = input<Employee | null>(null);
}
