import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
export interface CategoryModel {
  id?: number;
  name?: string;
  color?: string;
}
export interface PaperModel {
  id: number;
  title: string;
  created_at: string;
}

const PAPERS_DATA: PaperModel[] = [
  {id: 1, title: 'Hydrogen', created_at: '20.20.2022 9:22'},
  {id: 2, title: 'Helium', created_at: '20.20.2022 9:22'},
  {id: 3, title: 'Lithium', created_at: '20.20.2022 9:22'},
  {id: 4, title: 'Beryllium', created_at: '20.20.2022 9:22'},
  {id: 5, title: 'Boron', created_at: '20.20.2022 9:22'},
  {id: 6, title: 'Carbon', created_at: '20.20.2022 9:22'},
  {id: 7, title: 'Nitrogen', created_at: '20.20.2022 9:22'},
  {id: 8, title: 'Oxygen', created_at: '20.20.2022 9:22'},
  {id: 9, title: 'Fluorine', created_at: '20.20.2022 9:22'},
  {id: 10, title: 'Neon', created_at: '20.20.2022 9:22'},
];
@Component({
  selector: 'app-category-papers-dialog',
  templateUrl: './category-papers-dialog.component.html',
  styleUrls: ['./category-papers-dialog.component.scss']
})
export class CategoryPapersDialogComponent implements OnInit {
  categoryForm: FormGroup;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  displayedColumns: string[] = ['title', 'created_at', 'actions'];
  dataSource = PAPERS_DATA;
  constructor(public dialogRef: MatDialogRef<CategoryPapersDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryModel,
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
  }

  addNewPaper(){}
}
