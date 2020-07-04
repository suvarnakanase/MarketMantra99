
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
  selector: 'app-action-trade-report',
  templateUrl: './action-trade-report.component.html',
  styleUrls: ['./action-trade-report.component.css']
})
export class ActionTradeReportComponent extends BaseComponent<any> implements OnInit {

  dataList: SecurityTransaction[];
  displayedColumns: string[] = [
    'asOfDate', 'view', 'scenario', 'ticker', 'absTopBtm',
    'colHigh', 'colLow', 'colClose', 'daySce', 'weekSce', 'monthSce',
    'noOfDay', 'perReturnFrCls', 'status'
  ];

  completeCheck = false;

  showLoader = false;
  private subscription: Subscription;
  dataSource = new MatTableDataSource<SecurityTransaction>();
  timeTakenHeader: string = 'Days Taken';
  private responseData = [];

  ngOnInit() {
  }

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private service: DynamicServices,
    private excelService: ExportToExcelService
  ) {
    super(service, excelService, sharedService);
    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        
        if (!this.isValid(params)) return;
        params.reportType = "ACTION_REPORT";
        this.getSpName(params);
        this.setNoOfDurationHeader(params.timeFrame);
        this.showLoader = true;
        this.dataSource.data = [];
        this.service.getByPost(Constant.GET_ACTION_REPORT, params)
          .subscribe(respItem => {
            this.responseData = respItem;
            this.showLoader = false;
            if(respItem && respItem.length>0 && respItem[0].messageCode == -99){
              this.sharedService.openSnackBar(respItem[0].message, '', 8);
              return;
            }
            if (respItem)
              this.dataSource.data = this.processActionReport(respItem, 'PENDING');
          });
      });
  }

  processActionReport(respItem, status) {
    this.completeCheck =false;
    function unique(array, propertyName) {
      return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
    }

    let uniqueList = unique(respItem, 'securityId');
    let arrayList = [];

    for (let i = 0; i < uniqueList.length; i++) {
      let obj = uniqueList[i];
      arrayList.push(respItem.filter(x => x.securityId === obj.securityId));
    }

    let resultList = [];

    //same security objList

    let pendingObj = null;

    for (let j = 0; j < arrayList.length; j++) {
      let objList = arrayList[j];

      //this will give min 1 list order by date desc.
      //objList = objList.filter(x=> x.scenario  && x.scenario !='' );
      let isPendingDone = false, isCompleteDone = false;
      var abTopBtm = 0, noOfDay = 0;

      for (let i = 0; i < objList.length; i++) {
        let obj = objList[i];
        if (!obj.absTopBtm) {
          obj.absTopBtm = 0;
        }
     
        if (!obj.scenario && isPendingDone) {
          abTopBtm = obj.absTopBtm;
          noOfDay = obj.noOfDay;
        }
     
        if (isPendingDone == false) {
          if (obj.scenario) {
            obj.status = 'PENDING';
            isPendingDone = true;
            pendingObj = obj; 
            // obj.absTopBtm = abTopBtm;
            resultList.push(obj);
            continue;
          }
          resultList.push(obj);
        }
     
        if (isCompleteDone == false) {
          if (obj.scenario) {
           
            obj.status = 'COMPLETE';
            //obj.absTopBtm = abTopBtm;
            obj.noOfDay = noOfDay;
            //obj.absTopBtm4Calc = obj.absTopBtm; 
            if(pendingObj && pendingObj.rowNum ==obj.rowNum ){ 
              obj.absTopBtm4Calc = pendingObj.absTopBtm;
            }
            //consecutive hlc higher and lower
            if(i == 1){
              obj.absTopBtm4Calc = 'NA';
            }

            isCompleteDone = true;
            pendingObj = null;
            resultList.push(obj);
            break;
          }
          resultList.push(obj);
        }
      }
    }
    
    var list = [];
    for (let i = 0; i < uniqueList.length; i++) {
      let obj = uniqueList[i];
      
      var objList = resultList.filter(x => x.status && x.securityId == obj.securityId);
      var fObj : any= {}; 					//fObj is finalObj

      var x = objList.filter(y => y.status == status)[0];
      if(!x) continue;
      fObj.dateObj = x.dte;
      fObj.status = x.status;
      fObj.daySce = x.daySce;
      fObj.weekSce = x.weekSce;
      fObj.monthSce = x.monthSce;
      fObj.absTopBtm = x.absTopBtm;
      fObj.ticker = x.ticker;
      fObj.securityId = x.securityId;
      fObj.colHigh = x.high;
      fObj.colClose = x.closePrice;
      fObj.colLow = x.low;
      fObj.id = x.id;
      fObj.timeFrame = x.timeFrame;
      if (x.absTopBtm4Calc)
        fObj.absTopBtm4Calc = Math.abs(x.absTopBtm4Calc);

      if (x.status == 'PENDING') {
        fObj.pendingStatus = true;
        fObj.pendingSce = x.scenario;
        fObj.pendingDate = x.asOfDate
      }
      fObj.perReturnFrClos = '';

      if (x.status == 'COMPLETE') {
          
        fObj.noOfDay = x.noOfDay;
        fObj.completeStatus = true;
        fObj.completeSce = x.scenario;
        fObj.completeDate = x.asOfDate;
        if(fObj.absTopBtm4Calc == 'NA'){
          fObj.perReturnFrClos ='null';
        }else{
           fObj.perReturnFrClos = ((fObj.colClose - fObj.absTopBtm4Calc) / fObj.colClose * 100).toFixed(2);
          fObj.perReturnFrClos = Math.abs( fObj.perReturnFrClos);
        }
       }

      if (fObj.noOfDay != 'undefined' && fObj.noOfDay != null) {
        if (fObj.timeFrame == 'WEEKLY')
          fObj.noOfDay = fObj.noOfDay + 1;
        else if (fObj.timeFrame != 'DAILY') {
          fObj.noOfDay = fObj.noOfDay + 1;
        }
      } else {
        fObj.noOfDay = '';
      }

      if (fObj.status) {
        fObj.scenario = fObj.status == 'COMPLETE' ? fObj.completeSce : fObj.pendingSce;
        fObj.view = fObj.scenario == 'HLC LOWER' ? 'SELLING' : 'BUYING';
        list.push(fObj);
      }
    }
     
    return list.sort((a,b)=> { return new Date(a.dateObj).getTime() - new Date(b.dateObj).getTime()  });
  }

  getSpName(params: ReportParams): void {

    if (params.exchangeId == 1) {
      params.spName = 'sp_getActionItemReport_Nse';
    }
    if (params.exchangeId == 2) {
      params.spName = 'BseSecurityAnalysis.dbo.sp_getActionItemReport_Bse';
    }
    if (params.exchangeId == 3) {
      params.spName = 'sp_getActionItemReport_Comm';  
    }
    if (params.exchangeId == 4) {
      params.spName = 'sp_getActionItemReport_Curr';
    }
    if (params.exchangeId == 5) {
      params.spName = 'sp_getActionItemReport_World';
    }
  }

  setNoOfDurationHeader(value) {
    switch (value) {
      case 'DAILY': this.timeTakenHeader = 'Days Taken';
        break;
      case 'WEEKLY': this.timeTakenHeader = 'Weeks Taken';
        break;
      case 'MONTHLY': this.timeTakenHeader = 'Month Taken';
        break;
      case 'QUOTERLY': this.timeTakenHeader = 'Quoter Taken';
        break;
      case 'SIX_MONTHLY': this.timeTakenHeader = 'Six Month Taken';
        break;
      case 'YEARLY': this.timeTakenHeader = 'Year Taken';
        break;
      case 'FIVE_YEAR':
        this.timeTakenHeader = 'Five Year Taken';
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private isValid(params: ReportParams) {
    let msg = '';
    
    if (params.indexId === undefined || params.initialId === undefined) {
      msg = 'Please Select index name';
      this.sharedService.openSnackBar(msg, 'Ok', 10);
    }
    
    return msg === '';
  }

  changeReportPar(par) {
    this.dataSource.data =this.processActionReport(this.responseData, par);
  }
}
