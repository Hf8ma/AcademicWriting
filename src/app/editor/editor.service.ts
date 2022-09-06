import { PaperModel } from 'src/app/dashboard/model/paper-model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface EditorModel {
    paper: PaperModel;
    category_id: number;
  }
  

@Injectable()
export class EditorUrlParamsService {

    private subject = new Subject<EditorModel>();

    changeParam(paperCat: EditorModel): void {
      this.subject.next(paperCat);
    }
  
    clearParam(): void {
      this.subject.next();
    }
  
    getChanges(): Observable<any> {
      return this.subject.asObservable();
    }

}
