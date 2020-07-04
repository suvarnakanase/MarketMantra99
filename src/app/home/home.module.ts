import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RecordSheetReportComponent } from './record-sheet-report/record-sheet-report.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { AppRouteModule } from '../app-route/app-route.module'; 

import { DataSummaryReportComponent } from './data-summary-report/data-summary-report.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ActionTradeReportComponent } from './action-trade-report/action-trade-report.component';
import { TableReportComponent } from './table-report/table-report.component';  
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { TbBtReportComponent } from './tb-bt-report/tb-bt-report.component';
import { OtReportComponent } from './ot-report/ot-report.component';
import { MstReportComponent } from './mst-report/mst-report.component';
import { PointerSheetComponent } from './pointer-sheet/pointer-sheet.component';
import { DoubleDeckerReportComponent } from './double-decker-report/double-decker-report.component';
import { AcReportComponent } from './ac-report/ac-report.component';

 

@NgModule({
  declarations: [ 
    HomeComponent,
    DataSummaryReportComponent, 
    RecordSheetReportComponent,
    UserManagementComponent,
    ActionTradeReportComponent,
    TableReportComponent,
    TbBtReportComponent,
    OtReportComponent,
    MstReportComponent,
    PointerSheetComponent,
    DoubleDeckerReportComponent,
    AcReportComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  
  imports: [ 
    SharedModule, 
    AppRouteModule, 
    MaterialDesignModule  
    
  ],
  
  exports:[  ]
})
export class HomeModule { }
