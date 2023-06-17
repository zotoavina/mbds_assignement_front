import { Component, OnInit } from '@angular/core';
import { Assignment, Eleve, Matiere } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatiereService } from 'src/app/shared/matiere.service';
import { EleveService } from 'src/app/shared/eleve.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit{
  // champs du formulaire
  nomDevoir = '';
  dateDeRendu!: Date;
  
  matieres?: Matiere[];
  eleves?: Eleve[];

  matiereSelected?: Matiere;

  // Add Stepper
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    dateDeRendu: [this.dateDeRendu, Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private assignmentsService: AssignmentsService,
    private router: Router,
    private matiereService: MatiereService,
    private eleveService: EleveService,
  ) {}

  
  ngOnInit(): void {
    this.initializeMatieres();
    this.initializeEleves();
  }

  onSubmit(event: any) {
    // On vérifie que les champs ne sont pas vides
    if (this.nomDevoir === '') return;
    if (this.dateDeRendu === undefined) return;

    let nouvelAssignment = new Assignment();
    // génération d'id, plus tard ce sera fait dans la BD
    nouvelAssignment.id = Math.abs(Math.random() * 1000000000000000);
    nouvelAssignment.nom = this.nomDevoir;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;

    // on demande au service d'ajouter l'assignment
    this.assignmentsService
      .addAssignment(nouvelAssignment)
      .subscribe((message) => {
        console.log(message);

        // On va naviguer vers la page d'accueil pour afficher la liste
        // des assignments
        this.router.navigate(['/home']);
      });
  }

  onError = (err: any) =>{
    console.log(err);
  }

  // Recuperer les matières
  initializeMatieres(){
    this.matiereService.getAllMatieres().subscribe(
      r => this.matieres = r.data,
      this.onError
    )
  }
  
  // Recuperer les elèves
  initializeEleves(){
    this.eleveService.getAllEleves().subscribe(
      r => this.eleves = r.data,
      this.onError
    )
  }

  changeMatiere(id: string){
    this.matiereSelected = this.matieres?.find(m => m._id == id)
  }
}
