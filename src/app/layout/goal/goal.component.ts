import { Component, OnInit } from '@angular/core';
import {GoalModel} from '../models/goal-model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {GoalDialogComponent} from '../goal-dialog/goal-dialog.component';
import {GoalDeleteDialogComponent} from '../goal-delete-dialog/goal-delete-dialog.component';
import { HighlightcomponentService } from '../services/highlightcomponent.service';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {
  show= false;
  goals: GoalModel[] = [];
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  constructor(private snackBar: MatSnackBar,
              private readonly http: HttpClient,
              public dialog: MatDialog,
              private highlightService: HighlightcomponentService) { }

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
    this.getGoals();
  }

  getGoals(): void {
    this.http.get(`${this.serverUrl}goal`, this.httpOptions)
      .subscribe((response: any) => {
        this.goals = response;
      });
  }

  addGoal(): void{
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.goals.push(result);
        this.snackBar.open('Goal was created successfully.', 'Close' , {
          duration: 6000
        });
      }
    });
  }

  public editGoal(goal: GoalModel): void{
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: goal }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.goals.findIndex(x => x.id === goal.id);
        this.goals[index] = result;
        this.snackBar.open('Goal was updated successfully.', 'Close' , {
          duration: 6000
        });
      }
    });
  }

  public deleteGoal(goal: GoalModel): void {
    const dialogRef = this.dialog.open(GoalDeleteDialogComponent, {
      width: '250px',
      data: goal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message) {
        const index = this.goals.findIndex( x => x.id === goal.id );
        this.goals = this.goals.filter( x => x.id !== goal.id);
        this.snackBar.open(result.message, 'Close', {
          duration: 6000
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.highlightService.getChanges().subscribe(componentName => {
      if (componentName.text == 'goals') {
        this.show = true;
        setTimeout(()=>{
          this.show = false;
        },2000)
      }
    });
  }
}
