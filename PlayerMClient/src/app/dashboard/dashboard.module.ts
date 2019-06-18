import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { Disp264Component } from './disp264/disp264.component';
import { MatBoardComponent } from './mat-board/mat-board.component';
import { FlatBoardComponent } from './flat-board/flat-board.component';

@NgModule({
  declarations: [DashboardComponent, Disp264Component, MatBoardComponent, FlatBoardComponent],
  imports: [
    CommonModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ],
  exports: [Disp264Component, MatBoardComponent]
})
export class DashboardModule { }
