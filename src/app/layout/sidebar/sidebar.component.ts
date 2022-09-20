import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditorUrlParamsService } from 'src/app/editor/editor.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isDashboardRoute = true;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  paper: any;
  checked = false;

  constructor(private router: Router,
    public urlParamService: EditorUrlParamsService,
    private readonly http: HttpClient) {
    this.isDashboardRoute = this.router.url && this.router.url.includes('dashboard') ? true : false;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.url && event.url.includes('dashboard') ? true : false;
      }
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

    const changes = this.urlParamService.getChanges().subscribe(updatedPaper => {
      console.log('ngoninit editor, before if updatedpaper');
      if (updatedPaper.paper && updatedPaper.category_id) {
        this.paper = updatedPaper.paper;
      }
    });

  }

  changed() {
    //post a request with the content of text editor.. 
    //text_to_be_tested
    let body = {
      text: this.paper.content
    };
  if(this.checked== false){
    this.http.post(`${this.serverUrl}plagiarism`, body, this.httpOptions)
      .subscribe(response => {
        console.log(response)
      });
  }
    
  }


}
