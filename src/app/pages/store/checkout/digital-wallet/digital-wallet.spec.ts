import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DigitalWalletPage } from './digital-wallet';

describe('DigitalWalletPage', () => {
  let component: DigitalWalletPage;
  let fixture: ComponentFixture<DigitalWalletPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalWalletPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalWalletPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
