import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY_STORAGE } from './constants';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() {}

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, SECRET_KEY_STORAGE).toString();
  }

  decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY_STORAGE);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
