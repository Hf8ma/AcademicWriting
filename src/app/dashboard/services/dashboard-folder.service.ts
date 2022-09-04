import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DashboardFolderService {

  private categories_= [];

  constructor() { }

  get categories(): any {
      return this.categories_;
  }

  set categories(Catval) {
      this.categories_ = Catval;
  }
}
