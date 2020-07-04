import { Injectable } from '@angular/core';
import { UserMaster } from '../models/user';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private storageKey :string =  'Azpodlfidjfncbdhdkfpweo';
  constructor(private encryptionService: EncryptionService ) { }

  public addUser(user: UserMaster): void{
    if(!user){
      sessionStorage.setItem(this.storageKey, ''); 
      return; 
    } 
    let userStr =     JSON.stringify(user);
    var encryptStr =  this.encryptionService.encrypt(userStr);
    sessionStorage.setItem(this.storageKey, encryptStr );
  }  

  public getUser(): UserMaster{
    let encrptStr = sessionStorage.getItem(this.storageKey); 
    let userStr = this.encryptionService.decrypt(encrptStr);

    if(!userStr || userStr == ''){
      return null; 
    }   
    let user = JSON.parse(userStr);
    return user; 
  }

  public getUserId(): number{
    let user:UserMaster = this.getUser();
    if (!user)
      return 0;
    return user.id; 
  }

}
