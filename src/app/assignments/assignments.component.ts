import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap } from 'rxjs';
import { CdkDragDrop,moveItemInArray,transferArrayItem,CdkDrag,CdkDropList} from '@angular/cdk/drag-drop';
import { HttpStatusCode } from '@angular/common/http';
import { Reponse } from './../shared/reponse.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

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

  // Callback pour la liste
  onSuccessList = (reponse: any) =>{ 
    if(reponse.code == HttpStatusCode.Accepted){
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
  // Drag and drop

  drop(event: CdkDragDrop<Assignment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openModal(item: Assignment) {
    this.dialog.open(ModalComponent, {
      data: item
    });
  }
}
@Component({
  selector: 'app-modal',
  template: `
    <h2>{{ data.nom }}</h2>
    <p>{{ data.remarques }}</p>
    <!-- Add additional content to the modal as needed -->
  `
})
export class ModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Assignment) {}
}
