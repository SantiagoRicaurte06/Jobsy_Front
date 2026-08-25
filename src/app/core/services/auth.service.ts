import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models';
import { RegistrationDraft, UsuarioRegistrado } from './registration.service';
import { MOCK_USERS, mockResponse } from '../../mocks';

const STORAGE_KEY = 'jobsy_session';
/** "Base de datos" simulada de registros; persiste en localStorage como JSON. */
const USUARIOS_KEY = 'jobsy_usuarios';

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

  /**
   * Alta de usuario. Recibe el formulario completo del asistente de registro.
   * En modo mock simula que Usuarios_Api recibe y guarda el registro:
   * lo persiste en localStorage (jobsy_usuarios) como un JSON con todos los datos.
   */
  register(draft: RegistrationDraft): Observable<User> {
    const rol: UserRole = draft.rol ?? 'empleado';
    const user: User = {
      id: `u${Date.now()}`,
      nombre: draft.nombre,
      apellido: draft.apellido,
      email: draft.email,
      rol,
      verificado: false,
      fotoUrl: draft.fotoUrl || undefined,
      ciudad: draft.ciudad || undefined,
      fechaRegistro: new Date().toISOString(),
    };

    if (environment.useMocks) {
      // Guarda el registro completo (todo lo que rellenó el formulario).
      this.guardarUsuario({ ...draft, rol, id: user.id, fechaRegistro: user.fechaRegistro, verificado: false });
      return mockResponse(user);
    }

    // API real: el contrato de Usuarios_Api es RegisterRequest.
    const payload: RegisterRequest = {
      nombre: draft.nombre, apellido: draft.apellido, email: draft.email,
      password: draft.password, rol,
    };
    return this.api.post<User>(`${environment.endpoints.usuarios}/registro`, payload);
  }

  /** Registros guardados en el "backend" simulado (localStorage). */
  usuariosRegistrados(): UsuarioRegistrado[] {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(USUARIOS_KEY) : null;
    return raw ? (JSON.parse(raw) as UsuarioRegistrado[]) : [];
  }

  private guardarUsuario(usuario: UsuarioRegistrado): void {
    const usuarios = this.usuariosRegistrados();
    usuarios.push(usuario);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
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
