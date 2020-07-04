import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ReportParams } from '../models/reportParams';

@Injectable( )
export class DataMediaterService {

  constructor() { }

  private reportParamsSource = new Subject<ReportParams>(); 
  
  reportParamsSource$ = this.reportParamsSource.asObservable(); 
  
  emitReportParams(params: ReportParams) {  
    this.reportParamsSource.next(params);
  }
}
