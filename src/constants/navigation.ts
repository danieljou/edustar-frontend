import type { NavSection } from "@/types";

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    items: [
      { label: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Notifications", href: "/dashboard/notifications", icon: "Bell", badge: 7 },
    ],
  },
  {
    title: "Académique",
    items: [
      { label: "Étudiants", href: "/dashboard/students", icon: "GraduationCap" },
      { label: "Admissions", href: "/dashboard/admissions", icon: "ClipboardList" },
      { label: "Sessions", href: "/dashboard/sessions", icon: "CalendarRange" },
      { label: "Configuration", href: "/dashboard/configuration", icon: "Settings2" },
      { label: "Classes", href: "/dashboard/classes", icon: "School" },
      { label: "Matières", href: "/dashboard/subjects", icon: "BookOpen" },
    ],
  },
  {
    title: "Évaluations",
    items: [
      { label: "Système d'évaluation", href: "/dashboard/academique/evaluation-system", icon: "Layers" },
      { label: "Saisie des notes", href: "/dashboard/notes/saisie", icon: "PenLine" },
      { label: "Bulletins", href: "/dashboard/bulletins", icon: "Award" },
    ],
  },
  {
    title: "Pédagogie",
    items: [
      { label: "Présences", href: "/dashboard/attendance", icon: "UserCheck" },
      { label: "Examens", href: "/dashboard/exams", icon: "FileText" },
      { label: "Emplois du temps", href: "/dashboard/timetable", icon: "Clock" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Établissements", href: "/dashboard/campus", icon: "Building2" },
      { label: "Paiements", href: "/dashboard/payments", icon: "CreditCard" },
      { label: "Ressources Humaines", href: "/dashboard/hr", icon: "Users" },
      { label: "Bibliothèque", href: "/dashboard/library", icon: "Library" },
      { label: "Transport", href: "/dashboard/transport", icon: "Bus" },
      { label: "Salles", href: "/dashboard/salles", icon: "DoorOpen" },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Messagerie", href: "/dashboard/communication", icon: "MessageSquare" },
      { label: "Annonces", href: "/dashboard/announcements", icon: "Megaphone" },
    ],
  },
  {
    title: "Système",
    items: [
      { label: "Rapports", href: "/dashboard/reports", icon: "BarChart3" },
      { label: "Utilisateurs", href: "/dashboard/users", icon: "UserCog" },
      { label: "Paramètres", href: "/dashboard/settings", icon: "Settings" },
    ],
  },
];

export const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Tableau de bord",
  students: "Étudiants",
  admissions: "Admissions",
  sessions: "Sessions",
  configuration: "Configuration année scolaire",
  campus: "Réseau d'établissements",
  classes: "Classes",
  subjects: "Matières",
  attendance: "Présences",
  exams: "Examens",
  bulletins: "Bulletins",
  timetable: "Emplois du temps",
  payments: "Paiements",
  hr: "Ressources Humaines",
  library: "Bibliothèque",
  transport: "Transport",
  communication: "Messagerie",
  announcements: "Annonces",
  salles: "Salles",
  users: "Utilisateurs",
  reports: "Rapports",
  settings: "Paramètres",
  notifications: "Notifications",
};
