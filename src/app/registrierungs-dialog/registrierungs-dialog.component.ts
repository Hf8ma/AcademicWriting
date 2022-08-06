import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registrierungs-dialog',
  templateUrl: './registrierungs-dialog.component.html',
  styleUrls: ['./registrierungs-dialog.component.scss']
})
export class RegistrierungsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RegistrierungsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private readonly http: HttpClient) { }

  public hide = true;

  public usernameFormControl = new FormControl('', [
    Validators.required,
  ]);

  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  public passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit(): void {
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public registrieren(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.post('<BACKEND PLACEHOLDER>/api/user',
      {
        username: this.usernameFormControl.value, email: this.emailFormControl.value,
        password: this.passwordFormControl.value
      }, httpOptions).subscribe(user => {
        console.log(user)
      });

    this.onClose();
  }
}

export interface DialogData {
  username: string;
  email: string;
  password: string;
}
