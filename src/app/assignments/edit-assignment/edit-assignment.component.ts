import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment, Eleve, Matiere } from '../assignment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatiereService } from 'src/app/shared/matiere.service';
import { EleveService } from 'src/app/shared/eleve.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
 selector: 'app-edit-assignment',
 templateUrl: './edit-assignment.component.html',
 styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent {
  assignment: Assignment | undefined;
  matieres: Matiere[] | undefined;
  eleves: Eleve[] | undefined;
  matiereSelected: Matiere | undefined;
  eleveSelected: Eleve | undefined;
  submit: boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private assignmentsService: AssignmentsService,
    private router: Router,
    private matiereService: MatiereService,
    private eleveService: EleveService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.firstFormGroup = this._formBuilder.group({
      nomDevoir: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      matiere: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      eleve: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAssignment();
    this.initializeMatieres();
    this.initializeEleves();
  }

  getAssignment() {
    const id = this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe(
      (assignment) => {
        if (!assignment) return;
        console.log(assignment);
        this.assignment = assignment.data;
        this.matiereSelected = assignment.data.matiere;
        this.eleveSelected = assignment.data.eleve;

        // Populate form values after assignment data is retrieved
        this.firstFormGroup.patchValue({
          nomDevoir: this.assignment?.nom,
        });
        this.secondFormGroup.get('matiere')?.setValue(this.assignment?.matiere._id);
      this.thirdFormGroup.get('eleve')?.setValue(this.assignment?.eleve._id);
      },(error) => {
        console.log(error);
        // Handle error, show error message, etc.
      }
    );
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
  this.snackBar.open(message, 'Fermer', {
    duration: 3000, // Duration in milliseconds
    panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
  });
}
onUpdateAssignment() {
  if (!this.assignment) return;
  const updatedAssignment: Assignment = {
    ...this.assignment,
    nom: this.firstFormGroup.value.nomDevoir,
    matiere: this.matiereSelected,
    eleve: this.eleveSelected,
    matiere_id: this.matiereSelected?._id,
    eleve_id: this.eleveSelected?._id
  };
  this.assignmentsService.updateAssignment(updatedAssignment)
    .subscribe((message) => {
      console.log(message);
      // navigation vers la home page
      this.router.navigate(['/home']);
    });
}
}
