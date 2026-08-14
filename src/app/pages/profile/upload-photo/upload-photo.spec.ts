import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { UploadPhotoPage } from './upload-photo';

describe('UploadPhotoPage', () => {
  let component: UploadPhotoPage;
  let fixture: ComponentFixture<UploadPhotoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPhotoPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPhotoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
