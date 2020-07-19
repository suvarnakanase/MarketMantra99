import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';
import { DynamicServices } from '../../services/dynamic.service';
import { Securities } from '../../models/securities';
import { Constant } from '../../shared/constant';
import { IndexMaster } from '../../models/indexMaster';
import { SharedService } from '../../services/shared.service';
import { StorageService } from '../../services/storage.service';
import { DataMediaterService } from '../../services/data-mediater.service';
import { ReportParams } from '../../models/reportParams';
import { ReportType } from '../../models/baseEntity';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { slideInAnimation } from '../../router-transistion';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { ExportToExcelService } from '../../services/export-to-excel.service';

const initialList: IndexMaster[] = [
{ id: -1, indexName: 'A-F', isIndexFilter: false, isBSE: false },
{ id: -2, indexName: 'G-L', isIndexFilter: false, isBSE: false },
{ id: -3, indexName: 'M-T', isIndexFilter: false, isBSE: false },
{ id: -4, indexName: 'U-Z', isIndexFilter: false, isBSE: false }
]
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [DataMediaterService],
    animations: [slideInAnimation]
})

export class HomeComponent extends BaseComponent<any> implements OnInit {
    @Output() sidenavClose = new EventEmitter();
    isUserScreen: boolean = false;
    events: string[] = [];
    opened: boolean = true;
    isIndexFilter: boolean = true;
    params: ReportParams = new ReportParams;
    minDate: Date = this.user.reportViewFrDate;
    maxDate = new Date();
    showLoader = false; 
    fileToUpload: File = null;

    isSecurityReq: boolean = true;
    showQueryProgress: boolean = false;
    selectedSecurityName: string = '';
    selectedIndexName: string = '';
    //for actionItem Report
    timeTakenHeader: string = 'Days Taken';
    isTbBtReport = false;
    isFromDateRequired : boolean = true;

    selectedReport: ReportType;

    private securities: Securities[];
    private filteredSecurities: Observable<Securities[]>;

    public templateSample: any = [{
        'Ticker': '', 'Date': '', 'TickerName': '',
        'Open': '', 'High': '', 'Low': '', 'Close': ''
    }]; 

    private indexList: IndexMaster[];
    filteredOptions: Observable<IndexMaster[]>;
    public isDisplayTimeFrame : boolean = true;

    constructor(private service: DynamicServices,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private route: Router,
        private exp: ExportToExcelService,
        private mediaterService: DataMediaterService) { 
        super(service, exp, sharedService);
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 2);
        this.params.fromDate = currentDate;
        this.setSelectedReportType();
        this.displayTimeFrame(); 

        this.activatedRoute.url.subscribe(url => {
            this.setSelectedReportType();

            this.isUserScreen = this.route.url === '/home/userManagement';
            this.isTbBtReport = this.route.url ==='/home/tbBtReport';

            this.onTimeFrameChange('WEEKLY');   
            this.displayTimeFrame(); 

            this.selectedSecurityName = '';
            this.params.nseSecurityId = null; 

            if (this.selectedReport.isUserScreen)
                return;

            this.isSecurityReq = this.getIsSecurityReq();
            this.isFromDateRequired = this.isFromDateReq();
            if (this.indexList && this.indexList.filter(x => x.id < 0).length === 0) {
                initialList.forEach(x => this.indexList.push(x));
            }
            
            this.indexFilter(null);
        });
        mediaterService.reportParamsSource$.subscribe(
            re => {
                this.params = re;
            });
    }

    setSelectedReportType(){ 
        this.selectedReport = new ReportType();
        this.selectedReport.isUserScreen = this.route.url === '/home/userManagement';
        this.selectedReport.isTbBtReport = this.route.url ==='/home/tbBtReport';
        this.selectedReport.isActionItemTrade = this.route.url === '/home/actionItemTrade';
        this.selectedReport.isOtReport = (this.route.url === '/home/otReport');
        this.selectedReport.isRecordSheet = this.route.url === '/home/recordSheet' ;
        this.selectedReport.isMstReport = this.route.url == '/home/mstReport'; 
        this.selectedReport.isDDReport = this.route.url == '/home/ddReport'; 
        this.selectedReport.isDDReport = this.route.url == '/home/ddReport'; 
        this.selectedReport.isAocReport = this.route.url == '/home/aocReport'; 
    }

    public isFromDateReq():boolean{
        let selReport = this.selectedReport; 
        return !(selReport.isOtReport ||
                 selReport.isMstReport  || 
                 selReport.isDDReport ||
                 selReport.isTbBtReport ||
                 selReport.isAocReport );
    }

    getData() {
        if (!this.selectedSecurityName) {
            this.params.nseSecurityId = -1;
            if(!this.user)
                return this.logout();
            this.params.userId = this.user.id;  
        }
        this.mediaterService.emitReportParams(this.params);
    }

    getIsSecurityReq(): boolean { 
        let selReport = this.selectedReport;
        return !(selReport.isRecordSheet || 
                 selReport.isActionItemTrade ||
                 selReport.isOtReport ||
                 selReport.isMstReport  ||
                 selReport.isTbBtReport ||
                 selReport.isDDReport ||
                 selReport.isAocReport);
    }


    ngOnInit() {
        this.setSelectedReportType();
        if (this.selectedReport.isUserScreen) {
            return;
        }
        this.loadIndexList();
    }
    // this.service.getEntities(Constant.GET_SECURITIES)    

    loadIndexList() {
        this.showQueryProgress = true;
        this.service.getEntities(Constant.GET_INDEXES + this.params.exchangeId)
        .subscribe(resp => {
            this.indexList = resp.data;
            this.showQueryProgress = false;
            if(this.indexList && this.indexList.length>0){
                this.selectedIndexName = this.indexList[0].indexName;
                this.onIndexSelected(this.selectedIndexName);
            }
            if (true) {
                initialList.forEach(x => this.indexList.push(x));
            }
            this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    return this.indexFilter(value)
                })
                );
        }, err => {
            this.showQueryProgress = false;
            console.log(err);
        });
    }

    myControl = new FormControl();
    securityControll = new FormControl();

    private indexFilter(value: string): IndexMaster[] {
        if (!value) return this.indexList;

        const filterValue = value.toLowerCase();
        return this.indexList.filter(option =>
            option.indexName && option.indexName.toLowerCase().includes(filterValue)
            );
    }

    public onInitialChange(value) {
        this.params.initials = value;
        this.params.indexId = 0;
        const url = Constant.GET_SECURITIES + this.params.initials + '/' + this.params.indexId
        this.service.getEntities(url)
        .subscribe(items => {
            this.securities = items;
        });
    }

    private securityFilter(value: string): Securities[] {
        if (!value) return this.securities;
        const filterValue = value.toLowerCase();
        return this.securities.filter(option =>
            option.ticker && option.ticker.toLowerCase().includes(filterValue)
            );
    }

    private onExchageSelected(exchangeId) {
        this.selectedSecurityName = null;
        this.selectedIndexName = null;
        this.loadIndexList();
    }

    private onIndexSelected(name) { 
        this.selectedSecurityName = '';
        let indexId = this.indexList.find(x => x.indexName === name).id;
        if (indexId < 0) {
            this.params.initials = name;
            this.params.initialId = -indexId;
            this.params.indexId = -1;
        } else {
            this.params.initials = '-1';
            this.params.initialId = -1;

        }
        this.params.indexId = indexId;
        if(!this.isSecurityReq) 
            return;
        const url = Constant.GET_SECURITIES + this.params.initials + '/' + this.params.indexId + '/' + this.params.exchangeId;
        this.showQueryProgress = true;
        this.service.getEntities(url)
        .subscribe(items => {
            this.showQueryProgress = false;
            this.securities = items;
            if(this.securities && this.securities.length>0){
                this.selectedSecurityName = this.securities[0].ticker;
                this.params.nseSecurityId = this.securities[0].id;
            }

            this.filteredSecurities = this.securityControll.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    return this.securityFilter(value)
                })
                );
        }, err => this.showQueryProgress = false);
    }

    private onSecuritySelected(name) {
        let securityId = this.securities.find(x => x.ticker === name).id;
        this.params.nseSecurityId = securityId;
        console.log(securityId);
    }

    private displayTimeFrame(){
        let isActionItemTrade = (this.route.url === '/home/actionItemTrade');

        let isOtr = (this.route.url === '/home/otReport');
        if(this.selectedReport.isActionItemTrade || this.selectedReport.isOtReport){
            this.isDisplayTimeFrame = false; 
        }
        else
            this.isDisplayTimeFrame = true;
        this.onTimeFrameChange('WEEKLY');
    }

    private onTimeFrameChange(value) {
        let isActionItemTrade = this.selectedReport.isActionItemTrade;
        let isOtr = this.selectedReport.isOtReport;
        let isTbBtReport = this.selectedReport.isTbBtReport;

        let timeObj = null;

        if(isActionItemTrade){
            timeObj = {daily: 15, week: 93, month: 6 ,quoter: 12, sixMonth: 2, yrly: 48};
        }

        if(isTbBtReport)    
            timeObj = {daily: 180, week: 365, month: 36 ,quoter: 60, sixMonth: 12, yrly: 144};

        if(isOtr)  {  
            timeObj = {daily: 45, week: 180,  month: 12 ,quoter: 12, sixMonth: 12, yrly: 144}; 
        }

        if (isActionItemTrade ||  isTbBtReport || isOtr) {
            this.minDate = new Date();
            let date = new Date();
            switch (value) {
                case 'DAILY':
                this.maxDate = new Date();
                this.minDate.setDate(this.maxDate.getDate() - timeObj.daily);
                this.timeTakenHeader = 'Days Taken'; 
                date.setDate(this.maxDate.getMonth()-1);
                break;
                case 'WEEKLY':
                this.maxDate = new Date();
                this.minDate.setDate(this.maxDate.getDate() - timeObj.week);
                this.timeTakenHeader = 'Days Taken';
                date.setDate(this.maxDate.getMonth()-3); 
                break;

                case 'MONTHLY':
                this.maxDate = new Date();
                this.minDate.setMonth(this.minDate.getMonth() - timeObj.month);
                this.timeTakenHeader = 'Month Taken'; 
                date.setDate(this.maxDate.getMonth()-3); 
                break;
                case 'QUOTERLY':
                this.maxDate = new Date();
                this.minDate.setMonth(this.minDate.getMonth() - timeObj.quoter);
                this.timeTakenHeader = 'Quoter Taken'; 
                date.setDate(this.maxDate.getMonth()-9); 
                
                break;
                case 'SIX_MONTHLY':
                this.maxDate = new Date();
                this.minDate.setFullYear(this.minDate.getFullYear() - timeObj.sixMonth);
                this.timeTakenHeader = 'Six Month Taken'; 
                date.setDate(this.maxDate.getMonth()- 16); 

                break;
                case 'YEARLY':
                this.maxDate = new Date();
                this.minDate.setMonth(this.minDate.getMonth() - timeObj.yrly);
                this.timeTakenHeader = 'Year Taken';
                break;
                case 'FIVE_YEAR':
                this.maxDate = new Date();
                this.minDate.setFullYear(1990);
                this.timeTakenHeader = 'Five Year Taken'; 
                break; 
            }
            this.params.fromDate = date;
            this.params.toDate = this.maxDate;

        } else {
            this.maxDate = new Date();
            this.minDate = this.user.reportViewFrDate;
        }
    } 
    
    logout(): void {
        this.route.navigate(['/login']);
        sessionStorage.setItem('user', '');
        this.sharedService.users = null;
    }

    public fromDateChange(value) {

    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        if (!this.fileToUpload) return this.sharedService.openSnackBar('Select a different file ', 'ok', 10);

        if (!this.validateFileUpload(this.fileToUpload.name)) {
            return;
        }

        this.showLoader = true;
        this.service.postUploadFile(this.fileToUpload, this.params.fileTypeId, Constant.UPLOAD_FILE)
        .subscribe(resp => {
            if (resp && resp.messageCode !== 0) {
                this.sharedService.openSnackBar(resp.message, 'Ok', 120);
            }
            if (resp && resp.messageCode == '0') {
                this.sharedService.openSnackBar(resp.message, 'Ok', 120);
                this.fileToUpload = null;
            } else if (resp && resp.status == 500 && resp.message) {
                this.sharedService.openSnackBar(resp.message, 'Ok', 120);
            }


            this.showLoader = false;
        });
    }

    validateFileUpload(uploadFileName): boolean {
        var exchangeId = this.params.fileTypeId;
        var exchangeType = ReportParams.getFileTypeEnum(exchangeId);

        if (uploadFileName.toLowerCase().startsWith(exchangeType.toString()))
            return true;

        this.sharedService.openSnackBar("File name should contain  the  exhange name", "Ok", 10);
        return false;
    }

    public openFileChooser(fileId) {
        this.params.fileTypeId = fileId;
        document.getElementById("fileUpload").click();
    }

    public changePassowrd() {
        if (this.user) {
            const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
                width: '400px',
                data: this.user
            });

            dialogRef.afterClosed().subscribe(result => {
                // this.animal = result;
            });
        }
    }

    public onSidenavClose = () => {
        console.log("close menu")
        this.sidenavClose.emit();
      }
}
