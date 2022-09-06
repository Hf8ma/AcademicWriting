import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-deadline-show-dialog',
  templateUrl: './deadline-show-dialog.component.html',
  styleUrls: ['./deadline-show-dialog.component.scss']
})
export class DeadlineShowDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeadlineShowDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  dueDays(date) {
    const today = new Date();
    const _date = new Date(date);
    return Math.floor((Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) ) / (1000 * 60 * 60 * 24));
  }
}
