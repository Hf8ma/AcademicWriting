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
  displayedColumns: string[] = ['name','color','actions'];

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

  
  //  selectCategory(CategoryId: number) {
  //   //change category_id in paper record
  //   const updatedPaper = {
  //     content: this.getwholeText(),
  //     title: this.paper.title,
  //     last_modified: new Date(),
  //     id : this.paper.id,
  //     author_id: localStorage.getItem('user_id'),
  //     category_id: this.categoryId
  //   };

  //   this.http.put(`http://127.0.0.1:5000/api/paper?id=${this.paper.id}`, updatedPaper, this.httpOptions)
  //     .subscribe( response => {
  //       this.paper = response;
  //       this.snackBar.open('paper saved successfully', 'Close' , {
  //         duration: 6000
  //       });
  //     });
  //   this.dialogRef.close();
  //   this.router.navigate(['editor', this.data.id, 'edit', id]).then();
  //   // 
  //   return;
  //  }
}
