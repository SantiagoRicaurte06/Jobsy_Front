import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { MyOrdersPage } from './mis-pedidos';

describe('MyOrdersPage', () => {
  let component: MyOrdersPage;
  let fixture: ComponentFixture<MyOrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrdersPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
