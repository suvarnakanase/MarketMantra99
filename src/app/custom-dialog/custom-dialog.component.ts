import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
	selector: 'app-custom-dialog',
	templateUrl: './custom-dialog.component.html',
	styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {
	
	ngOnInit() {
	}
	constructor(
		public dialogRef: MatDialogRef<CustomDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {}

}
