import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/** Aviso de la bandeja del usuario (usuarios.notificaciones). */
export interface Notification {
  id: string;
  titulo: string;
  cuerpo: string;
  leida: boolean;
  destino?: string;
  fecha: string;
}

/** Usuarios_Api — bandeja de avisos. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  private path = environment.endpoints.usuarios;

  private _items = signal<Notification[]>([]);
  readonly items = this._items.asReadonly();
  readonly sinLeer = computed(() => this._items().filter((n) => !n.leida).length);

  /** Recarga la bandeja. Sin sesion el servidor responde 401 y se ignora. */
  refresh(): void {
    if (environment.useMocks) return;
    this.api.get<Notification[]>(`${this.path}/notificaciones`).subscribe({
      next: (items) => this._items.set(items ?? []),
      error: () => this._items.set([]),
    });
  }

  markRead(id: string): void {
    const antes = this._items();
    this._items.update((list) => list.map((n) => (n.id === id ? { ...n, leida: true } : n)));
    this.api
      .post<void>(`${this.path}/notificaciones/${id}/leida`, {})
      .pipe(tap({ error: () => this._items.set(antes) }))
      .subscribe({ error: () => {} });
  }

  clear(): void {
    this._items.set([]);
  }
}
