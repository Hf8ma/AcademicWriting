import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
export interface PaperModel {
  id?: any;
  title?: any;
}

@Component({
  selector: 'app-paper-title-dialog',
  templateUrl: './paper-title-dialog.component.html',
  styleUrls: ['./paper-title-dialog.component.scss']
})
export class PaperTitleDialogComponent implements OnInit {
  paperTitleForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<PaperTitleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PaperModel,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.paperTitleForm = this.fb.group({
      title: [this.data && this.data.title ? this.data.title : '', Validators.required],
    });
  }

  saveChanges(): void{
    if (this.paperTitleForm.valid) {
            this.dialogRef.close(this.paperTitleForm.value.title);
    }
    return;
  }
}
