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
  constructor(private http: HttpClient) { }

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
        tap((data) => console.log('')),
        catchError(this.handleError<any>('error in login'))
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

  private log(message: string) {
    console.log(message);
    // this.messageService.add('locationService: ' + message);
  }

}
