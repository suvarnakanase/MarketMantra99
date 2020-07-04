import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule ,
  ],
  exports:[
    CommonModule,
    FormsModule,
    FlexLayoutModule , 
    ReactiveFormsModule
  ]
})
export class SharedModule { }
