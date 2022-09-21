import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface matchModel {
  fileName: string,
  match:[]
}

@Component({
  selector: 'app-plagiarism-matches',
  templateUrl: './plagiarism-matches.component.html',
  styleUrls: ['./plagiarism-matches.component.scss']
})
export class PlagiarismMatchesComponent implements OnInit {
dataSource = new MatTableDataSource<matchModel>([]);
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  displayedColumns: string[] = ['fileName','Match'];

  constructor(public dialogRef: MatDialogRef<PlagiarismMatchesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any[],
              public dialog: MatDialog,
             ) { }

  ngOnInit(): void {
    this.dataSource.data = this.data;
  }
}

