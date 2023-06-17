export class Assignment {
    _id!: string;
    id!: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu: boolean = false;
    note : number = 0;
    eleve!:Eleve;
    matiere!:Matiere;
    remarques?:string;
    eleve_id?: string;
    matiere_id?: string;
}

export class Eleve{
  _id!: string;
  nom!: string;
  photo!: string;
}

export class Matiere{
  _id!: string;
  nom!: string;
  photo!: string;
  photoProf!: string;
}
