import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core'; 
import { ReportParams } from '../../models/reportParams';
import { SharedService } from '../../services/shared.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Subscription } from 'rxjs'; 
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { ExportToExcelService } from '../../services/export-to-excel.service';   
import { MatTableDataSource } from '@angular/material';
import { BaseComponent } from '../../base/base.component';
import { TableReportComponent } from '../table-report/table-report.component';
import { TableReportModel } from '../../models/reportsResponseModel';
import { DataUtil } from '../../utils/dataUtils';

@Component({
  selector: 'app-mst-report',
  templateUrl: './mst-report.component.html',
  styleUrls: ['./mst-report.component.css']
})
export class MstReportComponent extends BaseComponent<any>  implements OnDestroy{

  dataList:[];
  displayedColumns: string[] = ['date', 'scriptName', 'date1', 'scenario1','price1', 
                                'date2', 'scenario2','price2',
                                'date3', 'scenario3','price3',   
                                'query',  'action']; 

    
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
         
        params.exchangeName = ReportParams.getFileTypeEnum(params.exchangeId); 
        params.reportType = 'OT_REPORT';


        this.displayLoader();
        this.dataSource.data = [] 
        this.getByPost(Constant.GET_MST_REPORT, params)
          .subscribe(data => { 
            this.hideLoader(); 
            if (data && data.length > 0){ 
              var modifiedResultData = new DataUtil().processDataForMST(data);
              modifiedResultData.sort((val1, val2)=> {return new Date(val2.date).getTime() - new 
                Date(val1.date).getTime() })
              this.dataSource.data = modifiedResultData; 
            }
            else {
              this.sharedService.openSnackBar('No data found for a given parameter', 'OK', 8);
            }
          });
      });
  }  

  
  ngOnDestroy(): void { 
    this.subscription.unsubscribe();
  } 


  private isValid(params: ReportParams) {
    let msg = '';
    if (!params.indexId) { 
      msg = 'Please select index or script initials';
      this.sharedService.openSnackBar(msg, 'Ok', 10);
    }
    return msg === '';
  } 

}
