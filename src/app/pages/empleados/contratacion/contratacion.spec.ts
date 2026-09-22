import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { HiringPage } from './contratacion';

describe('HiringPage', () => {
  let component: HiringPage;
  let fixture: ComponentFixture<HiringPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
