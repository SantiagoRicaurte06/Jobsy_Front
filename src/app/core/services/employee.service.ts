import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Employee, Paginated } from '../models';
import { MOCK_EMPLOYEES, mockResponse, paginate } from '../../mocks';

/** Usuarios_Api — busqueda y perfiles de empleados. */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private api = inject(ApiService);
  private path = environment.endpoints.usuarios;

  list(busqueda = '', page = 1, pageSize = 6): Observable<Paginated<Employee>> {
    if (environment.useMocks) {
      const q = busqueda.toLowerCase();
      const items = q
        ? MOCK_EMPLOYEES.filter((e) => e.nombre.toLowerCase().includes(q) || e.especialidades.some((s) => s.toLowerCase().includes(q)))
        : [...MOCK_EMPLOYEES];
      return mockResponse(paginate(items, page, pageSize));
    }
    return this.api.get<Paginated<Employee>>(`${this.path}/empleados`, { busqueda, page, pageSize });
  }

  getById(id: string): Observable<Employee | undefined> {
    if (environment.useMocks) return mockResponse(MOCK_EMPLOYEES.find((e) => e.id === id));
    return this.api.get<Employee>(`${this.path}/empleados/${id}`);
  }

  featured(limit = 3): Observable<Employee[]> {
    if (environment.useMocks) return mockResponse(MOCK_EMPLOYEES.slice(0, limit));
    return this.api.get<Employee[]>(`${this.path}/empleados/destacados`, { limit });
  }
}
