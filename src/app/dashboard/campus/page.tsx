"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus, Pencil, Trash2, Building2, MapPin, Phone, Mail,
  Users, School, GraduationCap, ArrowRightLeft, AlertTriangle,
  CheckCircle2, ChevronRight, Star, BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { Campus, TransfertEleve } from "@/types";

// ── Mock data ─────────────────────────────────────────────────────────────────
const INIT_CAMPUS: Campus[] = [
  {
    id: "camp-1", code: "PRINC", lib: "Campus Principal", type: "Principal",
    adresse: "Avenue de l'Indépendance, Centre-Ville", ville: "Yaoundé",
    tel: "+237 222 000 001", email: "principal@edustar.cm",
    directeur: "Dr. NKOMO Pierre", statut: "Actif",
    effectif: 391, nbClasses: 14, nbEnseignants: 32,
    couleur: "#1a3c8f", sessionActive: "2025–2026",
  },
  {
    id: "camp-2", code: "NORD", lib: "Annexe Nord", type: "Annexe",
    adresse: "Rue du Commerce, Bafoussam", ville: "Bafoussam",
    tel: "+237 233 000 002", email: "nord@edustar.cm",
    directeur: "Mme. TCHINDA Rose", statut: "Actif",
    effectif: 214, nbClasses: 8, nbEnseignants: 18,
    couleur: "#0099cc", sessionActive: "2025–2026",
  },
  {
    id: "camp-3", code: "SUD", lib: "Annexe Sud", type: "Annexe",
    adresse: "Boulevard de la Liberté, Akwa", ville: "Douala",
    tel: "+237 233 000 003", email: "sud@edustar.cm",
    directeur: "M. MBARGA Alain", statut: "Actif",
    effectif: 178, nbClasses: 7, nbEnseignants: 15,
    couleur: "#6b48ff", sessionActive: "2025–2026",
  },
  {
    id: "camp-4", code: "PART-GAR", lib: "École Partenaire Garoua", type: "Partenaire",
    adresse: "Quartier Administratif", ville: "Garoua",
    tel: "+237 222 000 004", email: "garoua@edustar-partner.cm",
    directeur: "M. HAMIDOU Ibrahim", statut: "Inactif",
    effectif: 89, nbClasses: 4, nbEnseignants: 9,
    couleur: "#0a7c4e", sessionActive: "2024–2025",
  },
];

const MOCK_STUDENTS = [
  { code: "ETU-001", nom: "ESSOMBA Marie-Claire", campus: "camp-1" },
  { code: "ETU-002", nom: "FOFACK Jean", campus: "camp-1" },
  { code: "ETU-003", nom: "KAMGA Paul", campus: "camp-2" },
  { code: "ETU-004", nom: "NGUEMO Laure", campus: "camp-3" },
  { code: "ETU-005", nom: "BELLO Adamou", campus: "camp-4" },
];

const INIT_TRANSFERTS: TransfertEleve[] = [
  { id: "tr-1", etuCode: "ETU-012", etuNom: "DJEMBA Lionel", campusSourceId: "camp-2", campusDestId: "camp-1", date: "2025-03-10", motif: "Rapprochement familial", statut: "Approuvé", approvedBy: "Admin" },
  { id: "tr-2", etuCode: "ETU-008", etuNom: "SONG Carole", campusSourceId: "camp-1", campusDestId: "camp-3", date: "2025-04-15", motif: "Changement de domicile", statut: "En attente" },
  { id: "tr-3", etuCode: "ETU-021", etuNom: "METO Richard", campusSourceId: "camp-3", campusDestId: "camp-2", date: "2025-05-02", motif: "Choix de filière", statut: "Rejeté" },
];

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}

function typeBadge(t: Campus["type"]) {
  const map: Record<Campus["type"], "blue" | "cyan" | "purple" | "green"> = {
    Principal: "blue", Annexe: "cyan", Partenaire: "green",
  };
  return map[t] ?? "neutral" as never;
}

function statutColor(s: Campus["statut"]) {
  return s === "Actif" ? "text-[var(--success)]" : "text-[var(--ink-4)]";
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-medium text-[var(--ink-3)] w-8 text-right">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CampusPage() {
  const { t } = useTranslation("administration");
  const toast = useToast();
  const [campus, setCampus] = useState<Campus[]>(INIT_CAMPUS);
  const [transferts, setTransferts] = useState<TransfertEleve[]>(INIT_TRANSFERTS);
  const [activeId, setActiveId] = useState("camp-1");

  const [campusDlg, setCampusDlg] = useState<{ open: boolean; data: Campus | null }>({ open: false, data: null });
  const [deleteDlg, setDeleteDlg] = useState<Campus | null>(null);
  const [transferDlg, setTransferDlg] = useState(false);
  const [switchDlg, setSwitchDlg] = useState<Campus | null>(null);

  const activeCampus = campus.find(c => c.id === activeId);
  const actifs = campus.filter(c => c.statut === "Actif");
  const totalEffectif = campus.reduce((s, c) => s + c.effectif, 0);
  const totalClasses = campus.reduce((s, c) => s + c.nbClasses, 0);
  const totalEns = campus.reduce((s, c) => s + c.nbEnseignants, 0);
  const maxEffectif = Math.max(...campus.map(c => c.effectif));

  const saveCampus = (data: Omit<Campus, "id">) => {
    if (!data.code || !data.lib) { toast(t("campus.toasts.codeRequired"), "error"); return; }
    if (campusDlg.data) {
      setCampus(p => p.map(c => c.id === campusDlg.data!.id ? { ...c, ...data } : c));
      toast(t("campus.toasts.modified"), "success");
    } else {
      setCampus(p => [...p, { ...data, id: uid() }]);
      toast(t("campus.toasts.added"), "success");
    }
    setCampusDlg({ open: false, data: null });
  };

  const deleteCampus = (id: string) => {
    if (id === activeId) { toast(t("campus.toasts.cannotDelete"), "error"); setDeleteDlg(null); return; }
    setCampus(p => p.filter(c => c.id !== id));
    setTransferts(p => p.filter(tr => tr.campusSourceId !== id && tr.campusDestId !== id));
    setDeleteDlg(null);
    toast(t("campus.toasts.deleted"), "info");
  };

  const switchContext = (id: string) => {
    setActiveId(id);
    setSwitchDlg(null);
    toast(t("campus.toasts.switched", { name: campus.find(c => c.id === id)?.lib }), "success");
  };

  const approveTransfert = (id: string) => {
    setTransferts(p => p.map(tr => tr.id === id ? { ...tr, statut: "Approuvé" as const, approvedBy: "Admin" } : tr));
    toast(t("campus.toasts.transferApproved"), "success");
  };

  const rejectTransfert = (id: string) => {
    setTransferts(p => p.map(tr => tr.id === id ? { ...tr, statut: "Rejeté" as const } : tr));
    toast(t("campus.toasts.transferRejected"), "info");
  };

  return (
    <div>
      <PageHeader
        title={t("campus.networkTitle")}
        subtitle={t("campus.networkSubtitle", { count: campus.length, active: actifs.length, total: totalEffectif.toLocaleString("fr-FR") })}
        actions={
          <Button size="sm" onClick={() => setCampusDlg({ open: true, data: null })}>
            <Plus className="w-3.5 h-3.5" /> {t("campus.addCampus")}
          </Button>
        }
      />

      {/* Context banner */}
      {activeCampus && (
        <div className="flex items-center gap-3 p-3 mb-5 bg-[var(--blue-lighter)] border border-[var(--blue-light)] rounded-[10px]">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: activeCampus.couleur }} />
          <span className="text-[12.5px] text-[var(--ink-2)]">
            {t("campus.activeContext")} <strong>{activeCampus.lib}</strong> — {activeCampus.ville}
          </span>
          <button
            onClick={() => setSwitchDlg(campus.find(c => c.id !== activeId && c.statut === "Actif") ?? null)}
            className="ml-auto text-[11.5px] text-[var(--blue)] font-medium flex items-center gap-1 hover:underline"
          >
            {t("campus.switchBtn")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("campus.kpi.activeCampuses"), value: actifs.length, icon: Building2, color: "var(--blue)" },
          { label: t("campus.kpi.totalStudents"), value: totalEffectif.toLocaleString("fr-FR"), icon: GraduationCap, color: "var(--cyan)" },
          { label: t("campus.kpi.totalClasses"), value: totalClasses, icon: School, color: "var(--purple)" },
          { label: t("campus.kpi.totalTeachers"), value: totalEns, icon: Users, color: "var(--success)" },
        ].map(kpi => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[11.5px] text-[var(--ink-4)]">{kpi.label}</div>
              <div className="w-7 h-7 rounded-[7px] flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${kpi.color} 12%, white)` }}>
                <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-[22px] font-bold text-[var(--ink)]" style={{ color: kpi.color }}>{kpi.value}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="vue">
        <TabsList>
          <TabsTrigger value="vue"><Building2 className="w-3.5 h-3.5" />{t("campus.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="w-3.5 h-3.5" />{t("campus.tabs.stats")}</TabsTrigger>
          <TabsTrigger value="transferts"><ArrowRightLeft className="w-3.5 h-3.5" />{t("campus.tabs.transfers")} ({transferts.filter(tr => tr.statut === "En attente").length})</TabsTrigger>
        </TabsList>

        {/* ── VUE D'ENSEMBLE ─────────────────────────────────────────────── */}
        <TabsContent value="vue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {campus.map(c => {
              const isActive = c.id === activeId;
              return (
                <Card key={c.id} className={`overflow-hidden transition-all ${isActive ? "ring-2 ring-[var(--blue)] shadow-md" : ""}`}>
                  <div className="flex items-stretch">
                    {/* Color stripe */}
                    <div className="w-1 shrink-0" style={{ backgroundColor: c.couleur }} />

                    <div className="flex-1 p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            {isActive && <Star className="w-3.5 h-3.5 fill-[var(--blue)] text-[var(--blue)]" />}
                            <span className="font-serif text-[15px] font-semibold text-[var(--ink)]">{c.lib}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <EduBadge variant={typeBadge(c.type)}>{c.type}</EduBadge>
                            <span className={`flex items-center gap-1 text-[11px] font-medium ${statutColor(c.statut)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${c.statut === "Actif" ? "bg-[var(--success)]" : "bg-[var(--ink-5)]"}`} />
                              {c.statut}
                            </span>
                            <span className="text-[11px] text-[var(--ink-4)]">Session {c.sessionActive}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setCampusDlg({ open: true, data: c })} className="p-1.5 rounded-[6px] text-[var(--ink-4)] hover:text-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {!isActive && (
                            <button onClick={() => setDeleteDlg(c)} className="p-1.5 rounded-[6px] text-[var(--ink-4)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5 mb-3">
                        <InfoRow icon={<MapPin className="w-3 h-3" />} text={`${c.adresse}, ${c.ville}`} />
                        <InfoRow icon={<Phone className="w-3 h-3" />} text={c.tel} />
                        <InfoRow icon={<Mail className="w-3 h-3" />} text={c.email} />
                        <InfoRow icon={<Users className="w-3 h-3" />} text={`${t("campus.director")} ${c.directeur}`} />
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 py-3 border-t border-[var(--line)]">
                        {[
                          { label: t("campus.tableCol.students"), value: c.effectif, color: "var(--blue)" },
                          { label: t("campus.tableCol.classes"), value: c.nbClasses, color: "var(--cyan)" },
                          { label: t("campus.tableCol.teachers"), value: c.nbEnseignants, color: "var(--purple)" },
                        ].map(m => (
                          <div key={m.label} className="text-center flex-1">
                            <div className="text-[18px] font-bold" style={{ color: m.color }}>{m.value}</div>
                            <div className="text-[10.5px] text-[var(--ink-4)]">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        {!isActive && c.statut === "Actif" && (
                          <Button size="sm" variant="outline" onClick={() => switchContext(c.id)}>
                            <ArrowRightLeft className="w-3.5 h-3.5" /> {t("campus.switchTo")}
                          </Button>
                        )}
                        {isActive && (
                          <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--blue)] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {t("campus.isActive")}
                          </span>
                        )}
                        <button
                          onClick={() => setTransferDlg(true)}
                          className="ml-auto text-[11.5px] text-[var(--ink-4)] hover:text-[var(--ink-2)] flex items-center gap-1 transition-colors"
                        >
                          {t("campus.transferLink")} <ArrowRightLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── STATISTIQUES COMPARATIVES ────────────────────────────────────── */}
        <TabsContent value="stats">
          <div className="space-y-5">
            {/* Summary table */}
            <Card className="overflow-hidden">
              <div className="border-b border-[var(--line)] bg-[var(--ivory)] px-4 py-2.5">
                <span className="text-[11px] font-semibold text-[var(--ink-3)]">{t("campus.compareTable")}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--ivory)]">
                      <th className="text-left px-4 py-2.5 font-medium text-[var(--ink-3)]">{t("campus.tableCol.establishment")}</th>
                      <th className="text-left px-4 py-2.5 font-medium text-[var(--ink-3)]">{t("campus.tableCol.type")}</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)]">{t("campus.tableCol.city")}</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[160px]">{t("campus.tableCol.students")}</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[130px]">{t("campus.tableCol.classes")}</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[140px]">{t("campus.tableCol.teachers")}</th>
                      <th className="text-center px-4 py-2.5 font-medium text-[var(--ink-3)]">{t("campus.tableCol.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...campus].sort((a, b) => b.effectif - a.effectif).map((c, i) => (
                      <tr key={c.id} className={`border-b border-[var(--line)] last:border-0 ${i % 2 ? "bg-[var(--ivory)]" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.couleur }} />
                            <span className="font-semibold text-[var(--ink)]">{c.lib}</span>
                            {c.id === activeId && <Star className="w-3 h-3 fill-[var(--blue)] text-[var(--blue)]" />}
                          </div>
                        </td>
                        <td className="px-4 py-3"><EduBadge variant={typeBadge(c.type)}>{c.type}</EduBadge></td>
                        <td className="px-4 py-3 text-[var(--ink-3)]">{c.ville}</td>
                        <td className="px-4 py-3"><Bar value={c.effectif} max={maxEffectif} color={c.couleur} /></td>
                        <td className="px-4 py-3"><Bar value={c.nbClasses} max={Math.max(...campus.map(x => x.nbClasses))} color={c.couleur} /></td>
                        <td className="px-4 py-3"><Bar value={c.nbEnseignants} max={Math.max(...campus.map(x => x.nbEnseignants))} color={c.couleur} /></td>
                        <td className="px-4 py-3 text-center">
                          <span className={`flex items-center justify-center gap-1 text-[11.5px] font-medium ${statutColor(c.statut)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.statut === "Actif" ? "bg-[var(--success)]" : "bg-[var(--ink-5)]"}`} />
                            {c.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[var(--blue-lighter)] border-t-2 border-[var(--blue-light)]">
                      <td colSpan={3} className="px-4 py-2.5 font-bold text-[var(--ink-2)] text-[12px]">{t("campus.networkTotal")}</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalEffectif.toLocaleString("fr-FR")} {t("campus.studentsUnit")}</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalClasses} {t("campus.classesUnit")}</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalEns} {t("campus.teachersUnit")}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>

            {/* Visual share bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t("campus.distribution.students"), key: "effectif" as keyof Campus },
                { label: t("campus.distribution.classes"), key: "nbClasses" as keyof Campus },
                { label: t("campus.distribution.teachers"), key: "nbEnseignants" as keyof Campus },
              ].map(({ label, key }) => {
                const total = campus.reduce((s, c) => s + (c[key] as number), 0);
                return (
                  <Card key={key} className="p-4">
                    <div className="text-[12px] font-semibold text-[var(--ink)] mb-3">{label}</div>
                    <div className="space-y-2.5">
                      {campus.map(c => {
                        const pct = total > 0 ? ((c[key] as number) / total * 100).toFixed(1) : "0";
                        return (
                          <div key={c.id}>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="text-[var(--ink-3)] truncate max-w-[130px]">{c.lib}</span>
                              <span className="font-medium text-[var(--ink)]">{pct}%</span>
                            </div>
                            <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: c.couleur }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ── TRANSFERTS ───────────────────────────────────────────────────── */}
        <TabsContent value="transferts">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">{t("campus.transfers.title")}</p>
              <p className="text-[12px] text-[var(--ink-4)]">{t("campus.transfers.subtitle")}</p>
            </div>
            <Button size="sm" onClick={() => setTransferDlg(true)}>
              <ArrowRightLeft className="w-3.5 h-3.5" /> {t("campus.transfers.newTransfer")}
            </Button>
          </div>

          {/* Pending alert */}
          {transferts.filter(tr => tr.statut === "En attente").length > 0 && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-[var(--warning-light)] border border-[rgba(180,83,9,0.2)] rounded-[10px] text-[12px] text-[var(--warning)]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span><strong>{transferts.filter(tr => tr.statut === "En attente").length}</strong> {t("campus.transfers.pendingAlert", { count: transferts.filter(tr => tr.statut === "En attente").length })}</span>
            </div>
          )}

          <div className="border border-[var(--line)] rounded-[10px] overflow-hidden">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[var(--ivory)] border-b border-[var(--line)]">
                  {[
                    t("campus.transfers.columns.student"),
                    t("campus.transfers.columns.from"),
                    t("campus.transfers.columns.to"),
                    t("campus.transfers.columns.date"),
                    t("campus.transfers.columns.reason"),
                    t("campus.transfers.columns.status"),
                    "",
                  ].map((h, i) => (
                    <th key={i} className={`px-3 py-2.5 font-medium text-[var(--ink-3)] ${h === "" || i === 5 ? "text-center" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferts.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-[var(--ink-4)]">{t("campus.transfers.noRecords")}</td></tr>
                )}
                {transferts.map((tr, i) => {
                  const src = campus.find(c => c.id === tr.campusSourceId);
                  const dst = campus.find(c => c.id === tr.campusDestId);
                  const badgeMap: Record<TransfertEleve["statut"], "green" | "amber" | "red"> = {
                    "Approuvé": "green", "En attente": "amber", "Rejeté": "red",
                  };
                  return (
                    <tr key={tr.id} className={`border-b border-[var(--line)] last:border-0 ${i % 2 ? "bg-[var(--ivory)]" : ""}`}>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-[var(--ink)]">{tr.etuNom}</div>
                        <div className="text-[11px] text-[var(--ink-4)] font-mono">{tr.etuCode}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: src?.couleur ?? "#ccc" }} />
                          <span className="text-[var(--ink-3)]">{src?.lib ?? tr.campusSourceId}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dst?.couleur ?? "#ccc" }} />
                          <span className="text-[var(--ink-3)]">{dst?.lib ?? tr.campusDestId}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--ink-3)]">{new Date(tr.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-3 py-2.5 max-w-[160px] truncate text-[var(--ink-3)] text-[11.5px]">{tr.motif}</td>
                      <td className="px-3 py-2.5 text-center">
                        <EduBadge variant={badgeMap[tr.statut]}>{tr.statut}</EduBadge>
                      </td>
                      <td className="px-3 py-2.5">
                        {tr.statut === "En attente" && (
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => approveTransfert(tr.id)} className="p-1.5 rounded-[6px] text-[var(--success)] hover:bg-[var(--success-light)] transition-colors" title="Approuver">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => rejectTransfert(tr.id)} className="p-1.5 rounded-[6px] text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors" title="Rejeter">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ DIALOGS ════════════════════════════════════════════════════════ */}

      <CampusDialog
        key={`camp-${campusDlg.open}-${campusDlg.data?.id}`}
        open={campusDlg.open}
        initial={campusDlg.data}
        onSave={saveCampus}
        onClose={() => setCampusDlg({ open: false, data: null })}
      />

      {/* Delete confirm */}
      <Dialog open={!!deleteDlg} onOpenChange={() => setDeleteDlg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("campus.deleteDlg.title")}</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex items-start gap-3 p-4 bg-[var(--danger-light)] border border-[rgba(192,57,43,0.2)] rounded-[10px]">
              <AlertTriangle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[13px] text-[var(--danger)] mb-1">{t("campus.deleteDlg.warning")}</div>
                <p className="text-[12.5px] text-[var(--ink-2)]">
                  {t("campus.deleteDlg.message", { name: deleteDlg?.lib })}
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDlg(null)}>{t("actions.cancel", { ns: "common" })}</Button>
            <Button variant="danger" size="sm" onClick={() => deleteDlg && deleteCampus(deleteDlg.id)}>
              <Trash2 className="w-3.5 h-3.5" /> {t("actions.delete", { ns: "common" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch context */}
      <Dialog open={!!switchDlg} onOpenChange={() => setSwitchDlg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("campus.switchDlg.title")}</DialogTitle></DialogHeader>
          <DialogBody>
            <p className="text-[12.5px] text-[var(--ink-3)] mb-4">{t("campus.switchDlg.subtitle")}</p>
            <div className="space-y-2">
              {campus.filter(c => c.id !== activeId && c.statut === "Actif").map(c => (
                <button
                  key={c.id}
                  onClick={() => switchContext(c.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] border border-[var(--line)] hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-all text-left"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.couleur }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[13px] text-[var(--ink)]">{c.lib}</div>
                    <div className="text-[11px] text-[var(--ink-4)]">{c.ville} · {c.effectif} {t("campus.studentsUnit")}</div>
                  </div>
                  <EduBadge variant={typeBadge(c.type)}>{c.type}</EduBadge>
                </button>
              ))}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSwitchDlg(null)}>{t("actions.cancel", { ns: "common" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfert dialog */}
      <TransfertDialog
        key={`tr-${transferDlg}`}
        open={transferDlg}
        campus={campus}
        students={MOCK_STUDENTS}
        onSave={(data) => {
          setTransferts(p => [...p, { ...data, id: uid(), statut: "En attente" }]);
          setTransferDlg(false);
          toast(t("campus.toasts.transferPending"), "success");
        }}
        onClose={() => setTransferDlg(false)}
      />
    </div>
  );
}

// ── Micro helpers ─────────────────────────────────────────────────────────────
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--ink-3)]">
      <span className="text-[var(--ink-4)] shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

// ── CampusDialog ──────────────────────────────────────────────────────────────
const COULEURS_PRESET = [
  { label: "Bleu", value: "#1a3c8f" },
  { label: "Cyan", value: "#0099cc" },
  { label: "Violet", value: "#6b48ff" },
  { label: "Vert", value: "#0a7c4e" },
  { label: "Ambre", value: "#b45309" },
  { label: "Rouge", value: "#c0392b" },
];

function CampusDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial: Campus | null;
  onSave: (d: Omit<Campus, "id">) => void; onClose: () => void;
}) {
  const { t } = useTranslation("administration");
  const blank: Omit<Campus, "id"> = { code: "", lib: "", type: "Annexe", adresse: "", ville: "", tel: "", email: "", directeur: "", statut: "Actif", effectif: 0, nbClasses: 0, nbEnseignants: 0, couleur: "#0099cc", sessionActive: "2025–2026" };
  const [form, setForm] = useState<Omit<Campus, "id">>(initial ? { ...initial } : blank);
  useEffect(() => { if (open) setForm(initial ? { ...initial } : blank); }, [open]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? t("campus.dialog.editTitle") : t("campus.dialog.newTitle")}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("campus.dialog.fields.code")}><Input placeholder={t("campus.dialog.codePlaceholder")} value={form.code} onChange={set("code")} /></Field>
              <Field label={t("campus.dialog.fields.type")}>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as Campus["type"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">{t("campus.types.Principal")}</SelectItem>
                    <SelectItem value="Annexe">{t("campus.types.Annexe")}</SelectItem>
                    <SelectItem value="Partenaire">{t("campus.types.Partenaire")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label={t("campus.dialog.fields.name")}><Input placeholder={t("campus.dialog.namePlaceholder")} value={form.lib} onChange={set("lib")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("campus.dialog.fields.city")}><Input placeholder={t("campus.dialog.cityPlaceholder")} value={form.ville} onChange={set("ville")} /></Field>
              <Field label={t("campus.dialog.fields.address")}><Input placeholder={t("campus.dialog.addressPlaceholder")} value={form.adresse} onChange={set("adresse")} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("campus.dialog.fields.phone")}><Input placeholder={t("campus.dialog.phonePlaceholder")} value={form.tel} onChange={set("tel")} /></Field>
              <Field label={t("campus.dialog.fields.email")}><Input type="email" placeholder={t("campus.dialog.emailPlaceholder")} value={form.email} onChange={set("email")} /></Field>
            </div>
            <Field label={t("campus.dialog.fields.director")}><Input placeholder={t("campus.dialog.directorPlaceholder")} value={form.directeur} onChange={set("directeur")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("campus.dialog.fields.status")}>
                <Select value={form.statut} onValueChange={v => setForm(p => ({ ...p, statut: v as Campus["statut"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">{t("status.active", { ns: "common" })}</SelectItem>
                    <SelectItem value="Inactif">{t("status.inactive", { ns: "common" })}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={t("campus.dialog.fields.session")}><Input placeholder={t("campus.dialog.sessionPlaceholder")} value={form.sessionActive} onChange={set("sessionActive")} /></Field>
            </div>
            <div>
              <Label>{t("campus.dialog.fields.color")}</Label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {COULEURS_PRESET.map(c => (
                  <button
                    key={c.value}
                    title={c.label}
                    onClick={() => setForm(p => ({ ...p, couleur: c.value }))}
                    className={`w-7 h-7 rounded-full transition-all ${form.couleur === c.value ? "ring-2 ring-offset-2 ring-[var(--ink-2)] scale-110" : "opacity-70 hover:opacity-100"}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>{t("actions.cancel", { ns: "common" })}</Button>
          <Button size="sm" onClick={() => onSave(form)}>{initial ? t("actions.save", { ns: "common" }) : t("actions.add", { ns: "common" })}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── TransfertDialog ───────────────────────────────────────────────────────────
function TransfertDialog({ open, campus, students, onSave, onClose }: {
  open: boolean;
  campus: Campus[];
  students: { code: string; nom: string; campus: string }[];
  onSave: (d: Omit<TransfertEleve, "id" | "statut">) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation("administration");
  const [form, setForm] = useState({ etuCode: "", etuNom: "", campusSourceId: "", campusDestId: "", date: new Date().toISOString().slice(0, 10), motif: "" });
  useEffect(() => {
    if (open) setForm({ etuCode: "", etuNom: "", campusSourceId: campus[0]?.id ?? "", campusDestId: campus[1]?.id ?? "", date: new Date().toISOString().slice(0, 10), motif: "" });
  }, [open]);
  const toast = useToast();
  const handleStudentSelect = (code: string) => {
    const stu = students.find(s => s.code === code);
    setForm(p => ({ ...p, etuCode: code, etuNom: stu?.nom ?? "", campusSourceId: stu?.campus ?? p.campusSourceId }));
  };
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("campus.transferDialog.title")}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <Field label={t("campus.transferDialog.fields.student")}>
              <Select value={form.etuCode} onValueChange={handleStudentSelect}>
                <SelectTrigger><SelectValue placeholder={t("campus.transferDialog.studentPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  {students.map(s => <SelectItem key={s.code} value={s.code}>{s.nom} ({s.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("campus.transferDialog.fields.source")}>
                <Select value={form.campusSourceId} onValueChange={v => setForm(p => ({ ...p, campusSourceId: v }))}>
                  <SelectTrigger><SelectValue placeholder={t("campus.transferDialog.sourcePlaceholder")} /></SelectTrigger>
                  <SelectContent>{campus.map(c => <SelectItem key={c.id} value={c.id}>{c.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label={t("campus.transferDialog.fields.dest")}>
                <Select value={form.campusDestId} onValueChange={v => setForm(p => ({ ...p, campusDestId: v }))}>
                  <SelectTrigger><SelectValue placeholder={t("campus.transferDialog.destPlaceholder")} /></SelectTrigger>
                  <SelectContent>{campus.filter(c => c.id !== form.campusSourceId).map(c => <SelectItem key={c.id} value={c.id}>{c.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label={t("campus.transferDialog.fields.date")}><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></Field>
            <Field label={t("campus.transferDialog.fields.reason")}><Input placeholder={t("campus.transferDialog.reasonPlaceholder")} value={form.motif} onChange={e => setForm(p => ({ ...p, motif: e.target.value }))} /></Field>
            <div className="flex items-start gap-2 p-3 bg-[var(--blue-lighter)] border border-[var(--blue-light)] rounded-[8px] text-[11.5px] text-[var(--ink-2)]">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--blue)] shrink-0 mt-0.5" />
              {t("campus.transferDialog.notice")}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>{t("actions.cancel", { ns: "common" })}</Button>
          <Button size="sm" onClick={() => {
            if (!form.etuCode || !form.campusSourceId || !form.campusDestId || !form.motif) { toast(t("campus.errors.requiredFields"), "error"); return; }
            if (form.campusSourceId === form.campusDestId) { toast(t("campus.errors.sameLocation"), "error"); return; }
            onSave(form);
          }}>
            <ArrowRightLeft className="w-3.5 h-3.5" /> {t("campus.transferDialog.submitBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
