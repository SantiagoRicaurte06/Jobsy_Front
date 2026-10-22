import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User, UserDocument, UserDocumentType } from '../models';
import { MOCK_USERS, mockResponse } from '../../mocks';

/** Usuarios_Api — perfil del usuario autenticado. */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ApiService);
  private path = environment.endpoints.usuarios;

  me(): Observable<User> {
    if (environment.useMocks) return mockResponse(MOCK_USERS[1]);
    return this.api.get<User>(`${this.path}/perfil`);
  }

  update(data: Partial<User>): Observable<User> {
    if (environment.useMocks) return mockResponse({ ...MOCK_USERS[1], ...data });
    return this.api.put<User>(`${this.path}/perfil`, data);
  }

  uploadPhoto(file: File): Observable<{ url: string }> {
    // TEMPORAL: subida real a storage via Usuarios_Api
    if (environment.useMocks) return mockResponse({ url: URL.createObjectURL(file) }, 800);
    const form = new FormData();
    form.append('foto', file);
    return this.api.post<{ url: string }>(`${this.path}/perfil/foto`, form);
  }

  /** Documentos subidos para verificar la identidad, con su estado de revision. */
  documents(): Observable<UserDocument[]> {
    if (environment.useMocks) return mockResponse([]);
    return this.api.get<UserDocument[]>(`${this.path}/documentos`);
  }

  uploadDocument(file: File, tipo: UserDocumentType): Observable<UserDocument> {
    if (environment.useMocks) {
      return mockResponse({ id: `d${Date.now()}`, tipo, archivoUrl: URL.createObjectURL(file), estado: 'pendiente' as const }, 800);
    }
    const form = new FormData();
    form.append('documento', file);
    form.append('tipo', tipo);
    return this.api.post<UserDocument>(`${this.path}/documentos`, form);
  }
}
