import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EmailSentPage } from './email-sent';

describe('EmailSentPage', () => {
  let component: EmailSentPage;
  let fixture: ComponentFixture<EmailSentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSentPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
