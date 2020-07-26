import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRouteModule } from './app-route/app-route.module'; 
import { HomeModule } from './home/home.module';
import { MaterialDesignModule } from './material-design/material-design.module';

import { HttpClientModule } from '@angular/common/http'; 
import { ChangePasswordDialogComponent } from './home/change-password-dialog/change-password-dialog.component';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent , 
    ChangePasswordDialogComponent, CustomDialogComponent 
  ],
  entryComponents: [ChangePasswordDialogComponent, CustomDialogComponent],
  imports: [
    BrowserModule,
    MaterialDesignModule,
    BrowserAnimationsModule, 
    HttpClientModule,
    SharedModule,
    HomeModule ,
    AppRouteModule,  
  ], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 