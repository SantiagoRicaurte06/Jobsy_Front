import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PressPage } from './prensa';

describe('PressPage', () => {
  let component: PressPage;
  let fixture: ComponentFixture<PressPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PressPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
