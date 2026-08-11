import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Plan, Subscription } from '../models';
import { MOCK_PLANS, mockResponse } from '../../mocks';

/** suscripciones_API — planes y suscripcion activa. */
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private api = inject(ApiService);
  private path = environment.endpoints.suscripciones;

  plans(): Observable<Plan[]> {
    if (environment.useMocks) return mockResponse(MOCK_PLANS);
    return this.api.get<Plan[]>(`${this.path}/planes`);
  }

  current(): Observable<Subscription | null> {
    if (environment.useMocks) {
      return mockResponse<Subscription>({
        id: 's1', userId: 'u2', planId: 'pl1', activa: true,
        fechaInicio: '2026-02-01', fechaRenovacion: '2026-09-01',
      });
    }
    return this.api.get<Subscription | null>(`${this.path}/mi-suscripcion`);
  }

  subscribe(planId: string): Observable<Subscription> {
    if (environment.useMocks) {
      return mockResponse<Subscription>({
        id: `s${Date.now()}`, userId: 'u2', planId, activa: true,
        fechaInicio: new Date().toISOString(), fechaRenovacion: new Date().toISOString(),
      });
    }
    return this.api.post<Subscription>(`${this.path}/suscribir`, { planId });
  }
}
