import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material';
import { ReportParams } from '../../models/reportParams';
import { SharedService } from '../../services/shared.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Subscription } from 'rxjs'; 
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { ExportToExcelService } from '../../services/export-to-excel.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-double-decker-report',
  templateUrl: './double-decker-report.component.html',
  styleUrls: ['./double-decker-report.component.css']
})

export class DoubleDeckerReportComponent extends BaseComponent<any> implements OnInit { 
    dataList: any[];
    displayedColumns: string[] = ['srNo', 'reportDate', 'ticker', '1stAction', 'date1',
                                  '2ndAction', 'date2']; 
    showLoader = false;  
     
    private subscription: Subscription;
    dataSource = new MatTableDataSource<any[]>();
  
    ngOnInit() { 
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
  
          params.reportType = 'DD_Report'; 
  
          this.showLoader = true;
          this.dataSource.data = [] 
          this.getByPost(Constant.GET_DD_REPORT, params)
            .subscribe(data => {
              this.showLoader = false;  
              console.log(data)
               
              if (data && data.length > 0){ 
                this.dataSource.data = data;
              }
              else {
                this.sharedService.openSnackBar('No data found for a given parameter', 'Ok', 8);
              }
              
            });
        });
    }
  
    ngOnDestroy(): void { 
      this.subscription.unsubscribe();
    }

    public getToolTipValue(item): string{
      if(!this.isSuperAdmin) return ''; 
        //s return 'Address : Home \n  Tel : Number';
      var ret = item.perReturn? item.perReturn.toFixed(2): '-';  
      return '% Return:     '+ ret+
             '\n DaysTaken: '+item.daysTaken +
             '\n Current CL:'+item.currentClosePrice;
    }
  
    private isValid(params: ReportParams) {
      let msg = '';
      console.log(params )
      if (params.indexId ==-1 &&params.initialId == -1) { 
        msg = 'Please Select index';
        this.sharedService.openSnackBar(msg, 'Ok', 8);
      } 
      return msg =='';
    }  
} 