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
import { DateUtil } from 'src/app/utils/dateUtil';

@Component({
  selector: 'app-ot-report',
  templateUrl: './ot-report.component.html',
  styleUrls: ['./ot-report.component.css']
})
export class OtReportComponent extends BaseComponent<any>  implements OnInit, OnDestroy {

  dataList: SecurityTransaction[];
  displayedColumns: string[] = ['date', 'scriptName', 'scenario1', 'scenario2', 
                                'average1',  'average2', 'typOfBtm','typeOfTop'];
  pageSizeOptions: [10];
  showLoader = false;

  typeScenarioCol1: string;
  typeScenarioCol2: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private subscription: Subscription;
  dataSource = new MatTableDataSource<any>();

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
        params.exchangeName = ReportParams.getFileTypeEnum(params.exchangeId); 
        params.reportType = 'OT_REPORT';

        this.showLoader = true;
        this.dataSource.data = [] 
        this.getByPost(Constant.GET_OT_REPORT, params)
          .subscribe(data => {
            this.showLoader = false; 
            if (data && data.length > 0){ 
              this.setScenarioColType(params);     //take only 1st obect to define columns name.
              this.dataSource.data = data;
              this.loadHatLat(params);
            }
            else {
              this.sharedService.openSnackBar('No data found for a given parameter', '', 8);
            }
          });
      });
  }

  loadHatLat(params:ReportParams): void{
    this.dataSource.data.forEach(x=>{
        var securityId = x.secId;  
        var tableParam = new ReportParams();
        tableParam.exchangeId = params.exchangeId;
        tableParam.fromDate = DateUtil.addDaysFromTimeFrame(params.timeFrame, x.dDate);// '2019-12-01';
        tableParam.toDate = DateUtil.convertToSqlFormat(x.dDate);// '2020-01-31';
        tableParam.nseSecurityId = securityId;
        tableParam.reportType = Constant.TABLE_REPORT; 
        tableParam.timeFrame = params.timeFrame;
        tableParam.exchangeId = params.exchangeId; 
        tableParam.initialId = -1;
      
        this.getByPost(Constant.GET_HAT_LAT_STATUS_4_OTR, tableParam)
          .subscribe(dataObj => {
            this.showLoader = false;
            if (dataObj){  
              x.topObj =  dataObj[0].topData;
              x.btmObj = dataObj[1].btmData; 

              x.topFormation = x.topObj?  x.topObj.scenario :'';
              x.bottomFormation = x.btmObj?  x.btmObj.scenario:''; 

              var sumOfHighLowClose = x.dAvg*3;
              x.average2 = 0;

              if(x.dScenario == 'HLC HIGHER' && x.topObj){
                let btmHigh = x.btmObj? x.btmObj.low: undefined;
                x.average2 = ((sumOfHighLowClose + btmHigh)/4).toFixed(2);
              } else{
                let topObj = x.topObj? x.topObj.high: undefined; 
                x.average2 = ((sumOfHighLowClose +  topObj)/4).toFixed(2);
              } 
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
      debugger;
      msg = 'Please select index or script initials';
      this.sharedService.openSnackBar(msg, 'Ok', 10);
    }
    return msg === '';
  }  

  getHLCloseToolTipValue(obj){
    return 'High: '+obj.high+  ', '+'Low: '+obj.low+', ClosePrice: '+ obj.closePrice; 
  }

  private setScenarioColType(params){
    var type = params.timeFrame;
    if(type == 'DAILY'){
      this.typeScenarioCol1 = 'Daily Scenario';
      this.typeScenarioCol2= 'Weekly Scenario';
    }
    if(type == 'WEEKLY'){
      this.typeScenarioCol1 = 'Weekly Scenario';
      this.typeScenarioCol2 = 'Monthly Scenario';
    }
    if(type == 'MONTHLY'){
      this.typeScenarioCol1 = 'Monthly Scenario';
      this.typeScenarioCol2 = 'Quoter Scenario';
    }
  }
}