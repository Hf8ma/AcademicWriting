import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CategoryDialogComponent} from '../category-dialog/category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteCategoryDialogComponent} from '../delete-category-dialog/delete-category-dialog.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  all_categories = [];
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar,
              private readonly http: HttpClient) { }

  ngOnInit(): void {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('access_token')}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        })
      };
      this.http.get(`${this.serverUrl}category`, this.httpOptions)
        .subscribe((response: any) => {
          this.all_categories = response;
          console.log('this.categories  ', this.all_categories);
        });
  }


  openEditCategoryDialog(category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        this.snackBar.open(result.message, 'Close' , {
          duration: 6000
        });
      }
    });
  }

  openDeleteCategoryDialog(category): void {
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent, {
      width: '250px',
      data: category
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
