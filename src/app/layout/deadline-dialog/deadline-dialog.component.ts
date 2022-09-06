import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-deadline-dialog',
  templateUrl: './deadline-dialog.component.html',
  styleUrls: ['./deadline-dialog.component.scss']
})
export class DeadlineDialogComponent implements OnInit {
  deadlineForm: FormGroup;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<DeadlineDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.deadlineForm = this.fb.group({
      content: [this.data && this.data.content ? this.data.content : '', Validators.required],
      submission_date: [this.data && this.data.submission_date ? this.data.submission_date : '', Validators.required],
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
  }

  saveChanges(): void {
    if (this.deadlineForm.valid) {
      let body = {
        content: this.deadlineForm.value.content,
        submission_date: this.deadlineForm.value.submission_date,
        author_id: localStorage.getItem('user_id'),
      };
      if (this.data && this.data.id){
        body['id'] = this.data.id;
        this.http.put(`${this.serverUrl}deadline?id=${this.data.id}`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }else{
        this.http.post(`${this.serverUrl}deadline`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }
    }
    return;
  }

}
