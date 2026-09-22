import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';

interface Vacante {
  id: string;
  cargo: string;
  area: string;
  ciudad: string;
  modalidad: string;
}

/** Vacantes y cultura del equipo de Jobsy (carreras corporativas, no ofertas de hogar). */
@Component({
  selector: 'jobsy-trabaja-con-nosotros',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './trabaja-con-nosotros.html',
  styleUrl: './trabaja-con-nosotros.scss',
})
export class CareersPage {
  readonly beneficios = [
    { icon: 'house', title: 'Trabajo hibrido', text: 'Oficina en Yopal con dias remotos.' },
    { icon: 'trending-up', title: 'Crecimiento real', text: 'Equipo pequeno, mucho impacto directo.' },
    { icon: 'heart', title: 'Bienestar', text: 'Tiempo libre remunerado y horarios flexibles.' },
    { icon: 'sparkles', title: 'Aprendizaje', text: 'Presupuesto para cursos y certificaciones.' },
  ];

  readonly vacantes: Vacante[] = [
    { id: 'v1', cargo: 'Desarrollador/a Frontend Angular', area: 'Ingenieria', ciudad: 'Yopal / Remoto', modalidad: 'Tiempo completo' },
    { id: 'v2', cargo: 'Ejecutivo/a de Soporte al Cliente', area: 'Soporte', ciudad: 'Yopal', modalidad: 'Tiempo completo' },
    { id: 'v3', cargo: 'Analista de Verificacion de Perfiles', area: 'Confianza y Seguridad', ciudad: 'Yopal', modalidad: 'Tiempo completo' },
    { id: 'v4', cargo: 'Community Manager', area: 'Marketing', ciudad: 'Remoto', modalidad: 'Medio tiempo' },
  ];
}
