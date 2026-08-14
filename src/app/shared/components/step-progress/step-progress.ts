import { Component, input } from '@angular/core';

/** Barra de progreso del asistente de registro. */
@Component({
  selector: 'jobsy-step-progress',
  standalone: true,
  imports: [],
  templateUrl: './step-progress.html',
  styleUrl: './step-progress.scss',
})
export class StepProgressComponent {
  readonly steps = input.required<string[]>();
  /** Indice del paso actual, empezando en 0. */
  readonly current = input.required<number>();
}
