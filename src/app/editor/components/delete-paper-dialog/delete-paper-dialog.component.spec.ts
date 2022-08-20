import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaperDialogComponent } from './delete-paper-dialog.component';

describe('DeletePaperDialogComponent', () => {
  let component: DeletePaperDialogComponent;
  let fixture: ComponentFixture<DeletePaperDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePaperDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePaperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
