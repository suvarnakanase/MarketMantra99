import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatCardModule,
  MatDividerModule, MatAutocompleteModule,
  MatInputModule, MatCheckboxModule, MatSelectModule,
  MatMenuModule, MatListModule, MatTableModule, MatButtonModule,
  MatSnackBarModule, MatDialogModule, MatIconModule,
  MatSidenavModule, MatDatepickerModule, MatNativeDateModule,
  MatTabsModule, MatPaginatorModule, MatTooltipModule,MatProgressSpinnerModule,
  MatStepperModule,MatProgressBarModule, MatRadioModule 
} from '@angular/material';
 

const modules = [
  MatToolbarModule, MatCardModule,MatDatepickerModule,MatNativeDateModule,
  MatDividerModule, MatAutocompleteModule,MatTabsModule,
  MatPaginatorModule,
  MatInputModule, MatCheckboxModule, MatSelectModule,
  MatMenuModule, MatListModule, MatTableModule, MatButtonModule,
  MatSnackBarModule, MatDialogModule, MatIconModule,MatSidenavModule, MatTooltipModule
  ,MatProgressSpinnerModule,MatStepperModule,MatProgressBarModule,MatMenuModule,
  MatRadioModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class MaterialDesignModule { }
