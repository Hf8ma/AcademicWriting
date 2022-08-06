import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  stunden = 0;
  minuten = 25;
  isChecked = false;

  constructor(public dialogRef: MatDialogRef<DialogComponent>) { }

  public startTimer(): void {
    this.isChecked = true;
    localStorage.setItem('timerChecked', "true")

  };

  public closeDialog(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (localStorage.getItem('timerChecked') == 'true') {
      this.isChecked = true

    }
  }

  ngOnDestroy() {

    console.log("hello from destroydialog")
  }

}
