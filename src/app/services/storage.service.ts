import { Injectable } from '@angular/core';
import { UserMaster } from '../models/user';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private storageKey :string =  'Azpodlfidjfncbdhdkfpweo';
  private storageKey1 :string =  'ddnmcnvmk';
  constructor(private encryptionService: EncryptionService ) { }

  public addUser(user: UserMaster): void{

    if(!user){
      localStorage.removeItem(this.storageKey);
      return; 
    } 
    let userStr =     JSON.stringify(user);
    var encryptStr =  this.encryptionService.encrypt(userStr);
    localStorage.setItem(this.storageKey, encryptStr );
  }  

  //this is used to storeauthkey
  public saveDbWeb(value:string){
    if(!value){
     localStorage.removeItem(this.storageKey1); 
      return;
    }
    localStorage.setItem(this.storageKey1, value);
  }

  public getDbWeb(){
    return localStorage.getItem(this.storageKey1);
  }

  public clearAllValues(){
     localStorage.removeItem(this.storageKey1); 
     localStorage.removeItem(this.storageKey);  
  }

  public getUser(): UserMaster{
    let encrptStr = localStorage.getItem(this.storageKey); 
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
