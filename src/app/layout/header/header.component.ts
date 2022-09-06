import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  username = '';
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  notificationsList = [];
  notificationsCounter = 0 ;
  constructor(    private readonly http: HttpClient,
                  private router: Router) {
    this.username = localStorage.getItem('user_name');
  }

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
    this.http.get(`${this.serverUrl}deadline?date=1`, this.httpOptions)
      .subscribe((response: any) => {
        this.notificationsList = response;
        this.notificationsCounter = response.length;
      });
  }

  public deleteUser(): void {
    this.http.delete(`${this.serverUrl}user?user_id=${localStorage.getItem('user_id')}`, this.httpOptions)
      .subscribe(user => {
        this.logout();
      });

  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigateByUrl('').then(r => r);
  }

  dueDays(date) {
    const today = new Date();
    const _date = new Date(date);
    return Math.floor((Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) ) / (1000 * 60 * 60 * 24));
  }
}
