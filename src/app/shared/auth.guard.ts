import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  // injection par programme (au lieu de le faire dans
  // le constructeur d'un composant)
  let authService = inject(AuthService);
  let router = inject(Router);

  return authService.isLoggedIn().then(
    authentifie => {
      if(authentifie){
        return authService.isAdmin()
          .then(isAdmin => {
            if(isAdmin) {
              console.log("Vous êtes admin, navigation autorisée !");
              return true;
            } else {
              console.log("Vous n'êtes pas admin ! Navigation refusée !");
              // et on retourne vers la page d'accueil
              router.navigate(["/home"]);
              return false;
            }
          })
      }else{
        router.navigate(["/login"]);
        return false;
      }
    }
  )

  // si ça renvoie true, alors, on peut activer la route

};
