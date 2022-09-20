import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private subject = new Subject<any>();

  update(update: string): void {
    this.subject.next({ text: update });
  }

  
  getChanges(): Observable<any> {
    return this.subject.asObservable();
  }
}
