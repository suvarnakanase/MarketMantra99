import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { DataMediaterService } from 'src/app/services/data-mediater.service';
import { DynamicServices } from 'src/app/services/dynamic.service';
import { ExportToExcelService } from 'src/app/services/export-to-excel.service';
import { BaseComponent } from 'src/app/base/base.component';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { Constant } from 'src/app/shared/constant';
import { ReportParams } from 'src/app/models/reportParams';
import { DataUtil } from 'src/app/utils/dataUtils';

@Component({
  selector: 'app-table-report',
  templateUrl: './table-report.component.html',
  styleUrls: ['./table-report.component.css']
})
export class TableReportComponent extends BaseComponent<any> implements OnInit, OnDestroy {

  dataList: any[];
  displayedColumns: string[] = ['highScenario', 'highDate', 'high', 'low', 'lowDate', 'lowScenario'];
  

  private subscription: Subscription;
  dataSource = new MatTableDataSource<any>();

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private dynamic: DynamicServices,
    private excelService: ExportToExcelService
  ) {
    super(dynamic, excelService, sharedService);

    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        if (!this.isValid(params)) return;

        params.reportType = Constant.TABLE_REPORT;

        this.displayLoader();
        this.dataSource.data = [];
        this.getByPost(Constant.GET_NSE_TABLE_REPORT, params)
          .subscribe(data => {
            this.hideLoader();
            if(data && data.length>0 && data[0].messageCode == -99){
              this.sharedService.openSnackBar( data[0].message, '', 10);
              return;
            }
            if (data){
              this.dataSource.data = data; 
              new DataUtil().setScenario(data);
            }else{
              this.sharedService.openSnackBar('No data found for a given parameter', '', 8);
            }
          });
      });
  }

  ngOnInit() {
  }

  

  private isValid(params: ReportParams) {
    let msg = '';
    if (!params.nseSecurityId) {
      debugger;
      msg = 'Please Select security name';
      this.sharedService.openSnackBar(msg, 'Ok', 10);
    }
    return msg === '';
  }
  ngOnDestroy(): void { 
    this.subscription.unsubscribe(); 
  }  


}
