import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPapersDialogComponent } from './category-papers-dialog.component';

describe('CategoryPapersDialogComponent', () => {
  let component: CategoryPapersDialogComponent;
  let fixture: ComponentFixture<CategoryPapersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryPapersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPapersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
