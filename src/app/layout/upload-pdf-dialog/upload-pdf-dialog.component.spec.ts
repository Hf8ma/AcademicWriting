import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPdfDialogComponent } from './upload-pdf-dialog.component';

describe('UploadPdfDialogComponent', () => {
  let component: UploadPdfDialogComponent;
  let fixture: ComponentFixture<UploadPdfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPdfDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
