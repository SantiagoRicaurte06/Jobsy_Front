import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { JobDetailPage } from './job-detail';

describe('JobDetailPage', () => {
  let component: JobDetailPage;
  let fixture: ComponentFixture<JobDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
