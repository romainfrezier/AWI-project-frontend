export class Assignment {
  _id!: string;
  zone!: {
    _id: string;
    nom: string;
  };
  date_deb!: Date;
  date_fin!: Date;
  jeu!: {
    _id: string;
    nom: string;
  };
  benevole!: {
    _id: string;
    nom: string;
    prenom: string;
  };
}
