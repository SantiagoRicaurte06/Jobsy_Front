import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { StepWorkPage } from './paso-trabajo';

describe('StepWorkPage', () => {
  let component: StepWorkPage;
  let fixture: ComponentFixture<StepWorkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepWorkPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StepWorkPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
