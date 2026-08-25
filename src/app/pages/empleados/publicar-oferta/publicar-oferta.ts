import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services';
import { JobSize, WorkModality } from '../../../core/models';

@Component({
  selector: 'jobsy-publish-offer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './publicar-oferta.html',
  styleUrl: './publicar-oferta.scss',
})
export class PublishOfferPage {
  private jobService = inject(JobService);
  private router = inject(Router);

  readonly titulo = signal('');
  readonly tamano = signal<JobSize>('mediano');
  readonly modalidad = signal<WorkModality>('por_horas');
  readonly precioHora = signal<number | null>(null);
  readonly horario = signal('');
  readonly direccion = signal('');
  readonly ciudad = signal('Yopal');
  readonly etiquetas = signal<string[]>([]);
  readonly descripcion = signal('');
  readonly saving = signal(false);
  readonly error = signal('');

  readonly tamanos: { value: JobSize; label: string }[] = [
    { value: 'pequeno', label: 'Pequena' },
    { value: 'mediano', label: 'Mediana' },
    { value: 'grande', label: 'Grande' },
    { value: 'lujoso', label: 'Lujosa' },
  ];

  readonly modalidades: { value: WorkModality; label: string }[] = [
    { value: 'por_horas', label: 'Por horas' },
    { value: 'jornada_completa', label: 'Jornada completa' },
    { value: 'fin_de_semana', label: 'Fin de semana' },
    { value: 'presencial', label: 'Presencial fijo' },
  ];

  readonly tareas = ['Limpieza', 'Cocina', 'Planchado', 'Zonas verdes', 'Mascotas', 'Cuidado de ninos'];
  readonly ciudades = ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva', 'Monterrey'];

  toggleTarea(t: string): void {
    this.etiquetas.update((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
  }

  submit(): void {
    if (!this.titulo() || !this.precioHora() || !this.direccion()) {
      this.error.set('Completa titulo, precio y direccion.');
      return;
    }

    this.saving.set(true);
    this.jobService
      .create({
        titulo: this.titulo(),
        tamano: this.tamano(),
        modalidad: this.modalidad(),
        precioHora: this.precioHora()!,
        horario: this.horario(),
        direccion: this.direccion(),
        ciudad: this.ciudad(),
        etiquetas: this.etiquetas(),
      })
      .subscribe({
        next: () => this.router.navigate(['/empleos']),
        error: () => {
          this.error.set('No pudimos publicar la oferta. Intenta de nuevo.');
          this.saving.set(false);
        },
      });
  }
}
