import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  secretKey = "AllIsBeatifull@0101017512"; 
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    if(!textToDecrypt)
         return null; 
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
