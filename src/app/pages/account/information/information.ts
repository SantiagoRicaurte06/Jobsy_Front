import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService, OrderService } from '../../../core/services';
import { User, Order } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-account-info',
  standalone: true,
  imports: [RouterLink, CopPipe, LoadingSpinnerComponent],
  templateUrl: './account-info.html',
  styleUrl: './account-info.scss',
})
export class AccountInfoPage implements OnInit {
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);

  readonly user = signal<User | undefined>(undefined);
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.profileService.me().subscribe((u) => {
      this.user.set(u);
      this.loading.set(false);
    });

    this.orderService.myOrders().subscribe((o) => this.orders.set(o));
  }

  badgeClass(estado: string): string {
    if (estado === 'entregado') return 'badge-success';
    if (estado === 'enviado') return 'badge-info';
    if (estado === 'cancelado') return 'badge-danger';
    return 'badge-warning';
  }
}
