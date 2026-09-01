import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon';

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

  enviar(): void {
    if (!this.nombre() || !this.correo() || !this.mensaje()) return;

    this.enviando.set(true);

    // TEMPORAL: no hay backend de contacto todavia, se simula el envio.
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
      this.nombre.set('');
      this.correo.set('');
      this.mensaje.set('');
      this.motivo.set(this.motivos[0]);
    }, 700);
  }
}
