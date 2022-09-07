import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NoteModel} from '../models/note-model';


@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss'],
})
export class NoteDialogComponent implements OnInit {
  noteForm: FormGroup;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  constructor(public dialogRef: MatDialogRef<NoteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NoteModel,
              private fb: FormBuilder,
              private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.noteForm = this.fb.group({
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
    if (this.noteForm.valid) {
      let body = {
        content: this.noteForm.value.content,
        author_id: localStorage.getItem('user_id'),
      };
      if (this.data && this.data.id){
        body['id'] = this.data.id;
        this.http.put(`${this.serverUrl}note?id=${this.data.id}`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }else{
        this.http.post(`${this.serverUrl}note`, body, this.httpOptions)
          .subscribe(response => {
            this.dialogRef.close(response);
          });
      }
    }
    return;
  }

}
