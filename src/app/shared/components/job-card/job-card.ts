import { Component, input } from '@angular/core';
import { Job } from '../../../core/models';

@Component({
  selector: 'jobsy-job-card',
  standalone: true,
  imports: [],
  templateUrl: './job-card.html',
  styleUrl: './job-card.scss',
})
export class JobCardComponent {
  /** Oferta que pinta la tarjeta. */
  readonly job = input.required<Job>();

  // TODO: maquetar la tarjeta usando job().
}
