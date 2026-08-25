import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../core/services';
import { Job, JobFilters } from '../../../core/models';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { FilterPanelComponent } from '../../../shared/components/filter-panel/filter-panel';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-job-search',
  standalone: true,
  imports: [
    RouterLink,
    JobCardComponent,
    FilterPanelComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './buscar-empleos.html',
  styleUrl: './buscar-empleos.scss',
})
export class JobSearchPage implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);

  readonly jobs = signal<Job[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly filters = signal<JobFilters>({});
  readonly showFilters = signal(false);

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) this.filters.set({ busqueda: q });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.jobService.list(this.filters(), this.page(), 6).subscribe((res) => {
      this.jobs.set(res.items);
      this.totalPages.set(res.totalPages);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  applyFilters(f: JobFilters): void {
    this.filters.set({ ...f, busqueda: this.filters().busqueda });
    this.page.set(1);
    this.load();
  }

  changePage(p: number): void {
    this.page.set(p);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }
}
