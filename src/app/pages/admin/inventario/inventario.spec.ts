import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AdminInventoryPage } from './inventario';

describe('AdminInventoryPage', () => {
  let component: AdminInventoryPage;
  let fixture: ComponentFixture<AdminInventoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInventoryPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInventoryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
