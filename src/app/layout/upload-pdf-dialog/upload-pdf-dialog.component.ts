import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-upload-pdf-dialog',
  templateUrl: './upload-pdf-dialog.component.html',
  styleUrls: ['./upload-pdf-dialog.component.scss']
})
export class UploadPdfDialogComponent implements OnInit {

  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  file: FormControl = new FormControl('', Validators.required);
  files: FileList;

  constructor(public dialogRef: MatDialogRef<UploadPdfDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };
  }

  saveChanges(): void {
    if (this.file.valid) {
      let fd = new FormData();
      fd.append('file', this.files[0], this.files[0].name);
      fd.append('author_id', localStorage.getItem('user_id'));
      console.log(fd.get('file'));
      this.http.post(`${this.serverUrl}file`, fd, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
    }
    return;
  }

  handleFileInputChange(files: FileList): void {
    this.files = files;
    if (files.length) {
      const f = files[0];
      this.file.patchValue(`${f.name}`);
    }
  }

}
