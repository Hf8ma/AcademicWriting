import { EditorUrlParamsService } from './editor.service';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';

import { MarkdownService } from 'ngx-markdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperTitleDialogComponent } from './components/paper-title-dialog/paper-title-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';


// const Context = ClassicEditor.Context;
// const ContextWatchdog = ClassicEditor.ContextWatchdog;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public focusText = true;


  public wordcountlaenge = 0;
  public wordList: string[];
  public paper: any;
  public averageSentenceLength = 0;
  public selectedCategory: string;
  categoryId: number;
  id: number;

  public Editor = ClassicEditor;
  @ViewChild( 'myEditor' ) editorComponent: CKEditorComponent;
  // public watchdog: any;
  // public ready = false;


  constructor(public dialog: MatDialog,
    private markdownService: MarkdownService,
    private readonly http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public urlParamService: EditorUrlParamsService) {
  }

  public ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('category_id');
    console.log('editor oninit this.categoryId ', this.categoryId);

    this.id = +this.route.snapshot.paramMap.get('id');
    console.log('editor oninit this.paperId ', this.id);

    if (this.id) { //here wer're editing the paper
      this.getPaper();
    }
    else {
      this.urlParamService.changeParam({
        category_id: this.categoryId,
        paper: null
      })
    }

    const changes = this.urlParamService.getChanges().subscribe(updatedPaper => {
      console.log('ngoninit editor, before if updatedpaper');
      if (updatedPaper.paper && updatedPaper.category_id) {
        this.categoryId = updatedPaper.category_id;
        this.paper = updatedPaper.paper;
      }
    });

    // const contextConfig = {};
    // this.watchdog = new ContextWatchdog(Context);
    // this.watchdog.create(contextConfig)
    //   .then(() => {
    //     this.ready = true;
    //   });

  }

  public onReady(event){
    console.log(event);
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.updatePaper(data)
    console.log(data);
  }

  public goDashboard(): void {
    this.router.navigate(['dashboard']);
  }

  public getPaper(): void {
    console.log('inside getpaper:')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };
    this.http.get(`http://127.0.0.1:5000/api/paper?id=${this.id}`, httpOptions)
      .subscribe((response: any) => {
        this.paper = response;

        if (this.paper) {
          console.log(this.editorComponent.data);
          this.editorComponent.data = this.paper.content;
          this.urlParamService.changeParam({
            category_id: this.categoryId,
            paper: this.paper
          })
        }
      });
  }

  public savePaper(myEditor: any): void {
    this.focusText = false;
    const dialogRef = this.dialog.open(PaperTitleDialogComponent, {
      width: '350px',
      data: this.paper ? { id: this.paper.id, title: this.paper.title } : {}
    });

    const data = myEditor.getData();

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== '') {
        if (this.paper) {
          this.paper.title = result;
          this.updatePaper(data);
          this.focusText = true;
        } else {
          this.paper = {};
          this.paper.title = result;
          this.addPaper(data);
          this.focusText = true;
        }
      }
    });
  }

  public addPaper(data: string): void {
    const body = {
      content:  data,
      title: this.paper.title,
      last_modified: new Date(),
      author_id: localStorage.getItem('user_id'),
      category_id: this.categoryId
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };
    this.http.post(`http://127.0.0.1:5000/api/paper`, body, httpOptions)
      .subscribe(response => {
        this.paper = response;
        this.urlParamService.changeParam({
          category_id: this.categoryId,
          paper: this.paper
        });
        console.log('in save paper after post call ', response)
        this.snackBar.open('Paper has been added successfully', 'Close', {
          duration: 6000
        });
      });
  }


  public updatePaper(data: string): void {
    const updatedPaper = {
      content: data,
      title: this.paper.title,
      last_modified: new Date(),
      id: this.paper.id,
      author_id: localStorage.getItem('user_id'),
      category_id: this.categoryId
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('access_token')}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    };

    this.http.put(`http://127.0.0.1:5000/api/paper?id=${this.paper.id}`, updatedPaper, httpOptions)
      .subscribe(response => {
        this.paper = response;
        this.urlParamService.changeParam({
          category_id: this.categoryId,
          paper: this.paper
        })
        // this.snackBar.open('paper saved successfully', 'Close', {
        //   duration: 6000
        // });
      });
  }


}





