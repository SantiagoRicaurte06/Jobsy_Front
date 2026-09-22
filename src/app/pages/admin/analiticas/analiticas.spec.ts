import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AdminAnalyticsPage } from './analiticas';

describe('AdminAnalyticsPage', () => {
  let component: AdminAnalyticsPage;
  let fixture: ComponentFixture<AdminAnalyticsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAnalyticsPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAnalyticsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
