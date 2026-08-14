import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { MyApplicationsPage } from './my-applications';

describe('MyApplicationsPage', () => {
  let component: MyApplicationsPage;
  let fixture: ComponentFixture<MyApplicationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApplicationsPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MyApplicationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
