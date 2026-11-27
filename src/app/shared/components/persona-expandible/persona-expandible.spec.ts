import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PersonaExpandibleComponent } from './persona-expandible';
import { Employee } from '../../../core/models';

const MARTHA: Employee = {
  id: 'e1',
  nombre: 'Martha C.',
  descripcion: 'Doce años en hogares de Yopal.',
  calificacion: 5,
  totalServicios: 23,
  verificado: true,
  especialidades: ['Limpieza', 'Cocina'],
  experiencia: '12 años',
  ciudad: 'Yopal',
  disponible: true,
  tarifaHora: 30000,
};

describe('PersonaExpandibleComponent', () => {
  let fixture: ComponentFixture<PersonaExpandibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaExpandibleComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaExpandibleComponent);
    fixture.componentRef.setInput('employee', MARTHA);
    await fixture.whenStable();
  });

  it('muestra nombre, oficios y servicios en la tarjeta cerrada', () => {
    const carta: HTMLElement = fixture.nativeElement.querySelector('.carta');
    expect(carta.textContent).toContain('Martha C.');
    expect(carta.textContent).toContain('Limpieza · Cocina');
    expect(carta.textContent).toContain('23 servicios');
  });

  it('nombra la vista abierta con el nombre de la persona', () => {
    const dialogo: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    const titulo = fixture.nativeElement.querySelector('#' + dialogo.getAttribute('aria-labelledby'));
    expect(titulo.textContent).toContain('Martha C.');
  });

  it('usa las iniciales cuando no hay foto', async () => {
    fixture.componentRef.setInput('employee', { ...MARTHA, fotoUrl: undefined });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.iniciales').textContent).toContain('MC');
  });
});
