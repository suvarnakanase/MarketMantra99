import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { Constant } from '../shared/constant';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  constructor(private http: HttpClient, private sharedService: SharedService) { }

  public authenticateUser(userName: string, password: string): Observable<any> { 

    if (userName == null || userName == '') {
      return;
    }

    if (password == null || password == '') {
      return;
    }

    userName = userName.trim();
    password = password.trim();

    return this.http.post(Constant.LOGINAPI, JSON.stringify(new User(userName, password)), httpOptions)
    .pipe(
      tap((data) => console.log(data)),
      catchError(this.handleError<any>('error in login'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (httpError: any): Observable<T> => { 
      console.error('ERRORR OBJ: ', httpError); // log to console instead
      let respObj = httpError.error;
      if(respObj&& respObj.code && respObj.message){
        this.sharedService.openSnackBar( respObj.code +':  '+ respObj.message, 'Ok', 10);
      }
      else
        this.sharedService.openSnackBar('Some error occured. Please try again later', "Ok", 10);
    
      return of(result as T);
    };
  } 
}
