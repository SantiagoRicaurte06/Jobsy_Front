/** Tienda_APi — pedidos y pagos */

/**
 * Metodos que acepta la plataforma.
 *
 * Son los nombres de tienda.metodo_pago, que es contra lo que el servidor los
 * resuelve. Antes la lista incluia 'billetera', que no existe alli: pagar con
 * billetera fallaba siempre con "Ese metodo de pago no esta disponible". Las
 * billeteras son nequi y daviplata, cada una por su nombre.
 */
export type PaymentMethod = 'pse' | 'tarjeta' | 'nequi' | 'daviplata' | 'saldo_jobsy';

export type OrderStatus =
  | 'pendiente'
  | 'pagado'
  | 'procesando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'reembolsado';

export interface OrderItem {
  productId: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Order {
  id: string;
  numero: string;
  items: OrderItem[];
  total: number;
  estado: OrderStatus;
  metodoPago: PaymentMethod | '';
  fecha: string;

  // Desglose y resultado del cobro. Los manda el servidor al pagar; el
  // historial no los trae.
  subtotal?: number;
  descuento?: number;
  envio?: number;
  pagoId?: string;
  estadoPago?: string;
  /** PSE saca al usuario del sitio: si viene, hay que seguirla. */
  urlRedireccion?: string;
  /** A quien y a donde se lleva; los pedidos antiguos no lo tienen. */
  entrega?: DeliveryInfo;
}

/** Datos para entregar un pedido de la tienda. */
export interface DeliveryInfo {
  nombre: string;
  telefono: string;
  direccion: string;
  /** Apartamento, torre, casa o interior. */
  detalle?: string;
  barrio?: string;
  ciudad: string;
  /** Indicaciones para quien entrega: porteria, horario, referencias. */
  notas?: string;
}

/** Cupon ya resuelto para un subtotal concreto. */
export interface Coupon {
  id: string;
  codigo: string;
  descuento: number;
  porcentaje?: number;
}
