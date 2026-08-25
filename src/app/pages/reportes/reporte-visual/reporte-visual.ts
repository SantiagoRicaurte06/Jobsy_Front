import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart';

@Component({
  selector: 'jobsy-visual-report',
  standalone: true,
  imports: [RouterLink, BarChartComponent],
  templateUrl: './reporte-visual.html',
  styleUrl: './reporte-visual.scss',
})
export class VisualReportPage {
  readonly periodo = signal('2026');

  /** TEMPORAL: datos de ejemplo. Vendran de Soporte_API / Core_api. */
  readonly postulaciones: BarDatum[] = [
    { label: 'Ene', value: 4 },
    { label: 'Feb', value: 7 },
    { label: 'Mar', value: 12, destacado: true },
    { label: 'Abr', value: 9 },
    { label: 'May', value: 6 },
    { label: 'Jun', value: 8 },
    { label: 'Jul', value: 5, proyectado: true },
    { label: 'Ago', value: 7, proyectado: true },
  ];

  readonly kpis = [
    { label: 'Postulaciones enviadas', value: '58', delta: '+12', tone: 'up' },
    { label: 'Tasa de respuesta', value: '72%', delta: '+8%', tone: 'up' },
    { label: 'Servicios completados', value: '23', delta: '+3', tone: 'up' },
    { label: 'Calificacion promedio', value: '4.9', delta: '+0.2', tone: 'up' },
  ];

  readonly categorias = [
    { nombre: 'Limpieza profunda', porcentaje: 45 },
    { nombre: 'Cocina', porcentaje: 25 },
    { nombre: 'Planchado', porcentaje: 18 },
    { nombre: 'Zonas verdes', porcentaje: 12 },
  ];
}
