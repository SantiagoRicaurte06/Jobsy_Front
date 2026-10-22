import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Employee, EmployeeReview, Paginated } from '../models';
import { ScheduleSlot } from './hiring.service';
import { MOCK_EMPLOYEES, mockResponse, paginate } from '../../mocks';

/** Usuarios_Api — busqueda, perfiles, resenas y disponibilidad de empleados. */
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

  // ============================================================
  //  Resenas
  // ============================================================

  /**
   * Resenas que ha recibido esa persona.
   *
   * Antes vivian en localStorage: solo las veia quien las escribia, y el
   * perfil mostraba ademas tres de ejemplo fijas.
   */
  reviews(employeeId: string): Observable<EmployeeReview[]> {
    if (environment.useMocks) return mockResponse<EmployeeReview[]>([]);
    return this.api.get<EmployeeReview[]>(`${this.path}/empleados/${employeeId}/resenas`);
  }

  /**
   * Publica una resena.
   *
   * El servidor solo la acepta si ambos comparten una postulacion, es decir,
   * si de verdad trabajaron juntos.
   */
  addReview(data: {
    sobreUsuarioId: string;
    calificacion: number;
    comentario: string;
    postulacionId?: string;
  }): Observable<EmployeeReview> {
    return this.api.post<EmployeeReview>(`${this.path}/resenas`, data);
  }

  // ============================================================
  //  Disponibilidad
  // ============================================================

  /** Franjas en las que esa persona puede trabajar. */
  availability(employeeId: string): Observable<ScheduleSlot[]> {
    if (environment.useMocks) return mockResponse<ScheduleSlot[]>([]);
    return this.api.get<ScheduleSlot[]>(`${this.path}/empleados/${employeeId}/disponibilidad`);
  }

  /** Franjas propias, para el empleado que edita su agenda. */
  myAvailability(): Observable<ScheduleSlot[]> {
    return this.api.get<ScheduleSlot[]>(`${this.path}/disponibilidad`);
  }

  setMyAvailability(franjas: ScheduleSlot[]): Observable<ScheduleSlot[]> {
    return this.api.put<ScheduleSlot[]>(`${this.path}/disponibilidad`, franjas);
  }
}
