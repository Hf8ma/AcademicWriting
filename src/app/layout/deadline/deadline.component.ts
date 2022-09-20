import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DeadlineDialogComponent} from '../deadline-dialog/deadline-dialog.component';
import {DatePipe} from '@angular/common';
import {MatCalendar} from '@angular/material/datepicker';
import {DeadlineShowDialogComponent} from '../deadline-show-dialog/deadline-show-dialog.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-deadline',
  templateUrl: './deadline.component.html',
  styleUrls: ['./deadline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeadlineComponent implements OnInit {
  daysSelected: any[] = [];
  event: any;
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  pipe = new DatePipe('en-US');
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  constructor(private snackBar: MatSnackBar,
              private readonly http: HttpClient,
              private notificationService: NotificationService,
              public dialog: MatDialog) { }

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
    this.http.get(`${this.serverUrl}deadline`, this.httpOptions)
      .subscribe((response: any) => {
        this.daysSelected = response;
        this.calendar.updateTodaysDate();
      });
  }
  isSelected = (event: any) => {
    const date = this.pipe.transform(event, 'yyyy-MM-dd');
    return this.daysSelected.find(x => this.pipe.transform(x.submission_date, 'yyyy-MM-dd') === date) ? 'selected' : null;
  }
  select(event: any, calendar: any): void {
    const date = this.pipe.transform(event, 'yyyy-MM-dd');
    const index = this.daysSelected.findIndex(x => this.pipe.transform(x.submission_date, 'yyyy-MM-dd') === date);
    if (index < 0) {
      this.addDeadline(event, calendar);
    }
    else {
      this.getDeadline(index);
    }
    //delete
    // this.daysSelected.splice(index, 1);
    // calendar.updateTodaysDate();
  }

  addDeadline(event, calendar): void{
    const dialogRef = this.dialog.open(DeadlineDialogComponent, {
      width: '500px',
      data: { submission_date: event}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.daysSelected.push(result);
        calendar.updateTodaysDate();
        this.notificationService.update('update');
        this.snackBar.open('Deadline was created successfully.', 'Close' , {
          duration: 6000
        });
      }
    });
  }

  getDeadline(index): void{
    const dialogRef = this.dialog.open(DeadlineShowDialogComponent, {
      width: '350px',
      data: { content: this.daysSelected[index].content, submission_date: this.daysSelected[index].submission_date }
    });
  }

}
