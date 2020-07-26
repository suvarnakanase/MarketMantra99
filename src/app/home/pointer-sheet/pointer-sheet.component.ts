import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ReportParams } from '../../models/reportParams';
import { SharedService } from '../../services/shared.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Subscription } from 'rxjs';
import { SecurityTransaction } from '../../models/securityTransaction';
import { PointerSheetModel } from '../../models/PointerSheetModel';
import { BaseComponent } from '../../base/base.component';
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { ExportToExcelService } from '../../services/export-to-excel.service';
import { DateUtil } from 'src/app/utils/dateUtil';

@Component({
  selector: 'app-pointer-sheet',
  templateUrl: './pointer-sheet.component.html',
  styleUrls: ['./pointer-sheet.component.css']
})


export class PointerSheetComponent  extends BaseComponent<any> implements OnInit, OnDestroy {

  dataList: SecurityTransaction[];
  displayedColumns: string[] = ['srNo', 'date', 'high', 'low', 'closePrice',  'average', 'range',
                                'scenario',
                                'rc14_6', 'rc23_6','rc38_2','rc61_8', 'rc100',  'rc127_2', 'rc161_8', 'rc261_8', 
                                'fc14_6', 'fc23_6','fc38_2', 'fc61_8', 'fc100',  'fc127_2', 'fc161_8', 'fc261_8'];
  pageSizeOptions: [10];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private subscription: Subscription;
  dataSource = new MatTableDataSource<SecurityTransaction>();

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  repParams : ReportParams = null;

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private dynamic: DynamicServices,
    private excelService: ExportToExcelService
  ) {
    super(dynamic, excelService, sharedService);
    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        if (!this.isValid(params)) return;

        this.repParams = params;

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
              var list = [];
              data.forEach(x=>{
                  let pointerSheetObj = new PointerSheetModel(x);
                  list.push(pointerSheetObj);
              })
              this.dataSource.data = list;
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

  // timeFrameData = '';
  // getOtherTimeFrameDetail(obj){ 
  //    let params =  Object.assign({}, this.repParams);
  //    params.fromDate = new Date(obj.date);
  //    params.toDate =  DateUtil.addDays(1,  new Date(obj.date));
     
  //    this.getByPost(Constant.GET_NSE_TRANSACTION_DATA, params).subscribe(data => {
  //           this.hideLoader();
  //           if(data && data.length>0 && data[0].messageCode == -99){ 
  //             return;
  //           }
  //           if (data && data.length > 0){  
  //               let dataObj = data.find(x=>x.date == obj.date)
  //               this.timeFrameData =  "Sc: "+dataObj.scenario +", high:"+ dataObj.high+",low:"+dataObj.low; 
  //           }
  //    });

  // }

}
