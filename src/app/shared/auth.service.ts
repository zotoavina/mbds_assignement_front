import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {LOGIN, ROLE, ROLE_STORAGE, TOKEN_STORAGE, USER} from '../shared/constants';
import { Reponse } from './reponse.model';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  loggedInAsAdmin = false;
  base_url = environment.apiUrl + USER;

  constructor(private http: HttpClient, private encryptionService: EncryptionService){
    this.isLoggedIn().then(
      authentifie => {
        if(authentifie){
          this.loggedIn =  true;
          this.isAdmin()
            .then(isAdmin => {
              if(isAdmin) {
                this.loggedInAsAdmin = true;
              } else {
                this.loggedInAsAdmin = false;
              }
            });
        }else{
          this.loggedIn =  false;
        }
      });
    }

  // théoriquement, on devrait passer en paramètre le login
  // et le password, cette méthode devrait faire une requête
  // vers un Web Service pour vérifier que c'est ok, renvoyer
  // un token d'authentification JWT etc.
  // elle devrait renvoyer un Observable etc.

  // logIn() {
  //   console.log("ON SE LOGGE")
  //   this.loggedIn = true;
  // }

  logIn(email: string, motDePasse: string): Observable<Reponse> {
    const url = this.base_url + LOGIN;
    const body = { email, motDePasse };
    return this.http.post<Reponse>(url, body);
  }


  logOut() {
    console.log("ON SE DELOGGE")
    this.loggedIn = false;
  }

  // si on l'utilisait on ferai isAdmin().then(...)
  isAdmin() {
    // Pour le moment, version simplifiée...
    // on suppose qu'on est admin si on est loggué
    const isUserAdminPromise = new Promise((resolve, reject) => {
        const role  = localStorage.getItem(ROLE_STORAGE);
        if (role) {
          const decryptedData = this.encryptionService.decrypt(role);
          resolve(decryptedData == ROLE.ADMIN);
        }
        return false;
    });

    // on renvoie la promesse qui dit si on est admin ou pas
    return isUserAdminPromise;
  }

  isLoggedIn(){
    const isUserLoggedIn = new Promise((resolve, reject) => {
      const role = localStorage.getItem(TOKEN_STORAGE);
      var res: boolean = (role)? true: false;
      resolve(res);
    });

    // on renvoie la promesse qui dit si on est admin ou pas
    return isUserLoggedIn;
  }

}
