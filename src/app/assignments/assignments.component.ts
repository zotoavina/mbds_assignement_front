import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap } from 'rxjs';
import { CdkDragDrop,moveItemInArray,transferArrayItem,CdkDrag,CdkDropList} from '@angular/cdk/drag-drop';
import { HttpStatusCode } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

titre="Liste des devoirs à rendre";
errorMessage?: string ;
isDragEnabled: boolean= false;
// les données à afficher
assignments:Assignment[] = [];

assignmentsRendu: Assignment[] = [];
// Pour la data table
displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];

// propriétés pour la pagination
page: number=1;
limit: number=10;
totalDocs: number = 0;
totalPages: number = 0;
hasPrevPage: boolean = false;
prevPage: number = 0;
hasNextPage: boolean = false;
nextPage: number = 0;


@ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

constructor(
  private assignmentsService:AssignmentsService,
  private ngZone: NgZone,
  private dialog: MatDialog,
  private authService: AuthService,
  private snackBar: MatSnackBar,
  private router: Router
)
{
  console.log("OnInit Composant instancié et juste avant le rendu HTML (le composant est visible dans la page HTML)");
}

  ngOnInit(): void {
    console.log("OnInit Composant instancié et juste avant le rendu HTML (le composant est visible dans la page HTML)");
    // exercice : regarder si il existe des query params
    // page et limit, récupérer leur valeurs si elles existent
    // et les passer à la méthode getAssignments
    // TODO
    this.isDragEnabled = this.authService.loggedInAsAdmin;
    this.getAssignments();
  }

  detail(itemId: string) {
    // Replace 'details' with the actual route path for your details component
    this.router.navigate(['/assignments/', itemId]);
  }
  // Callback pour la liste
  onSuccessList = (reponse: any) =>{
    if(reponse.code == HttpStatusCode.Accepted){
      console.log(reponse);
      this.filterData(reponse.data.docs);
      this.setPageProperties(reponse.data);
    }else{
      this.errorMessage = reponse.message;
      console.log(this.errorMessage);
    }
  }

  getAssignments() {
    this.assignmentsService.getAssignments(this.page,this.limit).subscribe(
      this.onSuccessList
    );
  }

  private filterData(data: Assignment[]){
    if(data.length != 0){
      this.assignments = this.assignments.concat(data.filter( (item :Assignment) => item.rendu != true));
      this.assignmentsRendu = this.assignmentsRendu.concat(data.filter( (item :Assignment) => item.rendu == true));
    }
  }

  ngAfterViewInit() {
    console.log("after view init");

    if(!this.scroller) return;

    // on s'abonne à l'évènement scroll de la liste
    this.scroller.elementScrolled()
    .pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
         return this.scroller.measureScrollOffset('bottom');
      }),
      tap(y => {
        //console.log("y = " + y);
      }),
      pairwise(),
      tap(([y1, y2]) => {
        //console.log("y1 = " + y1 + " y2 = " + y2);
      }),
      filter(([y1, y2]) => {
        return y2 < y1 && y2 < 100;
      }),
      // Pour n'envoyer des requêtes que toutes les 200ms
      //throttleTime(200)
    )
    .subscribe((val) => {
      // console.log("val = " + val);
      // console.log("je CHARGE DE NOUVELLES DONNEES page = " + this.page);
      this.ngZone.run(() => {
        if(!this.hasNextPage) return;

        this.page = this.nextPage;
        this.getAddAssignmentsForScroll();
      });
    });
  }

  getAddAssignmentsForScroll() {
    this.assignmentsService.getAssignments(this.page, this.limit).subscribe(
      this.onSuccessList
    );
  }

  editAssignment(item: any) {
    console.log(item);
    // Navigate to the edit page with the item's ID as a parameter
    this.router.navigate(['/assignments/'+item._id+'/edit', ]);
  }

  viewDetails(item: any) {
    console.log(item);
    // Navigate to the details page with the item's ID as a parameter
    this.router.navigate(['/assignments/'+item._id]);
  }


  setPageProperties(data: any){
    this.page = data.page;
    this.limit = data.limit;
    this.totalDocs = data.totalDocs;
    this.totalPages = data.totalPages;
    this.hasPrevPage = data.hasPrevPage;
    this.prevPage = data.prevPage;
    this.hasNextPage = data.hasNextPage;
    this.nextPage = data.nextPage;
  }
  showSnackBar(message: string, type: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Duration in milliseconds
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }
  // Drag and drop

  drop(event: CdkDragDrop<Assignment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const previousContainer = event.previousContainer;
      const currentContainer = event.container;
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      const draggedItem: Assignment = JSON.parse(JSON.stringify(previousContainer.data[previousIndex]));

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {real: previousContainer.data[previousIndex], copy:draggedItem};
      const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        console.log(draggedItem);
        console.log(this.assignmentsRendu);
        if (result && result !== draggedItem) {
          transferArrayItem(
            previousContainer.data,
            currentContainer.data,
            previousIndex,
            currentIndex
          );
        }
        this.showSnackBar("Devoir rendu avec succes", "success");
      });
    }
  }
}
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./assignments.component.css']
})
export class ModalComponent {
  noteForm: FormGroup;
  errorMessage? : string;

  constructor(
    private assignmentsService: AssignmentsService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {real:Assignment,copy:Assignment},
    private formBuilder: FormBuilder
  ) {
    this.noteForm = this.formBuilder.group({
      note: ['', Validators.required],
      remarks: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.data.real.note = this.noteForm.value.note;
    this.data.real.remarques = this.noteForm.value.remarks;
    this.data.real.dateDeRendu = new Date();
    this.assignmentsService.patchAssignment(this.data.real).subscribe(
      (res) =>{
      if(res.code == 202){
        this.data.real = res.data;
        this.dialogRef.close(this.data);
      }else{
        this.errorMessage = res.message;
        this.data.real = this.data.copy;
      }
    },(error) => {
      // Handle the error
      this.errorMessage = error.message;
      this.data.real = this.data.copy;
      console.error(error);
    });

  }

}
