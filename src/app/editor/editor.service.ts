import { Injectable } from '@angular/core';

@Injectable()
export class EditorUrlParamsService {

    categoryID_: number;
    paperID_: number;

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

}
