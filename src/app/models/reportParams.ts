export class ReportParams {
	fromDate: any = new Date();
	toDate: any = new Date();
	timeFrame: string = 'WEEKLY';
	indexId: number = -1;
	nseSecurityId: number = -1;
	initials: string;
	pageNo: number = 0;
	initialId: number = -1;
	reportType: string;
	exchangeId: any = "1";
	fileTypeId: number;
	spName: string;
	setUpName: string;  //tb or bt setup
	exchangeName: string ;
	userId: number;
	//userId: string = this.getUserId(); 

	static getFileTypeEnum(typeId: number): string {
		if (typeId == 1)
			return "nse";

		if (typeId == 2)
			return "bse";

		if (typeId == 3)
			return "commodity";
 
		if (typeId == 4)
			return "currency";   
		if (typeId == 5)
			return "world";
	} 

	private getUserId(){
		let userId = sessionStorage.getItem('user');
		if(userId)
			return userId;

		let userStr = sessionStorage.getItem('user');
		let userObj = getJson(userStr);
		sessionStorage.setItem("a", userObj.id);
		return userObj.id; 

		function getJson(jsonObject) {
			if (typeof jsonObject == 'string')
				return JSON.parse(jsonObject);

			if (typeof jsonObject == 'object')
				return jsonObject;
			return null;
		}
	}
}



export enum FileTypeEnum {
	NSE ,
	BSE ,
	COMMODITY  ,
	CURRENCY  ,
	WORLD  
}


