import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ReportParams } from '../../models/reportParams';
import { SharedService } from '../../services/shared.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Subscription } from 'rxjs';
import { SecurityTransaction } from '../../models/securityTransaction';
import { BaseComponent } from '../../base/base.component';
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { ExportToExcelService } from '../../services/export-to-excel.service';

@Component({
  selector: 'app-data-summary-report',
  templateUrl: './data-summary-report.component.html',
  styleUrls: ['./data-summary-report.component.css']
})
export class DataSummaryReportComponent extends BaseComponent<any> implements OnInit, OnDestroy {

  dataList: SecurityTransaction[];
  displayedColumns: string[] = ['srNo', 'date', 'high', 'low', 'closePrice',  'average', 'range','scenario'];
  pageSizeOptions: [10];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private subscription: Subscription;
  dataSource = new MatTableDataSource<SecurityTransaction>();

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private dynamic: DynamicServices,
    private excelService: ExportToExcelService
  ) {
    super(dynamic, excelService, sharedService);
    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        if (!this.isValid(params)) return;

        params.reportType = 'DATA_SUMMARY';

        this.displayLoader();
        this.dataSource.data = [] 
        this.getByPost(Constant.GET_NSE_TRANSACTION_DATA, params)
          .subscribe(data => {
            this.hideLoader();
            if(data && data.length>0 && data[0].messageCode == -99){
              this.sharedService.openSnackBar( data[0].message, '', 8);
              return;
            }
             
            if (data && data.length > 0){ 
              this.dataSource.data = data;
            }
            else {
              this.sharedService.openSnackBar('No data found for a given parameter', '', 8);
            }
          });
      });
  }

  ngOnDestroy(): void { 
    this.subscription.unsubscribe();
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

}
