import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { BalancePage } from './saldo';

describe('BalancePage', () => {
  let component: BalancePage;
  let fixture: ComponentFixture<BalancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalancePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BalancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
