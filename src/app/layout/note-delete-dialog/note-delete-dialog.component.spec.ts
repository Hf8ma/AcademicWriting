import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDeleteDialogComponent } from './note-delete-dialog.component';

describe('NoteDeleteDialogComponent', () => {
  let component: NoteDeleteDialogComponent;
  let fixture: ComponentFixture<NoteDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
