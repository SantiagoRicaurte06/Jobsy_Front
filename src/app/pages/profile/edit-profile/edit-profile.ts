import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-edit-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfilePage implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly guardado = signal(false);

  readonly nombre = signal('');
  readonly apellido = signal('');
  readonly email = signal('');
  readonly telefono = signal('');
  readonly ciudad = signal('');
  readonly descripcion = signal('');
  readonly especialidades = signal<string[]>([]);

  readonly ciudades = ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva', 'Monterrey'];
  readonly opcionesEspecialidad = [
    'Limpieza profunda', 'Cocina', 'Planchado', 'Zonas verdes',
    'Cuidado de ninos', 'Cuidado de adultos', 'Mascotas', 'Bioseguridad',
  ];

  ngOnInit(): void {
    this.profileService.me().subscribe((u) => {
      if (u) {
        this.nombre.set(u.nombre);
        this.apellido.set(u.apellido);
        this.email.set(u.email);
        this.telefono.set(u.telefono ?? '');
        this.ciudad.set(u.ciudad ?? 'Yopal');
      }
      this.loading.set(false);
    });
  }

  toggleEspecialidad(e: string): void {
    this.especialidades.update((list) =>
      list.includes(e) ? list.filter((x) => x !== e) : [...list, e],
    );
  }

  submit(): void {
    this.saving.set(true);

    this.profileService
      .update({
        nombre: this.nombre(),
        apellido: this.apellido(),
        telefono: this.telefono(),
        ciudad: this.ciudad(),
      })
      .subscribe(() => {
        this.saving.set(false);
        this.guardado.set(true);
        setTimeout(() => this.router.navigate(['/app/perfil']), 1200);
      });
  }
}
