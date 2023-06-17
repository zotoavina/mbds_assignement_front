import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap } from 'rxjs';
import { CdkDragDrop,moveItemInArray,transferArrayItem,CdkDrag,CdkDropList} from '@angular/cdk/drag-drop';
import { HttpStatusCode } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

titre="Liste des devoirs à rendre";
errorMessage?: string ;
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
  private dialog: MatDialog
)
{}

  ngOnInit(): void {
    console.log("OnInit Composant instancié et juste avant le rendu HTML (le composant est visible dans la page HTML)");
    // exercice : regarder si il existe des query params
    // page et limit, récupérer leur valeurs si elles existent
    // et les passer à la méthode getAssignments
    // TODO

    this.getAssignments();
  }

  getAssignments() {
    this.assignmentsService.getAssignments(this.page,this.limit).subscribe(
      reponse =>{
        if(reponse.code == HttpStatusCode.Accepted){
          this.filterData(reponse.data);
          console.log(this.assignments);
          console.log(this.assignmentsRendu);
        }else{
          this.errorMessage = reponse.message;
          console.log(this.errorMessage);
        }
      });
  }

  private filterData(data: Assignment[]){
    if(data.length != 0){
      this.assignments = data.filter( (item :Assignment) => item.rendu == false);
      this.assignmentsRendu = data.filter( (item :Assignment) => item.rendu == true);
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
      console.log("val = " + val);
      console.log("je CHARGE DE NOUVELLES DONNEES page = " + this.page);
      this.ngZone.run(() => {
        if(!this.hasNextPage) return;

        this.page = this.nextPage;
        // this.getAddAssignmentsForScroll();
      });
    });
  }

  // getAssignments() {
  //   console.log("On va chercher les assignments dans le service");

  //   this.assignmentsService.getAssignments(this.page, this.limit)
  //   .subscribe(data => {
  //     this.assignments = data.docs;
  //     this.page = data.page;
  //     this.limit = data.limit;
  //     this.totalDocs = data.totalDocs;
  //     this.totalPages = data.totalPages;
  //     this.hasPrevPage = data.hasPrevPage;
  //     this.prevPage = data.prevPage;
  //     this.hasNextPage = data.hasNextPage;
  //     this.nextPage = data.nextPage;

  //     console.log("Données reçues");
  //   });
  // }

  // getAddAssignmentsForScroll() {
  //   this.assignmentsService.getAssignments(this.page, this.limit)
  //   .subscribe(data => {
  //     // au lieu de remplacer le tableau, on va concaténer les nouvelles données
  //     this.assignments = this.assignments.concat(data.docs);
  //     // ou comme ceci this.assignments = [...this.assignments, ...data.docs]
  //     //this.assignments = data.docs;
  //     this.page = data.page;
  //     this.limit = data.limit;
  //     this.totalDocs = data.totalDocs;
  //     this.totalPages = data.totalPages;
  //     this.hasPrevPage = data.hasPrevPage;
  //     this.prevPage = data.prevPage;
  //     this.hasNextPage = data.hasNextPage;
  //     this.nextPage = data.nextPage;

  //     console.log("Données ajoutées pour scrolling");
  //   });
  // }

  // premierePage() {
  //   this.page = 1;
  //   this.getAssignments();
  // }

  // pageSuivante() {
  //   this.page = this.nextPage;
  //   this.getAssignments();
  // }

  // pagePrecedente() {
  //   this.page = this.prevPage;
  //   this.getAssignments();
  // }
  // dernierePage() {
  //   this.page = this.totalPages;
  //   this.getAssignments();
  // }

  // // Pour mat-paginator
  // handlePage(event: any) {
  //   console.log(event);

  //   this.page = event.pageIndex;
  //   this.limit = event.pageSize;
  //   this.getAssignments();
  // }


  // Drag and drop

  drop(event: CdkDragDrop<Assignment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const previousContainer = event.previousContainer;
      const currentContainer = event.container;
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      const draggedItem = previousContainer.data[previousIndex];

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = draggedItem;
      const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        console.log(draggedItem);
        if (result && result !== draggedItem) {
          transferArrayItem(
            previousContainer.data,
            currentContainer.data,
            previousIndex,
            currentIndex
          );
        }
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
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
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
    const newData: Assignment = JSON.parse(JSON.stringify(this.data));
    newData.note = this.noteForm.value.note;
    newData.remarques = this.noteForm.value.remarks;
    newData.rendu = true;
    newData.dateDeRendu = new Date();

    this.dialogRef.close(newData);
  }

}
