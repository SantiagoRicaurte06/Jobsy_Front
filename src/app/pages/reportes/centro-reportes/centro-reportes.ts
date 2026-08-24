import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../core/services';
import { Report } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-report-center',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './centro-reportes.html',
  styleUrl: './centro-reportes.scss',
})
export class ReportCenterPage implements OnInit {
  private reportService = inject(ReportService);

  readonly reports = signal<Report[]>([]);
  readonly loading = signal(true);
  readonly enviando = signal(false);
  readonly enviado = signal(false);

  /** `tipo` viaja como texto libre: asi lo define Report en el backend. */
  readonly tipo = signal('Incidencia');
  readonly asunto = signal('');
  readonly descripcion = signal('');

  readonly tipos = [
    { value: 'Incidencia', icon: '\u{1F41B}', label: 'Problema tecnico', text: 'Algo no funciona en la plataforma.' },
    { value: 'Usuario', icon: '\u{1F6A9}', label: 'Reportar usuario', text: 'Comportamiento inadecuado.' },
    { value: 'Pago', icon: '\u{1F4B3}', label: 'Problema de pago', text: 'Cobros o transferencias.' },
    { value: 'Sugerencia', icon: '\u{1F4A1}', label: 'Sugerencia', text: 'Ideas para mejorar Jobsy.' },
  ];

  readonly faqs = [
    { q: 'Como cambio mi contrasena?', a: 'Ve a Configuracion > Seguridad y usa "Cambiar contrasena".' },
    { q: 'Cuando recibo el pago de un servicio?', a: 'El pago se libera 24 horas despues de que el empleador confirme el servicio.' },
    { q: 'Como verifico mi perfil?', a: 'Sube tu documento de identidad desde tu perfil. La verificacion tarda 48 horas.' },
    { q: 'Puedo cancelar una postulacion?', a: 'Si, desde Mis postulaciones mientras siga en estado pendiente.' },
  ];

  readonly faqAbierta = signal<number | null>(null);

  ngOnInit(): void {
    this.reportService.list().subscribe((r) => {
      this.reports.set(r);
      this.loading.set(false);
    });
  }

  toggleFaq(i: number): void {
    this.faqAbierta.update((actual) => (actual === i ? null : i));
  }

  enviar(): void {
    if (!this.asunto() || !this.descripcion()) return;

    this.enviando.set(true);
    this.reportService
      .create({ tipo: this.tipo(), asunto: this.asunto(), descripcion: this.descripcion() })
      .subscribe((nuevo) => {
        this.reports.update((list) => [nuevo, ...list]);
        this.asunto.set('');
        this.descripcion.set('');
        this.enviando.set(false);
        this.enviado.set(true);
        setTimeout(() => this.enviado.set(false), 3000);
      });
  }

  badgeClass(estado: string): string {
    if (estado === 'resuelto') return 'pildora_exito';
    if (estado === 'en_proceso') return 'pildora_info';
    return 'pildora_aviso';
  }
}
