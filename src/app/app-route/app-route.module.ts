import { NgModule } from '@angular/core'; 
import { HomeComponent } from '../home/home/home.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DataSummaryReportComponent } from '../home/data-summary-report/data-summary-report.component';
import { RecordSheetReportComponent } from '../home/record-sheet-report/record-sheet-report.component';
import { RouteGaurd } from '../app-routing/route.guard';
import { UserManagementComponent } from '../home/user-management/user-management.component';
import { ActionTradeReportComponent } from '../home/action-trade-report/action-trade-report.component';
import { TableReportComponent } from '../home/table-report/table-report.component';
import { TbBtReportComponent } from '../home/tb-bt-report/tb-bt-report.component';
import { OtReportComponent } from '../home/ot-report/ot-report.component';
import { MstReportComponent } from '../home/mst-report/mst-report.component';
import { PointerSheetComponent } from '../home/pointer-sheet/pointer-sheet.component';
import { AcReportComponent } from '../home/ac-report/ac-report.component';
import { DoubleDeckerReportComponent } from '../home/double-decker-report/double-decker-report.component';

const parentRoute = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RouteGaurd],
    children: [
      {
        path: 'dataSummary',
        canActivate: [RouteGaurd],
        component: DataSummaryReportComponent
      },
      {
        path: 'recordSheet',
        canActivate: [RouteGaurd],
        component: RecordSheetReportComponent
      },
      {
        path: 'actionItemTrade',
        canActivate: [RouteGaurd],
        component: ActionTradeReportComponent
      },
      {
        path: 'tableReport',
        canActivate: [RouteGaurd],
        component: TableReportComponent
      },
      {
        path: 'mstReport',
        canActivate: [RouteGaurd],
        component: MstReportComponent
      },
      {
        path: 'userManagement',
        canActivate: [RouteGaurd],
        component: UserManagementComponent
      },
      {
        path: 'tbBtReport', 
        component: TbBtReportComponent,
        canActivate: [RouteGaurd]
      },
      {
        path: 'otReport', 
        component: OtReportComponent,
        canActivate: [RouteGaurd]
      },
      {
        path: 'ddReport', 
        component: DoubleDeckerReportComponent,
        canActivate: [RouteGaurd]
      },
      {
        path: 'psr0508', 
        component: PointerSheetComponent,
        canActivate: [RouteGaurd]
      } ,
      {
        path: 'aocReport', 
        component: AcReportComponent,
        canActivate: [RouteGaurd]
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(parentRoute),
    RouterModule.forRoot([ 
      { path: 'login', component: LoginComponent }, 
      { 
        path: '**', 
        component: HomeComponent,
        canActivate: [RouteGaurd],
        pathMatch: 'full' 
      }, 
      { 
        path: '', 
        component: HomeComponent,
        canActivate: [RouteGaurd],
        pathMatch: 'full' 
      },  
    ]),

  ],
  exports: [RouterModule]
})
export class AppRouteModule { }
