import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomDatepickerComponent} from './custom-datepicker.component';
import {YearPickerComponent} from './year-picker-component/year-picker.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
  ],
  declarations: [
    CustomDatepickerComponent,
    YearPickerComponent
  ],
  exports: [
    CustomDatepickerComponent,
  ],
})
export class CustomDatepickerModule {}
