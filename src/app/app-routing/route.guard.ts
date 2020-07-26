import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { User, UserMaster } from '../models/user';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGaurd implements CanActivate {

  constructor(private router: Router,
    private storageService: StorageService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let loggedUser: UserMaster =  this.storageService.getUser(); 
    let dbWeb =  this.storageService.getDbWeb(); 
    
    if (!dbWeb) {
      this.router.navigate(['/login']); 
      this.storageService.addUser(null); 
      return false;
    } 
 
    if(!loggedUser){
      console.error('Error when converting user to object in routeGaurd');
      return false;
    }
    
    if (loggedUser.isAdmin || loggedUser.isSuperAdmin)
      return true; 

    if (state.url.includes('recordSheet')) {
      return loggedUser.recordSheetPerm;
    }

    if (state.url.includes('actionItemTrade')) {
      return loggedUser.resultOutPerm;
    }

    if (state.url.includes('tableReport')) {
      return loggedUser.tablePermission;
    }

    if (state.url.includes('dataSummary')) {
      return loggedUser.dataSumaryReportPerm;
    }

    if (state.url.includes('tbBtReport')) {
      return loggedUser.tbBtReportPerm;
    } 

    if (state.url.includes('mstReport')) {
      return loggedUser.tbBtReportPerm;
    } 

    if (state.url.includes('ddReprt')) {
      return loggedUser.ddReportPerm;
    } 

    if (state.url.includes('aocReport')) {
      return loggedUser.aocReportPerm;
    } 

    if(state.url.includes('')) {
      return true;
    }

    return false;
  }

  private getJson(jsonObject) {
    if (typeof jsonObject == 'string')
      return JSON.parse(jsonObject);

    if (typeof jsonObject == 'object')
      return jsonObject;
    return null;
  }
}
