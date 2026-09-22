import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

interface Faq {
  pregunta: string;
  respuesta: string;
  categoria: string;
}

/** Centro de ayuda con categorias y preguntas frecuentes filtrables. */
@Component({
  selector: 'jobsy-centro-ayuda',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, EmptyStateComponent],
  templateUrl: './centro-ayuda.html',
  styleUrl: './centro-ayuda.scss',
})
export class HelpCenterPage {
  readonly categorias = [
    { icon: 'briefcase', title: 'Empleos', text: 'Buscar y postularme a ofertas' },
    { icon: 'user', title: 'Empleados', text: 'Contratar y calificar perfiles' },
    { icon: 'credit-card', title: 'Pagos', text: 'Metodos de pago y facturas' },
    { icon: 'settings', title: 'Mi cuenta', text: 'Datos, seguridad y perfil' },
    { icon: 'shopping-cart', title: 'Tienda', text: 'Pedidos, envios y devoluciones' },
  ];

  readonly termino = signal('');

  readonly faqs: Faq[] = [
    {
      categoria: 'Empleos',
      pregunta: 'Como me postulo a una oferta?',
      respuesta:
        'Entra al detalle de la oferta que te interese y presiona "Postularme". Te pediremos confirmar tu hoja de vida antes de enviar la postulacion.',
    },
    {
      categoria: 'Empleos',
      pregunta: 'Puedo editar mi postulacion despues de enviarla?',
      respuesta:
        'Puedes retirarla desde "Mis Postulaciones" y volver a postularte con datos actualizados mientras la oferta siga abierta.',
    },
    {
      categoria: 'Empleados',
      pregunta: 'Como verifica Jobsy a los empleados?',
      respuesta:
        'Validamos documento de identidad y al menos una referencia antes de publicar cualquier perfil. Los perfiles verificados muestran una insignia.',
    },
    {
      categoria: 'Pagos',
      pregunta: 'Que metodos de pago aceptan en la tienda?',
      respuesta:
        'Aceptamos PSE, tarjeta de credito o debito, billetera digital y saldo Jobsy. Puedes elegir el metodo en el ultimo paso del checkout.',
    },
    {
      categoria: 'Pagos',
      pregunta: 'Como pido una factura de mi compra?',
      respuesta:
        'La factura se genera automaticamente y queda disponible en "Mi Cuenta > Metodos de pago" una vez confirmado el pago.',
    },
    {
      categoria: 'Mi cuenta',
      pregunta: 'Como cambio mi contrasena?',
      respuesta:
        'Ve a Configuracion desde el menu de tu cuenta y selecciona "Seguridad" para actualizar tu contrasena en cualquier momento.',
    },
    {
      categoria: 'Mi cuenta',
      pregunta: 'Puedo tener perfil de empleador y de empleado a la vez?',
      respuesta:
        'Si. Puedes alternar de rol desde tu perfil sin crear una cuenta nueva.',
    },
    {
      categoria: 'Tienda',
      pregunta: 'Cuanto tarda el envio en Yopal?',
      respuesta:
        'Los pedidos dentro de Yopal se entregan en 24 a 48 horas habiles despues de confirmado el pago.',
    },
  ];

  private categoriaActiva = signal<string | null>(null);
  readonly abierta = signal<number | null>(null);

  readonly faqsFiltradas = computed(() => {
    const q = this.termino().trim().toLowerCase();
    const cat = this.categoriaActiva();

    return this.faqs.filter((f) => {
      const coincideTexto =
        !q || f.pregunta.toLowerCase().includes(q) || f.respuesta.toLowerCase().includes(q);
      const coincideCategoria = !cat || f.categoria === cat;
      return coincideTexto && coincideCategoria;
    });
  });

  filtrarPorCategoria(cat: string): void {
    this.categoriaActiva.set(this.categoriaActiva() === cat ? null : cat);
  }

  categoriaSeleccionada(): string | null {
    return this.categoriaActiva();
  }

  toggle(i: number): void {
    this.abierta.set(this.abierta() === i ? null : i);
  }
}
