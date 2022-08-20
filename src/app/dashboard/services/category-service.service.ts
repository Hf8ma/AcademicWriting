import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  private subject = new Subject<any>();

  changeCategoryList(message: string): void {
    this.subject.next({ text: message });
  }

  clearCategoryList(): void {
    this.subject.next();
  }

  getChanges(): Observable<any> {
    return this.subject.asObservable();
  }
}
