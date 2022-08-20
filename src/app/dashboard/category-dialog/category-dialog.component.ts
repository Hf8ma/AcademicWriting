import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CategoryModel} from '../model/category-model';
import {CategoryServiceService} from '../services/category-service.service';

@Component({
  selector: 'app-paper-title-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryModel,
              private fb: FormBuilder,
              private readonly http: HttpClient,
              private categoryService: CategoryServiceService) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [this.data && this.data.name ? this.data.name : '', Validators.required],
      color: [this.data && this.data.color ? this.data.color : '', Validators.required],
    });
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

  saveChanges() {
    if (this.categoryForm.valid) {
      let body = {
        name: this.categoryForm.value.name,
        color: this.categoryForm.value.color,
        author_id: localStorage.getItem('user_id'),
      };
      if (this.data && this.data.id){
        body['id'] = this.data.id;
        this.http.put(`${this.serverUrl}category?id=${this.data.id}`, body, this.httpOptions)
          .subscribe(response => {
            this.categoryService.changeCategoryList('yes');
            this.dialogRef.close(response);
          });
      }else{
        this.http.post(`${this.serverUrl}category`, body, this.httpOptions)
          .subscribe(response => {
            this.categoryService.changeCategoryList('yes');
            this.dialogRef.close(response);
          });
      }
    }
    return;
  }
}
