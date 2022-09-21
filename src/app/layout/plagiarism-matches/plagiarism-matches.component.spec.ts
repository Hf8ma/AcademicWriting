import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagiarismMatchesComponent } from './plagiarism-matches.component';

describe('PlagiarismMatchesComponent', () => {
  let component: PlagiarismMatchesComponent;
  let fixture: ComponentFixture<PlagiarismMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlagiarismMatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlagiarismMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
