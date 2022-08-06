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

  public emailFormControl = new FormControl('', [
    Validators.email,
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
      })
    };

    this.http.post('<BACKEND PLACEHOLDER>/api/auth/login',
      { username: this.usernameFormControl.value, password: this.passwordFormControl.value }, httpOptions)
      .subscribe((user: any) => {
        console.log(user.access_token)
        localStorage.setItem('access_token', user.access_token);
        localStorage.setItem('user_id', this.usernameFormControl.value);
        this.router.navigateByUrl('editor').then(r => r);
      });
  }

  public registrieren(): void {
    const dialogRef = this.dialog.open(RegistrierungsDialogComponent, {
      width: '300px',
      height: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
