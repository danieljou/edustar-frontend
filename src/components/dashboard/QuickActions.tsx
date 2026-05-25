import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, ClipboardList, CreditCard, FileText, UserCheck, Users } from "lucide-react";

const ACTIONS = [
  { label: "Nouvel étudiant", icon: GraduationCap, href: "/dashboard/students", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
  { label: "Nouvelle admission", icon: ClipboardList, href: "/dashboard/admissions", color: "bg-[var(--warning-light)] text-[var(--warning)]" },
  { label: "Enregistrer paiement", icon: CreditCard, href: "/dashboard/payments", color: "bg-[var(--success-light)] text-[var(--success)]" },
  { label: "Saisir notes", icon: FileText, href: "/dashboard/exams", color: "bg-purple-50 text-[var(--purple)]" },
  { label: "Présences", icon: UserCheck, href: "/dashboard/attendance", color: "bg-[var(--cyan-light)] text-[var(--cyan)]" },
  { label: "Nouveau RH", icon: Users, href: "/dashboard/hr", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2.5">
          {ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-2.5 p-3 rounded-[10px] border border-[var(--line)] hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-all group"
            >
              <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-tight">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
