import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './master/master.component';
import { RouterModule } from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HeaderComponent} from './header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {GoalComponent} from './goal/goal.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CountDownComponent} from './count-down/count-down.component';
import {DeadlineComponent} from './deadline/deadline.component';
import { NotesComponent } from './notes/notes.component';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DeadlineDialogComponent } from './deadline-dialog/deadline-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { DeadlineShowDialogComponent } from './deadline-show-dialog/deadline-show-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  declarations: [MasterComponent, HeaderComponent, SidebarComponent, GoalComponent, CountDownComponent, DeadlineComponent, NotesComponent, DeadlineDialogComponent, DeadlineShowDialogComponent],
  exports: [ MasterComponent],
})
export class LayoutsModule { }
