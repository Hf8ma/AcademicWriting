import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {
  @Input() countUporDown = '';
  @Input() stunden = 0;
  @Input() minuten = 0;


  private subscription: Subscription;

  public dateNow = new Date();
  public dDay = new Date('May 16 2021 00:00:00');
  public milliSecondsInASecond = 1000;
  public hoursInADay = 24;
  public minutesInAnHour = 60;
  public SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday = 0
  public minutesToDday = 0
  public hoursToDday = 0
  //public daysToDday;
  public timeAtStop = 0;
  public timerStarted = false;

  public timeStopped = false;


  public stopTimer(): void {
    if (this.timeStopped) {
      this.subscription.unsubscribe();
      this.timeAtStop = 0
      this.secondsToDday = 0
      this.minutesToDday = 0
      this.hoursToDday = 0
    }
    else {
      this.timeAtStop = this.timeDifference
      console.log(this.timeAtStop)
      this.subscription.unsubscribe();
      this.timeStopped = true;
    }


    //window.alert("sometext")
    /*       console.log(localStorage.getItem('stunden'));
          console.log(localStorage.getItem('minuten'));
          console.log(localStorage.getItem('sekunden')); */
    //this.timeAtStop = (parseInt(localStorage.getItem('sekunden')) * 1000) + (parseInt(localStorage.getItem('minuten')) * 60000) + (parseInt(localStorage.getItem('stunden')) * 360000)

  }

  public startTimer(): void {
    if (!this.timerStarted) {
      this.dDay = new Date();
      if (this.countUporDown == "down") {
        let tempMinutes = this.dDay.getMinutes() + this.minuten;
        if (tempMinutes >= 60) {
          this.stunden += 1
        }
        this.dDay.setMinutes(tempMinutes)
        this.dDay.setHours(this.dDay.getHours() + this.stunden)
        this.subscription = interval(1000)
          .subscribe(x => { this.getTimeDifferenceCountDown(); });
      }
      else {
        console.log("hochzählen")
        this.subscription = interval(1000)
          .subscribe(x => { this.getTimeDifferenceCountUp(); });

        this.timerStarted = true
      }
    } else {
      if (this.timeStopped) {
        this.restart()
      }


    }


    // this.restart()
    /*       console.log(localStorage.getItem('stunden'));
          console.log(localStorage.getItem('minuten'));
          console.log(localStorage.getItem('sekunden')); */

  }

  public restart() {
    //this.dDay = new Date();
    this.dDay.setTime(new Date().getTime() - this.timeAtStop)
    this.timeStopped = false;
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifferenceCountUp(); });

  }


  private getTimeDifferenceCountUp() {
    this.timeDifference = (new Date().getTime() - this.dDay.getTime());
    //console.log(this.timeAtStop)
    if (this.timeDifference > 1500000) {
      window.alert("Nimm dir ne Pause, iss ein Snickers")
      this.subscription.unsubscribe();
    }

    this.allocateTimeUnits(this.timeDifference);
  }

  private getTimeDifferenceCountDown() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    //this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }


  ngOnInit() {

  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

}