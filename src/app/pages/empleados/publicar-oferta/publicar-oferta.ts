import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { from, of } from 'rxjs';
import { catchError, concatMap, toArray } from 'rxjs/operators';
import { JobService } from '../../../core/services';
import {
  JobSize, MODALIDADES, MODALIDAD_TEXTO, TAMANOS, TAMANO_TEXTO, WorkModality,
} from '../../../core/models';
import * as R from '../../../core/validation/reglas';

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
  readonly dias = signal<string[]>([]);
  readonly horaInicio = signal('08:00');
  readonly horaFin = signal('12:00');
  readonly direccion = signal('');
  readonly ciudad = signal('Yopal');
  readonly etiquetas = signal<string[]>([]);
  readonly descripcion = signal('');
  readonly guardando = signal(false);
  readonly error = signal('');
  /** Los errores por campo se muestran tras el primer intento de publicar. */
  readonly intentado = signal(false);

  readonly diasSemana = R.DIAS_SEMANA;
  readonly limites = R.LIMITES;
  readonly ejemploDireccion = R.EJEMPLO_DIRECCION;

  readonly errores = computed(() => ({
    titulo: R.texto('El titulo', this.titulo(), 5, 100),
    precioHora: R.tarifa(this.precioHora()),
    horario: R.horario(this.dias(), this.horaInicio(), this.horaFin()),
    direccion: R.direccion(this.direccion()),
    descripcion: R.texto('La descripcion', this.descripcion(), 0, 1000),
  }));
  readonly valido = computed(() => Object.values(this.errores()).every((e) => !e));

  /** Lo que se publicara como horario, p. ej. "Lun, Mie · 08:00 a 12:00". */
  readonly horarioTexto = computed(() =>
    this.dias().length ? R.componerHorario(this.dias(), this.horaInicio(), this.horaFin()) : '',
  );

  readonly tamanos = TAMANOS.map((value) => ({ value, label: TAMANO_TEXTO[value] }));

  readonly modalidades = MODALIDADES.map((value) => ({ value, label: MODALIDAD_TEXTO[value] }));

  readonly tareas = ['Limpieza', 'Cocina', 'Planchado', 'Zonas verdes', 'Mascotas', 'Cuidado de ninos'];
  readonly ciudades = R.CIUDADES;

  /** Fotos elegidas; se suben al crear la oferta, la primera como principal. */
  readonly fotos = signal<File[]>([]);

  toggleDia(d: string): void {
    this.dias.update((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d]));
  }

  toggleTarea(t: string): void {
    this.etiquetas.update((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
  }

  elegirFotos(event: Event): void {
    this.fotos.set(Array.from((event.target as HTMLInputElement).files ?? []));
  }

  submit(): void {
    this.intentado.set(true);
    if (!this.valido()) {
      this.error.set('Revisa los campos marcados.');
      return;
    }
    this.error.set('');

    this.guardando.set(true);
    this.jobService
      .create({
        titulo: this.titulo().trim(),
        // Se capturaba y no se enviaba: la oferta se publicaba sin descripcion.
        descripcion: this.descripcion(),
        tamano: this.tamano(),
        modalidad: this.modalidad(),
        precioHora: this.precioHora()!,
        moneda: 'COP',
        horario: this.horarioTexto(),
        direccion: this.direccion().trim(),
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
