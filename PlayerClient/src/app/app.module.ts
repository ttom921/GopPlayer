import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedAngularMaterialModule } from './share/shared-angular-material/shared-angular-material.module';
import { Disp264Component } from './disp264/disp264.component';
import { Ver1Component } from './ver1/ver1.component';
import { Muldisp264Component } from './muldisp264/muldisp264.component';

@NgModule({
  declarations: [
    AppComponent,
    Disp264Component,
    Ver1Component,
    Muldisp264Component
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedAngularMaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [Disp264Component, Ver1Component, Muldisp264Component]
})
export class AppModule { }
