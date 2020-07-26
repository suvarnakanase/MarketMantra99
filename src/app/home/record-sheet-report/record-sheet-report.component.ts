import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ReportParams } from '../../models/reportParams';
import { SharedService } from '../../services/shared.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { ExportToExcelService } from '../../services/export-to-excel.service';

@Component({
  selector: 'app-record-sheet-report',
  templateUrl: './record-sheet-report.component.html',
  styleUrls: ['./record-sheet-report.component.css']
})
export class RecordSheetReportComponent extends BaseComponent<any> implements OnInit {

  displayedColumns: string[] = [];
  columns: any[] = [];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private subscription: Subscription;
  dataSource: any = [];

  ngOnInit() {
    this.dataSource = [];
  }

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private dynamic: DynamicServices,
    private excelService: ExportToExcelService
  ) {
    super(dynamic, excelService, sharedService);
    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        if (this.isValid(params)) {
          params.reportType = 'RECORD_REPORT';
          this.displayLoader();
          this.dataSource = [];
          this.getByPost(Constant.GET_CROSS_REPORT_DATA, params)
            .subscribe(data => {
              this.hideLoader();
              if(data && data.length>0 && data[0].messageCode == -99){
                this.sharedService.openSnackBar( data[0].message, '', 10);
                return;
              }
              
              if (data && data.length > 0) {
                this.displayedColumns = Object.keys(data[0]);
                this.dataSource = data;
              } else {

              }
            });
        }
      });
  }

  private removeNullColumnValue(displayedColumns: any, dataList: []) {
     
  }

  private isValid(params: ReportParams) {
    let msg = '';
    if (!params.indexId) {
      msg = 'Please Select index name';
      this.sharedService.openSnackBar(msg, 'Ok', 10);
    }
    return msg === '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProperties(obj) {
    if (obj)
      return Object.keys(obj);
    return [];
  }

}
