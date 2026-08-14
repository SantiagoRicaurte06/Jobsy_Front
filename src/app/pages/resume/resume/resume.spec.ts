import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ResumePage } from './resume';

describe('ResumePage', () => {
  let component: ResumePage;
  let fixture: ComponentFixture<ResumePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
