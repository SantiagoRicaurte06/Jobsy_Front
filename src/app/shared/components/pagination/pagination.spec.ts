import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('page', 0);
    fixture.componentRef.setInput('totalPages', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
