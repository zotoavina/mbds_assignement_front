import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {LOGIN} from '../shared/constants';
import { Reponse } from './reponse.model';
@Injectable()
export class DataService {
  apiUrl = environment.apiUrl;
  apiKey = environment.apiKey;

  // Rest of your service code
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  base_url = environment.apiUrl;

  constructor(private http: HttpClient){ }

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
    const url = this.base_url + LOGIN; // Replace with your login endpoint
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
        resolve(this.loggedIn);
    });

    // on renvoie la promesse qui dit si on est admin ou pas
    return isUserAdminPromise;
  }
}
