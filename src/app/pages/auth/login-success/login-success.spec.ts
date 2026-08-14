import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { LoginSuccessPage } from './login-success';

describe('LoginSuccessPage', () => {
  let component: LoginSuccessPage;
  let fixture: ComponentFixture<LoginSuccessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSuccessPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSuccessPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
