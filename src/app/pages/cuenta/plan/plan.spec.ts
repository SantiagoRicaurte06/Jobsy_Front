import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AccountPlanPage } from './plan';

describe('AccountPlanPage', () => {
  let component: AccountPlanPage;
  let fixture: ComponentFixture<AccountPlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPlanPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPlanPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
