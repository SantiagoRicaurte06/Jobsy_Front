import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SelectRolePage } from './select-role';

describe('SelectRolePage', () => {
  let component: SelectRolePage;
  let fixture: ComponentFixture<SelectRolePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRolePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRolePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
