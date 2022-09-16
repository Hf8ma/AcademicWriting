import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  view: any[] = [1200, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Hours';
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#c39797', '#90EE90', '#7097a4', '#beeee6', '#df9fb9', '#00d1cc', '#7097a4', '#8fffa0', '#dc143d']
  };
  chosenYearDate = new Date();

  public hoursPerMonth = [
    {
      "name": "January",
      "value": 0
    },
    {
      "name": "February",
      "value": 0
    },
    {
      "name": "March",
      "value": 0
    },
    {
      "name": "April",
      "value": 0
    },
    {
      "name": "May",
      "value": 0
    },
    {
      "name": "Jun",
      "value": 0
    },
    {
      "name": "July",
      "value": 0
    },
    {
      "name": "August",
      "value": 0
    },
    {
      "name": "Septemper",
      "value": 0
    },
    {
      "name": "October",
      "value": 0
    },
    {
      "name": "November",
      "value": 0
    },
    {
      "name": "December",
      "value": 0
    }
  ];
  httpOptions = {};
  serverUrl = 'http://127.0.0.1:5000/api/';
  average = 0;

  constructor(private snackBar: MatSnackBar,
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
    this.getStatistics();
  }

  getStatistics(): void{
    const year = this.chosenYearDate.getFullYear();
    this.http.get(`${this.serverUrl}duration?date=${year}`, this.httpOptions)
      .subscribe((response: any) => {
        if (response){
          this.average = 0;
          let count = 0;
          response.forEach(item => {
            this.average += item.value;
            if(item.value !== 0){
            count += 1;
            }
          });
          if (count){
           this.average = this.average / count;
          }
          if (this.average){
              this.hoursPerMonth = response;
          }else{
            this.hoursPerMonth =  [{
              "name": "January",
              "value": 0
            },
              {
                "name": "February",
                "value": 0
              },
              {
                "name": "March",
                "value": 0
              },
              {
                "name": "April",
                "value": 0
              },
              {
                "name": "May",
                "value": 0
              },
              {
                "name": "Jun",
                "value": 0
              },
              {
                "name": "July",
                "value": 0
              },
              {
                "name": "August",
                "value": 0
              },
              {
                "name": "Septemper",
                "value": 0
              },
              {
                "name": "October",
                "value": 0
              },
              {
                "name": "November",
                "value": 0
              },
              {
                "name": "December",
                "value": 0
              }];
          }

        }
      });
  }

  changeYear($event): void{
    this.getStatistics();
  }

}
