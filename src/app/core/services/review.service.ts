import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { ProductReview } from '../models';
import { mockResponse } from '../../mocks';

/**
 * Tienda_APi — opiniones de productos.
 *
 * Antes vivian en localStorage (solo las veia quien las escribia) junto a
 * unas resenas de ejemplo fijas. Ahora las guarda el servidor; el autor sale
 * de la sesion y la marca de compra verificada la pone el servidor.
 */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;

  /** Limite de fotos por resena; el servidor rechaza mas. */
  readonly maxFotos = 3;

  getByProductId(productId: string): Observable<ProductReview[]> {
    if (environment.useMocks) return mockResponse<ProductReview[]>([]);
    return this.api.get<ProductReview[]>(`${this.path}/productos/${productId}/resenas`);
  }

  addReview(productId: string, data: { calificacion: number; titulo: string; comentario: string; fotos: File[] }): Observable<ProductReview> {
    const form = new FormData();
    form.append('calificacion', String(data.calificacion));
    form.append('titulo', data.titulo.trim());
    form.append('comentario', data.comentario.trim());
    for (const f of data.fotos) form.append('fotos', f);
    return this.api.post<ProductReview>(`${this.path}/productos/${productId}/resenas`, form);
  }
}
