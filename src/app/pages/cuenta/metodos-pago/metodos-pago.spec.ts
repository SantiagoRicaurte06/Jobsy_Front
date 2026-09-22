import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PaymentMethodsPage } from './metodos-pago';

describe('PaymentMethodsPage', () => {
  let component: PaymentMethodsPage;
  let fixture: ComponentFixture<PaymentMethodsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodsPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
