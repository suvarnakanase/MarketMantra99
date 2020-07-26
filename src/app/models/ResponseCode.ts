export class ResponseCode{
	code:string;
	message: string;
	heading:string;
	data: any; 

	//
	actionBtnName: string;

	constructor(isDefault:boolean){
		if(!isDefault)
			return;
		this.code = "500";
		this.heading = "OOPS!!";
		this.message = "Some error occured. Please login again.";
		
	}
}