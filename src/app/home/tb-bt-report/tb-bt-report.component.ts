import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { DataMediaterService } from 'src/app/services/data-mediater.service';
import { DynamicServices } from 'src/app/services/dynamic.service';
import { ExportToExcelService } from 'src/app/services/export-to-excel.service';
import { BaseComponent } from 'src/app/base/base.component';
import { Subscription } from 'rxjs';
import { MatTableDataSource, Sort } from '@angular/material';
import { Constant } from 'src/app/shared/constant';
import { ReportParams } from 'src/app/models/reportParams';
import { DataUtil } from '../../utils/dataUtils';


@Component({
  selector: 'app-tb-bt-report',
  templateUrl: './tb-bt-report.component.html',
  styleUrls: ['./tb-bt-report.component.css']
})

export class TbBtReportComponent extends BaseComponent<any> implements OnInit, OnDestroy { 

  dataList: any[];
  isTB = true;
  displayedColumns: string[] = ['date', 'scriptName', 'timeFrame', 'setUp', 'hat_lab_date', 'hab_lat_date']; 


  private subscription: Subscription;
  dataSource = new MatTableDataSource<any>();
  private params: ReportParams;

  constructor(private sharedService: SharedService,
    private mediaterService: DataMediaterService,
    private dynamic: DynamicServices,
    private excelService: ExportToExcelService
    ) {
    super(dynamic, excelService, sharedService);

    this.subscription = mediaterService.reportParamsSource$.subscribe(
      params => {
        // if (!this.isValid(params)) return;
        this.params  =params;
        params.reportType = 'TABLE_REPORT';
        this.params = params;
        this.isTB = params.setUpName == "tb";

        this.displayLoader();
        this.dataSource.data = [];
        this.getByPost(Constant.GET_TB_BT_REPORT, params)
        .subscribe(data => {
          this.hideLoader();

          if(data && data.length>0 && data[0].messageCode == -99){
            this.sharedService.openSnackBar( data[0].message, '', 10);
            return;
          }

          if (data && data.length > 0) { 
            this.dataList = data;
            this.showSetup();
          } 
          else
            this.sharedService.openSnackBar("No data to display", 'Ok', 30);
        });
      });
  }

  ngOnInit() {
  } 

  public showTBSetup(){
    this.isTB = true;
    this.showSetup();
  }

  public showBTSetup(){
    this.isTB = false;
    this.showSetup();
  }

  private showSetup(){
    let displayList = []; 
    this.params.setUpName = this.isTB? 'tb': 'bt'; 
    if(this.dataList && this.dataList.length==0){
      this.sharedService.openSnackBar("No data to display", 'Ok', 10); 
      return ;
    }

    displayList = new DataUtil().proccessDataForTbBt(this.dataList, this.params); 
    displayList.sort((val1, val2)=> {return new Date(val2.actualDate).getTime() - new Date(val1.actualDate).getTime() })
    this.dataSource.data = displayList;  

    if(displayList.length ==0 )
      this.sharedService.openSnackBar("No data to display", 'Ok', 10); 

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


