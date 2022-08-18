import { NgModule } from '@angular/core';
import { MasterComponent } from '../layout/master/master.component';
import { EditorComponent } from './editor.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'editor',
    component: MasterComponent,
    children: [
      { path: '', component: EditorComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
