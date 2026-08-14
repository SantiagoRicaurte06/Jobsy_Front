import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PsePage } from './pse';

describe('PsePage', () => {
  let component: PsePage;
  let fixture: ComponentFixture<PsePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PsePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
