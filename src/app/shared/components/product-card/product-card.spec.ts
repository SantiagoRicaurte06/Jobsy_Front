import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ProductCardComponent } from './product-card';
import { MOCK_PRODUCTS } from '../../../mocks';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', MOCK_PRODUCTS[0]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
