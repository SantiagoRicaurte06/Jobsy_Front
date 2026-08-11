import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models';
import { MOCK_USERS, mockResponse } from '../../mocks';

const STORAGE_KEY = 'jobsy_session';

/** Usuarios_Api — autenticacion y sesion. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);

  private _user = signal<User | null>(this.restore());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly role = computed<UserRole | null>(() => this._user()?.rol ?? null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (environment.useMocks) {
      const user = MOCK_USERS.find((u) => u.email === credentials.usuario) ?? MOCK_USERS[1];
      const res: LoginResponse = { token: 'mock-token', user };
      return mockResponse(res).pipe(tap((r) => this.persist(r)));
    }
    return this.api
      .post<LoginResponse>(`${environment.endpoints.usuarios}/login`, credentials)
      .pipe(tap((r) => this.persist(r)));
  }

  loginWithGoogle(): Observable<LoginResponse> {
    // TEMPORAL: integrar OAuth de Google contra Usuarios_Api
    if (environment.useMocks) {
      const res: LoginResponse = { token: 'mock-token-google', user: MOCK_USERS[1] };
      return mockResponse(res).pipe(tap((r) => this.persist(r)));
    }
    return throwError(() => new Error('OAuth de Google no implementado'));
  }

  register(data: RegisterRequest): Observable<User> {
    if (environment.useMocks) {
      const user: User = {
        id: `u${Date.now()}`, nombre: data.nombre, apellido: data.apellido,
        email: data.email, rol: data.rol, verificado: false,
        fechaRegistro: new Date().toISOString(),
      };
      return mockResponse(user);
    }
    return this.api.post<User>(`${environment.endpoints.usuarios}/registro`, data);
  }

  requestPasswordReset(email: string): Observable<void> {
    if (environment.useMocks) return mockResponse(undefined as void);
    return this.api.post<void>(`${environment.endpoints.usuarios}/recuperar`, { email });
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
  }

  get token(): string | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoginResponse).token : null;
  }

  private persist(res: LoginResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    this._user.set(res.user);
  }

  private restore(): User | null {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? (JSON.parse(raw) as LoginResponse).user : null;
  }
}
