import { EditorUrlParamsService } from './../../editor/editor.service';
import { DeletePaperDialogComponent } from './../../editor/components/delete-paper-dialog/delete-paper-dialog.component';
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PaperModel } from "src/app/dashboard/model/paper-model";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username = '';
  isDashboardRoute = true;
  dataSource = new MatTableDataSource<PaperModel>([]);


  constructor(private readonly http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public urlParamService: EditorUrlParamsService) {
    
    this.username = localStorage.getItem('user_name');
    this.isDashboardRoute = this.router.url && this.router.url.includes('dashboard') ? true : false;
  
  }

  ngOnInit(): void {
  
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.url && event.url.includes('dashboard') ? true : false;

      }
    });
  }

  public deletePaper(paper: PaperModel): void {
    console.log('this paper id ', this.urlParamService.paperID)
    const dialogRef = this.dialog.open(DeletePaperDialogComponent, {
      width: '250px',
      data: { id: this.urlParamService.paperID}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        console.log('paper has been deleted and I am after closed deletedialog')
             
        this.snackBar.open(result.message, 'Close', {
          duration: 6000
        });
        this.goDashboard();
      }
    });
  }

  public goDashboard(): void{
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
}
