import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatBoardComponent } from './mat-board/mat-board.component';
import { FlatBoardComponent } from './flat-board/flat-board.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'flatboard', pathMatch: 'full' },
      { path: 'matboard', component: MatBoardComponent },
      { path: 'flatboard', component: FlatBoardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
