import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services';
import * as R from '../../../core/validation/reglas';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-edit-profile',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.scss',
})
export class EditProfilePage implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly guardado = signal(false);
  readonly error = signal('');
  readonly intentado = signal(false);

  readonly nombre = signal('');
  readonly apellido = signal('');
  readonly email = signal('');
  readonly telefono = signal('');
  readonly ciudad = signal('');
  readonly descripcion = signal('');
  readonly especialidades = signal<string[]>([]);

  readonly ciudades = R.CIUDADES;

  // El telefono es opcional, pero si se escribe tiene que ser valido.
  readonly errores = computed(() => ({
    nombre: R.nombrePersona('El nombre', this.nombre()),
    apellido: R.nombrePersona('El apellido', this.apellido()),
    telefono: this.telefono().trim() ? R.telefono(this.telefono()) : null,
  }));
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
      this.cargando.set(false);
    });
  }

  toggleEspecialidad(e: string): void {
    this.especialidades.update((list) =>
      list.includes(e) ? list.filter((x) => x !== e) : [...list, e],
    );
  }

  submit(): void {
    this.intentado.set(true);
    if (Object.values(this.errores()).some((e) => e)) {
      this.error.set('Revisa los campos marcados.');
      return;
    }
    this.error.set('');
    this.guardando.set(true);

    this.profileService
      .update({
        nombre: this.nombre().trim(),
        apellido: this.apellido().trim(),
        telefono: this.telefono(),
        ciudad: this.ciudad(),
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.guardado.set(true);
          setTimeout(() => this.router.navigate(['/app/perfil']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err?.error?.error?.mensaje ?? 'No pudimos guardar los cambios.');
          this.guardando.set(false);
        },
      });
  }
}
