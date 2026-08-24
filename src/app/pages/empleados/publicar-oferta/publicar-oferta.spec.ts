import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PublishOfferPage } from './publicar-oferta';

describe('PublishOfferPage', () => {
  let component: PublishOfferPage;
  let fixture: ComponentFixture<PublishOfferPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishOfferPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishOfferPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
