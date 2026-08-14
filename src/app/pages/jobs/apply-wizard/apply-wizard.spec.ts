import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ApplyWizardPage } from './apply-wizard';

describe('ApplyWizardPage', () => {
  let component: ApplyWizardPage;
  let fixture: ComponentFixture<ApplyWizardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyWizardPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyWizardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
