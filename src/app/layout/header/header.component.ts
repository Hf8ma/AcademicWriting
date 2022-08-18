import { Component } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username = '';
  constructor(    private readonly http: HttpClient,
                  private router: Router) {
    this.username = localStorage.getItem('user_name');
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
