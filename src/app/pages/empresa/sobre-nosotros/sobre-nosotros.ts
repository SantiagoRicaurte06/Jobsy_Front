import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Pagina institucional: historia, mision y valores de Jobsy. */
@Component({
  selector: 'jobsy-sobre-nosotros',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
})
export class AboutPage {
  readonly stats = [
    { value: '+1.200', label: 'Empleos publicados' },
    { value: '+900', label: 'Empleados verificados' },
    { value: '100%', label: 'Satisfaccion reportada' },
    { value: '1', label: 'Ciudad, Yopal (Casanare)' },
  ];

  readonly values = [
    {
      icon: 'shield',
      title: 'Confianza primero',
      text: 'Verificamos identidad y referencias antes de publicar cualquier perfil de empleado.',
    },
    {
      icon: 'circle-check',
      title: 'Transparencia',
      text: 'Precios, horarios y condiciones claras desde la primera conversacion, sin letra pequena.',
    },
    {
      icon: 'heart',
      title: 'Cercania',
      text: 'Somos un equipo local que conoce Yopal y acompana a cada usuario en su proceso.',
    },
    {
      icon: 'zap',
      title: 'Simplicidad',
      text: 'Publicar una oferta o encontrar trabajo toma minutos, no dias.',
    },
  ];

  readonly team = [
    { nombre: 'Santiago Ricaurte', rol: 'Fundador & Producto' },
    { nombre: 'Equipo de Ingenieria', rol: 'Desarrollo y plataforma' },
    { nombre: 'Equipo de Soporte', rol: 'Atencion a usuarios' },
  ];
}
