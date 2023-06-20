import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { MATIERE } from './constants';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Matiere } from '../assignments/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  uri_api = environment.apiUrl + MATIERE;

  constructor(
    private http: HttpClient)
  { }

  getAllMatieres(): Observable<{code: number, data: Matiere[]}>{ // Recuperer tous les matières par api
    return this.http.get<{code: number, data: Matiere[]}>(this.uri_api)
  }
}
