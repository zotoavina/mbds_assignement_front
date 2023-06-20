import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';


@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  title = 'Application de gestion de devoirs à rendre';
  labelConnexion = "Se connecter";
  nom:string = "";
  currentRoute:string = "";
  isConnected:boolean = false;
  isConnectedAsAdmin: boolean = false;

  constructor(private authService:AuthService,
              private router:Router,
              private assigmmentsService:AssignmentsService) {
    console.log(router.url);
    this.authService.isLoggedIn().then(authentifie => {
      if(authentifie){
        this.isConnected = true;
        this.authService.isLoggedInAsAdmin().then(isAdmin => {
          if(isAdmin) {
            this.isConnectedAsAdmin = true;
          }
        });
      }
    })

    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        console.log(event.url);
        this.currentRoute = event.url;
      }
    });
  }

  // login() {
  //   // utilise l'authService pour se connecter
  //   if(!this.authService.loggedIn) {
  //     this.authService.logIn();
  //     // on change le label du bouton
  //     this.labelConnexion = "Se déconnecter";
  //   } else {
  //     this.authService.logOut();
  //     // et on navigue vers la page d'accueil
  //     this.router.navigate(["/home"]);
  //   }
  // }

  isLogged() {
    if(this.authService.loggedIn) {
      this.nom = "Michel Buffa";
    }
    return this.authService.loggedIn;
  }

  creerDonneesDeTest() {
    this.assigmmentsService.peuplerBDavecForkJoin()
    .subscribe(() => {
      console.log("Opération terminée, les 1000 données ont été insérées")

      // on refresh la page pour que la liste apparaisse
      // plusieurs manières de faire....
      window.location.reload();
    });
  }

  logout(): void {
    localStorage.clear(); // Remove all item from local storage
    this.router.navigate(["/login"]);
  }
}
