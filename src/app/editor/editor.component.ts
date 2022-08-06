import { MatDialog } from '@angular/material/dialog';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DialogComponent } from './components/dialog/dialog.component';
import { ApiComponent } from './components/api/api.component';
import { MarkdownService } from 'ngx-markdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';




@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewChecked {
  public musikToggleActivelofi = false;
  public musikToggleActiveclassic = false;
  public musikToggleActiverain = false;
  public focusText = true;

  public sizePage = {
    width: 13,
    height: 18
  };

  public paddingPage = {
    top: 2,
    right: 2,
    bottom: 2,
    left: 2
  };

  public pages = [
    {
      htmlContent: null,
      full: false,
      innerText: null
    },
  ];

  public currentPaper = null;
  public currentPage = 0;
  public currentChar = null;
  public element: HTMLElement;
  public runAfterViewChecked = false;
  public wordcountlaenge = 0;
  public wordList: string[];
  public papers: any[];
  public averageSentenceLength = 0
  public selectedCategory: string;

  public schreibunterstuetzungen = [
    { value: 'synonyms', viewValue: 'Synonyme' },
    { value: 'antonyms', viewValue: 'Antonyme' },
    { value: 'hypernyms', viewValue: 'Hyperonyme' },
    { value: 'hyponyms', viewValue: 'Hyponyme' },
    { value: 'meronyms', viewValue: 'Meronyme' },
    { value: 'holonyms', viewValue: 'Holonyme' },
  ];
  public zitationssuchen = [
    { value: 'doisuche', viewValue: 'Suche mit DOI' },
    { value: 'titelsuche', viewValue: 'Suche mit Titel' },
  ];

  constructor(public dialog: MatDialog,
    private markdownService: MarkdownService,
    private readonly http: HttpClient,
    private router: Router) {
  }

  public ngOnInit(): void {
    this.getAllPapers();
  }

  public ngAfterViewChecked(): void {
    if (this.focusText) {
      //focus führt dazu, dass der Fokus wieder auf den Text zurückfällt -> daher kann input nicht befüllt werden.
      //Mauszeiger auf der 2. seite -> buttons lassen sich nicht mehr betätigen
      document.getElementById('editor-' + this.currentPage).focus();

      if (this.runAfterViewChecked) {
        if (this.currentChar) {
          let str = this.pages[this.currentPage - 1].htmlContent;
          const indexLastCloseDiv = str.lastIndexOf('</div>');
          const indexLastBr = str.lastIndexOf('<br>');
          let lastChar = str[indexLastCloseDiv - 1];
          if (indexLastBr !== -1 && (indexLastBr + 4) === indexLastCloseDiv) {
            lastChar = ' ';
          }

          if (indexLastCloseDiv !== -1) {
            str = str.slice(0, indexLastCloseDiv - 1) + str.slice(indexLastCloseDiv);
          } else {
            str = str.slice(0, str.length - 1);
          }
          this.pages[this.currentPage - 1].htmlContent = str;

          if (this.pages[this.currentPage].htmlContent) {
            this.pages[this.currentPage].htmlContent = lastChar + this.pages[this.currentPage].htmlContent;
          } else {
            this.pages[this.currentPage].htmlContent = lastChar;
          }
        }

        for (let i = 0; i < this.pages.length; i++) {
          this.element = document.getElementById('editor-' + i);
          this.element.innerHTML = this.pages[i].htmlContent;
        }
        this.runAfterViewChecked = false;
      }
    }

  }

  public wordCounter(pageIndex: number): void {
    let wordcountlaenge = 0;
    for (let i = 0; i < pageIndex + 1; i++) {
      const html = this.markdownService.compile(this.pages[i].innerText);
      const text = html.replace(/<[^>]*>/g, '').toString() //
        .replace(/&#160;/g, ' ') // leerzeichen soll als ' ' angezeigt werden
        .replace(/&#10;/g, ' '); // Zeilenumbruch soll als ' ' angezeigt werden
      this.wordList = text ? text.split(/\s+/) : []; // Wörterliste
      wordcountlaenge += this.wordList.length - 1; // Anzahl der Wörter
    }
    this.wordcountlaenge = wordcountlaenge;
  }


  public openDialog(): void {
    this.dialog.open(DialogComponent);
  }


  public getAllPapers(): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`
      })
    };
    this.http.get(`<BACKEND PLACEHOLDER>/api/paper?all=True`, httpOptions)
      .subscribe((wordList: any) => {
        console.log(wordList);
        this.papers = wordList;
        this.changePaper(this.papers.length - 1)

      });
  }

  public addPaper(): void {
    const body = {
      content: this.getwholeText(),
      title: "Beispieldokument " + (this.papers.length + 1),
      last_modified: new Date(),
      author_id: localStorage.getItem('user_id')
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`
      })
    };
    this.http.post(`<BACKEND PLACEHOLDER>/api/paper`, body, httpOptions)
      .subscribe(wordList => {
        // this.papers.push(body);
        //wir brauchen die id des neu angelegten papers, um es löschen zu können -> daher reicht das pushen von dem paper object aus dem frontend nicht aus 
        this.getAllPapers()
        console.log(wordList);

      });
  }

  public changePaper(papers_index: number): void {
    console.log(this.papers[papers_index].content);
    this.pages[0].htmlContent = this.papers[papers_index].content;

    // this.currentChar = char
    this.runAfterViewChecked = true;
    this.ngAfterViewChecked();
    this.pages[0].innerText = this.papers[papers_index].content;
    this.currentPaper = papers_index;

    // TODO: choose one paper which is to be displayed
    // what happens to current paper? auto-save? no save?
    // update function (put request) = save?
    // load current paper again from backend? after update the paper is not up2date when loaded from frontend only
  }

  public updatePaper(papers_index: number): void {
    const paper_id = this.papers[papers_index].id;
    const updated_paper = {
      content: this.getwholeText(),
      title: this.papers[papers_index].title,
      last_modified: new Date(),
      author_id: localStorage.getItem('user_id')
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`
      })
    };

    this.http.put(`<BACKEND PLACEHOLDER>/api/paper?id=${paper_id}`, updated_paper, httpOptions)
      .subscribe(wordList => {
        console.log(wordList);
        this.papers[papers_index] = updated_paper;

      });
  }

  public deleteUser(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
      })
    };

    this.http.delete('<BACKEND PLACEHOLDER>/api/user?username=test2', httpOptions)
      .subscribe(user => {
        console.log(user);
      });

  }

  public deletePaper(papers_index: number): void {
    const paper_id = this.papers[papers_index].id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*'
      })
    };
    this.http.delete(`<BACKEND PLACEHOLDER>/api/paper?id=${paper_id}`, httpOptions)
      .subscribe(wordList => {
        console.log(wordList);
        this.papers.splice(papers_index, 1);
        this.changePaper(this.papers.length - 1)
      });
  }

  public copyText(): void {


    navigator.clipboard.writeText(this.getwholeText()).then();
  }

  /*   public convertPaper(): void {
      let markdown = '';
      for (const page of this.pages) {
        markdown = this.markdownService.compile(page.htmlContent);
        // const text = markdown.replace(/<[^>]*>/g, '').toString()
      }
      console.log(markdown);
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Authorization': `${localStorage.getItem("access_token")}`
        })
      };
  
      this.http.post(`https://md-to-pdf.herokuapp.com/`, {
        markdown: '<p>markdown</p>',
      }, httpOptions)
        .subscribe(wordList => {
          console.log(wordList);
  
        });
    } */

  public openApiDialog(schreibunterstuetzung: any, unterstuetzungstyp: any): void {
    this.focusText = false
    const dialogRef = this.dialog.open(ApiComponent, {
      autoFocus: true,
      width: '250px',
      height: '250px',
    });
    dialogRef.componentInstance.schreibunterstuetzungen = schreibunterstuetzung;
    dialogRef.componentInstance.unterstuetzungstyp = unterstuetzungstyp;
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.focusText = true
    });
  }

  public getAverageSentenceLength(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: `${localStorage.getItem('access_token')}`,
      })
    };

    this.http.get(`<BACKEND PLACEHOLDER>/api/avg_sentence_length/?text=${this.getwholeText()}`, httpOptions)
      .subscribe((response: any) => {
        this.averageSentenceLength = response.toFixed(2).replace(/[.,]00$/, "")

      });

  }

  public clickPage(i: number): void {
    this.currentPage = i;
  }

  public inputContent(char: string, i: number): void {
    this.element = document.getElementById('editor-' + i);
    const heightContent = this.element.offsetHeight * 2.54 / 96;
    this.pages[i].htmlContent = this.element.innerHTML;
    this.pages[i].innerText = this.element.innerText.toString();


    if (Number(heightContent.toFixed(1)) > this.sizePage.height) {
      this.currentChar = char;
      this.pages[i].full = true;
      if (!this.pages[i + 1]) {
        this.pages.push({
          htmlContent: null,
          full: false,
          innerText: null
        });
      }
      this.currentPage = i + 1;
      this.runAfterViewChecked = true;
    }
    this.getAverageSentenceLength()
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigateByUrl('').then(r => r);
  }

  public slideTogglelofi(): void {
    if (this.musikToggleActivelofi === true) {
      this.musikToggleActivelofi = false;

    } else {
      this.musikToggleActivelofi = true;
    }
  }

  public slideToggleclassic(): void {
    if (this.musikToggleActiveclassic === true) {
      this.musikToggleActiveclassic = false;
    } else {
      this.musikToggleActiveclassic = true;

    }
  }

  public slideTogglerain(): void {
    if (this.musikToggleActiverain === true) {
      this.musikToggleActiverain = false;
    } else {
      this.musikToggleActiverain = true;
    }
  }

  public getwholeText(): string {
    let text = '';
    for (const page of this.pages) {
      text += page.innerText;
    }
    return text;
  }
}



