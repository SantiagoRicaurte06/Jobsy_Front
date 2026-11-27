import { Component, computed, input } from '@angular/core';

/** Un dato del gráfico de barras. */
export interface BarDatum {
  label: string;
  value: number;
  destacado?: boolean;
  proyectado?: boolean;
}

/**
 * Gráfico de barras en CSS, sin librerías externas.
 * La leyenda solo muestra lo que de verdad aparece en los datos, y cada
 * barra lleva su valor como texto para lectores de pantalla.
 */
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
  /** Nombre de la serie en la leyenda ("Ventas", "Usuarios nuevos"…). */
  readonly serie = input('');
  /** Qué significa la barra resaltada. */
  readonly etiquetaDestacado = input('Mes actual');

  private readonly max = computed(() => Math.max(...this.data().map((d) => d.value), 1));

  readonly bars = computed(() =>
    this.data().map((d) => ({
      ...d,
      height: Math.round((d.value / this.max()) * 100),
    })),
  );

  readonly hayDestacado = computed(() => this.data().some((d) => d.destacado));
  readonly hayProyectado = computed(() => this.data().some((d) => d.proyectado));
}
