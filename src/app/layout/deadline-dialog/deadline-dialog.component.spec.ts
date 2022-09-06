import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineDialogComponent } from './deadline-dialog.component';

describe('DeadlineDialogComponent', () => {
  let component: DeadlineDialogComponent;
  let fixture: ComponentFixture<DeadlineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadlineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
