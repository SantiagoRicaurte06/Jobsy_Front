/** Tienda_APi — pedidos y pagos */
export type PaymentMethod = 'pse' | 'tarjeta' | 'billetera' | 'saldo_jobsy';
export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  numero: string;
  items: { productId: string; nombre: string; cantidad: number; precio: number }[];
  total: number;
  estado: OrderStatus;
  metodoPago: PaymentMethod;
  fecha: string;
}
