import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Securities } from '../models/securities';
import { Subject, Observable } from 'rxjs';
import { Constant } from '../shared/constant';

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

	constructor(private snackBar: MatSnackBar) { }

	openSnackBar(message: string, action: string, durationSecs: number) {
		this.snackBar.open(message, action, {
			duration: durationSecs * 1000,
		});
	}

	dismiss(){
		this.snackBar.dismiss();
	}
	
}
