import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog  } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryModel } from 'src/app/dashboard/model/category-model';


export interface allCategories {
  name: string;
  author_id: number;
  id: number;
  color: string;
  created: string;
}




@Component({
  selector: 'app-catgories-list',
  templateUrl: './catgories-list.component.html',
  styleUrls: ['./catgories-list.component.scss']
})
export class CatgoriesListComponent implements OnInit {
  dataSource = new MatTableDataSource<allCategories>([]);
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  displayedColumns: string[] = ['name','color'];

  constructor(public dialogRef: MatDialogRef<CatgoriesListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryModel[],
              private readonly http: HttpClient,
              public dialog: MatDialog,
             ) { }

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
    this.getCategories();
  }


  getCategories(): void{
    this.http.get(`${this.serverUrl}category`, this.httpOptions)
      .subscribe((response: any) => {
        this.dataSource.data = response;
        console.log('this.dataSource.data',this.dataSource.data)
      });
  }

  
   selectCategory(Category) {
    console.log('in dialog ,selected category is ',Category)
    this.dialogRef.close(Category);
    
    return;
   }
}
