import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EmployeeDetailPage } from './detalle-empleado';

describe('EmployeeDetailPage', () => {
  let component: EmployeeDetailPage;
  let fixture: ComponentFixture<EmployeeDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
