import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AdminCategoriesPage } from './categorias';

describe('AdminCategoriesPage', () => {
  let component: AdminCategoriesPage;
  let fixture: ComponentFixture<AdminCategoriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoriesPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
