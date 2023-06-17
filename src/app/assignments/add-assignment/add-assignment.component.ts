import { Component, OnInit } from '@angular/core';
import { Assignment, Eleve, Matiere } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatiereService } from 'src/app/shared/matiere.service';
import { EleveService } from 'src/app/shared/eleve.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit{
  // champs du formulaire
  nomDevoir = '';
  dateDeRendu!: Date;
  eleve!: string;
  matiere!: string;

  matieres?: Matiere[];
  eleves?: Eleve[];

  matiereSelected?: Matiere;
  eleveSelected?: Eleve;

  submit: boolean = false;

  // Add Stepper
  firstFormGroup = this._formBuilder.group({
    nomDevoir: [this.nomDevoir, Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    matiere: [this.matiere, Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    eleve: [this.eleve, Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private assignmentsService: AssignmentsService,
    private router: Router,
    private matiereService: MatiereService,
    private eleveService: EleveService,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.initializeMatieres();
    this.initializeEleves();
  }

  onSubmit() {
    // On vérifie que les champs ne sont pas vides
    this.submit = true;
    if(this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid){
      this.showSnackBar("Veuillez renseigner tous les champs", "error");
      return;
    }

    let nouvelAssignment = new Assignment();
    // génération d'id, plus tard ce sera fait dans la BD
    nouvelAssignment.id = Math.abs(Math.random() * 1000000000000000);
    nouvelAssignment.nom = this.nomDevoir;
    nouvelAssignment.rendu = false;
    nouvelAssignment.eleve_id = this.eleve;
    nouvelAssignment.matiere_id = this.matiere;

    // on demande au service d'ajouter l'assignment
    this.assignmentsService
      .addAssignment(nouvelAssignment)
      .subscribe(this.onSuccess, this.onError)
    }

  onSuccess = (message: any) => {
    console.log(message);
    this.showSnackBar("Assignement enregistré avec succès", "success");
    // On va naviguer vers la page d'accueil pour afficher la liste
    // des assignments
    this.router.navigate(['/home']);
  }

  onError = (err: any) =>{
    console.log(err);
    this.showSnackBar("Une erreur s'est produite", "error");
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

  changeEleve(id: string){
    this.eleveSelected = this.eleves?.find(m => m._id == id)
  }

  showSnackBar(message: string, type: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
