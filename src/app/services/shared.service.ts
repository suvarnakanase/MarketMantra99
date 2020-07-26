import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Securities } from '../models/securities';
import { ResponseCode } from '../models/responseCode';
import { Subject, Observable } from 'rxjs';
import { Constant } from '../shared/constant';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	public users: any;
	public securities: Securities; 
	public config :any;

	subscription = new Subject();
	
	executeAction() {
		this.subscription.next();
	}

	constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }

	openSnackBar(message: string, action: string, durationSecs: number) {
		this.snackBar.open(message, action, {
			duration: durationSecs * 1000,
		});
	}

	dismiss(){
		this.snackBar.dismiss();
	}

	openDialog(responseCode: ResponseCode, cbFunction :any) :  Observable<boolean>{

		var dialogRefs = this.dialog.open(CustomDialogComponent, {
			width: '300px',
			data: responseCode,
			hasBackdrop: false,
			disableClose: true 
		});

		return dialogRefs.afterClosed();
	} 
}
