import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CategoryModel } from '../model/category-model';
import { PaperModel } from '../model/paper-model';
import {Router} from '@angular/router';
import {DeletePaperDialogComponent} from '../../editor/components/delete-paper-dialog/delete-paper-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-category-papers-dialog',
  templateUrl: './category-papers-dialog.component.html',
  styleUrls: ['./category-papers-dialog.component.scss']
})
export class CategoryPapersDialogComponent implements OnInit {
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  displayedColumns: string[] = ['title', 'created', 'last_modified', 'actions'];
  dataSource = new MatTableDataSource<PaperModel>([]);

  constructor(public dialogRef: MatDialogRef<CategoryPapersDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryModel,
              private readonly http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) { }

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
    this.getPapers();
  }

  getPapers(): void{
    this.http.get(`${this.serverUrl}paper?category_id=${this.data.id}`, this.httpOptions)
      .subscribe((response: any) => {
        this.dataSource.data = response;
      });
  }


  addNewPaper(): void{
    this.dialogRef.close();
    this.router.navigate(['editor', this.data.id]);
  }

  editPaper(id: number): void{
    this.dialogRef.close();
    this.router.navigate(['editor', this.data.id, 'edit', id]).then();
  }


  public deletePaper(paper: PaperModel): void {
    const dialogRef = this.dialog.open(DeletePaperDialogComponent, {
      width: '250px',
      data: paper
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        const ind = this.dataSource.data.findIndex( x => x.id === paper.id );
        this.dataSource.data = this.dataSource.data.filter( x => x.id !== paper.id);
        this.snackBar.open(result.message, 'Close', {
          duration: 6000
        });
      }
    });
  }
}
