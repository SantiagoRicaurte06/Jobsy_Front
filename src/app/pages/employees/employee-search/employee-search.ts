import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services';
import { Employee } from '../../../core/models';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-employee-search',
  standalone: true,
  imports: [
    RouterLink,
    EmployeeCardComponent,
    SearchBarComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './employee-search.html',
  styleUrl: './employee-search.scss',
})
export class EmployeeSearchPage implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly busqueda = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.employeeService.list(this.busqueda(), this.page(), 6).subscribe((res) => {
      this.employees.set(res.items);
      this.totalPages.set(res.totalPages);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  buscar(event: { termino: string }): void {
    this.busqueda.set(event.termino);
    this.page.set(1);
    this.load();
  }

  changePage(p: number): void {
    this.page.set(p);
    this.load();
  }

  solicitar(employee: Employee): void {
    this.router.navigate(['/contratacion', employee.id]);
  }
}
