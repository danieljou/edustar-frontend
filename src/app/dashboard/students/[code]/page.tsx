"use client";

import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Edit, Download, Mail, Phone, MapPin, Calendar,
  GraduationCap, CreditCard, BookOpen, FileText, UserCheck,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, User, Building2, Hash, Star, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import {
  STUDENTS, NOTES, PAYMENTS, MORATORIUMS, BULLETINS,
  EMPRUNTS, LIVRES,
} from "@/constants/mock-data";
import { formatCurrency, age, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ── helpers ─────────────────────────────────────────────────────────────── */
function MoyBadge({ moy }: { moy: number }) {
  return (
    <EduBadge variant={moy >= 14 ? "green" : moy >= 10 ? "amber" : "red"}>
      {moy.toFixed(1)}/20
    </EduBadge>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, string> = {
    "Validé": "bg-[var(--success-light)] text-[var(--success)]",
    "Rattrapage": "bg-[var(--warning-light)] text-[var(--warning)]",
    "Ajourné": "bg-[var(--danger-light)] text-[var(--danger)]",
    "Payé": "bg-[var(--success-light)] text-[var(--success)]",
    "En attente": "bg-[var(--warning-light)] text-[var(--warning)]",
    "En retard": "bg-[var(--danger-light)] text-[var(--danger)]",
    "À venir": "bg-[var(--ivory)] text-[var(--ink-4)]",
    "En cours": "bg-[var(--blue-light)] text-[var(--blue)]",
    "Retourné": "bg-[var(--success-light)] text-[var(--success)]",
  };
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", map[statut] ?? "bg-[var(--ivory)] text-[var(--ink-4)]")}>
      {statut}
    </span>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */
export default function StudentDossierPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { t } = useTranslation("academique");
  const { t: tc } = useTranslation("common");

  const student = STUDENTS.find(s => s.code === decodeURIComponent(code));
  if (!student) notFound();

  const notes    = NOTES.filter(n => n.etuCode === student.code);
  const payments = PAYMENTS.filter(p => p.etuCode === student.code);
  const morat    = MORATORIUMS.find(m => m.etuCode === student.code);
  const bulletins = BULLETINS.filter(b => b.etuCode === student.code);
  const emprunts = EMPRUNTS.filter(e => e.etuCode === student.code);

  const totalPaye = payments.filter(p => p.statut === "Validé").reduce((s, p) => s + p.montant, 0);
  const fraisTotal = totalPaye + student.solde;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--ink-4)]">
        <Link href="/dashboard/students" className="hover:text-[var(--blue)] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> {t("students.pageTitle")}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--ink)] font-medium">{student.prenom} {student.nom}</span>
        <span className="font-mono text-[var(--ink-5)] ml-1">({student.code})</span>
      </div>

      {/* ── Hero card ───────────────────────────────────────────────────── */}
      <Card className="overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-40 sm:h-48 bg-gradient-to-br from-[#1a3fcc] via-[#1e4fac] to-[var(--cyan)] relative overflow-hidden">
          {/* dot mesh */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          {/* decorative blobs */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/[0.06]" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-white/[0.05]" />
          <div className="absolute top-6 right-1/3 w-28 h-28 rounded-full bg-white/[0.04]" />
          {/* name watermark inside banner */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:left-[200px] sm:translate-x-0 text-[28px] sm:text-[34px] font-serif font-bold text-white/10 whitespace-nowrap select-none pointer-events-none leading-none">
            {student.prenom} {student.nom}
          </div>
        </div>

        <CardContent className="pt-0 px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-[60px] sm:-mt-[68px]">

            {/* Avatar + name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar frame */}
              <div className="relative shrink-0 self-start sm:self-auto">
                {/* ambient glow */}
                <div className="absolute -inset-3 rounded-[26px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] opacity-20 blur-xl" />
                {/* gradient ring */}
                <div className="relative bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] p-[3.5px] rounded-[22px] shadow-2xl">
                  <div className="bg-white p-[3px] rounded-[19px]">
                    <EduAvatar
                      name={`${student.prenom} ${student.nom}`}
                      size={116}
                      className="rounded-[16px] text-[42px] font-bold"
                    />
                  </div>
                </div>
                {/* status dot */}
                <div className={cn(
                  "absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-[2.5px] border-white shadow",
                  student.statut === "Actif" ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                )} />
              </div>

              {/* name block */}
              <div className="mt-2 sm:mb-2">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-serif text-[22px] sm:text-[25px] text-[var(--ink)] leading-tight tracking-[-0.02em]">
                    {student.prenom} <span className="font-bold">{student.nom}</span>
                  </h1>
                  <EduBadge variant={statusBadge(student.statut)}>{student.statut}</EduBadge>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[11px] text-[var(--blue)] bg-[var(--blue-light)] px-2 py-0.5 rounded-[5px] font-bold tracking-wide">
                    {student.code}
                  </span>
                  <span className="text-[var(--line-dark)]">·</span>
                  <span className="text-[11.5px] text-[var(--ink-3)] font-medium">{student.classe}</span>
                  <span className="text-[var(--line-dark)]">·</span>
                  <span className="text-[11.5px] text-[var(--ink-4)]">{student.filiere}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--ink-4)]">
                  {student.tel && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{student.tel}</span>
                  )}
                  {student.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{student.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:mb-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-[11.5px]">
                <Download className="w-3.5 h-3.5" /> {tc("actions.download")} PDF
              </Button>
              <Button size="sm" className="text-[11.5px]">
                <Edit className="w-3.5 h-3.5" /> {tc("actions.edit")}
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[var(--line)]">
            {[
              {
                label: t("students.columns.average"),
                value: `${student.moy}/20`,
                sub: student.moy >= 14 ? "Excellent" : student.moy >= 10 ? "Passable" : "Insuffisant",
                icon: Star,
                color: student.moy >= 14 ? "text-[var(--success)]" : student.moy >= 10 ? "text-[var(--warning)]" : "text-[var(--danger)]",
                bg: student.moy >= 14 ? "bg-[var(--success-light)]" : student.moy >= 10 ? "bg-[var(--warning-light)]" : "bg-[var(--danger-light)]",
              },
              {
                label: t("students.columns.absences"),
                value: `${student.absences}`,
                sub: student.absences >= 10 ? "Critique" : student.absences >= 5 ? "À surveiller" : "Normal",
                icon: UserCheck,
                color: student.absences >= 10 ? "text-[var(--danger)]" : student.absences >= 5 ? "text-[var(--warning)]" : "text-[var(--success)]",
                bg: student.absences >= 10 ? "bg-[var(--danger-light)]" : student.absences >= 5 ? "bg-[var(--warning-light)]" : "bg-[var(--success-light)]",
              },
              {
                label: t("students.columns.balance"),
                value: student.solde > 0 ? formatCurrency(student.solde) : "Soldé",
                sub: student.solde > 0 ? "Dû" : "À jour",
                icon: CreditCard,
                color: student.solde > 0 ? "text-[var(--danger)]" : "text-[var(--success)]",
                bg: student.solde > 0 ? "bg-[var(--danger-light)]" : "bg-[var(--success-light)]",
              },
              {
                label: t("students.columns.enrollmentDate"),
                value: new Date(student.created).getFullYear().toString(),
                sub: formatDate(student.created),
                icon: Calendar,
                color: "text-[var(--blue)]",
                bg: "bg-[var(--blue-light)]",
              },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 bg-[var(--ivory)] rounded-[12px] hover:bg-white hover:shadow-sm transition-all">
                <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div className="min-w-0">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-5)] truncate">{label}</div>
                  <div className={cn("text-[15px] font-bold leading-tight", color)}>{value}</div>
                  <div className="text-[10px] text-[var(--ink-4)]">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="infos">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="infos"><User className="w-3.5 h-3.5" /> Informations</TabsTrigger>
          <TabsTrigger value="academique"><GraduationCap className="w-3.5 h-3.5" /> Académique</TabsTrigger>
          <TabsTrigger value="financier"><CreditCard className="w-3.5 h-3.5" /> Financier</TabsTrigger>
          <TabsTrigger value="bibliotheque"><BookOpen className="w-3.5 h-3.5" /> Bibliothèque</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="w-3.5 h-3.5" /> Documents</TabsTrigger>
        </TabsList>

        {/* ── TAB : Informations ────────────────────────────────────────── */}
        <TabsContent value="infos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Identité */}
            <Card>
              <CardHeader><CardTitle>Identité</CardTitle></CardHeader>
              <CardContent className="space-y-3.5">
                {[
                  { icon: User,      label: t("students.columns.fullName"),      value: `${student.prenom} ${student.nom}` },
                  { icon: Hash,      label: t("students.columns.code"),           value: student.code },
                  { icon: Calendar,  label: t("students.columns.birthDate"),      value: `${formatDate(student.dob)} (${age(student.dob)} ans)` },
                  { icon: User,      label: t("students.columns.gender"),         value: student.sexe === "F" ? tc("fields.female") : tc("fields.male") },
                  { icon: MapPin,    label: t("students.columns.address"),        value: student.adresse || "—" },
                  { icon: Phone,     label: t("students.columns.phone"),          value: student.tel },
                  { icon: Mail,      label: t("students.columns.email"),          value: student.email || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-[7px] bg-[var(--ivory)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-5)]">{label}</div>
                      <div className="text-[12.5px] text-[var(--ink)] break-words">{value}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-5">
              {/* Scolarité */}
              <Card>
                <CardHeader><CardTitle>Scolarité</CardTitle></CardHeader>
                <CardContent className="space-y-3.5">
                  {[
                    { icon: GraduationCap, label: t("students.columns.class"),          value: student.classe },
                    { icon: Building2,     label: t("students.columns.filiere"),        value: student.filiere },
                    { icon: Clock,         label: t("students.columns.session"),        value: student.session },
                    { icon: Calendar,      label: t("students.columns.enrollmentDate"), value: formatDate(student.created) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-[7px] bg-[var(--blue-light)] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[var(--blue)]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-5)]">{label}</div>
                        <div className="text-[12.5px] text-[var(--ink)] font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tuteur */}
              <Card>
                <CardHeader><CardTitle>{t("students.columns.guardian")} / Contact urgence</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {student.tuteurNom ? (
                    <>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] bg-[var(--ivory)] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-[var(--ink-3)]" />
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold text-[var(--ink)]">{student.tuteurNom}</div>
                          <div className="text-[11px] text-[var(--ink-4)]">{student.tuteurTel}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[12px] text-[var(--ink-4)] italic">Aucun tuteur renseigné.</p>
                  )}

                  {student.notes && (
                    <>
                      <Separator />
                      <div className="p-3 bg-[var(--blue-lighter)] rounded-[8px] border border-[var(--blue-light)]">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--blue)] mb-1">Note interne</div>
                        <p className="text-[12px] text-[var(--ink-2)]">{student.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB : Académique ─────────────────────────────────────────── */}
        <TabsContent value="academique">
          <div className="space-y-5">

            {/* Bulletins */}
            {bulletins.length > 0 ? bulletins.map(bul => (
              <Card key={bul.id}>
                <CardHeader>
                  <CardTitle>Bulletin — {bul.session} · Semestre {bul.semestre}</CardTitle>
                  <StatutBadge statut={bul.statut} />
                </CardHeader>
                <CardContent>
                  {/* Résumé */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: t("students.columns.average"), value: `${bul.moyGeneral}/20`, color: bul.moyGeneral >= 14 ? "text-[var(--success)]" : bul.moyGeneral >= 10 ? "text-[var(--warning)]" : "text-[var(--danger)]" },
                      { label: "Crédits validés", value: `${bul.creditsValides}/${bul.totalCredits}`, color: "text-[var(--ink)]" },
                      { label: "Rang", value: `${bul.rang}e/${bul.effectifClasse}`, color: "text-[var(--blue)]" },
                      { label: "Appréciation", value: bul.appreciation.split(".")[0], color: "text-[var(--ink-3)]" },
                    ].map(item => (
                      <div key={item.label} className="bg-[var(--ivory)] rounded-[10px] p-3">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-5)] mb-1">{item.label}</div>
                        <div className={cn("text-[13px] font-bold leading-tight", item.color)}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Notes par matière */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="bg-[var(--ivory)]">
                          {["Matière", "DS", "TP", "Examen", "Moy.", "Crédits", tc("fields.status")].map(h => (
                            <th key={h} className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bul.notes.map(n => (
                          <tr key={n.matCode} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                            <td className="px-3 py-2.5">
                              <div className="font-semibold text-[var(--ink)]">{n.matLib}</div>
                              <div className="font-mono text-[10px] text-[var(--ink-4)]">{n.matCode}</div>
                            </td>
                            <td className="px-3 py-2.5 text-[var(--ink-2)]">{n.ds}</td>
                            <td className="px-3 py-2.5 text-[var(--ink-2)]">{n.tp ?? "—"}</td>
                            <td className="px-3 py-2.5 text-[var(--ink-2)]">{n.exam}</td>
                            <td className="px-3 py-2.5"><MoyBadge moy={n.moy} /></td>
                            <td className="px-3 py-2.5 text-[var(--ink-2)]">{n.credits} ECTS</td>
                            <td className="px-3 py-2.5"><StatutBadge statut={n.statut} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )) : (
              /* Notes brutes si pas de bulletin */
              notes.length > 0 ? (
                <Card>
                  <CardHeader><CardTitle>Notes — {student.session}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className="bg-[var(--ivory)]">
                            {["Matière", "DS", "TP", "Examen", "Moy.", tc("fields.status")].map(h => (
                              <th key={h} className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-4)] border-b border-[var(--line)]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {notes.map(n => (
                            <tr key={n.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                              <td className="px-3 py-2.5 font-mono text-[var(--blue)] font-semibold">{n.matCode}</td>
                              <td className="px-3 py-2.5">{n.ds}</td>
                              <td className="px-3 py-2.5">{n.tp ?? "—"}</td>
                              <td className="px-3 py-2.5">{n.exam}</td>
                              <td className="px-3 py-2.5"><MoyBadge moy={n.moy} /></td>
                              <td className="px-3 py-2.5"><StatutBadge statut={n.statut} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-10 text-[12px] text-[var(--ink-4)]">
                    {tc("misc.noData")}
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </TabsContent>

        {/* ── TAB : Financier ──────────────────────────────────────────── */}
        <TabsContent value="financier">
          <div className="space-y-5">

            {/* Résumé financier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total payé", value: formatCurrency(totalPaye), icon: CheckCircle2, color: "text-[var(--success)]", bg: "bg-[var(--success-light)]" },
                { label: t("students.columns.balance"), value: student.solde > 0 ? formatCurrency(student.solde) : "Soldé", icon: student.solde > 0 ? AlertTriangle : CheckCircle2, color: student.solde > 0 ? "text-[var(--danger)]" : "text-[var(--success)]", bg: student.solde > 0 ? "bg-[var(--danger-light)]" : "bg-[var(--success-light)]" },
                { label: "Frais totaux", value: formatCurrency(fraisTotal), icon: CreditCard, color: "text-[var(--blue)]", bg: "bg-[var(--blue-light)]" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label}>
                  <CardContent className="flex items-center gap-3 pt-4 pb-4">
                    <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0", bg)}>
                      <Icon className={cn("w-5 h-5", color)} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-5)]">{label}</div>
                      <div className={cn("text-[16px] font-bold", color)}>{value}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Historique paiements */}
            <Card>
              <CardHeader><CardTitle>Historique des paiements</CardTitle></CardHeader>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-[var(--ivory)]">
                        {["Réf.", tc("fields.type"), "Montant", "Mode", tc("fields.date"), tc("fields.status")].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--blue)] font-semibold">{p.ref}</td>
                          <td className="px-3 py-2.5 text-[var(--ink)]">{p.type}</td>
                          <td className="px-3 py-2.5 font-bold text-[var(--ink)]">{formatCurrency(p.montant)}</td>
                          <td className="px-3 py-2.5 text-[var(--ink-3)]">{p.mode}</td>
                          <td className="px-3 py-2.5 text-[var(--ink-3)]">{formatDate(p.date)}</td>
                          <td className="px-3 py-2.5"><StatutBadge statut={p.statut} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <CardContent className="py-8 text-center text-[12px] text-[var(--ink-4)]">
                  {tc("misc.noData")}
                </CardContent>
              )}
            </Card>

            {/* Moratorium */}
            {morat && (
              <Card>
                <CardHeader>
                  <CardTitle>Moratorium</CardTitle>
                  <StatutBadge statut={morat.statut} />
                </CardHeader>
                <CardContent>
                  {/* Progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11.5px] mb-1.5">
                      <span className="text-[var(--ink-4)]">Progression du remboursement</span>
                      <span className="font-semibold text-[var(--ink)]">
                        {formatCurrency(morat.montantPaye)} / {formatCurrency(morat.montantTotal)}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] rounded-full transition-all"
                        style={{ width: `${Math.round((morat.montantPaye / morat.montantTotal) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10.5px] text-[var(--ink-4)] mt-1 text-right">
                      {Math.round((morat.montantPaye / morat.montantTotal) * 100)}% remboursé
                    </div>
                  </div>

                  {/* Échéances */}
                  <div className="space-y-2">
                    {morat.echeances.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--ivory)]">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            e.statut === "Payé" ? "bg-[var(--success)]" :
                            e.statut === "En retard" ? "bg-[var(--danger)]" :
                            "bg-[var(--ink-5)]"
                          )} />
                          <div>
                            <div className="text-[12px] font-medium text-[var(--ink)]">Échéance {i + 1}</div>
                            <div className="text-[10.5px] text-[var(--ink-4)]">{formatDate(e.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[12px] text-[var(--ink)]">{formatCurrency(e.mont)}</span>
                          <StatutBadge statut={e.statut} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ── TAB : Bibliothèque ───────────────────────────────────────── */}
        <TabsContent value="bibliotheque">
          <Card>
            <CardHeader>
              <CardTitle>Emprunts bibliothèque</CardTitle>
              <span className="text-[11px] text-[var(--ink-4)]">{emprunts.length} emprunt(s)</span>
            </CardHeader>
            {emprunts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-[var(--ivory)]">
                      {["Ouvrage", "Emprunté le", "Retour prévu", "Retour réel", tc("fields.status")].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {emprunts.map(e => {
                      const livre = LIVRES.find(l => l.id === e.livreId);
                      return (
                        <tr key={e.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-[var(--ink)]">{livre?.titre ?? e.livreId}</div>
                            <div className="text-[10.5px] text-[var(--ink-4)]">{livre?.auteur}</div>
                          </td>
                          <td className="px-3 py-2.5 text-[var(--ink-3)]">{formatDate(e.dateEmprunt)}</td>
                          <td className="px-3 py-2.5 text-[var(--ink-3)]">{formatDate(e.dateRetourPrevu)}</td>
                          <td className="px-3 py-2.5 text-[var(--ink-3)]">{e.dateRetourReel ? formatDate(e.dateRetourReel) : "—"}</td>
                          <td className="px-3 py-2.5"><StatutBadge statut={e.statut} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <CardContent className="py-8 text-center text-[12px] text-[var(--ink-4)]">
                {tc("misc.noData")}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* ── TAB : Documents ──────────────────────────────────────────── */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents du dossier</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="w-3.5 h-3.5" /> {tc("actions.add")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { nom: "Acte de naissance", type: "Civil", date: student.created, statut: "Reçu" },
                  { nom: "Baccalauréat", type: "Académique", date: student.created, statut: "Reçu" },
                  { nom: "Photo d'identité", type: "Identité", date: student.created, statut: "Reçu" },
                  { nom: "Contrat de scolarité", type: "Administratif", date: student.created, statut: "Signé" },
                  { nom: "Relevé de notes antérieur", type: "Académique", date: student.created, statut: student.notes ? "Reçu" : "Manquant" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-[10px] border border-[var(--line)] hover:bg-[var(--blue-lighter)] transition-colors">
                    <div className="w-9 h-9 rounded-[8px] bg-[var(--blue-light)] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[var(--blue)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold text-[var(--ink)] truncate">{doc.nom}</div>
                      <div className="text-[10.5px] text-[var(--ink-4)]">{doc.type} · Ajouté le {formatDate(doc.date)}</div>
                    </div>
                    <StatutBadge statut={doc.statut} />
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
