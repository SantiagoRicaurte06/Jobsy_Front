import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/** Saldo de la cuenta Jobsy (tienda.saldo_jobsy). */
export interface Balance {
  disponible: number;
  totalGanado: number;
  totalRetirado: number;
  moneda: string;
}

/** Un pago del historial (tienda.pagos). */
export interface PaymentRecord {
  id: string;
  monto: number;
  moneda: string;
  estado: string;
  referencia: string;
  fecha: string;
  pedidoId?: string;
  ultimos4?: string;
  metodo?: string;
}

/** Metodo de pago guardado. El numero completo no sale del servidor. */
export interface SavedPaymentMethod {
  id: string;
  metodoId: string;
  alias: string;
  enmascarado: string;
  esPrincipal: boolean;
}

/** Metodo de pago que la plataforma acepta ahora mismo. */
export interface PaymentOption {
  id: string;
  nombre: string;
  disponible: boolean;
  requiereCVV: boolean;
  redirige: boolean;
}

/**
 * Tienda_APi — monedero, historial de pagos y metodos guardados.
 *
 * La pantalla de saldo mostraba 150.000 pesos fijos y tres movimientos
 * escritos en el codigo; la de metodos de pago, tres tarjetas de ejemplo cuyos
 * botones no hacian nada.
 */
@Injectable({ providedIn: 'root' })
export class WalletService {
  private api = inject(ApiService);
  private path = environment.endpoints.tienda;

  balance(): Observable<Balance> {
    return this.api.get<Balance>(`${this.path}/saldo`);
  }

  payments(): Observable<PaymentRecord[]> {
    return this.api.get<PaymentRecord[]>(`${this.path}/pagos/mios`);
  }

  /** Metodos que la plataforma acepta (tarjeta, PSE, Nequi...). */
  options(): Observable<PaymentOption[]> {
    return this.api.get<PaymentOption[]>(`${this.path}/metodos-pago`);
  }

  savedMethods(): Observable<SavedPaymentMethod[]> {
    return this.api.get<SavedPaymentMethod[]>(`${this.path}/metodos-guardados`);
  }

  saveMethod(data: {
    metodoId: string;
    alias: string;
    numeroCuenta: string;
    esPrincipal: boolean;
  }): Observable<SavedPaymentMethod> {
    return this.api.post<SavedPaymentMethod>(`${this.path}/metodos-guardados`, data);
  }

  deleteMethod(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/metodos-guardados/${id}`);
  }
}
