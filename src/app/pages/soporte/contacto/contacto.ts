import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IconComponent } from '../../../shared/components/icon/icon';
import { AuthService, ReportService } from '../../../core/services';
import { environment } from '../../../../environments/environment';

/** Tipo de reporte de Soporte_API segun el motivo elegido en el formulario. */
const TIPO_POR_MOTIVO: Record<string, string> = {
  'Soporte tecnico': 'tecnico',
  'Pagos y facturacion': 'pago',
  'Reportar un perfil': 'usuario',
  'Alianzas y prensa': 'sugerencia',
  Otro: 'sugerencia',
};

/** Formulario de contacto general (no requiere sesion iniciada). */
@Component({
  selector: 'jobsy-contacto',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class ContactPage {
  readonly canales = [
    {
      icon: 'mail',
      title: 'Correo electronico',
      text: 'soporte@jobsy.co',
      nota: 'Respuesta en menos de 24 horas habiles.',
    },
    {
      icon: 'message-circle',
      title: 'Chat en la app',
      text: 'Desde el Centro de Ayuda',
      nota: 'Lunes a sabado, 8:00 am - 6:00 pm.',
    },
    {
      icon: 'map-pin',
      title: 'Oficina Yopal',
      text: 'Calle 8 #23-15, Yopal, Casanare',
      nota: 'Visitas previa cita.',
    },
  ];

  readonly motivos = ['Soporte tecnico', 'Pagos y facturacion', 'Reportar un perfil', 'Alianzas y prensa', 'Otro'];

  readonly nombre = signal('');
  readonly correo = signal('');
  readonly motivo = signal(this.motivos[0]);
  readonly mensaje = signal('');
  readonly enviando = signal(false);
  readonly enviado = signal(false);
  /** El mensaje salio por el correo del usuario (no tenia sesion). */
  readonly porCorreo = signal(false);
  readonly error = signal('');

  private auth = inject(AuthService);
  private reportes = inject(ReportService);

  enviar(): void {
    if (!this.nombre() || !this.correo() || !this.mensaje()) return;
    this.error.set('');

    if (environment.useMocks) {
      this.enviando.set(true);
      setTimeout(() => this.listo(false), 700);
      return;
    }

    // Con sesion, el mensaje entra como reporte de soporte y se sigue desde el
    // Centro de reportes. Sin sesion no hay a quien asociarlo: se abre el
    // correo del usuario con el mensaje ya escrito.
    if (this.auth.user()) {
      this.enviando.set(true);
      this.reportes
        .create({
          tipo: TIPO_POR_MOTIVO[this.motivo()] ?? 'tecnico',
          asunto: this.motivo(),
          descripcion: `${this.mensaje()}\n\nContacto: ${this.nombre()} <${this.correo()}>`,
        })
        .subscribe({
          next: () => this.listo(false),
          error: (err: HttpErrorResponse) => {
            this.error.set(err?.error?.error?.mensaje ?? 'No pudimos enviar el mensaje. Intenta de nuevo.');
            this.enviando.set(false);
          },
        });
      return;
    }

    const asunto = encodeURIComponent(`[Jobsy] ${this.motivo()}`);
    const cuerpo = encodeURIComponent(`${this.mensaje()}\n\n${this.nombre()} <${this.correo()}>`);
    window.location.href = `mailto:soporte@jobsy.co?subject=${asunto}&body=${cuerpo}`;
    this.listo(true);
  }

  private listo(porCorreo: boolean): void {
    this.porCorreo.set(porCorreo);
    this.enviando.set(false);
    this.enviado.set(true);
    this.nombre.set('');
    this.correo.set('');
    this.mensaje.set('');
    this.motivo.set(this.motivos[0]);
  }
}
