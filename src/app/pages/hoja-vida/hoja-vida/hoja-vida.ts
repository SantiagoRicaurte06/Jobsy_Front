import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../../core/services';
import { Resume } from '../../../core/models';
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

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly guardado = signal(false);

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
      this.loading.set(false);
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

    this.habilidades.update((list) => [...list, h]);
    this.nuevaHabilidad.set('');
  }

  quitarHabilidad(h: string): void {
    this.habilidades.update((list) => list.filter((x) => x !== h));
  }

  guardar(): void {
    this.saving.set(true);

    this.resumeService
      .update({
        resumenProfesional: this.resumenProfesional(),
        experiencias: this.experiencias(),
        educacion: this.educacion(),
        habilidades: this.habilidades(),
        certificaciones: this.certificaciones(),
      })
      .subscribe(() => {
        this.saving.set(false);
        this.guardado.set(true);
        setTimeout(() => this.guardado.set(false), 2500);
      });
  }
}
