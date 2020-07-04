import { SecurityTransaction } from './securityTransaction';

export class PointerSheetModel extends SecurityTransaction{

	fib14_6: number = 14.6;
	fib23_6: number = 23.6;
	fib38_2: number = 38.2;
	fib61_8: number = 61.8;
	fib100: number = 100;
	
	fib127_2: number = 127.2;
	fib161_8: number = 161.8;
	fib261_8: number = 261.8;
	fib423_6: number = 423.6;

	closePrice: number;
	range : number;

	rcLow14_6: number;
	rc14_6: number ;
	rcUpp14_6: number ;


	rcLow23_6: number ;
	rc23_6: number ;
	rcUpp23_6: number ;
	
	rcLow38_2: number ;
	rc38_2: number ;
	rcUpp38_2: number ;

	rcLow61_8: number ;
	rc61_8: number ;
	rcUpp61_8: number ;

	rcLow100: number 
	rc100: number 
	rcUpp100: number 
	
	rcLow161_8: number ;
	rc161_8: number ;
	rcUpp161_8: number ;

	rcLow127_2: number ;
	rc127_2: number ;
	rcUpp127_2: number ;

	rcLow261_8: number ;
	rc261_8: number ;
	rcUpp261_8: number ;

	rcLow423_6: number ;
	rc423_6: number ;
	rcUpp423_6: number ;
 

	fcLow14_6: number ;
	fc14_6: number ;
	fcUpp14_6: number ;


	fcLow23_6: number ;
	fc23_6: number ;
	fcUpp23_6: number ;
	
	fcLow38_2: number ;
	fc38_2: number ;
	fcUpp38_2: number ;

	fcLow61_8: number ;
	fc61_8: number ;
	fcUpp61_8: number ;

	fcLow100: number 
	fc100: number 
	fcUpp100: number 
	
	fcLow161_8: number ;
	fc161_8: number ;
	fcUpp161_8: number ;

	fcLow127_2: number ;
	fc127_2: number ;
	fcUpp127_2: number ;

	fcLow261_8: number ;
	fc261_8: number ;
	fcUpp261_8: number ;

	fcLow423_6: number ;
	fc423_6: number ;
	fcUpp423_6: number ; 

	constructor(dataObj: SecurityTransaction){

		super();
		this.closePrice = dataObj.closePrice;
		this.range = dataObj.high - dataObj.low; 
		this.high = dataObj.high; 
		this.closePrice = dataObj.closePrice; 
		this.low = dataObj.low; 
		this.topBottom = dataObj.topBottom;

		this.openPrice = dataObj.openPrice; 
		this.strDate = dataObj.strDate; 
		this.scenario = dataObj.scenario; 
		this.isHigh = dataObj.isHigh;
		this.rowNum = dataObj.rowNum; 
		this.date = dataObj.date; 
		this.calculateValues(); 
	}

	calculateValues(){
		this.rc14_6 = this.range * this.fib14_6/100 + this.closePrice;
		this.rc23_6 = this.range * this.fib23_6/100 + this.closePrice;
		this.rc38_2 = this.range * this.fib38_2/100 + this.closePrice;

		this.rc61_8 = this.range * this.fib61_8/100 + this.closePrice;
		this.rc100  = this.range * this.fib100/100 + this.closePrice;
		
		this.rc127_2 = this.range * this.fib127_2/100 + this.closePrice;
		this.rc161_8 = this.range * this.fib161_8/100 + this.closePrice;
		this.rc261_8 = this.range * this.fib261_8/100 + this.closePrice;
		
		this.rc423_6 = this.range * this.fib423_6/100 + this.closePrice;

		this.fc14_6 = this.closePrice - (this.range * this.fib14_6)/100;
		this.fc23_6 = this.closePrice - (this.range * this.fib23_6)/100;
		this.fc38_2 = this.closePrice - (this.range  * this.fib38_2)/100;

		this.fc61_8 = this.closePrice - (this.range * this.fib61_8)/100;
		this.fc100  = this.closePrice - (this.range * this.fib100 )/100;

		this.fc127_2 = this.closePrice - (this.range * this.fib127_2)/100;
		this.fc161_8 = this.closePrice - (this.range * this.fib161_8)/100;
		this.fc261_8 = this.closePrice - (this.range * this.fib261_8)/100;
		
		this.fc423_6 = this.closePrice - (this.range * this.fib423_6)/100;

		this.rcUpp14_6 = this.rc14_6 +(this.rc23_6 -this.rc14_6) * this.fib38_2 /100;
		this.rcLow14_6 = this.rc14_6 -(this.rc14_6 - this.fc14_6) * this.fib38_2 /100;

		this.rcUpp23_6 = this.rc23_6;
		this.rcLow23_6 = this.rc23_6;

		this.rcUpp38_2 = this.rc38_2 +(this.rc61_8 -this.rc38_2) * this.fib38_2 /100;
		this.rcLow38_2 = this.rc38_2 -(this.rc38_2 - this.rc23_6) * this.fib38_2 /100;
		
		this.rcUpp61_8 = this.rc61_8 +(this.rc100 -this.rc61_8) * this.fib38_2 /100;
		this.rcLow61_8 = this.rc61_8 -(this.rc61_8 - this.rc38_2) * this.fib38_2 /100;
		
		this.rcUpp100 = this.rc100 +(this.rc127_2 -this.rc100) * this.fib38_2 /100;
		this.rcLow100 = this.rc100 -(this.rc100 - this.rc61_8) * this.fib38_2 /100;
		
		this.rcUpp127_2 = this.rc127_2 +(this.rc161_8 -this.rc127_2) * this.fib38_2 /100;
		this.rcLow127_2 = this.rc127_2 -(this.rc127_2 - this.rc100) * this.fib38_2 /100;
		
		this.rcUpp161_8 = this.rc161_8 +(this.rc161_8 -this.rc127_2) * this.fib38_2 /100;
		this.rcLow161_8 = this.rc161_8 -(this.rc161_8 - this.rc127_2) * this.fib38_2 /100;
		
		this.rcUpp261_8 = this.rc261_8 +(this.rc423_6 -this.rc261_8) * this.fib38_2 /100;
		this.rcLow261_8 = this.rc261_8 -(this.rc261_8 - this.rc161_8) * this.fib38_2 /100;
		
		this.fcUpp14_6 = this.fc14_6 +(this.rc14_6 - this.fc14_6 ) * this.fib38_2 /100;
		this.fcLow14_6 = this.fc14_6 -(this.fc14_6 - this.fc23_6) * this.fib38_2 /100;
		
		this.fcUpp23_6 = this.fc23_6;
		this.fcLow23_6 = this.fc23_6;

		this.fcUpp38_2 = this.fc38_2 +(this.fc23_6 - this.fc38_2 ) * this.fib38_2 /100;
		this.fcLow38_2 = this.fc38_2 -(this.fc38_2 - this.fc61_8) * this.fib38_2 /100;
		 

		this.fcUpp61_8 = this.fc61_8 +(this.fc38_2- this.fc61_8 ) * this.fib38_2 /100;
		this.fcLow61_8 = this.fc61_8 -(this.fc61_8 - this.fc100) * this.fib38_2 /100;
		 
		this.fcUpp100 = this.fc100 +(this.fc61_8- this.fc100 ) * this.fib38_2 /100;
		this.fcLow100 = this.fc100 -(this.fc100 - this.fc127_2) * this.fib38_2 /100;
		 
		this.fcUpp127_2 = this.fc127_2 +(this.fc100- this.fc127_2 ) * this.fib38_2 /100;
		this.fcLow127_2 = this.fc127_2 -(this.fc127_2 - this.fc161_8) * this.fib38_2 /100;
		 
		this.fcUpp161_8 = this.fc161_8 +(this.fc127_2- this.fc161_8 ) * this.fib38_2 /100;
		this.fcLow161_8 = this.fc161_8 -(this.fc161_8 - this.fc261_8) * this.fib38_2 /100;
		
		this.fcUpp261_8 = this.fc261_8 +(this.fc161_8 - this.fc261_8 ) * this.fib38_2 /100;
		this.fcLow261_8 = this.fc261_8 -(this.fc261_8 - this.fc423_6) * this.fib38_2 /100;
			
	}  
}