import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { VisualReportPage } from './visual-report';

describe('VisualReportPage', () => {
  let component: VisualReportPage;
  let fixture: ComponentFixture<VisualReportPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualReportPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualReportPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
