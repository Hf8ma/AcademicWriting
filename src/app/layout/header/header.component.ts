
import { EditorUrlParamsService } from './../../editor/editor.service';
import { DeletePaperDialogComponent } from './../../editor/components/delete-paper-dialog/delete-paper-dialog.component';
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PaperModel } from "src/app/dashboard/model/paper-model";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatgoriesListComponent } from '../catgories-list/catgories-list.component';
import { DashboardFolderService } from 'src/app/dashboard/services/dashboard-folder.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username = '';
  isDashboardRoute = true;
  dataSource = new MatTableDataSource<PaperModel>([]);
  catgColor: string;
  category_id: number;
  paper: PaperModel;

  // allCategories = [];
  // httpOptions = {};
   serverUrl = 'http://127.0.0.1:5000/api/';



  constructor(private readonly http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private urlParamService: EditorUrlParamsService,
    private location: Location) {

    this.username = localStorage.getItem('user_name');
    this.isDashboardRoute = this.router.url && this.router.url.includes('dashboard') ? true : false;

  }

  ngOnInit(): void {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.url && event.url.includes('dashboard') ? true : false;

      }
    });
    if (this.isDashboardRoute == false) {
      const changes = this.urlParamService.getChanges().subscribe(paperCat => {
        console.log('header,, paperCat && paperCat.paper', paperCat && paperCat.paper)
        if (paperCat && paperCat.paper) {
          this.paper = paperCat.paper;
          this.category_id = paperCat.category_id;
          console.log('header ngoninit, paper', this.paper);
          console.log('header ngoninit, category id', this.category_id);
        }
      });
    }



  }


  public deletePaper(paper: PaperModel): void {
    if (this.paper) {// if the paper is stored in the database then you can delete it

      const dialogRef = this.dialog.open(DeletePaperDialogComponent, {
        width: '250px',
        data: { id: this.paper.id }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(' after closed , print result', result)
        if (result && result.message) {
          console.log('paper has been deleted and I am after closed deletedialog')

          this.snackBar.open(result.message, 'Close', {
            duration: 6000
          });
          this.goDashboard();
        }
      });
    }
    else {// if the paper is NOT stored in the database then you can NOT delete it
      this.snackBar.open('Sorry, the paper is not saved yet', 'Close', {
        duration: 6000
      });
    }
  }

  public goDashboard(): void {
    // clearparam
    //this.urlParamService.clearParam();
    this.router.navigate(['dashboard']);
  }


  public deleteUser(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };

    this.http.delete(`http://127.0.0.1:5000/api/user?user_id=${localStorage.getItem('user_id')}`, httpOptions)
      .subscribe(user => {
        this.logout();
      });

  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigateByUrl('').then(r => r);
  }



  changeCategory() {
    const dialogRef = this.dialog.open(CatgoriesListComponent, {
      width: '600px'
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };
    dialogRef.afterClosed().subscribe(selectedCategory => {
      if (selectedCategory && selectedCategory.id) {
        console.log(selectedCategory.id);
        this.catgColor = selectedCategory.color;
        const updatedPaper = {
          content: this.paper.content,
          title: this.paper.title,
          last_modified: this.paper.last_modified,
          id: this.paper.id,
          author_id: localStorage.getItem('user_id'),
          category_id: selectedCategory.id
        };

        this.http.put(`http://127.0.0.1:5000/api/paper?id=${this.paper.id}`, updatedPaper, httpOptions)
          .subscribe((updatedPAper: PaperModel) => {
            console.log(updatedPAper);
            this.urlParamService.changeParam({
              paper: updatedPAper,
              category_id: updatedPAper.category_id
            });
          });
        const url = '/editor/'+ selectedCategory.id + '/edit/' + this.paper.id;

        this.location.go(url);
   
      }
    });

  }
}
