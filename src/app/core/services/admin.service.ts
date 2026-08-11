import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Product, Order } from '../models';
import { MOCK_PRODUCTS, mockResponse } from '../../mocks';

/** KPIs del dashboard de administracion. */
export interface AdminStats {
  ventasMes: number;
  pedidosMes: number;
  clientesRegistrados: number;
  calificacionPromedio: number;
  ingresosHoy: number;
  pedidosHoy: number;
  stockCritico: number;
  satisfaccion: number;
}

export interface SalesPoint {
  mes: string;
  ventas: number;
}

/** Core_api / Tienda_APi — panel de administracion. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;

  stats(): Observable<AdminStats> {
    if (environment.useMocks) {
      return mockResponse<AdminStats>({
        ventasMes: 4200000, pedidosMes: 147, clientesRegistrados: 312,
        calificacionPromedio: 4.9, ingresosHoy: 1440000, pedidosHoy: 23,
        stockCritico: 4, satisfaccion: 98,
      });
    }
    return this.api.get<AdminStats>(`${this.path}/admin/estadisticas`);
  }

  salesByMonth(ano = 2026): Observable<SalesPoint[]> {
    if (environment.useMocks) {
      return mockResponse<SalesPoint[]>([
        { mes: 'Ene', ventas: 1800000 }, { mes: 'Feb', ventas: 2400000 },
        { mes: 'Mar', ventas: 3100000 }, { mes: 'Abr', ventas: 2200000 },
        { mes: 'May', ventas: 4200000 }, { mes: 'Jun', ventas: 2900000 },
        { mes: 'Jul', ventas: 0 }, { mes: 'Ago', ventas: 0 },
      ]);
    }
    return this.api.get<SalesPoint[]>(`${this.path}/admin/ventas`, { ano });
  }

  topProducts(limit = 4): Observable<Product[]> {
    if (environment.useMocks) return mockResponse(MOCK_PRODUCTS.slice(0, limit));
    return this.api.get<Product[]>(`${this.path}/admin/productos-top`, { limit });
  }

  recentOrders(limit = 4): Observable<Order[]> {
    if (environment.useMocks) return mockResponse<Order[]>([]);
    return this.api.get<Order[]>(`${this.path}/admin/pedidos-recientes`, { limit });
  }
}
