import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class DynamicServices {

    constructor(private http: HttpClient) { }

    add(entity: any, url: string): any {
        return this.http.post<any>(url, entity, httpOptions).pipe(
            tap((data: any) => console.log('added entity')),
            catchError(this.handleError<any>('error  entity'))
        )
    };

    public getEntities(url: string): Observable<any> { 
        return this.http.get<any>(url).pipe(
            tap((data: any) => console.log('')),
            catchError(this.handleError<any>('error  entity'))
        )
    }

    public getByPost(url, data) : Observable<any> {
        return this.http.post(url, data)
            .pipe(
                tap((item) => console.log("....items in dynamicService methos")),
                catchError(this.handleError<any>('error in getByPost'))
            );
    }

    public saveEntity(entity: any, url: string): Observable<any> {
        debugger;
        return this.http.post(url, entity, httpOptions).pipe(
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
            return of(result as T);
        };
    }

    /** Log a locationService message with the MessageService */
    private log(message: string) {
        console.log(message);
        // this.messageService.add('locationService: ' + message);
    }  
}