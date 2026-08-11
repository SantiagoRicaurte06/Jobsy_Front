import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Order, PaymentMethod, CartItem } from '../models';
import { mockResponse } from '../../mocks';

/** Tienda_APi — pedidos y pasarela de pago (PSE, tarjeta, billetera, saldo Jobsy). */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;

  checkout(items: CartItem[], metodoPago: PaymentMethod): Observable<Order> {
    if (environment.useMocks) {
      const order: Order = {
        id: `o${Date.now()}`,
        numero: `#PED-${Math.floor(1000 + Math.random() * 9000)}`,
        items: items.map((i) => ({ productId: i.product.id, nombre: i.product.nombre, cantidad: i.cantidad, precio: i.product.precio })),
        total: items.reduce((n, i) => n + i.product.precio * i.cantidad, 0),
        estado: 'pendiente',
        metodoPago,
        fecha: new Date().toISOString(),
      };
      return mockResponse(order, 900);
    }
    return this.api.post<Order>(`${this.path}/pedidos`, { items, metodoPago });
  }

  myOrders(): Observable<Order[]> {
    if (environment.useMocks) return mockResponse<Order[]>([]);
    return this.api.get<Order[]>(`${this.path}/pedidos/mios`);
  }
}
