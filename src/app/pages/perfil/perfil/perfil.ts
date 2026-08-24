import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services';
import { User } from '../../../core/models';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-profile',
  standalone: true,
  imports: [RouterLink, RatingStarsComponent, LoadingSpinnerComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class ProfilePage implements OnInit {
  private profileService = inject(ProfileService);

  readonly user = signal<User | undefined>(undefined);
  readonly loading = signal(true);

  /** TEMPORAL: datos de perfil publico hasta que el backend los exponga. */
  readonly especialidades = ['Limpieza profunda', 'Cocina', 'Planchado'];
  readonly calificacion = 5.0;
  readonly servicios = 23;

  ngOnInit(): void {
    this.profileService.me().subscribe((u) => {
      this.user.set(u);
      this.loading.set(false);
    });
  }
}
