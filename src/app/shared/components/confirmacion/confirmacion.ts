import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal';

/**
 * Confirmación propia, en lugar de confirm()/prompt() del navegador.
 * Hereda del modal el cierre con Esc y el foco atrapado.
 *
 *   @if (porCerrar(); as o) {
 *     <jobsy-confirmacion titulo="¿Cerrar la oferta?" [mensaje]="…" textoAceptar="Cerrar oferta" peligro
 *       (aceptar)="cerrar(o)" (cancelar)="porCerrar.set(null)" />
 *   }
 */
@Component({
  selector: 'jobsy-confirmacion',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  template: `
    <jobsy-modal [title]="titulo()" (cerrar)="cancelar.emit()">
      <form class="confirmacion" (ngSubmit)="confirmar()">
        @if (mensaje()) { <p class="mensaje_confirmacion">{{ mensaje() }}</p> }

        @if (pedirMotivo()) {
          <div class="grupo_campo">
            <label class="etiqueta" for="motivo-confirmacion">{{ etiquetaMotivo() }}</label>
            <textarea id="motivo-confirmacion" class="area_texto" name="motivo" maxlength="300"
              [ngModel]="motivo()" (ngModelChange)="motivo.set($event)"></textarea>
          </div>
        }

        <div class="acciones_confirmacion">
          <button type="button" class="boton_simple" (click)="cancelar.emit()">{{ textoCancelar() }}</button>
          <button type="submit" [class]="peligro() ? 'boton_peligro' : 'boton_principal'">{{ textoAceptar() }}</button>
        </div>
      </form>
    </jobsy-modal>
  `,
  styleUrl: './confirmacion.scss',
})
export class ConfirmacionComponent {
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
  readonly textoAceptar = input('Confirmar');
  readonly textoCancelar = input('Volver');
  /** Acción destructiva: el botón va en rojo. */
  readonly peligro = input(false, { transform: (v: boolean | '') => v === '' || v });
  readonly pedirMotivo = input(false, { transform: (v: boolean | '') => v === '' || v });
  readonly etiquetaMotivo = input('Motivo (opcional)');

  readonly aceptar = output<string>();
  readonly cancelar = output<void>();

  readonly motivo = signal('');

  confirmar(): void {
    this.aceptar.emit(this.motivo().trim());
  }
}
