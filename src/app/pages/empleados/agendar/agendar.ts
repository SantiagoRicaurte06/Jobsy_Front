import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService, HiringService, ScheduleSlot } from '../../../core/services';
import { Employee } from '../../../core/models';
import { IconComponent } from '../../../shared/components/icon/icon';
import * as R from '../../../core/validation/reglas';

/** Codigos de dia tal como los espera el catalogo (catalogo.dias_semana). */
const CODIGOS_DIA = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

@Component({
  selector: 'jobsy-schedule',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './agendar.html',
  styleUrl: './agendar.scss',
})
export class SchedulePage implements OnInit {
  private ruta = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private hiring = inject(HiringService);

  readonly mesActual = signal(new Date());
  readonly diaSeleccionado = signal<number | null>(null);
  readonly slotSeleccionado = signal<string | null>(null);
  readonly notas = signal('');
  readonly direccion = signal('');
  readonly confirmado = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');

  readonly nombresDia = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  /** A quien se agenda. Llega como ?empleado= desde su ficha. */
  readonly empleadoId = signal('');
  readonly empleado = signal<Employee | undefined>(undefined);

  /**
   * Disponibilidad declarada por esa persona.
   *
   * Antes la pantalla mostraba seis franjas fijas escritas en el codigo, dos
   * de ellas marcadas como ocupadas, iguales para todo el mundo.
   */
  readonly franjas = signal<ScheduleSlot[]>([]);

  /** Franjas del dia elegido, segun el dia de la semana que caiga. */
  readonly franjasDelDia = computed(() => {
    const dia = this.diaSeleccionado();
    if (!dia) return [];
    const d = this.mesActual();
    const fecha = new Date(d.getFullYear(), d.getMonth(), dia);
    // getDay(): 0 = domingo; el catalogo empieza en lunes.
    const codigo = CODIGOS_DIA[(fecha.getDay() + 6) % 7];
    return this.franjas().filter((f) => f.dia === codigo);
  });

  /** Dias del mes con huecos al inicio para alinear la cuadricula. */
  readonly dias = computed(() => {
    const d = this.mesActual();
    const primero = new Date(d.getFullYear(), d.getMonth(), 1);
    const totalDias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const offset = (primero.getDay() + 6) % 7;

    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: totalDias }, (_, i) => i + 1),
    ];
  });

  readonly nombreMes = computed(() =>
    this.mesActual().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
  );

  ngOnInit(): void {
    const id = this.ruta.snapshot.queryParamMap.get('empleado') ?? '';
    this.empleadoId.set(id);
    if (!id) {
      this.error.set('Abre esta pantalla desde el perfil de la persona que quieres agendar.');
      return;
    }

    this.employeeService.getById(id).subscribe({
      next: (e) => this.empleado.set(e),
      error: () => this.error.set('No pudimos cargar los datos de esta persona.'),
    });

    this.employeeService.availability(id).subscribe({
      next: (f) => this.franjas.set(f ?? []),
      error: () => this.franjas.set([]),
    });
  }

  cambiarMes(delta: number): void {
    const d = new Date(this.mesActual());
    d.setMonth(d.getMonth() + delta);
    this.mesActual.set(d);
    this.diaSeleccionado.set(null);
    this.slotSeleccionado.set(null);
  }

  /** Solo se agenda desde hoy y hasta un ano adelante, como exige el servidor. */
  diaHabilitado(dia: number): boolean {
    const d = this.mesActual();
    return R.fechaServicio(iso(new Date(d.getFullYear(), d.getMonth(), dia))) === null;
  }

  seleccionarDia(dia: number | null): void {
    if (dia === null || !this.diaHabilitado(dia)) return;
    this.diaSeleccionado.set(dia);
    this.slotSeleccionado.set(null);
  }

  etiquetaFranja(f: ScheduleSlot): string {
    return `${f.horaInicio} - ${f.horaFin}`;
  }

  /** Contrata el servicio en el dia y la franja elegidos. */
  confirmar(): void {
    const dia = this.diaSeleccionado();
    const franja = this.franjasDelDia().find(
      (f) => this.etiquetaFranja(f) === this.slotSeleccionado(),
    );
    const empleado = this.empleado();

    if (!dia || !franja || !empleado) return;

    const d = this.mesActual();
    const fecha = new Date(d.getFullYear(), d.getMonth(), dia);
    const horas = duracionEnHoras(franja.horaInicio, franja.horaFin);
    const invalido = R.primero(
      R.direccion(this.direccion()),
      R.fechaServicio(iso(fecha)),
      R.rango('La franja', horas, R.LIMITES.horasMin, R.LIMITES.horasMax)
        ? `Una franja de ${horas} horas no se puede agendar: debe durar entre ${R.LIMITES.horasMin} y ${R.LIMITES.horasMax} horas.`
        : null,
      empleado.tarifaHora ? R.tarifa(empleado.tarifaHora) : `${empleado.nombre} aun no ha definido su tarifa por hora.`,
      R.texto('La nota', this.notas(), 0, 500),
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }

    this.enviando.set(true);
    this.error.set('');

    this.hiring
      .direct({
        empleadoId: this.empleadoId(),
        titulo: `Servicio agendado con ${empleado.nombre}`,
        direccion: this.direccion().trim(),
        // El servidor solo acepta ciudades donde opera Jobsy.
        ciudad: (R.CIUDADES as readonly string[]).includes(empleado.ciudad ?? '') ? empleado.ciudad : undefined,
        fechaInicio: iso(fecha),
        horaInicio: franja.horaInicio,
        horaFin: franja.horaFin,
        duracionHoras: horas,
        tarifa: empleado.tarifaHora ?? 0,
        dias: [franja.dia],
        nota: this.notas().trim(),
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.confirmado.set(true);
        },
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.error?.mensaje ?? 'No pudimos agendar el servicio.');
        },
      });
  }
}

/** "2026-10-05", en hora local: toISOString() adelantaria o atrasaria el dia. */
function iso(d: Date): string {
  const mes = `${d.getMonth() + 1}`.padStart(2, '0');
  const dia = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Horas entre dos "HH:MM". Una franja que cruza medianoche no se contempla. */
function duracionEnHoras(inicio: string, fin: string): number {
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fin.split(':').map(Number);
  const minutos = hf * 60 + mf - (hi * 60 + mi);
  return minutos > 0 ? Math.round((minutos / 60) * 100) / 100 : 1;
}
