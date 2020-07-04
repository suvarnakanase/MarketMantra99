
export class BaseReportResponseParam{
    high:Number;
    low:Number;
    closePrice:Number;
    scenario :string;
    date:Date; 
}

export class TableReportModel extends BaseReportResponseParam{
    securityName : string;
    strDate: string;
    isHigh: Number;
    topBottom: Number; 
}