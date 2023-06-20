# Assignement App
## Membre du groupe 
- N° 51, RASOAHARISOA Nantenaina Zotoavina
- N° 47, RANDRIANARIVELO Herimanarivo Finoana Mandresy

## Repositories
- Front : https://github.com/zotoavina/mbds_assignement_front.git
- Api : https://github.com/Finoana71/mbds_assignment_api.git

## Lien sur Render.com
- Front : https://mbds-assignment-51-47-front.onrender.com/
- Api : https://mbds-assignment-51-47-api.onrender.com/

## Prérequis techniques
- Version node : v18.16.0
- Version d'angular : 16.0.1

## Travaux effectués

### Génération des données de test
###  Authentification
- Création d'une collection utilisateurs dans mongoDb
- Validation du login et du mdp
- Authentification par jwt

#### Admin: 
			email: mcruddas0@census.gov  	Mot de passe: pkElid3n4v
#### Utilisateur simple: 
			email: kheight1@ftc.gov  	Mot de passe: VcaUca

### Ajout des nouvelles propriétés au modèles des assignements
- Auteur, matière, image associée à chaque matière et une photo du prof,
note sur 20, on ne peut marquer "rendu" un Assignment qui n'a pas été noté.

### Création des collections d'élèves et de matières

### Amélioration de l'affichage des assignements
- Deux onglets séparés: rendu et non rendu
- Drag and drop pour rendre un assignement(utilisateur admin)
- Scroll infini
- Affichage avec des cards

###  Création d'un assignement
- Utilisation d'un stepper: 
	-	Devoir: titre et date de rendu
	-	Matière: séléction d'une matière
	- Elève: séléction d'un élève
- Utilisation de ReactiveFormsModule pour la validation
- Utilisation d'un snackBar pour afficher des messages d'erreurs et succès

### Détail assignement 
- Affichage pour plus de détails sur un assignement: photo, remarques, note 
- Affichage selon le rôle de l'utilisateur connecté

### Rendre beau l'affichage:
- Ajout d'une barre de navigation
- Utilisation des "snackbar" lors des créations, modifications des assignements
- Utilisation de loader lors des chargements des pages
- Utilisation de card et de stepper

## Lancement du projet
- Installez les dépendances:
  npm install
- Démarrer l'application:
  ng serve
- Ouvrez localhost:4200
* Pour l'authentification, on a déjà mis par défaut
 le login et mdp d'un utilisateur admin

## Documentations et aides
- https://lottiefiles.com/ 
- https://github.com/ngx-lottie/ngx-lottie
utilisation de lottier pour les animations dans angular

- https://stackoverflow.com/questions/65786238/change-color-of-matsnackbar
Ajout css snackbar

- https://angular.io/guide/reactive-forms
ReactiveFormsModule 

- https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/
Sécurisation des api aves jwt

- https://danielk.tech/home/angular-how-to-add-a-loading-spinner
Ajout de loader

- https://chat.openai.com/
Pour l'amélioration des designs
