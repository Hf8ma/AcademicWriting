import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RegistrierungsDialogComponent } from '../registrierungs-dialog/registrierungs-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public hide = true;

  public usernameFormControl = new FormControl('', [
    Validators.required,
  ]);

  public passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(private readonly http: HttpClient, public dialog: MatDialog, private router: Router) {
  }

  public login(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };

    this.http.post('http://127.0.0.1:5000/api/auth/login',
    JSON.stringify(
       { username: this.usernameFormControl.value, password: this.passwordFormControl.value }), httpOptions)
      .subscribe((user: any) => {
        console.log(user.access_token)
        localStorage.setItem('access_token', user.access_token);
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('user_name', user.username);
        this.router.navigateByUrl('editor').then(r => r);
      });
  }

  public registrieren(): void {
    const dialogRef = this.dialog.open(RegistrierungsDialogComponent, {
      width: '300px',
      height: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result in login.ts when calling  dialogRef.afterClosed(): ', result);
    });
  }
}
