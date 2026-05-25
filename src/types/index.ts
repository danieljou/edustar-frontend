export type Student = {
  code: string;
  nom: string;
  prenom: string;
  dob: string;
  sexe: "M" | "F";
  tel: string;
  email: string;
  adresse: string;
  classe: string;
  filiere: string;
  session: string;
  statut: "Actif" | "Suspendu" | "Diplômé" | "Abandonné";
  tuteurNom: string;
  tuteurTel: string;
  created: string;
  moy: number;
  absences: number;
  solde: number;
  notes: string;
};

export type Admission = {
  id: string;
  nom: string;
  prenom: string;
  dob: string;
  sexe: "M" | "F";
  tel: string;
  email: string;
  filiere: string;
  niveau: string;
  statut: "En attente" | "Validé" | "Rejeté";
  docs: string[];
  date: string;
  notes: string;
};

export type Session = {
  id: string;
  lib: string;
  debut: string;
  fin: string;
  statut: "Active" | "Clôturée" | "À venir";
  effectif: number;
};

export type Classe = {
  id: string;
  code: string;
  filiere: string;
  niveau: string;
  effectif: number;
  delegue: string;
  salle: string;
  responsable: string;
};

export type Matiere = {
  code: string;
  lib: string;
  credits: number;
  coeff: number;
  filiere: string;
  niveau: string;
  ens: string;
  type: string;
};

export type Note = {
  id: string;
  etuCode: string;
  matCode: string;
  ds: number;
  tp?: number;
  exam: number;
  moy: number;
  session: string;
  statut: "Validé" | "Rattrapage" | "Ajourné";
};

export type Payment = {
  id: string;
  etuCode: string;
  montant: number;
  type: string;
  date: string;
  mode: "Espèces" | "Mobile Money" | "Virement" | "Chèque";
  statut: "Validé" | "En attente" | "Annulé";
  ref: string;
};

export type Moratorium = {
  id: string;
  etuCode: string;
  montantTotal: number;
  montantPaye: number;
  echeances: { date: string; mont: number; statut: string }[];
  statut: "En cours" | "En retard" | "Critique" | "Soldé";
};

export type Personnel = {
  id: string;
  nom: string;
  prenom: string;
  role: "Enseignant" | "Administratif" | "Technicien" | "Direction";
  dept: string;
  email: string;
  tel: string;
  statut: "Actif" | "Congé" | "Inactif";
  salaire: number;
  entree: string;
  contrat: "CDI" | "CDD" | "Vacataire";
};

export type EmploiDuTemps = {
  id: string;
  jour: string;
  hDebut: string;
  hFin: string;
  matCode: string;
  classe: string;
  salle: string;
  ens: string;
  type: "CM" | "TD" | "TP";
};

export type Livre = {
  id: string;
  titre: string;
  auteur: string;
  isbn: string;
  categorie: string;
  exemplaires: number;
  disponibles: number;
  localisation: string;
  annee: number;
  editeur: string;
};

export type Emprunt = {
  id: string;
  livreId: string;
  etuCode: string;
  dateEmprunt: string;
  dateRetourPrevu: string;
  dateRetourReel?: string;
  statut: "En cours" | "Retourné" | "En retard";
};

export type Bus = {
  id: string;
  numero: string;
  immatriculation: string;
  chauffeur: string;
  capacite: number;
  itineraire: string;
  statut: "En service" | "En panne" | "En maintenance";
  depart: string;
  arrivee: string;
  passagers: number;
};

export type Salle = {
  code: string;
  lib: string;
  type: "Amphi" | "Salle" | "Labo" | "Bibliothèque" | "Réunion";
  capacite: number;
  batiment: string;
  etage: string;
  equipements: string[];
  statut: "Disponible" | "Occupée" | "Maintenance";
};

export type AppUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  profil: "ADM" | "DIR" | "ENS" | "SCO" | "CPT" | "BIB";
  statut: "Actif" | "Inactif" | "Suspendu";
  created: string;
  lastLogin: string;
};

export type Message = {
  id: string;
  de: string;
  a: string;
  sujet: string;
  corps: string;
  date: string;
  lu: boolean;
};

export type Annonce = {
  id: string;
  titre: string;
  corps: string;
  auteur: string;
  date: string;
  cible: "Tous" | "Étudiants" | "Enseignants" | "Administratifs";
  priorite: "Normale" | "Urgente" | "Info";
  statut: "Publiée" | "Brouillon" | "Archivée";
};

export type BulletinNote = {
  matCode: string;
  matLib: string;
  credits: number;
  coeff: number;
  ds: number;
  tp?: number;
  exam: number;
  moy: number;
  statut: "Validé" | "Rattrapage" | "Ajourné";
};

export type Bulletin = {
  id: string;
  etuCode: string;
  session: string;
  semestre: "S1" | "S2";
  notes: BulletinNote[];
  moyGeneral: number;
  totalCredits: number;
  creditsValides: number;
  rang: number;
  effectifClasse: number;
  appreciation: string;
  statut: "Publié" | "Brouillon";
};

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};
