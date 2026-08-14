import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { StepPersonalPage } from './step-personal';

describe('StepPersonalPage', () => {
  let component: StepPersonalPage;
  let fixture: ComponentFixture<StepPersonalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPersonalPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StepPersonalPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
