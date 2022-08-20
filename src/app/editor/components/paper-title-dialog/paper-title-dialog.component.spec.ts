import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperTitleDialogComponent } from './paper-title-dialog.component';

describe('PaperTitleDialogComponent', () => {
  let component: PaperTitleDialogComponent;
  let fixture: ComponentFixture<PaperTitleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperTitleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperTitleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
