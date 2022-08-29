import { Injectable } from '@angular/core';

@Injectable()
export class EditorUrlParamsService {

    categoryID_: number;
    paperID_: number;
    paper_: any;
  

    constructor() { }

    get categoryID(): any {
        return this.categoryID_;
    }

    set categoryID(CatIDval: any) {
        this.categoryID_ = CatIDval;
    }

   get paperID(): any {
        return this.paperID_;
        
    }
    
    set paperID(papaerID: any) {
        this.paperID_ = papaerID;
        
    }
    get paper(): any {
        return this.paper_;
    }

    set paper(paperval: any) {
        this.paper_ = paperval;
    }


}
