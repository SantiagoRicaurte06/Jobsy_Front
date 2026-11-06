import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AdminReportsPage } from './reportes';

describe('AdminReportsPage', () => {
  let component: AdminReportsPage;
  let fixture: ComponentFixture<AdminReportsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReportsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
