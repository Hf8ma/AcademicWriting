import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CategoryModel} from '../model/category-model';
import {CategoryServiceService} from '../services/category-service.service';

@Component({
  selector: 'app-delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.scss']
})
export class DeleteCategoryDialogComponent implements OnInit {
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<DeleteCategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryModel,
              private readonly http: HttpClient,
              private categoryService: CategoryServiceService) { }

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
  }

  deleteCategory() {
      if (this.data && this.data.id){
        this.http.delete(`${this.serverUrl}category?id=${this.data.id}`, this.httpOptions)
          .subscribe(response => {
            this.categoryService.changeCategoryList('yes');
            this.dialogRef.close(response);
          });
      }
      this.dialogRef.close();
      return;
  }
}
