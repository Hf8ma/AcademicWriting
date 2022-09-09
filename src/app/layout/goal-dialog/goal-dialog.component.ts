import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GoalModel} from '../models/goal-model';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit {

  goalForm: FormGroup;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<GoalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: GoalModel,
              private fb: FormBuilder,
              private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.goalForm = this.fb.group({
      content: [this.data && this.data.content ? this.data.content : '', Validators.required],
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
    if (this.goalForm.valid) {
      let body = {
        content: this.goalForm.value.content,
        author_id: localStorage.getItem('user_id'),
      };
      if (this.data && this.data.id){
        body['id'] = this.data.id;
        this.http.put(`${this.serverUrl}goal?id=${this.data.id}`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }else{
        this.http.post(`${this.serverUrl}goal`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }
    }
    return;
  }

}
