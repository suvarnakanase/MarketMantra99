
import { Observable } from "rxjs";
import { DynamicServices } from '../services/dynamic.service';
import { ReportParams } from '../models/reportParams';
import { SharedService } from '../services/shared.service';
import { ExportToExcelService } from '../services/export-to-excel.service';
import { UserMaster } from '../models/user';
import { StorageService } from '../services/storage.service';
import { EncryptionService } from '../services/encryption.service';

export class BaseComponent<T> {
	isSaving: boolean;
	entity: T;
	message: string = "";
	isShowMessage: boolean = false;
	isCreateView: boolean = true;

	public userName: string;
	public isAdmin: boolean = false; 
	
	public pageTitle: string;

	public isSuperAdmin : boolean = false; 
	public user :UserMaster;
	public showLoader :boolean =  false;

	private storageService: StorageService; 
	/**
	 *
	 */
	constructor(
		private dynamicService: DynamicServices,
		private exportService: ExportToExcelService,
		private shared: SharedService  
	) {
		this.storageService = new StorageService(new EncryptionService()); 
		this.user = this.storageService.getUser(); 

		if(this.user){ 
			this.userName =  this.user.fullName ? this.user.fullName.split(' ')[0]: 'Guest';
			this.userName = 'Hi, '+ this.userName;
			this.isAdmin = this.user.isAdmin; 
			this.isSuperAdmin = this.user.isSuperAdmin; 
		} 
	} 

	exportToExcel(data: any[] , name:string = null) {
		name = name || 'SecurityAnalysis_export';
		name = name + '_' + new Date().toDateString() ;
		if (data && data.length > 0)
			this.exportService.exportAsExcelFile(data, name);
		else {
			this.shared.openSnackBar('Data source is Empty', 'OK', 5);
		}
		this.shared.dismiss(); 
	}

	getEntitiesByURL(url): Observable<any[]> {
		this.shared.dismiss(); 
		return this.dynamicService.getEntities(url); 
	}

	getByPost(url, data): Observable<any[]> {
		this.shared.dismiss();
		return this.dynamicService.getByPost(url, data);
	}

	getEntitiesByPost(url, data): Observable<any[]> {
		this.shared.dismiss(); 
		return this.dynamicService.getEntities(url);
	}

	clearEntity(): void {
		//	this.entity = new this.entityModel();
	}

	saveEntity(entity: T, entities: T[]): void {
		debugger;
		this.dynamicService.saveEntity(entity, '')
			.subscribe(ent => {
				this.displayMsg(ent)
			});;
	}

	private displayMsg(isSucess: boolean): void {
		this.message = isSucess ? "Save successfully" : "Error in saving";
		this.isShowMessage = true;
		setTimeout(() => {
			this.isShowMessage = false;
		}, 5000);
	}

	public displayLoader(){
		this.showLoader = true;
		// document.getElementById("overlay").style.display = "block";
	}

	public hideLoader(){
		this.showLoader = false;
		// document.getElementById("overlay").style.display = "none"; 
	}


	showCreateView(isShow: boolean) {
		this.isCreateView = isShow
		if (this.isCreateView) {
			this.entity = {} as T;
		}
		this.message = "";
		this.isShowMessage = false
	}

	//   updateEntity(entity: T, entities: T[]): void { 
	//     if (this.isSaving)
	//       return;
	//     var isNewEntity: Boolean = entity['id'] ? false : true;
	//     if (entity['isActive'])
	//       entity['isActive'] = 1;
	//     this.isSaving = true;
	//     this.dynamicService.updateEntity(entity, this.GET_URL)
	//       .subscribe(ent => {
	//         this.isSaving = false;
	//         this.snackBar.open("Save Successfully", "Response", {
	//           duration: 500,
	//         });
	//         if (ent && isNewEntity) {
	//           entities.push(ent);
	//         }
	//         this.myEntity = new this.entity();

	//       });
	//   }

	//   deleteEntity(entity: T, entities: T[]): void {
	//     if (entity['isActive'])
	//       entity['isActive'] = 0;
	//     this.isSaving = true;
	//     this.dynamicService.updateEntity(entity, this.GET_URL)
	//       .subscribe(ent => {
	//         this.isSaving = false;
	//         const index: number = entities.indexOf(entity);
	//         this.snackBar.open("Deleted  Successfully", "Response", {
	//           duration: 500,
	//         });
	//         if (index !== -1) {
	//           entities.splice(index, 1);
	//         }
	//         this.myEntity = new this.entity();
	//       });

	//   }

	onSelectEntity(entity: T): void { 
		this.entity = entity;
	}
}