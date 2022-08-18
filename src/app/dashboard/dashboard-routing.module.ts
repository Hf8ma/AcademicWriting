import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MasterComponent} from '../layout/master/master.component';
import {DashboardComponent} from './dashboard.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: MasterComponent,
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
