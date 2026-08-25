import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-login-success',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './ingreso-exitoso.html',
  styleUrl: './ingreso-exitoso.scss',
})
export class LoginSuccessPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);
  private timer?: ReturnType<typeof setInterval>;

  readonly user = this.auth.user;
  readonly seconds = signal(3);

  ngOnInit(): void {
    // Redirige automaticamente al area privada.
    this.timer = setInterval(() => {
      this.seconds.update((s) => s - 1);
      if (this.seconds() <= 0) this.go();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  go(): void {
    clearInterval(this.timer);
    this.router.navigate(['/app/inicio']);
  }
}
