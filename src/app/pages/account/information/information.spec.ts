import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { InformationPage } from './information';

describe('InformationPage', () => {
  let component: InformationPage;
  let fixture: ComponentFixture<InformationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
