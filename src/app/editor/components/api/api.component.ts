import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';

import { FormControl, Validators } from '@angular/forms';




interface Schreibunterstuetzung {
  value: string;
  viewValue: string;
}




@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})







export class ApiComponent implements OnInit {
  constructor(

    private readonly http: HttpClient,
    public dialog: MatDialog,
  ) { }
  schreibunterstuetzungen: Schreibunterstuetzung[]
  public selectedCategory: string;
  public resultWordList: any;
  public resultLiteratureSearch: any;
  public unterstuetzungstyp: any;
  public suchWort = "";


  public semantische_relationen_FormControl = new FormControl('', [
    Validators.required,
  ]);

  //private base_url='<BACKEND PLACEHOLDER>/api/synonyms?word=zeigen'


  /*startet funktion je nachdem welcher button in editor gedrückt wurde/welcher parameter übergeben wurde.
  Bei der Literatursuche wird noch weiter danach unterschieden, ob direkt per DOI oder per Titel gesucht werden soll*/
  startApi(): void {
    //let ausgabe = this.http.get(this.base_url)
    //schreibunterstützung Literatursuche
    if (this.unterstuetzungstyp == 1) {
      if (this.selectedCategory == "doisuche") {
        this.checkDOIstatus(this.suchWort)
      } else if (this.selectedCategory == "titelsuche") {
        this.getDOIbyTitel()
      }
      //schreibunterstützung semantische Relationen suchen
    } else {
      this.getSemanticRelations()

    }


  }


  public getSemanticRelations(): void {
    console.log(this.suchWort)
    console.log(this.selectedCategory)
    //this.openDialog3()
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.get(`<BACKEND PLACEHOLDER>/api/${this.selectedCategory}?word=${this.suchWort}`, httpOptions)
      .subscribe(wordList => {
        console.log(wordList);
        this.resultWordList = wordList

      });

  }
  public openDialog(): void {
    this.dialog.open(ApiDialog, {
      width: '250px',
    });
  }
  /*gets the DOI by given Titel (might not always be the correct DOI for given titel and calls function checkDOIstatus with the DOI)
  TODO: change email to email of registered user? or some other email?*/
  public getDOIbyTitel(): void {
    //TODO: remove static title wenn texteingabe in this.suchwort funktioniert
    let title = this.suchWort

    console.log(this.suchWort)
    console.log(this.selectedCategory)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.http.get(`https://api.unpaywall.org/v2/search/?query=${title}&email=spam.mail@gmx.de`, httpOptions)
      .subscribe((response: any) => {
        console.log(response);
        console.log(response.results[0].response.doi)
        const doi = response.results[0].response.doi
        this.checkDOIstatus(doi)

      });
  }
  /*überprüft ob DOI in crossref database vorhanden ist- nur bei vorhandener DOI in crossref wird getSimilarLiteraturebyDOI aufgerufen*/
  public checkDOIstatus(doi: string): void {
    //TODO: remove static doi wenn texteingabe in this.suchwort funktioniert
    //doi = "10.7717/peerj.4375"

    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    //https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency
    //this.http.get(`https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency`, httpOptions)
    this.http.get(`https://api.crossref.org/works/${doi}/agency`, httpOptions)
      .subscribe((response: any) => {
        //console.log(response);
        // console.log(response.status);
        if (response.status == "ok") {
          this.getSimiliarLiteraturebyDOI(doi)
          // console.log("jo ok")
        }
        else {
          //console.log("not ok")
        }

      });
  }
  /* nimmt DOI und sucht damit bei crossref nach ähnlichen Titeln*/
  public getSimiliarLiteraturebyDOI(doi: string): void {

    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    //https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency
    //this.http.get(`https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency`, httpOptions)
    this.http.get(`https://api.crossref.org/works/${doi}`, httpOptions)
      .subscribe((response: any) => {
        console.log(response);
        console.log(response.message.author[0]) //für alle autoren?
        console.log(response.message.reference)
        let references = []
        if (response.message.reference != undefined) {
          response.message.reference.forEach(element => {
            references.push({ titel: element['article-title'], doi: element['DOI'] })
          });
          //var filtered = references
          this.resultLiteratureSearch = references
        } else if (response.message.author != undefined) {
          let authors = []
          response.message.author.forEach(element => {
            authors.push(element.family)
          });
          this.getSimiliarLiteraturebyAuthor(authors)
        }







      });
  }

  public getSimiliarLiteraturebyAuthor(authors: string[]): void {

    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    //https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency
    //this.http.get(`https://api.crossref.org/works/10.1037/0003-066X.59.1.29/agency`, httpOptions)
    this.http.get(`https://api.crossref.org/works?query.author=${authors[0]}`, httpOptions)
      .subscribe((response: any) => {
        console.log(response);
        let literatureRecommendations = []
        response.message.items.forEach(element => {
          //literatureRecommendations.push(element.title)
          literatureRecommendations.push({ titel: element['container-title'], doi: element['DOI'] })
        });
        console.log(literatureRecommendations)
        this.resultLiteratureSearch = literatureRecommendations
      });
  }

  /*
      getSemanticRelations(): Observable<Schreibunterstuetzung[]> {
    return this.http.get<Schreibunterstuetzung[]>(this.base_url)
  }
  */

  //const req = new HttpRequest('GET', '<BACKEND PLACEHOLDER>/api/synonyms?word=zeigen', {
  //reportProgress: true


  ngOnInit(): void {
  }




}


export class ApiDialog {
  constructor(public dialogRef: MatDialogRef<ApiDialog>) { }



  public closeDialog(): void {
    this.dialogRef.close();
  }
}

