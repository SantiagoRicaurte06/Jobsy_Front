import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Product, Category, Paginated } from '../models';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, mockResponse, paginate } from '../../mocks';

/** Tienda_APi / Catalogo_api — productos y categorias. */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private tienda = environment.endpoints.tienda;
  private catalogo = environment.endpoints.catalogo;

  list(categoria?: string, page = 1, pageSize = 9): Observable<Paginated<Product>> {
    if (environment.useMocks) {
      // La tienda publica no muestra borradores (igual que el middleware).
      const visibles = MOCK_PRODUCTS.filter((p) => p.estado !== 'borrador');
      const items = categoria ? visibles.filter((p) => p.categoria === categoria) : visibles;
      return mockResponse(paginate(items, page, pageSize));
    }
    return this.api.get<Paginated<Product>>(`${this.tienda}/productos`, { categoria: categoria ?? '', page, pageSize });
  }

  getById(id: string): Observable<Product | undefined> {
    if (environment.useMocks) return mockResponse(MOCK_PRODUCTS.find((p) => p.id === id));
    return this.api.get<Product>(`${this.tienda}/productos/${id}`);
  }

  categories(): Observable<Category[]> {
    if (environment.useMocks) return mockResponse(MOCK_CATEGORIES);
    return this.api.get<Category[]>(`${this.catalogo}/categorias`);
  }
}
