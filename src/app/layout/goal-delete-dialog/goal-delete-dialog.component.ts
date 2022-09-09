import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GoalModel} from '../models/goal-model';

@Component({
  selector: 'app-goal-delete-dialog',
  templateUrl: './goal-delete-dialog.component.html',
  styleUrls: ['./goal-delete-dialog.component.scss']
})
export class GoalDeleteDialogComponent implements OnInit {

  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<GoalDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: GoalModel,
              private readonly http: HttpClient) { }

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
  }

  deleteGoal(): void{
    if (this.data && this.data.id){
      this.http.delete(`${this.serverUrl}goal?id=${this.data.id}`, this.httpOptions)
        .subscribe(response => {
          this.dialogRef.close(response);
        });
    }
    this.dialogRef.close();
    return;
  }

}
