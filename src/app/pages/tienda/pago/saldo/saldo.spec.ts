import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { JobsyBalancePage } from './saldo';

describe('JobsyBalancePage', () => {
  let component: JobsyBalancePage;
  let fixture: ComponentFixture<JobsyBalancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsyBalancePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsyBalancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
