import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AccountInfoPage } from './informacion';

describe('AccountInfoPage', () => {
  let component: AccountInfoPage;
  let fixture: ComponentFixture<AccountInfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountInfoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
