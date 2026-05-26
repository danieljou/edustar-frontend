"use client";
import { useState, useEffect } from "react";
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
    if (!data.code || !data.lib) { toast("Code et nom requis.", "error"); return; }
    if (campusDlg.data) {
      setCampus(p => p.map(c => c.id === campusDlg.data!.id ? { ...c, ...data } : c));
      toast("Établissement modifié.", "success");
    } else {
      setCampus(p => [...p, { ...data, id: uid() }]);
      toast("Établissement ajouté.", "success");
    }
    setCampusDlg({ open: false, data: null });
  };

  const deleteCampus = (id: string) => {
    if (id === activeId) { toast("Impossible de supprimer l'établissement actif.", "error"); setDeleteDlg(null); return; }
    setCampus(p => p.filter(c => c.id !== id));
    setTransferts(p => p.filter(t => t.campusSourceId !== id && t.campusDestId !== id));
    setDeleteDlg(null);
    toast("Établissement supprimé.", "info");
  };

  const switchContext = (id: string) => {
    setActiveId(id);
    setSwitchDlg(null);
    toast(`Contexte basculé sur : ${campus.find(c => c.id === id)?.lib}`, "success");
  };

  const approveTransfert = (id: string) => {
    setTransferts(p => p.map(t => t.id === id ? { ...t, statut: "Approuvé" as const, approvedBy: "Admin" } : t));
    toast("Transfert approuvé.", "success");
  };

  const rejectTransfert = (id: string) => {
    setTransferts(p => p.map(t => t.id === id ? { ...t, statut: "Rejeté" as const } : t));
    toast("Transfert rejeté.", "info");
  };

  return (
    <div>
      <PageHeader
        title="Réseau d'établissements"
        subtitle={`${campus.length} établissements · ${actifs.length} actifs · ${totalEffectif.toLocaleString("fr-FR")} élèves au total`}
        actions={
          <Button size="sm" onClick={() => setCampusDlg({ open: true, data: null })}>
            <Plus className="w-3.5 h-3.5" /> Ajouter un établissement
          </Button>
        }
      />

      {/* Context banner */}
      {activeCampus && (
        <div className="flex items-center gap-3 p-3 mb-5 bg-[var(--blue-lighter)] border border-[var(--blue-light)] rounded-[10px]">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: activeCampus.couleur }} />
          <span className="text-[12.5px] text-[var(--ink-2)]">
            Contexte actif : <strong>{activeCampus.lib}</strong> — {activeCampus.ville}
          </span>
          <button
            onClick={() => setSwitchDlg(campus.find(c => c.id !== activeId && c.statut === "Actif") ?? null)}
            className="ml-auto text-[11.5px] text-[var(--blue)] font-medium flex items-center gap-1 hover:underline"
          >
            Changer <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Établissements actifs", value: actifs.length, icon: Building2, color: "var(--blue)" },
          { label: "Élèves total", value: totalEffectif.toLocaleString("fr-FR"), icon: GraduationCap, color: "var(--cyan)" },
          { label: "Classes total", value: totalClasses, icon: School, color: "var(--purple)" },
          { label: "Enseignants total", value: totalEns, icon: Users, color: "var(--success)" },
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
          <TabsTrigger value="vue"><Building2 className="w-3.5 h-3.5" />Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="w-3.5 h-3.5" />Statistiques comparatives</TabsTrigger>
          <TabsTrigger value="transferts"><ArrowRightLeft className="w-3.5 h-3.5" />Transferts ({transferts.filter(t => t.statut === "En attente").length})</TabsTrigger>
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
                        <InfoRow icon={<Users className="w-3 h-3" />} text={`Directeur : ${c.directeur}`} />
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 py-3 border-t border-[var(--line)]">
                        {[
                          { label: "Élèves", value: c.effectif, color: "var(--blue)" },
                          { label: "Classes", value: c.nbClasses, color: "var(--cyan)" },
                          { label: "Enseignants", value: c.nbEnseignants, color: "var(--purple)" },
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
                            <ArrowRightLeft className="w-3.5 h-3.5" /> Basculer vers cet établissement
                          </Button>
                        )}
                        {isActive && (
                          <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--blue)] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Établissement actif
                          </span>
                        )}
                        <button
                          onClick={() => setTransferDlg(true)}
                          className="ml-auto text-[11.5px] text-[var(--ink-4)] hover:text-[var(--ink-2)] flex items-center gap-1 transition-colors"
                        >
                          Transfert d'élèves <ArrowRightLeft className="w-3 h-3" />
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
                <span className="text-[11px] font-semibold text-[var(--ink-3)]">Tableau comparatif — Session 2025–2026</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--ivory)]">
                      <th className="text-left px-4 py-2.5 font-medium text-[var(--ink-3)]">Établissement</th>
                      <th className="text-left px-4 py-2.5 font-medium text-[var(--ink-3)]">Type</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)]">Ville</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[160px]">Élèves</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[130px]">Classes</th>
                      <th className="px-4 py-2.5 font-medium text-[var(--ink-3)] w-[140px]">Enseignants</th>
                      <th className="text-center px-4 py-2.5 font-medium text-[var(--ink-3)]">Statut</th>
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
                      <td colSpan={3} className="px-4 py-2.5 font-bold text-[var(--ink-2)] text-[12px]">Total réseau</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalEffectif.toLocaleString("fr-FR")} élèves</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalClasses} classes</td>
                      <td className="px-4 py-2.5 font-bold text-[var(--blue)]">{totalEns} enseignants</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>

            {/* Visual share bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Répartition des élèves", key: "effectif" as keyof Campus },
                { label: "Répartition des classes", key: "nbClasses" as keyof Campus },
                { label: "Répartition des enseignants", key: "nbEnseignants" as keyof Campus },
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
              <p className="text-[13px] font-medium text-[var(--ink)]">Transferts d'élèves inter-établissements</p>
              <p className="text-[12px] text-[var(--ink-4)]">Chaque transfert est soumis à validation administrative.</p>
            </div>
            <Button size="sm" onClick={() => setTransferDlg(true)}>
              <ArrowRightLeft className="w-3.5 h-3.5" /> Nouveau transfert
            </Button>
          </div>

          {/* Pending alert */}
          {transferts.filter(t => t.statut === "En attente").length > 0 && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-[var(--warning-light)] border border-[rgba(180,83,9,0.2)] rounded-[10px] text-[12px] text-[var(--warning)]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span><strong>{transferts.filter(t => t.statut === "En attente").length}</strong> transfert(s) en attente de validation.</span>
            </div>
          )}

          <div className="border border-[var(--line)] rounded-[10px] overflow-hidden">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[var(--ivory)] border-b border-[var(--line)]">
                  {["Élève", "De", "Vers", "Date", "Motif", "Statut", ""].map(h => (
                    <th key={h} className={`px-3 py-2.5 font-medium text-[var(--ink-3)] ${h === "" || h === "Statut" ? "text-center" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferts.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-[var(--ink-4)]">Aucun transfert enregistré.</td></tr>
                )}
                {transferts.map((t, i) => {
                  const src = campus.find(c => c.id === t.campusSourceId);
                  const dst = campus.find(c => c.id === t.campusDestId);
                  const badgeMap: Record<TransfertEleve["statut"], "green" | "amber" | "red"> = {
                    "Approuvé": "green", "En attente": "amber", "Rejeté": "red",
                  };
                  return (
                    <tr key={t.id} className={`border-b border-[var(--line)] last:border-0 ${i % 2 ? "bg-[var(--ivory)]" : ""}`}>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-[var(--ink)]">{t.etuNom}</div>
                        <div className="text-[11px] text-[var(--ink-4)] font-mono">{t.etuCode}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: src?.couleur ?? "#ccc" }} />
                          <span className="text-[var(--ink-3)]">{src?.lib ?? t.campusSourceId}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dst?.couleur ?? "#ccc" }} />
                          <span className="text-[var(--ink-3)]">{dst?.lib ?? t.campusDestId}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--ink-3)]">{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-3 py-2.5 max-w-[160px] truncate text-[var(--ink-3)] text-[11.5px]">{t.motif}</td>
                      <td className="px-3 py-2.5 text-center">
                        <EduBadge variant={badgeMap[t.statut]}>{t.statut}</EduBadge>
                      </td>
                      <td className="px-3 py-2.5">
                        {t.statut === "En attente" && (
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => approveTransfert(t.id)} className="p-1.5 rounded-[6px] text-[var(--success)] hover:bg-[var(--success-light)] transition-colors" title="Approuver">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => rejectTransfert(t.id)} className="p-1.5 rounded-[6px] text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors" title="Rejeter">
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
          <DialogHeader><DialogTitle>Supprimer l'établissement</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex items-start gap-3 p-4 bg-[var(--danger-light)] border border-[rgba(192,57,43,0.2)] rounded-[10px]">
              <AlertTriangle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[13px] text-[var(--danger)] mb-1">Confirmation requise</div>
                <p className="text-[12.5px] text-[var(--ink-2)]">
                  Supprimer <strong>{deleteDlg?.lib}</strong> retirera définitivement cet établissement du réseau. Les historiques de transfert associés seront également supprimés.
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDlg(null)}>Annuler</Button>
            <Button variant="danger" size="sm" onClick={() => deleteDlg && deleteCampus(deleteDlg.id)}>
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch context */}
      <Dialog open={!!switchDlg} onOpenChange={() => setSwitchDlg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Changer de contexte</DialogTitle></DialogHeader>
          <DialogBody>
            <p className="text-[12.5px] text-[var(--ink-3)] mb-4">Sélectionnez l'établissement sur lequel vous souhaitez travailler :</p>
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
                    <div className="text-[11px] text-[var(--ink-4)]">{c.ville} · {c.effectif} élèves</div>
                  </div>
                  <EduBadge variant={typeBadge(c.type)}>{c.type}</EduBadge>
                </button>
              ))}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSwitchDlg(null)}>Annuler</Button>
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
          toast("Demande de transfert enregistrée. En attente de validation.", "success");
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
  const blank: Omit<Campus, "id"> = { code: "", lib: "", type: "Annexe", adresse: "", ville: "", tel: "", email: "", directeur: "", statut: "Actif", effectif: 0, nbClasses: 0, nbEnseignants: 0, couleur: "#0099cc", sessionActive: "2025–2026" };
  const [form, setForm] = useState<Omit<Campus, "id">>(initial ? { ...initial } : blank);
  useEffect(() => { if (open) setForm(initial ? { ...initial } : blank); }, [open]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier l'établissement" : "Nouvel établissement"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code *"><Input placeholder="ex : ANNEXE-EST" value={form.code} onChange={set("code")} /></Field>
              <Field label="Type *">
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as Campus["type"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Annexe">Annexe</SelectItem>
                    <SelectItem value="Partenaire">Partenaire</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Nom de l'établissement *"><Input placeholder="ex : Annexe Est" value={form.lib} onChange={set("lib")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ville"><Input placeholder="ex : Yaoundé" value={form.ville} onChange={set("ville")} /></Field>
              <Field label="Adresse"><Input placeholder="ex : Rue de la Paix" value={form.adresse} onChange={set("adresse")} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone"><Input placeholder="+237 6XX XXX XXX" value={form.tel} onChange={set("tel")} /></Field>
              <Field label="Email"><Input type="email" placeholder="annexe@edustar.cm" value={form.email} onChange={set("email")} /></Field>
            </div>
            <Field label="Directeur / Responsable"><Input placeholder="ex : M. NDOUMBE Paul" value={form.directeur} onChange={set("directeur")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Statut">
                <Select value={form.statut} onValueChange={v => setForm(p => ({ ...p, statut: v as Campus["statut"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Session active"><Input placeholder="ex : 2025–2026" value={form.sessionActive} onChange={set("sessionActive")} /></Field>
            </div>
            <div>
              <Label>Couleur d'identification</Label>
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
          <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button size="sm" onClick={() => onSave(form)}>{initial ? "Enregistrer" : "Ajouter"}</Button>
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
        <DialogHeader><DialogTitle>Demande de transfert</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <Field label="Élève *">
              <Select value={form.etuCode} onValueChange={handleStudentSelect}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un élève" /></SelectTrigger>
                <SelectContent>
                  {students.map(s => <SelectItem key={s.code} value={s.code}>{s.nom} ({s.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Établissement source *">
                <Select value={form.campusSourceId} onValueChange={v => setForm(p => ({ ...p, campusSourceId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>{campus.map(c => <SelectItem key={c.id} value={c.id}>{c.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Établissement destination *">
                <Select value={form.campusDestId} onValueChange={v => setForm(p => ({ ...p, campusDestId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
                  <SelectContent>{campus.filter(c => c.id !== form.campusSourceId).map(c => <SelectItem key={c.id} value={c.id}>{c.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Date effective"><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></Field>
            <Field label="Motif du transfert *"><Input placeholder="ex : Rapprochement familial" value={form.motif} onChange={e => setForm(p => ({ ...p, motif: e.target.value }))} /></Field>
            <div className="flex items-start gap-2 p-3 bg-[var(--blue-lighter)] border border-[var(--blue-light)] rounded-[8px] text-[11.5px] text-[var(--ink-2)]">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--blue)] shrink-0 mt-0.5" />
              La demande sera soumise à validation. L'élève restera inscrit dans l'établissement source jusqu'à approbation.
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button size="sm" onClick={() => {
            if (!form.etuCode || !form.campusSourceId || !form.campusDestId || !form.motif) { toast("Tous les champs obligatoires doivent être remplis.", "error"); return; }
            if (form.campusSourceId === form.campusDestId) { toast("Source et destination doivent être différentes.", "error"); return; }
            onSave(form);
          }}>
            <ArrowRightLeft className="w-3.5 h-3.5" /> Soumettre la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
