import { Component } from '@angular/core';

/** Un dato del grafico de barras. */
export interface BarDatum {
  label: string;
  value: number;
  destacado?: boolean;
  proyectado?: boolean;
}

/** Grafico de barras en CSS, sin librerias externas. */
@Component({
  selector: 'jobsy-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChartComponent {
  // TODO: input `data: BarDatum[]` y calculo de alturas en porcentaje.
}
