import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ResumeService } from '../../../core/services';
import { Resume } from '../../../core/models';
import * as R from '../../../core/validation/reglas';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Los sub-objetos de Resume son anonimos, asi que los tipamos aqui. */
type Experiencia = Resume['experiencias'][number];
type Estudio = Resume['educacion'][number];

@Component({
  selector: 'jobsy-resume',
  standalone: true,
  imports: [IconComponent, FormsModule, LoadingSpinnerComponent],
  templateUrl: './hoja-vida.html',
  styleUrl: './hoja-vida.scss',
})
export class ResumePage implements OnInit {
  private resumeService = inject(ResumeService);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly guardado = signal(false);
  readonly error = signal('');
  readonly mesMax = R.mesActual();
  readonly anioMax = Number(R.hoyISO().slice(0, 4));

  readonly resumenProfesional = signal('');
  readonly experiencias = signal<Experiencia[]>([]);
  readonly educacion = signal<Estudio[]>([]);
  readonly habilidades = signal<string[]>([]);
  readonly certificaciones = signal<string[]>([]);
  readonly nuevaHabilidad = signal('');

  ngOnInit(): void {
    this.resumeService.get().subscribe((r) => {
      this.resumenProfesional.set(r.resumenProfesional);
      this.experiencias.set(r.experiencias);
      this.educacion.set(r.educacion);
      this.habilidades.set(r.habilidades);
      this.certificaciones.set(r.certificaciones);
      this.cargando.set(false);
    });
  }

  // ---- Experiencia ----
  agregarExperiencia(): void {
    this.experiencias.update((list) => [
      ...list,
      { cargo: '', empresa: '', desde: '', hasta: '', descripcion: '' },
    ]);
  }

  quitarExperiencia(i: number): void {
    this.experiencias.update((list) => list.filter((_, idx) => idx !== i));
  }

  // ---- Educacion ----
  agregarEstudio(): void {
    this.educacion.update((list) => [...list, { titulo: '', institucion: '', ano: '' }]);
  }

  quitarEstudio(i: number): void {
    this.educacion.update((list) => list.filter((_, idx) => idx !== i));
  }

  // ---- Habilidades ----
  agregarHabilidad(): void {
    const h = this.nuevaHabilidad().trim();
    if (!h || this.habilidades().includes(h)) return;
    const invalido = R.texto('Cada habilidad', h, 2, 50);
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');

    this.habilidades.update((list) => [...list, h]);
    this.nuevaHabilidad.set('');
  }

  quitarHabilidad(h: string): void {
    this.habilidades.update((list) => list.filter((x) => x !== h));
  }

  /**
   * Las experiencias y los estudios se editan con [(ngModel)] sobre los
   * objetos de la lista, asi que se validan al guardar y no con computed().
   */
  private validar(): string | null {
    const r = R.texto('El resumen', this.resumenProfesional(), 0, 2000);
    if (r) return r;
    for (const [i, e] of this.experiencias().entries()) {
      const err = R.primero(
        R.texto('El cargo', e.cargo, 2, 100),
        R.texto('La empresa o familia', e.empresa, 2, 150),
        R.mesPasado('La fecha de inicio', e.desde),
        e.hasta ? R.mesPasado('La fecha de fin', e.hasta) : null,
        e.hasta && e.hasta < e.desde ? 'La fecha de fin no puede ser anterior a la de inicio.' : null,
        R.texto('La descripcion', e.descripcion, 0, 500),
      );
      if (err) return `Experiencia ${i + 1}: ${err}`;
    }
    for (const [i, e] of this.educacion().entries()) {
      const err = R.primero(
        R.texto('El titulo', e.titulo, 2, 150),
        R.texto('La institucion', e.institucion, 2, 150),
        R.anio(e.ano),
      );
      if (err) return `Estudio ${i + 1}: ${err}`;
    }
    return null;
  }

  guardar(): void {
    const invalido = this.validar();
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');
    this.guardando.set(true);

    this.resumeService
      .update({
        resumenProfesional: this.resumenProfesional(),
        experiencias: this.experiencias(),
        educacion: this.educacion(),
        habilidades: this.habilidades(),
        certificaciones: this.certificaciones(),
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.guardado.set(true);
          setTimeout(() => this.guardado.set(false), 2500);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err?.error?.error?.mensaje ?? 'No pudimos guardar la hoja de vida.');
          this.guardando.set(false);
        },
      });
  }
}
