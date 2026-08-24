import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { HomeLoggedPage } from './inicio-privado';

describe('HomeLoggedPage', () => {
  let component: HomeLoggedPage;
  let fixture: ComponentFixture<HomeLoggedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLoggedPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLoggedPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
