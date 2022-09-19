import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { NoteModel } from '../models/note-model';
import { NoteDeleteDialogComponent } from '../note-delete-dialog/note-delete-dialog.component';
import { HighlightcomponentService } from '../services/highlightcomponent.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})

export class NotesComponent implements OnInit {
  show= false;
  notes: NoteModel[] = [];
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';

  

  constructor(private snackBar: MatSnackBar,
    private readonly http: HttpClient,
    public dialog: MatDialog,
    private highlightService: HighlightcomponentService) {

  }

  ngOnInit() {
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
    this.getNotes();
  }

  getNotes(): void {
    this.http.get(`${this.serverUrl}note`, this.httpOptions)
      .subscribe((response: any) => {
        this.notes = response;
      });
  }

  addNote(): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notes.push(result);
        this.snackBar.open('Note was created successfully.', 'Close', {
          duration: 6000
        });
      }
    });
  }

  public editNote(note: NoteModel): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: note
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.notes.findIndex(x => x.id === note.id);
        this.notes[index] = result;
        this.snackBar.open('Note was updated successfully.', 'Close', {
          duration: 6000
        });
      }
    });
  }

  public deleteNote(note: NoteModel): void {
    const dialogRef = this.dialog.open(NoteDeleteDialogComponent, {
      width: '250px',
      data: note
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        const index = this.notes.findIndex(x => x.id === note.id);
        this.notes = this.notes.filter(x => x.id !== note.id);
        this.snackBar.open(result.message, 'Close', {
          duration: 6000
        });
      }
    });
  }

  
  ngAfterViewInit(): void {
    this.highlightService.getChanges().subscribe(componentName => {
      if (componentName.text == 'notes') {
        this.show = true;
        setTimeout(()=>{
          this.show = false;
        },2000)
      }
    });
  }
}
