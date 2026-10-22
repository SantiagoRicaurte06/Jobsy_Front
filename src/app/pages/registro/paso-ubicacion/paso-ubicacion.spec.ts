import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { StepLocationPage } from './paso-ubicacion';

describe('StepLocationPage', () => {
  let component: StepLocationPage;
  let fixture: ComponentFixture<StepLocationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLocationPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StepLocationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
