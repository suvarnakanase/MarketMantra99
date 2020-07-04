export class User {
    userName: string;
    password: string; 

    public constructor(username: string,  pwrd: string ){
        this.userName = username;
        this.password = pwrd;
    }
}

export interface MenuMaster{
    id: number;
    name: string;
    code: string;
    isDisplayed: boolean;
}

export interface UserMaster{
    id: number;
    fullName:string;
    password: string; 
    userName:  string;
    isAdmin:boolean;
    emailId: string;
    isActive: any;   
    address : string; 
    validTill : Date;
    reportViewFrDate: Date;
    phoneNumber : string;
    panNo:string;
    tablePermission: boolean ;
    tbBtReportPerm: boolean;
    recordSheetPerm: boolean;
    resultOutPerm: boolean;
    ddReportPerm: boolean;
    dataSumaryReportPerm: boolean; 
    aocReportPerm: boolean;
    otReportPerm:boolean;
    mstReportPerm: boolean;
    isSuperAdmin: boolean;
}
         

 