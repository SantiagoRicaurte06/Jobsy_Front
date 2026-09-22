import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services';
import { Job, MODALIDAD_TEXTO, TAMANO_TEXTO } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-job-detail',
  standalone: true,
  imports: [DatePipe, LowerCasePipe, RouterLink, CopPipe, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetailPage implements OnInit {
  private jobService = inject(JobService);

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

  ngOnInit(): void {
    this.jobService.getById(this.id()).subscribe((job) => {
      this.job.set(job);
      this.cargando.set(false);
    });
  }
}
