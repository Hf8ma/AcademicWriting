import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatgoriesListComponent } from './catgories-list.component';

describe('CatgoriesListComponent', () => {
  let component: CatgoriesListComponent;
  let fixture: ComponentFixture<CatgoriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatgoriesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatgoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
