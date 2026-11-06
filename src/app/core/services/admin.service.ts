import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Product, Category, Order, Report, ReportMessage, ReportStatus } from '../models';
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

export interface RefundResult {
  pedidoId: string;
  pagoId?: string;
  monto: number;
  estado: string;
  mensaje: string;
  stockRepuesto: boolean;
}

/**
 * Alta y edicion de producto.
 *
 * El SKU no viaja: la tabla no tiene esa columna y el servidor lo deriva del
 * id. En la edicion solo se mandan los campos que cambian.
 */
export interface ProductPayload {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  imagenUrl?: string;
  estado?: string;
}

/**
 * Tienda_APi / Soporte_API — panel de administracion.
 *
 * Las rutas /admin exigen rol de administrador en el servidor: el guard del
 * frontend lee el rol de localStorage y es manipulable.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;
  private soporte = environment.endpoints.soporte;

  // ---- Indicadores ----

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

  salesByMonth(ano = new Date().getFullYear()): Observable<SalesPoint[]> {
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

  /**
   * Devuelve el dinero de un pedido cobrado (pagado, enviado o entregado) y
   * repone su stock. El servidor rechaza los que no estan cobrados.
   */
  refundOrder(id: string, motivo: string): Observable<RefundResult> {
    if (environment.useMocks) {
      return mockResponse({ pedidoId: id, monto: 0, estado: 'reembolsado', mensaje: 'Reembolso simulado.', stockRepuesto: true });
    }
    return this.api.post<RefundResult>(`${this.path}/admin/pedidos/${id}/reembolsar`, { motivo });
  }

  // ---- Catalogo ----

  /** Incluye los productos en borrador, que la tienda publica no muestra. */
  products(): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.path}/admin/productos`);
  }

  createProduct(data: ProductPayload): Observable<Product> {
    return this.api.post<Product>(`${this.path}/admin/productos`, data);
  }

  updateProduct(id: string, cambios: ProductPayload): Observable<Product> {
    return this.api.put<Product>(`${this.path}/admin/productos/${id}`, cambios);
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/admin/productos/${id}`);
  }

  /** Suma o resta unidades. El servidor no deja bajar de cero. */
  adjustStock(id: string, delta: number): Observable<Product> {
    return this.api.post<Product>(`${this.path}/admin/productos/${id}/stock`, { delta });
  }

  createCategory(nombre: string): Observable<Category> {
    return this.api.post<Category>(`${this.path}/admin/categorias`, { nombre });
  }

  renameCategory(id: string, nombre: string): Observable<Category> {
    return this.api.put<Category>(`${this.path}/admin/categorias/${id}`, { nombre });
  }

  deleteCategory(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/admin/categorias/${id}`);
  }

  // ---- Soporte ----

  /** Reportes de todos los usuarios, no solo los propios. */
  reports(): Observable<Report[]> {
    return this.api.get<Report[]>(`${this.soporte}/admin/reportes`);
  }

  reportMessages(id: string): Observable<ReportMessage[]> {
    return this.api.get<ReportMessage[]>(`${this.soporte}/admin/reportes/${id}/mensajes`);
  }

  replyToReport(id: string, texto: string): Observable<ReportMessage> {
    return this.api.post<ReportMessage>(`${this.soporte}/admin/reportes/${id}/mensajes`, { texto });
  }

  setReportStatus(id: string, estado: ReportStatus): Observable<Report> {
    return this.api.put<Report>(`${this.soporte}/admin/reportes/${id}/estado`, { estado });
  }

  /** Oculta el reporte. El hilo se conserva: es el rastro de la atencion. */
  removeReport(id: string): Observable<void> {
    return this.api.delete<void>(`${this.soporte}/admin/reportes/${id}`);
  }
}
