import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services';
import { Job } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-job-detail',
  standalone: true,
  imports: [RouterLink, CopPipe, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetailPage implements OnInit {
  private jobService = inject(JobService);

  /** Llega desde la ruta gracias a withComponentInputBinding(). */
  readonly id = input.required<string>();

  readonly job = signal<Job | undefined>(undefined);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.jobService.getById(this.id()).subscribe((job) => {
      this.job.set(job);
      this.loading.set(false);
    });
  }
}
