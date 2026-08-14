import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EmployeeSearchPage } from './employee-search';

describe('EmployeeSearchPage', () => {
  let component: EmployeeSearchPage;
  let fixture: ComponentFixture<EmployeeSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSearchPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSearchPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
