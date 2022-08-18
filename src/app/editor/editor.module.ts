import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { GoalComponent } from './components/goal/goal.component';
import { ApiComponent } from './components/api/api.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CountDownComponent } from './components/count-down/count-down.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { EditorRoutingModule } from './editor-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MarkdownModule } from 'ngx-markdown';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [EditorComponent, GoalComponent, ApiComponent, DialogComponent, CountDownComponent, ColorPickerComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MarkdownModule.forRoot(),
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatSlideToggleModule,
  ]
})
export class EditorModule { }
