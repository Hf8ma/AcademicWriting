import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CategoryDialogComponent} from './category-dialog/category-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        this.snackBar.open(result.message, 'Close' , {
          duration: 6000
        });
      }
    });
  }

}
