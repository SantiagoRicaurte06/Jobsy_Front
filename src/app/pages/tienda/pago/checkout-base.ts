import { inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService, CartService, PaymentDetails } from '../../../core/services';
import { PaymentMethod } from '../../../core/models';

/**
 * Parte comun de las cuatro pantallas de pago.
 *
 * Antes cada una llamaba a checkout() y navegaba en el `next` sin mirar el
 * error ni la respuesta: un pago rechazado por la pasarela, o un producto sin
 * stock, dejaba al usuario en "Mi cuenta" creyendo que habia comprado, y con
 * el carrito ya vaciado. PSE ademas devuelve una URL a la que hay que ir, y
 * se ignoraba.
 */
export abstract class CheckoutBase {
  protected orderService = inject(OrderService);
  protected cart = inject(CartService);
  protected router = inject(Router);

  readonly procesando = signal(false);
  readonly error = signal('');

  /**
   * Cobra y decide a donde ir.
   *
   * - aprobado  -> a Mis pedidos, con el carrito vacio
   * - pendiente -> al portal del banco si lo hay; si no, a los pedidos
   * - rechazado -> se queda aqui y lo dice
   */
  protected pagarCon(metodo: PaymentMethod, datos: PaymentDetails = {}): void {
    if (this.cart.isEmpty()) {
      this.error.set('Tu carrito esta vacio.');
      return;
    }
    this.procesando.set(true);
    this.error.set('');

    this.orderService.checkout(this.cart.items(), metodo, datos).subscribe({
      next: (pedido) => {
        this.procesando.set(false);

        if (pedido.estadoPago === 'rechazado') {
          this.error.set('La entidad rechazo el pago. Prueba con otro metodo.');
          return;
        }

        // El pedido ya existe: lo comprado no debe seguir en el carrito.
        this.cart.clear();

        if (pedido.urlRedireccion) {
          window.location.href = pedido.urlRedireccion;
          return;
        }
        this.router.navigate(['/app/pedidos'], {
          queryParams: { pedido: pedido.numero },
        });
      },
      error: (e: HttpErrorResponse) => {
        this.procesando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos procesar el pago.');
      },
    });
  }
}
