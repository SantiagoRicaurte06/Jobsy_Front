import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, JobService } from '../../../core/services';
import { Job, MODALIDAD_TEXTO, TAMANO_TEXTO } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-job-detail',
  standalone: true,
  imports: [
    DatePipe, LowerCasePipe, IconComponent, RouterLink, CopPipe,
    LoadingSpinnerComponent, EmptyStateComponent,
  ],
  templateUrl: './detalle-empleo.html',
  styleUrl: './detalle-empleo.scss',
})
export class JobDetailPage implements OnInit {
  private jobService = inject(JobService);
  private auth = inject(AuthService);

  /** Llega desde la ruta gracias a withComponentInputBinding(). */
  readonly id = input.required<string>();

  readonly job = signal<Job | undefined>(undefined);
  readonly cargando = signal(true);

  // La vista pintaba el valor crudo del enum: "jornada_completa" con guion
  // bajo, y "mediano" en masculino junto a "vivienda".
  readonly tamanoTexto = computed(() => {
    const j = this.job();
    return j ? TAMANO_TEXTO[j.tamano] : '';
  });

  readonly modalidadTexto = computed(() => {
    const j = this.job();
    return j ? MODALIDAD_TEXTO[j.modalidad] : '';
  });

  /**
   * Que ofrecer en el panel lateral. El dueño no se postula a su oferta: va a
   * gestionarla; otro empleador no puede postularse; una oferta pausada o
   * cerrada ya no recibe postulaciones.
   */
  readonly accion = computed<'propia' | 'empleador' | 'cerrada' | 'postular'>(() => {
    const j = this.job();
    const u = this.auth.user();
    if (j && u && j.empleadorId === u.id) return 'propia';
    if (u?.rol === 'empleador') return 'empleador';
    if (j?.estado && j.estado !== 'activa') return 'cerrada';
    return 'postular';
  });

  ngOnInit(): void {
    this.jobService.getById(this.id()).subscribe((job) => {
      this.job.set(job);
      this.cargando.set(false);
    });
  }
}
