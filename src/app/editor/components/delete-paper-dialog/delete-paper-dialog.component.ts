import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface PaperModel {
  id: number;
  title: string;
  created: string;
  category_id: number;
  last_modified: string;
  content: string;
}

@Component({
  selector: 'app-delete-paper-dialog',
  templateUrl: './delete-paper-dialog.component.html',
  styleUrls: ['./delete-paper-dialog.component.scss']
})
export class DeletePaperDialogComponent implements OnInit {
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<DeletePaperDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PaperModel,
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

  deletePaper(): void {
      if (this.data){
        this.http.delete(`${this.serverUrl}paper?id=${this.data.id}`, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }
      this.dialogRef.close();
      return;
  }
}
