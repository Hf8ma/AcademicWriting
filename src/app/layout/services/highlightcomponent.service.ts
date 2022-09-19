import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HighlightcomponentService {
  private subject = new Subject<any>();

  highlightComponent(componentName: string): void {
    this.subject.next({ text: componentName });
  }

  
  getChanges(): Observable<any> {
    return this.subject.asObservable();
  }

}



