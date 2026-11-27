import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OfertaComprobanteComponent } from './oferta-comprobante';
import { Job } from '../../../core/models';

const OFERTA = {
  id: 'j1',
  titulo: 'Limpieza de casa grande',
  tamano: 'grande',
  precioHora: 32000,
  moneda: 'COP',
  horario: 'Lun, Mie, Vie 08:00-12:00',
  direccion: 'El Alcaraván',
  ciudad: 'Yopal',
  modalidad: 'presencial',
  etiquetas: ['Limpieza'],
  esNuevo: false,
  empleadorId: 'u1',
  fechaPublicacion: '2026-11-20',
} as unknown as Job;

describe('OfertaComprobanteComponent', () => {
  let fixture: ComponentFixture<OfertaComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaComprobanteComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertaComprobanteComponent);
    fixture.componentRef.setInput('job', OFERTA);
    await fixture.whenStable();
  });

  it('muestra título, lugar y el enlace a la oferta', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent).toContain('Limpieza de casa grande');
    expect(el.textContent).toContain('El Alcaraván, Yopal');
    expect(el.querySelector('a.boton_principal')?.getAttribute('href')).toBe('/empleos/j1');
  });

  it('el sello es decorativo', () => {
    expect(fixture.nativeElement.querySelector('.estampa').getAttribute('aria-hidden')).toBe('true');
  });
});
