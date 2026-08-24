import { Component, signal } from '@angular/core';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart';

@Component({
  selector: 'jobsy-analytics',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './analiticas.html',
  styleUrl: './analiticas.scss',
})
export class AdminAnalyticsPage {
  readonly periodo = signal<'7d' | '30d' | '12m'>('30d');

  readonly periodos = [
    { value: '7d' as const, label: 'Ultimos 7 dias' },
    { value: '30d' as const, label: 'Ultimos 30 dias' },
    { value: '12m' as const, label: 'Ultimos 12 meses' },
  ];

  readonly usuariosNuevos: BarDatum[] = [
    { label: 'S1', value: 24 },
    { label: 'S2', value: 38 },
    { label: 'S3', value: 52, destacado: true },
    { label: 'S4', value: 41 },
  ];

  readonly contrataciones: BarDatum[] = [
    { label: 'Ene', value: 12 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 28, destacado: true },
    { label: 'Abr', value: 22 },
    { label: 'May', value: 25 },
    { label: 'Jun', value: 18 },
  ];

  readonly metricas = [
    { label: 'Usuarios totales', value: '312', delta: '+12%' },
    { label: 'Empleos publicados', value: '186', delta: '+8%' },
    { label: 'Contrataciones', value: '124', delta: '+21%' },
    { label: 'Tasa de conversion', value: '38%', delta: '+4%' },
  ];

  readonly ciudades = [
    { nombre: 'Yopal', usuarios: 218, porcentaje: 70 },
    { nombre: 'Aguazul', usuarios: 47, porcentaje: 15 },
    { nombre: 'Tauramena', usuarios: 28, porcentaje: 9 },
    { nombre: 'Villanueva', usuarios: 19, porcentaje: 6 },
  ];

  readonly topEmpleados = [
    { nombre: 'Martha C.', servicios: 23, calificacion: 5.0, zona: 'Sirivana' },
    { nombre: 'Jose Luis  R.', servicios: 19, calificacion: 5.0, zona: 'Centro' },
    { nombre: 'Carmen E.', servicios: 15, calificacion: 4.8, zona: 'El Alcaravan' },
  ];
}
