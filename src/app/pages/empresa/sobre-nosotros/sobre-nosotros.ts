import { Component, inject, signal } from '@angular/core';
import { JobService, EmployeeService } from '../../../core/services';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';

/**
 * Página institucional: historia, misión y valores de Jobsy. Las cifras
 * salen de la API (totales reales), no de números escritos a mano.
 */
@Component({
  selector: 'jobsy-sobre-nosotros',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
})
export class AboutPage {
  readonly stats = signal<{ value: string; label: string }[]>([]);

  constructor() {
    let ofertas: number | null = null;
    let personas: number | null = null;
    const pintar = () => {
      const s: { value: string; label: string }[] = [];
      if (ofertas) s.push({ value: String(ofertas), label: ofertas === 1 ? 'Oferta abierta' : 'Ofertas abiertas' });
      if (personas) s.push({ value: String(personas), label: personas === 1 ? 'Persona con perfil' : 'Personas con perfil' });
      s.push({ value: '1', label: 'Ciudad: Yopal, Casanare' });
      this.stats.set(s);
    };
    pintar();
    inject(JobService).list({}, 1, 1).subscribe({ next: (r) => { ofertas = r.total; pintar(); }, error: () => {} });
    inject(EmployeeService).list('', 1, 1).subscribe({ next: (r) => { personas = r.total; pintar(); }, error: () => {} });
  }

  readonly values = [
    {
      icon: 'shield',
      title: 'Confianza primero',
      text: 'Verificamos identidad y referencias antes de publicar cualquier perfil de empleado.',
    },
    {
      icon: 'circle-check',
      title: 'Transparencia',
      text: 'Precios, horarios y condiciones claras desde la primera conversación, sin letra pequeña.',
    },
    {
      icon: 'heart',
      title: 'Cercanía',
      text: 'Somos un equipo local que conoce Yopal y acompaña a cada usuario en su proceso.',
    },
    {
      icon: 'zap',
      title: 'Simplicidad',
      text: 'Publicar una oferta o encontrar trabajo toma minutos, no días.',
    },
  ];

  readonly team = [
    { nombre: 'Santiago Ricaurte', rol: 'Fundador & Producto' },
    { nombre: 'Equipo de Ingeniería', rol: 'Desarrollo y plataforma' },
    { nombre: 'Equipo de Soporte', rol: 'Atención a usuarios' },
  ];
}
