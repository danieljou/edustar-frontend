import type { Student, Admission, Session, Classe, Matiere, Note, Payment, Moratorium, Personnel, EmploiDuTemps, Livre, Emprunt, Bus, Salle, AppUser, Message, Annonce, Bulletin } from "@/types";

export const STUDENTS: Student[] = [
  { code: "ETU-001", nom: "Mballa", prenom: "Christian", dob: "2005-03-12", sexe: "M", tel: "+237 677 100 001", email: "christian.mballa@gmail.com", adresse: "Bastos, Yaoundé", classe: "L1-INFO-A", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "Paul Mballa", tuteurTel: "+237 677 200 001", created: "2025-09-01", moy: 14.2, absences: 3, solde: 250000, notes: "Délégué de classe" },
  { code: "ETU-002", nom: "Nguema", prenom: "Laetitia", dob: "2004-07-22", sexe: "F", tel: "+237 699 100 002", email: "laetitia.nguema@yahoo.fr", adresse: "Nlongkak, Yaoundé", classe: "L1-INFO-A", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "Marie Nguema", tuteurTel: "+237 699 200 002", created: "2025-09-01", moy: 16.8, absences: 1, solde: 0, notes: "Major de promo" },
  { code: "ETU-003", nom: "Tamba", prenom: "Rodrigue", dob: "2003-11-05", sexe: "M", tel: "+237 655 100 003", email: "", adresse: "Melen, Yaoundé", classe: "L2-GESTION-B", filiere: "Gestion", session: "2025-2026", statut: "Actif", tuteurNom: "", tuteurTel: "", created: "2024-09-01", moy: 11.5, absences: 8, solde: 180000, notes: "Dossier incomplet" },
  { code: "ETU-004", nom: "Fouda Bekolo", prenom: "Sylvie", dob: "2002-05-18", sexe: "F", tel: "+237 677 100 004", email: "sylvie.fb@gmail.com", adresse: "Mvog-Ada, Yaoundé", classe: "L3-DROIT-A", filiere: "Droit", session: "2025-2026", statut: "Actif", tuteurNom: "Jean Fouda", tuteurTel: "+237 677 200 004", created: "2023-09-01", moy: 15.3, absences: 2, solde: 0, notes: "" },
  { code: "ETU-005", nom: "Kamdem", prenom: "Boris", dob: "2006-01-30", sexe: "M", tel: "+237 699 100 005", email: "", adresse: "Cité Verte, Yaoundé", classe: "L1-GESTION-A", filiere: "Gestion", session: "2025-2026", statut: "Actif", tuteurNom: "Anne Kamdem", tuteurTel: "+237 699 200 005", created: "2025-09-01", moy: 13.0, absences: 5, solde: 375000, notes: "" },
  { code: "ETU-006", nom: "Onana", prenom: "Cécile", dob: "2001-09-14", sexe: "F", tel: "+237 655 100 006", email: "cecile.onana@gmail.com", adresse: "Elig-Ézoa, Yaoundé", classe: "M1-INFO-A", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "", tuteurTel: "", created: "2022-09-01", moy: 17.1, absences: 0, solde: 0, notes: "Boursière" },
  { code: "ETU-007", nom: "Atangana", prenom: "Kevin", dob: "2004-06-08", sexe: "M", tel: "+237 677 100 007", email: "", adresse: "Etoudi, Yaoundé", classe: "L2-INFO-B", filiere: "Informatique", session: "2025-2026", statut: "Suspendu", tuteurNom: "Rose Atangana", tuteurTel: "+237 677 200 007", created: "2024-09-01", moy: 9.2, absences: 15, solde: 450000, notes: "Abandon possible" },
  { code: "ETU-008", nom: "Mvondo", prenom: "Diane", dob: "2003-04-16", sexe: "F", tel: "+237 699 100 008", email: "diane.mvo@gmail.com", adresse: "Omnisport, Yaoundé", classe: "L2-INFO-B", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "Paul Mvondo", tuteurTel: "+237 699 200 008", created: "2024-09-01", moy: 12.4, absences: 4, solde: 90000, notes: "" },
  { code: "ETU-009", nom: "Beti", prenom: "Armand", dob: "2005-12-01", sexe: "M", tel: "+237 677 100 009", email: "armand.beti@yahoo.fr", adresse: "Mendong, Yaoundé", classe: "L1-INFO-A", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "Josiane Beti", tuteurTel: "+237 677 200 009", created: "2025-09-01", moy: 13.8, absences: 2, solde: 0, notes: "" },
  { code: "ETU-010", nom: "Nkoa", prenom: "Estelle", dob: "2002-08-22", sexe: "F", tel: "+237 655 100 010", email: "estelle.nkoa@gmail.com", adresse: "Biyem-Assi, Yaoundé", classe: "L3-DROIT-A", filiere: "Droit", session: "2025-2026", statut: "Actif", tuteurNom: "", tuteurTel: "", created: "2023-09-01", moy: 14.9, absences: 1, solde: 0, notes: "" },
  { code: "ETU-011", nom: "Owono", prenom: "Serge", dob: "2004-02-28", sexe: "M", tel: "+237 699 100 011", email: "", adresse: "Obili, Yaoundé", classe: "L2-GESTION-B", filiere: "Gestion", session: "2025-2026", statut: "Suspendu", tuteurNom: "Hélène Owono", tuteurTel: "+237 699 200 011", created: "2024-09-01", moy: 7.8, absences: 19, solde: 320000, notes: "Avertissement disciplinaire" },
  { code: "ETU-012", nom: "Mveng", prenom: "Claire", dob: "2001-06-10", sexe: "F", tel: "+237 677 100 012", email: "claire.mveng@gmail.com", adresse: "Ngousso, Yaoundé", classe: "M1-INFO-A", filiere: "Informatique", session: "2025-2026", statut: "Actif", tuteurNom: "", tuteurTel: "", created: "2022-09-01", moy: 15.6, absences: 0, solde: 0, notes: "Excellence académique" },
];

export const ADMISSIONS: Admission[] = [
  { id: "ADM-001", nom: "Essono", prenom: "Patrick", dob: "2006-02-14", sexe: "M", tel: "+237 699 300 001", email: "patrick.essono@gmail.com", filiere: "Informatique", niveau: "L1", statut: "En attente", docs: ["Baccalauréat", "Relevé de notes", "Photo"], date: "2025-07-15", notes: "Mention Bien au bac" },
  { id: "ADM-002", nom: "Mekongo", prenom: "Judith", dob: "2005-11-20", sexe: "F", tel: "+237 677 300 002", email: "judith.mekongo@yahoo.fr", filiere: "Gestion", niveau: "L1", statut: "Validé", docs: ["Baccalauréat", "Relevé de notes", "Photo", "Extrait de naissance"], date: "2025-07-10", notes: "" },
  { id: "ADM-003", nom: "Biyong", prenom: "Arnaud", dob: "2004-03-05", sexe: "M", tel: "+237 655 300 003", email: "", filiere: "Droit", niveau: "L2", statut: "Rejeté", docs: ["Baccalauréat"], date: "2025-07-20", notes: "Documents insuffisants" },
  { id: "ADM-004", nom: "Zoa", prenom: "Hélène", dob: "2006-08-12", sexe: "F", tel: "+237 699 300 004", email: "helene.zoa@gmail.com", filiere: "Informatique", niveau: "L1", statut: "En attente", docs: ["Baccalauréat", "Photo"], date: "2025-07-25", notes: "Très bon dossier" },
  { id: "ADM-005", nom: "Engamba", prenom: "Thierry", dob: "2006-01-08", sexe: "M", tel: "+237 677 300 005", email: "thierry.engamba@gmail.com", filiere: "Gestion", niveau: "L1", statut: "En attente", docs: ["Baccalauréat", "Relevé de notes", "Photo", "Extrait de naissance"], date: "2025-08-01", notes: "Admis sous réserve médicale" },
  { id: "ADM-006", nom: "Abena", prenom: "Nathalie", dob: "2005-05-30", sexe: "F", tel: "+237 655 300 006", email: "nathalie.abena@yahoo.fr", filiere: "Droit", niveau: "L1", statut: "Validé", docs: ["Baccalauréat", "Relevé de notes", "Photo", "Extrait de naissance", "Certificat médical"], date: "2025-07-05", notes: "Dossier complet, excellent profil" },
];

export const SESSIONS: Session[] = [
  { id: "SES-001", lib: "2023-2024", debut: "2023-09-04", fin: "2024-07-12", statut: "Clôturée", effectif: 312 },
  { id: "SES-002", lib: "2024-2025", debut: "2024-09-02", fin: "2025-07-11", statut: "Clôturée", effectif: 348 },
  { id: "SES-003", lib: "2025-2026", debut: "2025-09-01", fin: "2026-07-10", statut: "Active", effectif: 391 },
];

export const CLASSES: Classe[] = [
  { id: "CL-001", code: "L1-INFO-A", filiere: "Informatique", niveau: "Licence 1", effectif: 48, delegue: "Christian Mballa", salle: "Amphi A", responsable: "Dr. Ateba" },
  { id: "CL-002", code: "L1-INFO-B", filiere: "Informatique", niveau: "Licence 1", effectif: 45, delegue: "—", salle: "Amphi B", responsable: "Dr. Ateba" },
  { id: "CL-003", code: "L2-INFO-B", filiere: "Informatique", niveau: "Licence 2", effectif: 38, delegue: "—", salle: "Salle 201", responsable: "Dr. Nkemba" },
  { id: "CL-004", code: "L1-GESTION-A", filiere: "Gestion", niveau: "Licence 1", effectif: 52, delegue: "—", salle: "Amphi C", responsable: "Dr. Tchamba" },
  { id: "CL-005", code: "L2-GESTION-B", filiere: "Gestion", niveau: "Licence 2", effectif: 40, delegue: "—", salle: "Salle 105", responsable: "Dr. Biyong" },
  { id: "CL-006", code: "L3-DROIT-A", filiere: "Droit", niveau: "Licence 3", effectif: 35, delegue: "—", salle: "Salle 302", responsable: "Me. Essama" },
  { id: "CL-007", code: "M1-INFO-A", filiere: "Informatique", niveau: "Master 1", effectif: 22, delegue: "Cécile Onana", salle: "Labo Info", responsable: "Pr. Ondoa" },
];

export const MATIERES: Matiere[] = [
  { code: "INF101", lib: "Algorithmique & Structures de données", credits: 6, coeff: 3, filiere: "Informatique", niveau: "L1", ens: "Dr. Ateba", type: "CM+TD" },
  { code: "INF102", lib: "Programmation Orientée Objet", credits: 4, coeff: 2, filiere: "Informatique", niveau: "L1", ens: "Dr. Nkemba", type: "CM+TD+TP" },
  { code: "INF201", lib: "Bases de données avancées", credits: 6, coeff: 3, filiere: "Informatique", niveau: "L2", ens: "Dr. Nkemba", type: "CM+TP" },
  { code: "INF301", lib: "Intelligence Artificielle", credits: 5, coeff: 3, filiere: "Informatique", niveau: "L3", ens: "Pr. Ondoa", type: "CM+TD" },
  { code: "GES101", lib: "Comptabilité générale", credits: 6, coeff: 3, filiere: "Gestion", niveau: "L1", ens: "Dr. Tchamba", type: "CM+TD" },
  { code: "GES201", lib: "Finance d'entreprise", credits: 5, coeff: 2, filiere: "Gestion", niveau: "L2", ens: "Dr. Biyong", type: "CM+TD" },
  { code: "DRT101", lib: "Droit civil des obligations", credits: 6, coeff: 3, filiere: "Droit", niveau: "L1", ens: "Me. Essama", type: "CM" },
  { code: "COM101", lib: "Communication professionnelle", credits: 3, coeff: 1, filiere: "Toutes", niveau: "L1", ens: "Mme. Abega", type: "TD" },
];

export const NOTES: Note[] = [
  { id: "N001", etuCode: "ETU-001", matCode: "INF101", ds: 14, tp: 16, exam: 13, moy: 14.0, session: "2025-2026", statut: "Validé" },
  { id: "N002", etuCode: "ETU-001", matCode: "INF102", ds: 15, tp: 17, exam: 14, moy: 15.2, session: "2025-2026", statut: "Validé" },
  { id: "N003", etuCode: "ETU-002", matCode: "INF101", ds: 17, tp: 18, exam: 16, moy: 16.8, session: "2025-2026", statut: "Validé" },
  { id: "N004", etuCode: "ETU-003", matCode: "GES101", ds: 11, exam: 12, moy: 11.5, session: "2025-2026", statut: "Validé" },
  { id: "N005", etuCode: "ETU-007", matCode: "INF102", ds: 8, tp: 10, exam: 9, moy: 9.0, session: "2025-2026", statut: "Rattrapage" },
  { id: "N006", etuCode: "ETU-006", matCode: "INF301", ds: 18, tp: 19, exam: 17, moy: 17.5, session: "2025-2026", statut: "Validé" },
];

export const PAYMENTS: Payment[] = [
  { id: "PAY-001", etuCode: "ETU-001", montant: 150000, type: "Frais de scolarité", date: "2025-09-05", mode: "Mobile Money", statut: "Validé", ref: "MTN-2025-091" },
  { id: "PAY-002", etuCode: "ETU-002", montant: 500000, type: "Frais de scolarité", date: "2025-09-02", mode: "Virement", statut: "Validé", ref: "VIR-2025-090" },
  { id: "PAY-003", etuCode: "ETU-003", montant: 50000, type: "Frais partiels", date: "2026-01-15", mode: "Espèces", statut: "Validé", ref: "ESP-2026-015" },
  { id: "PAY-004", etuCode: "ETU-004", montant: 500000, type: "Frais de scolarité", date: "2025-09-01", mode: "Chèque", statut: "Validé", ref: "CHQ-2025-088" },
  { id: "PAY-005", etuCode: "ETU-005", montant: 150000, type: "Frais partiels", date: "2026-02-01", mode: "Mobile Money", statut: "Validé", ref: "OM-2026-020" },
  { id: "PAY-006", etuCode: "ETU-008", montant: 410000, type: "Frais de scolarité", date: "2025-09-08", mode: "Virement", statut: "Validé", ref: "VIR-2025-092" },
  { id: "PAY-007", etuCode: "ETU-009", montant: 500000, type: "Frais de scolarité", date: "2025-09-03", mode: "Mobile Money", statut: "Validé", ref: "MTN-2025-093" },
  { id: "PAY-008", etuCode: "ETU-006", montant: 500000, type: "Frais de scolarité", date: "2025-09-01", mode: "Virement", statut: "Validé", ref: "VIR-2025-089" },
  { id: "PAY-009", etuCode: "ETU-007", montant: 50000, type: "Frais partiels", date: "2026-01-01", mode: "Espèces", statut: "Validé", ref: "ESP-2026-001" },
  { id: "PAY-010", etuCode: "ETU-011", montant: 180000, type: "Frais partiels", date: "2026-01-20", mode: "Mobile Money", statut: "En attente", ref: "MTN-2026-022" },
];

export const MORATORIUMS: Moratorium[] = [
  { id: "MOR-001", etuCode: "ETU-003", montantTotal: 180000, montantPaye: 100000, echeances: [{ date: "2026-01-15", mont: 50000, statut: "Payé" }, { date: "2026-03-15", mont: 50000, statut: "Payé" }, { date: "2026-05-15", mont: 80000, statut: "En attente" }], statut: "En cours" },
  { id: "MOR-002", etuCode: "ETU-005", montantTotal: 375000, montantPaye: 150000, echeances: [{ date: "2026-02-01", mont: 150000, statut: "Payé" }, { date: "2026-04-01", mont: 100000, statut: "En retard" }, { date: "2026-06-01", mont: 125000, statut: "À venir" }], statut: "En retard" },
  { id: "MOR-003", etuCode: "ETU-007", montantTotal: 450000, montantPaye: 50000, echeances: [{ date: "2026-01-01", mont: 50000, statut: "Payé" }, { date: "2026-03-01", mont: 100000, statut: "En retard" }, { date: "2026-05-01", mont: 150000, statut: "En retard" }, { date: "2026-07-01", mont: 150000, statut: "À venir" }], statut: "Critique" },
];

export const PERSONNEL: Personnel[] = [
  { id: "RH001", nom: "Ateba", prenom: "Barnabé", role: "Enseignant", dept: "Informatique", email: "b.ateba@edustar.cm", tel: "+237 677 500 001", statut: "Actif", salaire: 450000, entree: "2018-09-01", contrat: "CDI" },
  { id: "RH002", nom: "Nkemba", prenom: "Carine", role: "Enseignant", dept: "Informatique", email: "c.nkemba@edustar.cm", tel: "+237 699 500 002", statut: "Actif", salaire: 420000, entree: "2020-01-15", contrat: "CDI" },
  { id: "RH003", nom: "Tchamba", prenom: "Dieudonne", role: "Enseignant", dept: "Gestion", email: "d.tchamba@edustar.cm", tel: "+237 655 500 003", statut: "Actif", salaire: 430000, entree: "2019-09-01", contrat: "CDI" },
  { id: "RH004", nom: "Ondoa", prenom: "Marcel", role: "Direction", dept: "Direction", email: "m.ondoa@edustar.cm", tel: "+237 677 500 004", statut: "Actif", salaire: 750000, entree: "2015-01-01", contrat: "CDI" },
  { id: "RH005", nom: "Biyong", prenom: "Sophie", role: "Enseignant", dept: "Gestion", email: "s.biyong@edustar.cm", tel: "+237 699 500 005", statut: "Congé", salaire: 410000, entree: "2021-09-01", contrat: "CDI" },
  { id: "RH006", nom: "Essama", prenom: "Jean-Pierre", role: "Enseignant", dept: "Droit", email: "jp.essama@edustar.cm", tel: "+237 655 500 006", statut: "Actif", salaire: 440000, entree: "2017-09-01", contrat: "CDI" },
  { id: "RH007", nom: "Abega", prenom: "Claudine", role: "Enseignant", dept: "Langues", email: "c.abega@edustar.cm", tel: "+237 677 500 007", statut: "Actif", salaire: 380000, entree: "2022-09-01", contrat: "CDD" },
  { id: "RH008", nom: "Fouda", prenom: "Eric", role: "Administratif", dept: "Scolarité", email: "e.fouda@edustar.cm", tel: "+237 699 500 008", statut: "Actif", salaire: 220000, entree: "2019-03-01", contrat: "CDI" },
  { id: "RH009", nom: "Minko", prenom: "Bernadette", role: "Administratif", dept: "Comptabilité", email: "b.minko@edustar.cm", tel: "+237 655 500 009", statut: "Actif", salaire: 260000, entree: "2020-06-01", contrat: "CDI" },
  { id: "RH010", nom: "Zang", prenom: "Victor", role: "Technicien", dept: "Informatique", email: "v.zang@edustar.cm", tel: "+237 677 500 010", statut: "Actif", salaire: 200000, entree: "2023-01-01", contrat: "CDD" },
];

export const EMPLOI_DU_TEMPS: EmploiDuTemps[] = [
  { id: "EDT001", jour: "Lundi", hDebut: "08:00", hFin: "10:00", matCode: "INF101", classe: "L1-INFO-A", salle: "Amphi A", ens: "Dr. Ateba", type: "CM" },
  { id: "EDT002", jour: "Lundi", hDebut: "10:00", hFin: "12:00", matCode: "GES101", classe: "L1-GESTION-A", salle: "Amphi C", ens: "Dr. Tchamba", type: "CM" },
  { id: "EDT003", jour: "Lundi", hDebut: "14:00", hFin: "16:00", matCode: "INF201", classe: "L2-INFO-B", salle: "Salle 201", ens: "Dr. Nkemba", type: "TD" },
  { id: "EDT004", jour: "Mardi", hDebut: "08:00", hFin: "10:00", matCode: "INF102", classe: "L1-INFO-A", salle: "Labo Info", ens: "Dr. Nkemba", type: "TP" },
  { id: "EDT005", jour: "Mardi", hDebut: "14:00", hFin: "16:00", matCode: "INF201", classe: "L2-INFO-B", salle: "Salle 201", ens: "Dr. Nkemba", type: "TD" },
  { id: "EDT006", jour: "Mercredi", hDebut: "08:00", hFin: "10:00", matCode: "DRT101", classe: "L3-DROIT-A", salle: "Salle 302", ens: "Me. Essama", type: "CM" },
  { id: "EDT007", jour: "Mercredi", hDebut: "10:00", hFin: "12:00", matCode: "GES201", classe: "L2-GESTION-B", salle: "Salle 105", ens: "Dr. Biyong", type: "CM" },
  { id: "EDT008", jour: "Jeudi", hDebut: "08:00", hFin: "10:00", matCode: "INF101", classe: "L1-INFO-B", salle: "Amphi B", ens: "Dr. Ateba", type: "CM" },
  { id: "EDT009", jour: "Jeudi", hDebut: "10:00", hFin: "12:00", matCode: "INF301", classe: "M1-INFO-A", salle: "Labo Info", ens: "Pr. Ondoa", type: "CM" },
  { id: "EDT010", jour: "Vendredi", hDebut: "08:00", hFin: "10:00", matCode: "COM101", classe: "L1-INFO-A", salle: "Salle 101", ens: "Mme. Abega", type: "TD" },
  { id: "EDT011", jour: "Vendredi", hDebut: "10:00", hFin: "12:00", matCode: "INF102", classe: "L1-INFO-A", salle: "Labo Info", ens: "Dr. Nkemba", type: "TP" },
  { id: "EDT012", jour: "Vendredi", hDebut: "14:00", hFin: "16:00", matCode: "DRT101", classe: "L3-DROIT-A", salle: "Salle 302", ens: "Me. Essama", type: "TD" },
];

export const CHART_DATA = [
  { mois: "Sep", inscrits: 391, admissions: 42, paiements: 18500000 },
  { mois: "Oct", inscrits: 391, admissions: 12, paiements: 12300000 },
  { mois: "Nov", inscrits: 388, admissions: 5, paiements: 9800000 },
  { mois: "Déc", inscrits: 388, admissions: 2, paiements: 7200000 },
  { mois: "Jan", inscrits: 385, admissions: 0, paiements: 6400000 },
  { mois: "Fév", inscrits: 384, admissions: 0, paiements: 5900000 },
  { mois: "Mar", inscrits: 383, admissions: 0, paiements: 4100000 },
];

export const LIVRES: Livre[] = [
  { id: "LIV-001", titre: "Algorithmique — Techniques de base", auteur: "Thomas Cormen", isbn: "978-2-1001-5421-9", categorie: "Informatique", exemplaires: 8, disponibles: 3, localisation: "Rayon A-12", annee: 2022, editeur: "Dunod" },
  { id: "LIV-002", titre: "Python pour les sciences", auteur: "Jake VanderPlas", isbn: "978-2-1001-7831-2", categorie: "Informatique", exemplaires: 5, disponibles: 5, localisation: "Rayon A-15", annee: 2023, editeur: "O'Reilly" },
  { id: "LIV-003", titre: "Comptabilité générale approfondie", auteur: "Robert Obert", isbn: "978-2-2471-3892-4", categorie: "Gestion", exemplaires: 10, disponibles: 6, localisation: "Rayon B-03", annee: 2021, editeur: "Dunod" },
  { id: "LIV-004", titre: "Droit des obligations", auteur: "François Terré", isbn: "978-2-2471-5510-6", categorie: "Droit", exemplaires: 6, disponibles: 2, localisation: "Rayon C-07", annee: 2020, editeur: "Dalloz" },
  { id: "LIV-005", titre: "Bases de données relationnelles", auteur: "C.J. Date", isbn: "978-2-7440-7239-8", categorie: "Informatique", exemplaires: 4, disponibles: 1, localisation: "Rayon A-18", annee: 2019, editeur: "Pearson" },
  { id: "LIV-006", titre: "Management stratégique", auteur: "Michael Porter", isbn: "978-2-1001-6711-0", categorie: "Gestion", exemplaires: 7, disponibles: 4, localisation: "Rayon B-11", annee: 2022, editeur: "Dunod" },
  { id: "LIV-007", titre: "Introduction au droit pénal", auteur: "Jean Pradel", isbn: "978-2-2471-9203-5", categorie: "Droit", exemplaires: 5, disponibles: 3, localisation: "Rayon C-12", annee: 2021, editeur: "Cujas" },
  { id: "LIV-008", titre: "Réseaux informatiques", auteur: "Andrew Tanenbaum", isbn: "978-2-7440-6801-8", categorie: "Informatique", exemplaires: 6, disponibles: 0, localisation: "Rayon A-22", annee: 2020, editeur: "Pearson" },
  { id: "LIV-009", titre: "Mathématiques financières", auteur: "Gilles Hanus", isbn: "978-2-1001-2345-1", categorie: "Gestion", exemplaires: 8, disponibles: 7, localisation: "Rayon B-08", annee: 2023, editeur: "Dunod" },
  { id: "LIV-010", titre: "Génie logiciel", auteur: "Roger Pressman", isbn: "978-2-7440-7899-4", categorie: "Informatique", exemplaires: 3, disponibles: 2, localisation: "Rayon A-25", annee: 2019, editeur: "Pearson" },
];

export const EMPRUNTS: Emprunt[] = [
  { id: "EMP-001", livreId: "LIV-001", etuCode: "ETU-001", dateEmprunt: "2026-04-10", dateRetourPrevu: "2026-04-24", statut: "En cours" },
  { id: "EMP-002", livreId: "LIV-004", etuCode: "ETU-004", dateEmprunt: "2026-04-12", dateRetourPrevu: "2026-04-26", statut: "En cours" },
  { id: "EMP-003", livreId: "LIV-005", etuCode: "ETU-006", dateEmprunt: "2026-04-08", dateRetourPrevu: "2026-04-22", statut: "En retard" },
  { id: "EMP-004", livreId: "LIV-008", etuCode: "ETU-007", dateEmprunt: "2026-03-20", dateRetourPrevu: "2026-04-03", statut: "En retard" },
  { id: "EMP-005", livreId: "LIV-001", etuCode: "ETU-002", dateEmprunt: "2026-03-15", dateRetourPrevu: "2026-03-29", dateRetourReel: "2026-03-28", statut: "Retourné" },
  { id: "EMP-006", livreId: "LIV-003", etuCode: "ETU-003", dateEmprunt: "2026-04-01", dateRetourPrevu: "2026-04-15", dateRetourReel: "2026-04-14", statut: "Retourné" },
  { id: "EMP-007", livreId: "LIV-006", etuCode: "ETU-005", dateEmprunt: "2026-04-18", dateRetourPrevu: "2026-05-02", statut: "En cours" },
  { id: "EMP-008", livreId: "LIV-008", etuCode: "ETU-009", dateEmprunt: "2026-04-05", dateRetourPrevu: "2026-04-19", statut: "En retard" },
];

export const BUS_LIST: Bus[] = [
  { id: "BUS-001", numero: "B01", immatriculation: "LT-5142-YA", chauffeur: "Martin Essono", capacite: 45, itineraire: "Bastos → Université → Nlongkak", statut: "En service", depart: "06:30", arrivee: "07:45", passagers: 38 },
  { id: "BUS-002", numero: "B02", immatriculation: "CE-3871-YA", chauffeur: "Paul Mbarga", capacite: 45, itineraire: "Mvog-Ada → Melen → Université", statut: "En service", depart: "06:45", arrivee: "08:00", passagers: 42 },
  { id: "BUS-003", numero: "B03", immatriculation: "LT-7820-YA", chauffeur: "Jean Bela", capacite: 30, itineraire: "Biyem-Assi → Obili → Université", statut: "En panne", depart: "06:30", arrivee: "07:30", passagers: 0 },
  { id: "BUS-004", numero: "B04", immatriculation: "CE-4520-YA", chauffeur: "Samuel Nkeng", capacite: 45, itineraire: "Cité Verte → Mendong → Université", statut: "En service", depart: "07:00", arrivee: "08:15", passagers: 31 },
  { id: "BUS-005", numero: "B05", immatriculation: "LT-9231-YA", chauffeur: "André Mveng", capacite: 30, itineraire: "Etoudi → Omnisport → Université", statut: "En maintenance", depart: "07:15", arrivee: "08:15", passagers: 0 },
];

export const SALLES: Salle[] = [
  { code: "AMPH-A", lib: "Amphithéâtre A", type: "Amphi", capacite: 200, batiment: "Bâtiment Principal", etage: "Rez-de-chaussée", equipements: ["Vidéoprojecteur", "Sonorisation", "Climatisation", "Wi-Fi"], statut: "Disponible" },
  { code: "AMPH-B", lib: "Amphithéâtre B", type: "Amphi", capacite: 150, batiment: "Bâtiment Principal", etage: "Rez-de-chaussée", equipements: ["Vidéoprojecteur", "Sonorisation", "Climatisation"], statut: "Occupée" },
  { code: "AMPH-C", lib: "Amphithéâtre C", type: "Amphi", capacite: 180, batiment: "Aile Ouest", etage: "Rez-de-chaussée", equipements: ["Vidéoprojecteur", "Sonorisation", "Wi-Fi"], statut: "Disponible" },
  { code: "S-101", lib: "Salle 101", type: "Salle", capacite: 50, batiment: "Bâtiment A", etage: "1er étage", equipements: ["Tableau blanc", "Climatisation"], statut: "Disponible" },
  { code: "S-105", lib: "Salle 105", type: "Salle", capacite: 45, batiment: "Bâtiment A", etage: "1er étage", equipements: ["Vidéoprojecteur", "Tableau blanc"], statut: "Occupée" },
  { code: "S-201", lib: "Salle 201", type: "Salle", capacite: 40, batiment: "Bâtiment B", etage: "2ème étage", equipements: ["Tableau blanc", "Climatisation", "Wi-Fi"], statut: "Disponible" },
  { code: "S-302", lib: "Salle 302", type: "Salle", capacite: 35, batiment: "Bâtiment C", etage: "3ème étage", equipements: ["Tableau noir", "Climatisation"], statut: "Occupée" },
  { code: "LABO-INFO", lib: "Laboratoire Informatique", type: "Labo", capacite: 30, batiment: "Bâtiment Tech", etage: "1er étage", equipements: ["30 PC", "Réseau local", "Vidéoprojecteur", "Climatisation", "Wi-Fi"], statut: "Disponible" },
  { code: "LABO-SC", lib: "Laboratoire Sciences", type: "Labo", capacite: 25, batiment: "Bâtiment Tech", etage: "2ème étage", equipements: ["Équipements de labo", "Climatisation"], statut: "Maintenance" },
  { code: "SALLE-REU", lib: "Salle de réunion", type: "Réunion", capacite: 20, batiment: "Bâtiment Direction", etage: "2ème étage", equipements: ["Écran TV", "Table de conférence", "Climatisation", "Wi-Fi"], statut: "Disponible" },
];

export const APP_USERS: AppUser[] = [
  { id: "USR-001", nom: "Ondoa", prenom: "Marcel", email: "m.ondoa@edustar.cm", tel: "+237 677 500 004", profil: "DIR", statut: "Actif", created: "2015-01-01", lastLogin: "2026-05-25T08:30:00" },
  { id: "USR-002", nom: "Fouda", prenom: "Eric", email: "e.fouda@edustar.cm", tel: "+237 699 500 008", profil: "SCO", statut: "Actif", created: "2019-03-01", lastLogin: "2026-05-25T09:15:00" },
  { id: "USR-003", nom: "Ateba", prenom: "Barnabé", email: "b.ateba@edustar.cm", tel: "+237 677 500 001", profil: "ENS", statut: "Actif", created: "2018-09-01", lastLogin: "2026-05-24T16:00:00" },
  { id: "USR-004", nom: "Nkemba", prenom: "Carine", email: "c.nkemba@edustar.cm", tel: "+237 699 500 002", profil: "ENS", statut: "Actif", created: "2020-01-15", lastLogin: "2026-05-25T07:45:00" },
  { id: "USR-005", nom: "Minko", prenom: "Bernadette", email: "b.minko@edustar.cm", tel: "+237 655 500 009", profil: "CPT", statut: "Actif", created: "2020-06-01", lastLogin: "2026-05-23T14:30:00" },
  { id: "USR-006", nom: "Tchamba", prenom: "Dieudonné", email: "d.tchamba@edustar.cm", tel: "+237 655 500 003", profil: "ENS", statut: "Actif", created: "2019-09-01", lastLogin: "2026-05-24T10:20:00" },
  { id: "USR-007", nom: "Zang", prenom: "Victor", email: "v.zang@edustar.cm", tel: "+237 677 500 010", profil: "ADM", statut: "Actif", created: "2023-01-01", lastLogin: "2026-05-25T08:00:00" },
  { id: "USR-008", nom: "Essama", prenom: "Jean-Pierre", email: "jp.essama@edustar.cm", tel: "+237 655 500 006", profil: "ENS", statut: "Actif", created: "2017-09-01", lastLogin: "2026-05-22T11:00:00" },
  { id: "USR-009", nom: "Abega", prenom: "Claudine", email: "c.abega@edustar.cm", tel: "+237 677 500 007", profil: "ENS", statut: "Inactif", created: "2022-09-01", lastLogin: "2026-04-30T15:45:00" },
  { id: "USR-010", nom: "Nguemba", prenom: "Alice", email: "a.nguemba@edustar.cm", tel: "+237 699 500 010", profil: "BIB", statut: "Actif", created: "2024-01-15", lastLogin: "2026-05-25T09:00:00" },
];

export const MESSAGES: Message[] = [
  { id: "MSG-001", de: "Dr. Ateba", a: "Admin Principal", sujet: "Notes session partielle INF101", corps: "Bonjour, je vous transmets les notes de la session partielle de la matière INF101 pour la classe L1-INFO-A. Veuillez procéder à leur publication dans le système. Cordialement.", date: "2026-05-25T09:30:00", lu: false },
  { id: "MSG-002", de: "Scolarité (Eric Fouda)", a: "Admin Principal", sujet: "Dossiers d'admission incomplets — Action requise", corps: "5 dossiers d'admission sont incomplets depuis plus de 7 jours. Merci de relancer les candidats concernés ou de les rejeter après délai.", date: "2026-05-24T14:00:00", lu: false },
  { id: "MSG-003", de: "Dr. Nkemba", a: "Admin Principal", sujet: "Demande de réservation — Labo Informatique", corps: "Je sollicite la réservation du Laboratoire Informatique pour les séances de TP du cours INF201 les mardis de 14h à 16h à partir du 3 juin.", date: "2026-05-23T11:15:00", lu: true },
  { id: "MSG-004", de: "Pr. Ondoa", a: "Admin Principal", sujet: "Conseil pédagogique — Convocation", corps: "Le conseil pédagogique se tiendra le jeudi 29 mai 2026 à 14h00 en salle de réunion. Présence obligatoire de tous les responsables de filière.", date: "2026-05-22T10:00:00", lu: true },
  { id: "MSG-005", de: "Victor Zang", a: "Admin Principal", sujet: "Maintenance serveur planifiée", corps: "Une maintenance du serveur est prévue samedi 31 mai de 22h à 02h. Le système sera temporairement indisponible. Merci de prévenir les utilisateurs.", date: "2026-05-21T16:30:00", lu: true },
  { id: "MSG-006", de: "Alice Nguemba", a: "Admin Principal", sujet: "Rapport bibliothèque — Mai 2026", corps: "Ci-joint le rapport mensuel de la bibliothèque pour mai 2026 : 23 emprunts, 3 retards, 5 retours effectués. 2 ouvrages à commander en urgence (disponibilité nulle).", date: "2026-05-20T09:00:00", lu: true },
  { id: "MSG-007", de: "Admin Principal", a: "Tous les enseignants", sujet: "Rappel — Saisie des notes S2", corps: "Le délai de saisie des notes du semestre 2 est fixé au 30 juin 2026. Merci de respecter cette échéance pour permettre la publication des bulletins.", date: "2026-05-19T08:00:00", lu: true },
  { id: "MSG-008", de: "Me. Essama", a: "Scolarité (Eric Fouda)", sujet: "Liste des étudiants L3-DROIT-A", corps: "Veuillez me transmettre la liste définitive des étudiants de L3-DROIT-A pour le semestre 2, ainsi que leurs relevés de présence.", date: "2026-05-18T14:30:00", lu: false },
];

export const ANNONCES: Annonce[] = [
  { id: "ANN-001", titre: "Résultats du Semestre 1 — Publication imminente", corps: "Les résultats du semestre 1 de l'année académique 2025-2026 seront publiés le lundi 2 juin 2026. Les étudiants pourront consulter leurs bulletins via leur espace personnel.", auteur: "Scolarité", date: "2026-05-25", cible: "Étudiants", priorite: "Urgente", statut: "Publiée" },
  { id: "ANN-002", titre: "Conseil pédagogique — 29 Mai 2026", corps: "Un conseil pédagogique est convoqué le jeudi 29 mai 2026 à 14h00 en salle de réunion. Tous les responsables de filière et enseignants titulaires sont conviés.", auteur: "Direction", date: "2026-05-22", cible: "Enseignants", priorite: "Normale", statut: "Publiée" },
  { id: "ANN-003", titre: "Journée Portes Ouvertes — 14 Juin 2026", corps: "EduStar organise sa journée portes ouvertes annuelle le samedi 14 juin 2026. Les étudiants sont invités à participer et à accompagner leurs familles.", auteur: "Direction", date: "2026-05-20", cible: "Tous", priorite: "Info", statut: "Publiée" },
  { id: "ANN-004", titre: "Maintenance système — 31 Mai (22h–02h)", corps: "Le système de gestion sera indisponible le samedi 31 mai de 22h à 02h du matin pour maintenance. Veuillez sauvegarder vos travaux en cours.", auteur: "Service Informatique", date: "2026-05-19", cible: "Tous", priorite: "Urgente", statut: "Publiée" },
  { id: "ANN-005", titre: "Délai de saisie des notes — Semestre 2", corps: "La date limite de saisie des notes du semestre 2 est fixée au 30 juin 2026. Passé ce délai, aucune modification ne sera acceptée sans validation de la direction.", auteur: "Scolarité", date: "2026-05-18", cible: "Enseignants", priorite: "Normale", statut: "Publiée" },
  { id: "ANN-006", titre: "Activités sportives inter-filières", corps: "La compétition sportive inter-filières aura lieu du 5 au 7 juin 2026. Inscriptions ouvertes jusqu'au 30 mai auprès du service scolarité.", auteur: "Direction", date: "2026-05-15", cible: "Étudiants", priorite: "Info", statut: "Publiée" },
];

export const BULLETINS: Bulletin[] = [
  {
    id: "BUL-001", etuCode: "ETU-001", session: "2025-2026", semestre: "S1",
    notes: [
      { matCode: "INF101", matLib: "Algorithmique & Structures de données", credits: 6, coeff: 3, ds: 14, tp: 16, exam: 13, moy: 14.0, statut: "Validé" },
      { matCode: "INF102", matLib: "Programmation Orientée Objet", credits: 4, coeff: 2, ds: 15, tp: 17, exam: 14, moy: 15.2, statut: "Validé" },
      { matCode: "COM101", matLib: "Communication professionnelle", credits: 3, coeff: 1, ds: 13, exam: 14, moy: 13.5, statut: "Validé" },
    ],
    moyGeneral: 14.2, totalCredits: 13, creditsValides: 13, rang: 8, effectifClasse: 48,
    appreciation: "Bon travail. Continue sur cette lancée.", statut: "Publié",
  },
  {
    id: "BUL-002", etuCode: "ETU-002", session: "2025-2026", semestre: "S1",
    notes: [
      { matCode: "INF101", matLib: "Algorithmique & Structures de données", credits: 6, coeff: 3, ds: 17, tp: 18, exam: 16, moy: 16.8, statut: "Validé" },
      { matCode: "INF102", matLib: "Programmation Orientée Objet", credits: 4, coeff: 2, ds: 18, tp: 19, exam: 16, moy: 17.2, statut: "Validé" },
      { matCode: "COM101", matLib: "Communication professionnelle", credits: 3, coeff: 1, ds: 16, exam: 17, moy: 16.5, statut: "Validé" },
    ],
    moyGeneral: 16.8, totalCredits: 13, creditsValides: 13, rang: 1, effectifClasse: 48,
    appreciation: "Excellence. Major de promotion. Félicitations !", statut: "Publié",
  },
  {
    id: "BUL-003", etuCode: "ETU-007", session: "2025-2026", semestre: "S1",
    notes: [
      { matCode: "INF101", matLib: "Algorithmique & Structures de données", credits: 6, coeff: 3, ds: 8, tp: 10, exam: 9, moy: 9.0, statut: "Rattrapage" },
      { matCode: "INF102", matLib: "Programmation Orientée Objet", credits: 4, coeff: 2, ds: 8, tp: 10, exam: 9, moy: 9.0, statut: "Rattrapage" },
      { matCode: "COM101", matLib: "Communication professionnelle", credits: 3, coeff: 1, ds: 10, exam: 9, moy: 9.5, statut: "Rattrapage" },
    ],
    moyGeneral: 9.2, totalCredits: 13, creditsValides: 0, rang: 38, effectifClasse: 38,
    appreciation: "Résultats insuffisants. Passage en rattrapage. Travail sérieux requis.", statut: "Publié",
  },
];

export const ACTIVITY_FEED = [
  { id: 1, type: "admission", text: "Nouvelle admission validée — Judith Mekongo (Gestion L1)", time: "Il y a 12 min", color: "bg-success-DEFAULT" },
  { id: 2, type: "payment", text: "Paiement reçu — ETU-009 · 500 000 FCFA via MTN Mobile Money", time: "Il y a 34 min", color: "bg-blue-DEFAULT" },
  { id: 3, type: "alert", text: "Alerte retard — Boris Kamdem (ETU-005), moratoire en retard", time: "Il y a 1h", color: "bg-warning-DEFAULT" },
  { id: 4, type: "student", text: "Nouveau dossier créé — Armand Beti (ETU-009) inscrit en L1-INFO-A", time: "Il y a 2h", color: "bg-cyan-DEFAULT" },
  { id: 5, type: "exam", text: "Résultats publiés — Session partielle INF101, 48 notes saisies", time: "Il y a 3h", color: "bg-purple-DEFAULT" },
  { id: 6, type: "suspension", text: "Compte suspendu — Kevin Atangana (ETU-007), 15 absences non justifiées", time: "Hier", color: "bg-danger-DEFAULT" },
];
