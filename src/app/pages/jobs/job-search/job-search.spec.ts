import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { JobSearchPage } from './job-search';

describe('JobSearchPage', () => {
  let component: JobSearchPage;
  let fixture: ComponentFixture<JobSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSearchPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSearchPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
