import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { RatingStarsComponent } from './rating-stars';

describe('RatingStarsComponent', () => {
  let component: RatingStarsComponent;
  let fixture: ComponentFixture<RatingStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingStarsComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingStarsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
