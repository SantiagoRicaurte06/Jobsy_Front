import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CardPage } from './tarjeta';

describe('CardPage', () => {
  let component: CardPage;
  let fixture: ComponentFixture<CardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
