import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService, OrderService } from '../../../core/services';
import { User, Order } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-account-info',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, DatePipe],
  templateUrl: './informacion.html',
  styleUrl: './informacion.scss',
})
export class AccountInfoPage implements OnInit {
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);

  readonly user = signal<User | undefined>(undefined);
  readonly orders = signal<Order[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.profileService.me().subscribe((u) => {
      this.user.set(u);
      this.cargando.set(false);
    });

    // El mas reciente primero, para el resumen.
    this.orderService.myOrders().subscribe((o) => this.orders.set([...(o ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha))));
  }

}
