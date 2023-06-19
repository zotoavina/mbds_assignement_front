import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, catchError, forkJoin, map, of, tap } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { bdInitialAssignments } from './data';
import { environment } from '../../environments/environment';
import { ASSIGNEMENT } from './constants';
import { Reponse } from './reponse.model';
@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
// tableau de devoirs à rendre
assignments:Assignment[] = [];
uri_api = environment.apiUrl + ASSIGNEMENT;

  constructor(
    private loggingService:LoggingService,
    private http:HttpClient)
  { }



  getAssignments(page:number, limit:number):Observable<Reponse> {
      const params = new HttpParams()
        .set('page', page)
        .set('limit', limit);
      return this.http.get<Reponse>(this.uri_api, { params });
  }

  getAssignment(id:number):Observable<Reponse> {
    const uri = this.uri_api + id;
    return this.http.get<Reponse>(uri);
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
 };

  addAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, 'ajouté');

    return this.http.post<Assignment>(this.uri_api, assignment);
  }

  updateAssignment(assignment:Assignment):Observable<any> {
  const uri = this.uri_api + assignment._id;
  console.log(assignment);
  return this.http.put<Assignment>(uri, assignment);
  }


  patchAssignment(assignment:Assignment):Observable<any> {
    const req  ={
      note : assignment.note,
      remarques: assignment.remarques,
      dateRendu: new Date().toISOString().substring(0, 10)
    }
  const uri = this.uri_api + assignment._id + "/rendre";
  return this.http.patch<Assignment>(uri, req);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    return this.http.delete(this.uri_api + assignment._id);
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      const newAssignment = new Assignment();
      newAssignment.id = a.id;
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;

      this.addAssignment(newAssignment)
      .subscribe((reponse) => {
        console.log(reponse.message);
      })
    })
  }

  // cette version retourne un Observable. Elle permet de savoir quand
  // l'opération est terminée (l'ajout des 1000 assignments)
  peuplerBDavecForkJoin():Observable<any> {
    // tableau d'observables (les valeurs de retour de addAssignment)
    let appelsVersAddAssignment:Observable<any>[] = [];

    bdInitialAssignments.forEach(a => {
      const nouvelAssignment = new Assignment();
      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment))
    });

    return forkJoin(appelsVersAddAssignment);
  }


}
