import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Order, PaymentMethod, CartItem, Coupon } from '../models';
import { mockResponse } from '../../mocks';

/**
 * Datos del instrumento con el que se cobra.
 *
 * Son opcionales porque no todos los metodos los usan: una tarjeta necesita
 * titular y ultimos digitos, PSE el banco y el tipo de cuenta, una billetera
 * el correo o el telefono, y el saldo Jobsy ninguno.
 *
 * El numero completo de la tarjeta NO viaja: solo los cuatro ultimos digitos.
 */
export interface PaymentDetails {
  cupon?: string;
  titular?: string;
  ultimos4?: string;
  banco?: string;
  tipoCuenta?: string;
  correo?: string;
}

/** Tienda_APi — pedidos y pasarela de pago (PSE, tarjeta, billetera, saldo). */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;

  /**
   * Cierra la compra.
   *
   * Los precios que van en `items` los ignora el servidor: los relee del
   * catalogo, porque el carrito del navegador puede traerlos caducados o
   * manipulados.
   */
  checkout(
    items: CartItem[],
    metodoPago: PaymentMethod,
    datos: PaymentDetails = {},
  ): Observable<Order> {
    if (environment.useMocks) {
      const order: Order = {
        id: `o${Date.now()}`,
        numero: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        items: items.map((i) => ({
          productId: i.product.id,
          nombre: i.product.nombre,
          cantidad: i.cantidad,
          precio: i.product.precio,
        })),
        total: items.reduce((n, i) => n + i.product.precio * i.cantidad, 0),
        estado: 'pendiente',
        metodoPago,
        fecha: new Date().toISOString(),
      };
      return mockResponse(order, 900);
    }
    return this.api.post<Order>(`${this.path}/pedidos`, { items, metodoPago, ...datos });
  }

  myOrders(): Observable<Order[]> {
    if (environment.useMocks) return mockResponse<Order[]>([]);
    return this.api.get<Order[]>(`${this.path}/pedidos/mios`);
  }

  /** Comprueba un cupon contra un subtotal y devuelve el descuento resuelto. */
  validateCoupon(codigo: string, subtotal: number): Observable<Coupon> {
    return this.api.post<Coupon>(`${this.path}/cupones/validar`, { codigo, subtotal });
  }
}
