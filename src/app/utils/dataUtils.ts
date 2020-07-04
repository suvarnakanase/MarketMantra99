import { TableReportModel } from '../models/reportsResponseModel';
import { ReportParams } from '../models/reportParams';


export class DataUtil {
 
	private params:ReportParams;
	constructor() {

	}

	public proccessDataForTbBt(data,  params: ReportParams): any[]{
		this.params = params;
		var resultData = [];
		const uniqueScriptArra = data.map(item => item.securityName)
			.filter((value, index, self) => self.indexOf(value) === index); 
		uniqueScriptArra.forEach(securityName => {

			var sameSecurityData = data.filter(x => x.securityName == securityName);
			this.setHat_HabScenario(sameSecurityData);
			var modifyData = params.setUpName == 'tb' ? this.getTbList(sameSecurityData) : this.getBtList(sameSecurityData);
			if (modifyData.length > 0)
				resultData.push(modifyData[0]);
		});
		return resultData;	 
	}

	public processDataForMST(data: TableReportModel[]) {
		var resultData = [];
		const uniqueScriptArra = data.map(item => item.securityName)
			.filter((value, index, self) => self.indexOf(value) === index);

		console.log(data.length)
		uniqueScriptArra.forEach(securityName => {

			var sameSecurityData = data.filter(x => x.securityName == securityName);
			this.setHat_HabScenario(sameSecurityData); 
			var modObj = createObject();
			if (modObj)
				resultData.push(modObj);

			function createObject() {
				sameSecurityData = sameSecurityData.filter(s => !!s.scenario);
				let count = sameSecurityData.length;


				let scenarioQuery = '';
				let createdObj: any = {};

				if (sameSecurityData.length > 2) {
					let lastScenario = sameSecurityData[count - 1];
					let middleScenario = sameSecurityData[count - 2];
					let firstScenario = sameSecurityData[count - 3];

					let isBuyQuery = lastScenario.scenario == 'HAB' && middleScenario.scenario == 'HAT' && firstScenario.scenario == 'HAB';
					let isSellQuery = lastScenario.scenario == 'LAT' && middleScenario.scenario == 'LAB' && firstScenario.scenario == 'LAT';


					if (isBuyQuery) {
						createdObj.securityName = lastScenario.securityName;

						createdObj.scenario3 = lastScenario.scenario;
						createdObj.price3 = lastScenario.low;
						createdObj.date3 = lastScenario.strDate;
						createdObj.date = lastScenario.date;

						createdObj.scenario2 = middleScenario.scenario;
						createdObj.price2 = middleScenario.high;
						createdObj.date2 = middleScenario.strDate;

						createdObj.scenario1 = firstScenario.scenario;
						createdObj.price1 = firstScenario.low;
						createdObj.date1 = firstScenario.strDate;

						createdObj.scenarioQuery = "HAB-HAT-HAB";
						createdObj.action = 'BUYING';
						sameSecurityData = [];
						return createdObj;
					}

					if (isSellQuery) {
						createdObj.securityName = lastScenario.securityName;

						createdObj.scenario3 = lastScenario.scenario;
						createdObj.price3 = lastScenario.high;
						createdObj.date3 = lastScenario.strDate;
						createdObj.date = lastScenario.date;

						createdObj.scenario2 = middleScenario.scenario;
						createdObj.price2 = middleScenario.low;
						createdObj.date2 = middleScenario.strDate;

						createdObj.scenario1 = firstScenario.scenario;
						createdObj.price1 = firstScenario.high;
						createdObj.date1 = firstScenario.strDate;

						createdObj.scenarioQuery = "LAT-LAB-LAT";
						createdObj.action = 'SELLING';
						return createdObj;
					}
				};
				return null;
			}
		});
		return resultData;
	} 

	public setHat_HabScenario(data: any[]) {
		if (data && data.length > 0) {
			let highData = data.filter(x => x.isHigh === 1);
			let lowData = data.filter(x => x.isHigh === 0);
			  
			for (let i = 0; i < highData.length; i++) {
				if (i == 0) continue;
				let isHighFromPre = highData[i].high > highData[i - 1].high;
				highData[i].scenario = isHighFromPre ? 'HAT' : 'LAT';
			}

			for (let i = 0; i < lowData.length; i++) {
				if (i == 0) continue;
				let isLowHighFrPrev = lowData[i].low > lowData[i - 1].low;
				lowData[i].scenario = isLowHighFrPrev ? 'HAB' : 'LAB';
			}
		}
	}
	//same as above
	public setScenario(data: any[]) {
		if (data && data.length > 0) {
			let highData = data.filter(x => x.isHigh === 1);
			let lowData = data.filter(x => x.isHigh === 0);
			for (let i = 0; i < highData.length; i++) {
				if (i == 0) continue;
				let isHighFromPre = highData[i].high > highData[i - 1].high;
				highData[i].scenario = isHighFromPre ? 'HAT' : 'LAT';
			}

			for (let i = 0; i < lowData.length; i++) {
				if (i == 0) continue;
				let isLowHighFrPrev = lowData[i].low > lowData[i - 1].low;
				lowData[i].scenario = isLowHighFrPrev ? 'HAB' : 'LAB';
			}
		}
	}

	public getHatLat(data: any[]) {
		var filterData = data.filter(x => !!x.scenario);
		var obj = filterData[filterData.length - 1];
		return obj;
	}

	public getJson(jsonObject) {
		if (typeof jsonObject == 'string')
			return JSON.parse(jsonObject);

		if (typeof jsonObject == 'object')
			return jsonObject;
		return null;
	} 

	private getTbList(data) {  
		var tbDataList = []; 
		data = data.filter(x => x.scenario == 'HAT' || x.scenario == 'HAB');
		let lenght = data.length; 
		if(data && lenght>=2){
			let lastObj = data[lenght-1];			//firstObj : in date asc 01-01-2020
			let secondLastObj= data[lenght-2];			//secObj in date asc 05-01-2020; 
			if(secondLastObj.scenario == 'HAT' && lastObj.scenario == 'HAB') {
				let hatHabObj = this.getTbDataObj(lastObj, secondLastObj); 
				tbDataList.push(hatHabObj);
			}
				 	
		} 
		return tbDataList;
	}

	private getTbDataObj(habObj, hatObj): any {
		var obj = {
			hatDate: hatObj.strDate,
			habDate: habObj.strDate,
			scriptName: hatObj.securityName,
			date: habObj.strDate,
			timeFrame: this.params.timeFrame,
			actualDate: habObj.date,
			setUpName: this.params.setUpName == 'tb' ? "TB SET UP" : "BT SET UP"
		}
		return obj;
	}
	private getBtDataObj(latObj, labObj) {
		var obj = {
			latDate: latObj.strDate,
			labDate: labObj.strDate,
			scriptName: latObj.securityName,
			date: latObj.strDate,
			timeFrame: this.params.timeFrame,
			actualDate: latObj.date,
			setUpName: this.params.setUpName == "1" ? "TB SET UP" : "BT SET UP"
		}
		return obj;
	}


	private getBtList(data) { 
		var btDataList = []; 
		data = data.filter(x => x.scenario == 'LAB' || x.scenario == 'LAT');
		let lenght = data.length; 
		if(data && lenght>=2){
			let lastObj = data[lenght-1];			//firstObj : in date asc 01-01-2020 ,LAB
			let secondObj = data[lenght-2];			//secObj in date asc 05-01-2020; , LAT
			if(secondObj.scenario == 'LAB' && lastObj.scenario == 'LAT') {
				let hatHabObj = this.getBtDataObj(lastObj, secondObj); 
				btDataList.push(hatHabObj);
			} 	 	
		} 
		return btDataList;
	}


}

