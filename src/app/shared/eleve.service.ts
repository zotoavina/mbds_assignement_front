import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { ELEVE } from './constants';
import { environment } from 'src/environments/environment';
import { Eleve } from '../assignments/assignment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  uri_api = environment.apiUrl + ELEVE;

  constructor(
    private http: HttpClient)
  { }

  getAllEleves(): Observable<{code: number, data: Eleve[]}>{ // Recuperer tous les élèves par api
    return this.http.get<{code: number, data: Eleve[]}>(this.uri_api)
  }

}
