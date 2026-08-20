import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, LogoComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly email = signal('');
  readonly loading = signal(false);

  submit(): void {
    if (!this.email()) return;

    this.loading.set(true);
    this.auth.requestPasswordReset(this.email()).subscribe({
      next: () => this.router.navigate(['/auth/correo-enviado'], { queryParams: { email: this.email() } }),
      error: () => this.loading.set(false),
    });
  }
}
