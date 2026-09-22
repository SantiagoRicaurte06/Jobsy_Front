import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { BlogPage } from './blog';

describe('BlogPage', () => {
  let component: BlogPage;
  let fixture: ComponentFixture<BlogPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
