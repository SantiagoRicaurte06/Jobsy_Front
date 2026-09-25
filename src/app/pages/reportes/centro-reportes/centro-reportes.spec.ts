import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ReportCenterPage } from './centro-reportes';

describe('ReportCenterPage', () => {
  let component: ReportCenterPage;
  let fixture: ComponentFixture<ReportCenterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCenterPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCenterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
