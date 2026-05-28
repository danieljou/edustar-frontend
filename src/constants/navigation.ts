import type { NavSection } from "@/types";

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    titleKey: "nav.sections.principal",
    items: [
      { label: "Tableau de bord", labelKey: "nav.items.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Notifications", labelKey: "nav.items.notifications", href: "/dashboard/notifications", icon: "Bell", badge: 7 },
    ],
  },
  {
    title: "Académique",
    titleKey: "nav.sections.academique",
    items: [
      { label: "Étudiants", labelKey: "nav.items.students", href: "/dashboard/students", icon: "GraduationCap" },
      { label: "Admissions", labelKey: "nav.items.admissions", href: "/dashboard/admissions", icon: "ClipboardList" },
      { label: "Sessions", labelKey: "nav.items.sessions", href: "/dashboard/sessions", icon: "CalendarRange" },
      { label: "Configuration", labelKey: "nav.items.configuration", href: "/dashboard/configuration", icon: "Settings2" },
      { label: "Classes", labelKey: "nav.items.classes", href: "/dashboard/classes", icon: "School" },
      { label: "Matières", labelKey: "nav.items.subjects", href: "/dashboard/subjects", icon: "BookOpen" },
      { label: "Config Académique", labelKey: "nav.items.configAcademique", href: "/dashboard/config-academique", icon: "Layers" },
    ],
  },
  {
    title: "Évaluations",
    titleKey: "nav.sections.evaluations",
    items: [
      { label: "Système d'évaluation", labelKey: "nav.items.evalSystem", href: "/dashboard/academique/evaluation-system", icon: "Layers" },
      { label: "Saisie des notes", labelKey: "nav.items.gradeEntry", href: "/dashboard/notes/saisie", icon: "PenLine" },
      { label: "Bulletins", labelKey: "nav.items.bulletins", href: "/dashboard/bulletins", icon: "Award" },
    ],
  },
  {
    title: "Pédagogie",
    titleKey: "nav.sections.pedagogie",
    items: [
      { label: "Présences", labelKey: "nav.items.attendance", href: "/dashboard/attendance", icon: "UserCheck" },
      { label: "Examens", labelKey: "nav.items.exams", href: "/dashboard/exams", icon: "FileText" },
      { label: "Emplois du temps", labelKey: "nav.items.timetable", href: "/dashboard/timetable", icon: "Clock" },
    ],
  },
  {
    title: "Administration",
    titleKey: "nav.sections.administration",
    items: [
      { label: "Établissements", labelKey: "nav.items.campus", href: "/dashboard/campus", icon: "Building2" },
      { label: "Paiements", labelKey: "nav.items.payments", href: "/dashboard/payments", icon: "CreditCard" },
      { label: "Ressources Humaines", labelKey: "nav.items.hr", href: "/dashboard/hr", icon: "Users" },
      { label: "Bibliothèque", labelKey: "nav.items.library", href: "/dashboard/library", icon: "Library" },
      { label: "Transport", labelKey: "nav.items.transport", href: "/dashboard/transport", icon: "Bus" },
      { label: "Salles", labelKey: "nav.items.salles", href: "/dashboard/salles", icon: "DoorOpen" },
    ],
  },
  {
    title: "Communication",
    titleKey: "nav.sections.communication",
    items: [
      { label: "Messagerie", labelKey: "nav.items.messaging", href: "/dashboard/communication", icon: "MessageSquare" },
      { label: "Annonces", labelKey: "nav.items.announcements", href: "/dashboard/announcements", icon: "Megaphone" },
    ],
  },
  {
    title: "Système",
    titleKey: "nav.sections.systeme",
    items: [
      { label: "Rapports", labelKey: "nav.items.reports", href: "/dashboard/reports", icon: "BarChart3" },
      { label: "Utilisateurs", labelKey: "nav.items.users", href: "/dashboard/users", icon: "UserCog" },
      { label: "Paramètres", labelKey: "nav.items.settings", href: "/dashboard/settings", icon: "Settings" },
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
  "config-academique": "Configuration Académique",
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
