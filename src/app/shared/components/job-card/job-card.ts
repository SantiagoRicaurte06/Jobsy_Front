import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job, TAMANO_TEXTO } from '../../../core/models';
import { CopPipe } from '../../pipes';
import { IconComponent } from '../icon/icon';

/** Tarjeta de oferta de empleo. Se usa en el home y en la busqueda. */
@Component({
  selector: 'jobsy-job-card',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.scss',
})
export class JobCardComponent {
  readonly job = input.required<Job>();

  readonly sizeLabel = computed(() => TAMANO_TEXTO[this.job().tamano]);
}
