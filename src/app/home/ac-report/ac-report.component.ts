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
 	selector: 'app-ac-report',
 	templateUrl: './ac-report.component.html',
 	styleUrls: ['./ac-report.component.css']
 })

 //AVERAGE OUTCOME REPORT 

 export class AcReportComponent extends BaseComponent<any> implements OnInit { 
 	dataList: any[];
 	displayedColumns: string[] = ['srNo', 'date', 'ticker',  'outcome' ]; 
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
 				params.reportType = 'AocReport';  
 				this.showLoader = true;
 				this.dataSource.data = [] 
 				this.getByPost(Constant.GET_AOC_REPORT, params)
 				.subscribe(data => { 
 					this.showLoader = false;   
 					console.log(data);
 					if (data && data.length > 0){ 
 						this.dataSource.data = data;
 						this.sharedService.openSnackBar('Hover the mouse over outcome value to view defination.', 'Ok', 5);
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
 		var msg = '';
 		if(item.AVG_BUY == 1)
 			msg = msg+'3_TIER_AVG_BUY:  Avg(H+L+C) > Avg(H+L) & Avg(L+C)\n\n';

 		if(item.AVG_SELL == 1)
 			msg = msg+'3_TIER_AVG_SELL: Avg(H+L+C) <  Avg(H+L) & Avg(H+C)\n\n';

 		if(item.SIMILAR_DEF_SELL ==1 ) 
 			msg = msg+ 'SIMILAR_DEFECT_SELL: Running HLC Higher & Higher defect & avg(H+L+C) < ( avg(H+L) & avg(H+C))\n\n';

 		if(item.SIMILAR_DEF_BUY ==1 ){
 			msg = msg+ 'SIMILAR_DEFECT_SELL: Running HLC Lower & Lower defect & avg(H+L+C) > ( avg(H +L)  & avg(L+C))\n\n';
 		}

 		if(item.ODC_SELL ==1)
 			msg = msg+ 'OPPOSITE_DEFECT_SELL: Running HLC Higher & Lower defect\n\n';

 		if(item.ODC_BUY ==1)
 			msg = msg+ 'OPPOSITE_DEFECT_BUY: Running HLC Lower  & Higher defect \n\n'; 

 		return msg;
 	}

 	 

 	public getAvgToolTip(item): string{
 		var msg = '';
 		msg = 'High: '+ item.high + ', Low: '+ item.low + ', Close: '+item.closePrice+'\n\n';
 		msg = msg+ 'Average: ' +item.average.toFixed(2) + '\n\n'; 
 		msg = msg+ 'HL Average: ' +item.hlAverage.toFixed(2) + '\n\n'; 
 		msg = msg+ 'HC Average: ' +item.hcAverage.toFixed(2) + '\n\n'; 
 		msg = msg+ 'LC Average: ' +item.lcAverage.toFixed(2) + '\n\n'; 
 		return msg;
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
