import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AccountCreatedPage } from './cuenta-creada';

describe('AccountCreatedPage', () => {
  let component: AccountCreatedPage;
  let fixture: ComponentFixture<AccountCreatedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCreatedPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreatedPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
