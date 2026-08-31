import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CareersPage } from './trabaja-con-nosotros';

describe('CareersPage', () => {
  let component: CareersPage;
  let fixture: ComponentFixture<CareersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareersPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CareersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
