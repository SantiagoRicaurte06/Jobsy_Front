import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { HelpCenterPage } from './centro-ayuda';

describe('HelpCenterPage', () => {
  let component: HelpCenterPage;
  let fixture: ComponentFixture<HelpCenterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCenterPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpCenterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
