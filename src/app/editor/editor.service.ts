import { Injectable } from '@angular/core';

@Injectable()
export class EditorUrlParamsService {

    private categoryID_: number;
    private paperID_: number;
    private paper_: any;
  

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
