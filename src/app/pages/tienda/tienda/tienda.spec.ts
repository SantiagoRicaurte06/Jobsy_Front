import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { StorePage } from './tienda';

describe('StorePage', () => {
  let component: StorePage;
  let fixture: ComponentFixture<StorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
