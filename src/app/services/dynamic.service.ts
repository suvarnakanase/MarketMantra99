import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { StorageService } from '../services/storage.service';

import { MenuMaster, UserMaster } from '../models/user';
import { ResponseCode } from '../models/responseCode';

import { Router } from '@angular/router';

 

@Injectable({
    providedIn: 'root'
})
export class DynamicServices {

    constructor(private http: HttpClient, 
        private storageService: StorageService,
        private sharedService: SharedService,
        private route: Router, 
        ) { 
        this.getHeader();
    }

    getHeader(): any { 
        var dbWeb = this.storageService.getDbWeb();

        var httpOption =  {
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json' , 
                'Authorization' : 'Bearer '+ dbWeb})
        };
        return httpOption;

    }

    add(entity: any, url: string): any {
        return this.http.post<any>(url, entity, this.getHeader()).pipe(
            tap((data: any) => console.log('added entity')),
            catchError(this.handleError<any>('error  entity'))
            )
    };

    public getEntities(url: string): Observable<any> { 

        return this.http.get<any>(url, this.getHeader()).pipe(
            tap((data: any) => console.log('')),
            catchError(this.handleError<any>('error  entity'))
            )
    }

    public getByPost(url, data) : Observable<any> {
        var user : UserMaster; 
        return this.http.post(url, data, this.getHeader())
        .pipe(
            tap((item) => console.log('')),
            catchError(this.handleError<any>('error in getByPost'))
            );
    }

    public saveEntity(entity: any, url: string): Observable<any> {
        debugger;
        return this.http.post(url, entity, this.getHeader()).pipe(
            tap((data) => console.log(data)),
            catchError(this.handleError<any>('updated entity'))
            );
    }

    public postUploadFile(fileToUpload: File, exchangeId:number,  url:string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('fileU', fileToUpload, fileToUpload.name);
        formData.append('exchangeId', exchangeId.toString());
        return this.http
        .post(url, formData).pipe(  
            tap((data) => console.log(data)),
            catchError(this.handleError<any>('updated entity'))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead 
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`); 
            // Let the app keep running by returning an empty result.
            let errorObj = error.error;
            let status = error.status;
            let responseCode ;
            if(status == 401){ 
                if(errorObj && errorObj.code ){
                    responseCode  = errorObj as ResponseCode; 
                } 
                else
                    responseCode = new ResponseCode(false); 
                responseCode.actionBtnName = "Login Again"; 
                this.sharedService.openDialog(responseCode, this.logout).subscribe(result => {
                    if(status)
                        this.logout();
                });;
                
                return of(result as T);
            } 

            return of(result as T);
        };
    }

    private logout(){
        this.storageService.clearAllValues();
        this.getByPost("/logout", null);
        this.route.navigate(['/login']);
    }

    /** Log a locationService message with the MessageService */
    private log(message: string) {
        console.log(message);
        // this.messageService.add('locationService: ' + message);
    }  
}