import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services';
import { Plan, Subscription } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-account-plan',
  standalone: true,
  imports: [IconComponent, CopPipe, LoadingSpinnerComponent],
  templateUrl: './plan.html',
  styleUrl: './plan.scss',
})
export class AccountPlanPage implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  readonly plans = signal<Plan[]>([]);
  readonly current = signal<Subscription | null>(null);
  readonly loading = signal(true);
  readonly cambiando = signal<string | null>(null);

  /** Nombre del plan suscrito, resuelto contra el listado de planes. */
  readonly currentPlanName = computed(
    () => this.plans().find((p) => p.id === this.current()?.planId)?.nombre ?? 'Plan actual',
  );

  ngOnInit(): void {
    this.subscriptionService.plans().subscribe((p) => {
      this.plans.set(p);
      this.loading.set(false);
    });

    this.subscriptionService.current().subscribe((s) => this.current.set(s));
  }

  esActual(planId: string): boolean {
    return this.current()?.planId === planId;
  }

  cambiar(planId: string): void {
    this.cambiando.set(planId);
    this.subscriptionService.subscribe(planId).subscribe((s) => {
      this.current.set(s);
      this.cambiando.set(null);
    });
  }
}
