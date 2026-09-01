import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { TermsPage } from './terminos';

describe('TermsPage', () => {
  let component: TermsPage;
  let fixture: ComponentFixture<TermsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
