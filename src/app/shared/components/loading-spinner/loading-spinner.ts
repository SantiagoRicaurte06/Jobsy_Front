import { Component, input } from '@angular/core';

/** Indicador de carga. Usar mientras un servicio resuelve. */
@Component({
  selector: 'jobsy-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinnerComponent {
  readonly label = input('Cargando...');
}
