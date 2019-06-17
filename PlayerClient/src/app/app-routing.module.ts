import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Disp264Component } from './disp264/disp264.component';
import { Ver1Component } from './ver1/ver1.component';
import { Muldisp264Component } from './muldisp264/muldisp264.component';

const routes: Routes = [
  { path: '', redirectTo: 'md264', pathMatch: 'full' },
  { path: 'd264', component: Disp264Component },
  { path: 'md264', component: Muldisp264Component },
  { path: 'v1', component: Ver1Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
