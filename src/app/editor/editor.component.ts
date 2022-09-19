import { EditorUrlParamsService } from './editor.service';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { MarkdownService } from 'ngx-markdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperTitleDialogComponent } from './components/paper-title-dialog/paper-title-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HighlightcomponentService } from '../layout/services/highlightcomponent.service';



import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

// const Context = ClassicEditor.Context;
// const ContextWatchdog = ClassicEditor.ContextWatchdog;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  public wordcountlaenge = 0;
  public wordList: string[];
  public paper: any;
  public averageSentenceLength = 0;
  public selectedCategory: string;
  categoryId: number;
  id: number;
  searchTerm:string;
  show= false;

  // public Editor = ClassicEditor;
  @ViewChild( 'myEditor' ) editorComponent: CKEditorComponent;
  editorData = '';
  startTypingTime: Date;
  endTypingTime: Date;
  duration = 0;
  textBeforeSearch: string;
  timeouts = [];

  constructor(public dialog: MatDialog,
    private markdownService: MarkdownService,
    private readonly http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,

    private snackBar: MatSnackBar,private elementRef: ElementRef,
    public urlParamService: EditorUrlParamsService,
    private highlightService: HighlightcomponentService) {

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

  public onReady({editor}){
    let self = this;
    editor.document.on('keyup',function($event){
      self.keyupEditor($event);
    });

  }


  public highlight() {
    if (!this.searchTerm) {
        this.editorData = this.textBeforeSearch;
    }
    else{
      this.textBeforeSearch = this.editorData;
      this.editorData = this.editorData.replace(new RegExp(this.searchTerm, "gi"), match => {
        return '<strong><i><span class="marker">' + match + '</span></i></strong>';
      });
    }
  }

  handleSearch(): void{
    // if (!this.searchTerm) {
      this.editorData = this.textBeforeSearch;
    // }
  }

  public onChange({ editor }: any) {
    this.editorData = editor.getData();


    if (!this.startTypingTime){
      this.startTypingTime = new Date();
    }
    // this.updatePaper(data);
  }
  public keyupEditor(event){
    console.log(event.data.$.keyCode);
    if (this.timeouts && this.timeouts.length){
      for (var i=0 ; i < this.timeouts.length; i++) {
        clearTimeout(this.timeouts[i]);
      }
      this.timeouts = [];
    }
      //timer every 1 minute
      this.timeouts.push(setTimeout(() => {
        console.log('timer for duration');

        if (this.startTypingTime) {
          this.endTypingTime = new Date();
          const hours = Math.abs(this.endTypingTime.getTime() - this.startTypingTime.getTime()) / 3600000;

          this.duration = this.duration + hours;
          this.startTypingTime = null;
        }
      }, 60000));
    //timer every 5 minutes
     this.timeouts.push(setTimeout(() => {
        console.log('timer for stop writing');
        this.snackBar.open('You have spent 5 minutes without writing', 'Close' , {
          duration: 3000,
        });
      },300000));
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
          this.editorData = this.paper.content;
          this.textBeforeSearch = this.paper.content;
          this.urlParamService.changeParam({
            category_id: this.categoryId,
            paper: this.paper
          });
        }
      });
  }

  public savePaper(): void {
   // this.focusText = false;
    const dialogRef = this.dialog.open(PaperTitleDialogComponent, {
      width: '350px',
      data: this.paper ? { id: this.paper.id, title: this.paper.title } : {}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== '') {
        if (this.paper) {
          this.paper.title = result;
          this.updatePaper(this.editorData);
         // this.focusText = true;
        } else {
          this.paper = {};
          this.paper.title = result;
          this.addPaper(this.editorData);
         // this.focusText = true;
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
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    this.handelLeaveEditor();
  }
  ngOnDestroy(): void {
    this.handelLeaveEditor();
  }

  handelLeaveEditor(): void{
    if (this.paper && this.paper.id){
      if (!this.duration){
        if (this.startTypingTime) {
          this.endTypingTime = new Date();
          const hours = Math.abs(this.endTypingTime.getTime() - this.startTypingTime.getTime()) / 3600000;

          this.duration = this.duration + hours;
          this.startTypingTime = null;
        }
      }
      const body = {
        duration_time:  this.duration,
        paper_id: this.paper.id
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
      this.http.post(`http://127.0.0.1:5000/api/duration`, body, httpOptions)
        .subscribe(response => {});
    }

  }

  ngAfterViewInit(): void {
    this.highlightService.getChanges().subscribe(componentName => {
      if (componentName.text == 'editor') {
        this.show = true;
        setTimeout(()=>{
          this.show = false;
        },2000)
      }
    });
  }
}





