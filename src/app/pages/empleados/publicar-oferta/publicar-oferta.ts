import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { from, of } from 'rxjs';
import { catchError, concatMap, toArray } from 'rxjs/operators';
import { JobService } from '../../../core/services';
import {
  JobSize, MODALIDADES, MODALIDAD_TEXTO, TAMANOS, TAMANO_TEXTO, WorkModality,
} from '../../../core/models';

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
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly tamanos = TAMANOS.map((value) => ({ value, label: TAMANO_TEXTO[value] }));

  readonly modalidades = MODALIDADES.map((value) => ({ value, label: MODALIDAD_TEXTO[value] }));

  readonly tareas = ['Limpieza', 'Cocina', 'Planchado', 'Zonas verdes', 'Mascotas', 'Cuidado de ninos'];
  readonly ciudades = ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva', 'Monterrey'];

  /** Fotos elegidas; se suben al crear la oferta, la primera como principal. */
  readonly fotos = signal<File[]>([]);

  toggleTarea(t: string): void {
    this.etiquetas.update((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
  }

  elegirFotos(event: Event): void {
    this.fotos.set(Array.from((event.target as HTMLInputElement).files ?? []));
  }

  submit(): void {
    if (!this.titulo() || !this.precioHora() || !this.direccion()) {
      this.error.set('Completa titulo, precio y direccion.');
      return;
    }

    this.guardando.set(true);
    this.jobService
      .create({
        titulo: this.titulo(),
        // Se capturaba y no se enviaba: la oferta se publicaba sin descripcion.
        descripcion: this.descripcion(),
        tamano: this.tamano(),
        modalidad: this.modalidad(),
        precioHora: this.precioHora()!,
        moneda: 'COP',
        horario: this.horario(),
        direccion: this.direccion(),
        ciudad: this.ciudad(),
        etiquetas: this.etiquetas(),
      })
      .pipe(
        // Las fotos van despues, una a una y en orden. Si alguna falla la
        // oferta ya esta publicada: se completa desde "Mis ofertas".
        concatMap((oferta) =>
          this.fotos().length
            ? from(this.fotos()).pipe(
                concatMap((f) => this.jobService.uploadPhoto(oferta.id, f)),
                toArray(),
                catchError(() => of([])),
              )
            : of([]),
        ),
      )
      .subscribe({
        next: () => this.router.navigate(['/app/mis-ofertas']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err?.error?.error?.mensaje ?? 'No pudimos publicar la oferta. Intenta de nuevo.');
          this.guardando.set(false);
        },
      });
  }
}
