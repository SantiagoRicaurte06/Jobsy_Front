import { Component, computed, input } from '@angular/core';

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
  readonly data = input.required<BarDatum[]>();
  readonly unit = input('');

  private readonly max = computed(() => Math.max(...this.data().map((d) => d.value), 1));

  readonly bars = computed(() =>
    this.data().map((d) => ({
      ...d,
      height: Math.round((d.value / this.max()) * 100),
    })),
  );
}
