import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineShowDialogComponent } from './deadline-show-dialog.component';

describe('DeadlineShowDialogComponent', () => {
  let component: DeadlineShowDialogComponent;
  let fixture: ComponentFixture<DeadlineShowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadlineShowDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineShowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
