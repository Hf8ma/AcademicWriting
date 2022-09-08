import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NoteModel} from '../models/note-model';

@Component({
  selector: 'app-note-delete-dialog',
  templateUrl: './note-delete-dialog.component.html',
  styleUrls: ['./note-delete-dialog.component.scss']
})
export class NoteDeleteDialogComponent implements OnInit {
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<NoteDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NoteModel,
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

  deleteNote(): void{
    if (this.data && this.data.id){
      this.http.delete(`${this.serverUrl}note?id=${this.data.id}`, this.httpOptions)
        .subscribe(response => {
          this.dialogRef.close(response);
        });
    }
    this.dialogRef.close();
    return;
  }

}
