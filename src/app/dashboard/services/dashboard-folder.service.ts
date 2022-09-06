import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardFolderService {
  private subject = new Subject<any>();
  private categories_= [];

  constructor() { }

  get categories(): any {
      return this.categories_;
  }

  set categories(Catval) {
      this.categories_ = Catval;
  }


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
