"use client";
import { useState, useEffect } from "react";
import {
  Plus, Trash2, Copy, Upload, Settings2, BookOpen,
  Layers, GraduationCap, AlertTriangle, FileSpreadsheet,
  Pencil, Check, X,
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
import type { Niveau, Filiere, UniteEnseignement, ParticulariteMatiere } from "@/types";

// ── Local types ───────────────────────────────────────────────────────────────
type ClasseConfig = {
  id: string; code: string; niveauId: string; filiereId: string;
  effectifMax: number; sessionId: string;
};
type MatiereConfig = {
  code: string; lib: string; niveauId: string; sessionId: string;
};

// ── Sessions ref ──────────────────────────────────────────────────────────────
const SESSIONS_REF = [
  { id: "ses-1", lib: "2023–2024", statut: "Clôturée" },
  { id: "ses-2", lib: "2024–2025", statut: "Clôturée" },
  { id: "ses-3", lib: "2025–2026", statut: "Active" },
];

// ── Initial mock data ─────────────────────────────────────────────────────────
const INIT_NIVEAUX: Niveau[] = [
  { id: "niv-1", code: "6EME", lib: "6ème", ordre: 1, sessionId: "ses-3" },
  { id: "niv-2", code: "5EME", lib: "5ème", ordre: 2, sessionId: "ses-3" },
  { id: "niv-3", code: "4EME", lib: "4ème", ordre: 3, sessionId: "ses-3" },
  { id: "niv-4", code: "3EME", lib: "3ème (BEPC)", ordre: 4, sessionId: "ses-3" },
  { id: "niv-5", code: "2NDE", lib: "2nde", ordre: 5, sessionId: "ses-3" },
  { id: "niv-6", code: "1ERE", lib: "1ère", ordre: 6, sessionId: "ses-3" },
  { id: "niv-7", code: "TERM", lib: "Terminale (BAC)", ordre: 7, sessionId: "ses-3" },
];

const INIT_FILIERES: Filiere[] = [
  { id: "fil-1", code: "SCI", lib: "Scientifique", description: "Mathématiques, physique, biologie (séries C, D)", sessionId: "ses-3" },
  { id: "fil-2", code: "LIT", lib: "Littéraire", description: "Langues, philosophie, histoire (série A)", sessionId: "ses-3" },
  { id: "fil-3", code: "TEC", lib: "Technique", description: "Enseignements techniques et professionnels (série F)", sessionId: "ses-3" },
  { id: "fil-4", code: "ECO", lib: "Économique & Social", description: "Économie, comptabilité, sciences sociales (série G)", sessionId: "ses-3" },
];

const INIT_CLASSES: ClasseConfig[] = [
  { id: "cl-1", code: "6ème A", niveauId: "niv-1", filiereId: "", effectifMax: 55, sessionId: "ses-3" },
  { id: "cl-2", code: "6ème B", niveauId: "niv-1", filiereId: "", effectifMax: 55, sessionId: "ses-3" },
  { id: "cl-3", code: "5ème A", niveauId: "niv-2", filiereId: "", effectifMax: 52, sessionId: "ses-3" },
  { id: "cl-4", code: "4ème A", niveauId: "niv-3", filiereId: "", effectifMax: 50, sessionId: "ses-3" },
  { id: "cl-5", code: "3ème A", niveauId: "niv-4", filiereId: "", effectifMax: 48, sessionId: "ses-3" },
  { id: "cl-6", code: "2nde C", niveauId: "niv-5", filiereId: "fil-1", effectifMax: 45, sessionId: "ses-3" },
  { id: "cl-7", code: "1ère C", niveauId: "niv-6", filiereId: "fil-1", effectifMax: 42, sessionId: "ses-3" },
  { id: "cl-8", code: "Tle C", niveauId: "niv-7", filiereId: "fil-1", effectifMax: 40, sessionId: "ses-3" },
  { id: "cl-9", code: "Tle A4", niveauId: "niv-7", filiereId: "fil-2", effectifMax: 38, sessionId: "ses-3" },
];

const INIT_MATIERES: MatiereConfig[] = [
  { code: "MATH", lib: "Mathématiques", niveauId: "niv-1", sessionId: "ses-3" },
  { code: "FR", lib: "Français", niveauId: "niv-1", sessionId: "ses-3" },
  { code: "ANGL", lib: "Anglais", niveauId: "niv-1", sessionId: "ses-3" },
  { code: "HG", lib: "Histoire-Géographie", niveauId: "niv-1", sessionId: "ses-3" },
  { code: "EPS", lib: "Éducation Physique et Sportive", niveauId: "niv-1", sessionId: "ses-3" },
  { code: "SVT", lib: "Sciences de la Vie et de la Terre", niveauId: "niv-2", sessionId: "ses-3" },
  { code: "PC", lib: "Physique-Chimie", niveauId: "niv-2", sessionId: "ses-3" },
  { code: "MATH5", lib: "Mathématiques", niveauId: "niv-5", sessionId: "ses-3" },
  { code: "INFO", lib: "Informatique", niveauId: "niv-5", sessionId: "ses-3" },
  { code: "PHILO", lib: "Philosophie", niveauId: "niv-6", sessionId: "ses-3" },
];

const INIT_UNITES: UniteEnseignement[] = [
  { id: "ue-1", matiereCode: "MATH", niveauId: "niv-1", coeff: 4, volumeH: 4, credits: 4, isObligatoire: true },
  { id: "ue-2", matiereCode: "FR", niveauId: "niv-1", coeff: 4, volumeH: 5, credits: 4, isObligatoire: true },
  { id: "ue-3", matiereCode: "ANGL", niveauId: "niv-1", coeff: 2, volumeH: 3, credits: 2, isObligatoire: true },
  { id: "ue-4", matiereCode: "HG", niveauId: "niv-1", coeff: 2, volumeH: 2, credits: 2, isObligatoire: true },
  { id: "ue-5", matiereCode: "EPS", niveauId: "niv-1", coeff: 1, volumeH: 2, credits: 1, isObligatoire: true },
  { id: "ue-6", matiereCode: "SVT", niveauId: "niv-2", coeff: 3, volumeH: 3, credits: 3, isObligatoire: true },
  { id: "ue-7", matiereCode: "PC", niveauId: "niv-2", coeff: 3, volumeH: 3, credits: 3, isObligatoire: true },
  { id: "ue-8", matiereCode: "MATH5", niveauId: "niv-5", coeff: 6, volumeH: 6, credits: 6, isObligatoire: true },
  { id: "ue-9", matiereCode: "INFO", niveauId: "niv-5", coeff: 2, volumeH: 2, credits: 2, isObligatoire: false },
  { id: "ue-10", matiereCode: "PHILO", niveauId: "niv-6", coeff: 3, volumeH: 3, credits: 3, isObligatoire: true },
];

const INIT_PARTICULARITES: ParticulariteMatiere[] = [
  { id: "par-1", matiereCode: "INFO", classeId: "cl-6", coeff: 3, isOptionnel: false, enseignantId: "ENS-005", volumeH: 3, note: "Salle informatique obligatoire" },
  { id: "par-2", matiereCode: "EPS", classeId: "cl-8", coeff: null, isOptionnel: true, enseignantId: "", volumeH: null, note: "Optionnel pour élèves en situation de handicap" },
  { id: "par-3", matiereCode: "PHILO", classeId: "cl-7", coeff: 4, isOptionnel: false, enseignantId: "ENS-003", volumeH: 4, note: "Coeff majoré — série A" },
];

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ConfigurationPage() {
  const toast = useToast();
  const [sessionId, setSessionId] = useState("ses-3");

  const [niveaux, setNiveaux] = useState<Niveau[]>(INIT_NIVEAUX);
  const [filieres, setFilieres] = useState<Filiere[]>(INIT_FILIERES);
  const [classes, setClasses] = useState<ClasseConfig[]>(INIT_CLASSES);
  const [matieres, setMatieres] = useState<MatiereConfig[]>(INIT_MATIERES);
  const [unites, setUnites] = useState<UniteEnseignement[]>(INIT_UNITES);
  const [particularites, setParticularites] = useState<ParticulariteMatiere[]>(INIT_PARTICULARITES);

  const [niveauDlg, setNiveauDlg] = useState<{ open: boolean; data: Niveau | null }>({ open: false, data: null });
  const [filiereDlg, setFiliereDlg] = useState<{ open: boolean; data: Filiere | null }>({ open: false, data: null });
  const [classeDlg, setClasseDlg] = useState<{ open: boolean; data: ClasseConfig | null }>({ open: false, data: null });
  const [matiereDlg, setMatiereDlg] = useState<{ open: boolean; data: (MatiereConfig & { unite?: Partial<UniteEnseignement> }) | null }>({ open: false, data: null });
  const [particulariteDlg, setParticulariteDlg] = useState<{ open: boolean; data: ParticulariteMatiere | null }>({ open: false, data: null });
  const [dupDlg, setDupDlg] = useState(false);
  const [importDlg, setImportDlg] = useState(false);
  const [dupSource, setDupSource] = useState("ses-2");

  const sesNiveaux = niveaux.filter(n => n.sessionId === sessionId).sort((a, b) => a.ordre - b.ordre);
  const sesFilieres = filieres.filter(f => f.sessionId === sessionId);
  const sesClasses = classes.filter(c => c.sessionId === sessionId);
  const sesMatieres = matieres.filter(m => m.sessionId === sessionId);
  const currentSession = SESSIONS_REF.find(s => s.id === sessionId);

  const saveNiveau = (data: Omit<Niveau, "id" | "sessionId">) => {
    if (!data.code || !data.lib) { toast("Code et libellé requis.", "error"); return; }
    if (niveauDlg.data) {
      setNiveaux(p => p.map(n => n.id === niveauDlg.data!.id ? { ...n, ...data } : n));
      toast("Niveau modifié.", "success");
    } else {
      setNiveaux(p => [...p, { ...data, id: uid(), sessionId }]);
      toast("Niveau ajouté.", "success");
    }
    setNiveauDlg({ open: false, data: null });
  };

  const deleteNiveau = (id: string) => {
    if (sesClasses.some(c => c.niveauId === id)) { toast("Ce niveau possède des classes. Supprimez-les d'abord.", "error"); return; }
    setNiveaux(p => p.filter(n => n.id !== id));
    toast("Niveau supprimé.", "info");
  };

  const saveFiliere = (data: Omit<Filiere, "id" | "sessionId">) => {
    if (!data.code || !data.lib) { toast("Code et libellé requis.", "error"); return; }
    if (filiereDlg.data) {
      setFilieres(p => p.map(f => f.id === filiereDlg.data!.id ? { ...f, ...data } : f));
      toast("Filière modifiée.", "success");
    } else {
      setFilieres(p => [...p, { ...data, id: uid(), sessionId }]);
      toast("Filière ajoutée.", "success");
    }
    setFiliereDlg({ open: false, data: null });
  };

  const deleteFiliere = (id: string) => {
    setFilieres(p => p.filter(f => f.id !== id));
    toast("Filière supprimée.", "info");
  };

  const saveClasse = (data: Omit<ClasseConfig, "id" | "sessionId">) => {
    if (!data.code || !data.niveauId) { toast("Code et niveau requis.", "error"); return; }
    if (classeDlg.data) {
      setClasses(p => p.map(c => c.id === classeDlg.data!.id ? { ...c, ...data } : c));
      toast("Classe modifiée.", "success");
    } else {
      setClasses(p => [...p, { ...data, id: uid(), sessionId }]);
      toast("Classe ajoutée.", "success");
    }
    setClasseDlg({ open: false, data: null });
  };

  const deleteClasse = (id: string) => {
    setClasses(p => p.filter(c => c.id !== id));
    setParticularites(p => p.filter(x => x.classeId !== id));
    toast("Classe supprimée.", "info");
  };

  const saveMatiere = (mat: MatiereConfig, ue: Partial<UniteEnseignement>) => {
    if (!mat.code || !mat.lib || !mat.niveauId) { toast("Tous les champs matière sont requis.", "error"); return; }
    if (matiereDlg.data) {
      setMatieres(p => p.map(m => m.code === matiereDlg.data!.code && m.niveauId === matiereDlg.data!.niveauId ? mat : m));
      setUnites(p => p.map(u => u.matiereCode === matiereDlg.data!.code && u.niveauId === matiereDlg.data!.niveauId ? { ...u, ...ue } : u));
      toast("Matière modifiée.", "success");
    } else {
      setMatieres(p => [...p, mat]);
      setUnites(p => [...p, { id: uid(), matiereCode: mat.code, niveauId: mat.niveauId, coeff: Number(ue.coeff ?? 1), volumeH: Number(ue.volumeH ?? 1), credits: Number(ue.credits ?? 1), isObligatoire: ue.isObligatoire ?? true }]);
      toast("Matière ajoutée.", "success");
    }
    setMatiereDlg({ open: false, data: null });
  };

  const deleteMatiere = (code: string, niveauId: string) => {
    setMatieres(p => p.filter(m => !(m.code === code && m.niveauId === niveauId)));
    setUnites(p => p.filter(u => !(u.matiereCode === code && u.niveauId === niveauId)));
    toast("Matière supprimée.", "info");
  };

  const saveParticularite = (data: Omit<ParticulariteMatiere, "id">) => {
    if (!data.matiereCode || !data.classeId) { toast("Matière et classe requises.", "error"); return; }
    if (particulariteDlg.data) {
      setParticularites(p => p.map(x => x.id === particulariteDlg.data!.id ? { ...x, ...data } : x));
      toast("Particularité modifiée.", "success");
    } else {
      setParticularites(p => [...p, { ...data, id: uid() }]);
      toast("Particularité ajoutée.", "success");
    }
    setParticulariteDlg({ open: false, data: null });
  };

  const deleteParticularite = (id: string) => {
    setParticularites(p => p.filter(x => x.id !== id));
    toast("Particularité supprimée.", "info");
  };

  const handleDuplicate = () => {
    const nMap: Record<string, string> = {};
    const srcNiv = niveaux.filter(n => n.sessionId === dupSource).map(n => { const id = uid(); nMap[n.id] = id; return { ...n, id, sessionId }; });
    const srcFil = filieres.filter(f => f.sessionId === dupSource).map(f => ({ ...f, id: uid(), sessionId }));
    const srcCls = classes.filter(c => c.sessionId === dupSource).map(c => ({ ...c, id: uid(), niveauId: nMap[c.niveauId] ?? c.niveauId, sessionId }));
    const srcMat = matieres.filter(m => m.sessionId === dupSource).map(m => ({ ...m, niveauId: nMap[m.niveauId] ?? m.niveauId, sessionId }));
    setNiveaux(p => [...p.filter(n => n.sessionId !== sessionId), ...srcNiv]);
    setFilieres(p => [...p.filter(f => f.sessionId !== sessionId), ...srcFil]);
    setClasses(p => [...p.filter(c => c.sessionId !== sessionId), ...srcCls]);
    setMatieres(p => [...p.filter(m => m.sessionId !== sessionId), ...srcMat]);
    setDupDlg(false);
    toast(`Configuration dupliquée depuis ${SESSIONS_REF.find(s => s.id === dupSource)?.lib}. Vérifiez et ajustez avant validation.`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Configuration année scolaire"
        subtitle={`Session sélectionnée : ${currentSession?.lib} — paramétrage pédagogique complet`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={sessionId} onValueChange={setSessionId}>
              <SelectTrigger className="w-[148px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SESSIONS_REF.map(s => <SelectItem key={s.id} value={s.id}>{s.lib}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setImportDlg(true)}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Importer Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDupDlg(true)}>
              <Copy className="w-3.5 h-3.5" /> Dupliquer
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="niveaux">
        <TabsList>
          <TabsTrigger value="niveaux"><Layers className="w-3.5 h-3.5" />Niveaux ({sesNiveaux.length})</TabsTrigger>
          <TabsTrigger value="filieres"><GraduationCap className="w-3.5 h-3.5" />Filières ({sesFilieres.length})</TabsTrigger>
          <TabsTrigger value="classes"><Settings2 className="w-3.5 h-3.5" />Classes ({sesClasses.length})</TabsTrigger>
          <TabsTrigger value="matieres"><BookOpen className="w-3.5 h-3.5" />Matières & Unités ({sesMatieres.length})</TabsTrigger>
          <TabsTrigger value="particularites">Particularités ({particularites.length})</TabsTrigger>
        </TabsList>

        {/* ── NIVEAUX ──────────────────────────────────────────────────────── */}
        <TabsContent value="niveaux">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setNiveauDlg({ open: true, data: null })}>
              <Plus className="w-3.5 h-3.5" /> Ajouter un niveau
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sesNiveaux.map(n => (
              <Card key={n.id} className="p-4 flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] font-bold text-[var(--blue)] mb-0.5">{n.code}</div>
                  <div className="text-[13px] font-medium text-[var(--ink)]">{n.lib}</div>
                  <div className="text-[11px] text-[var(--ink-4)] mt-1">
                    Ordre {n.ordre} · {sesClasses.filter(c => c.niveauId === n.id).length} classe(s)
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconBtn onClick={() => setNiveauDlg({ open: true, data: n })} icon={<Pencil className="w-3.5 h-3.5" />} variant="blue" />
                  <IconBtn onClick={() => deleteNiveau(n.id)} icon={<Trash2 className="w-3.5 h-3.5" />} variant="danger" />
                </div>
              </Card>
            ))}
            {sesNiveaux.length === 0 && <EmptyMsg text="Aucun niveau défini pour cette session." cols={4} />}
          </div>
        </TabsContent>

        {/* ── FILIÈRES ─────────────────────────────────────────────────────── */}
        <TabsContent value="filieres">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setFiliereDlg({ open: true, data: null })}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une filière
            </Button>
          </div>
          <div className="space-y-2.5">
            {sesFilieres.map(f => (
              <Card key={f.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <EduBadge variant="blue">{f.code}</EduBadge>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{f.lib}</div>
                    <div className="text-[11.5px] text-[var(--ink-4)] truncate">{f.description}</div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconBtn onClick={() => setFiliereDlg({ open: true, data: f })} icon={<Pencil className="w-3.5 h-3.5" />} variant="blue" />
                  <IconBtn onClick={() => deleteFiliere(f.id)} icon={<Trash2 className="w-3.5 h-3.5" />} variant="danger" />
                </div>
              </Card>
            ))}
            {sesFilieres.length === 0 && <EmptyMsg text="Aucune filière définie." />}
          </div>
        </TabsContent>

        {/* ── CLASSES ──────────────────────────────────────────────────────── */}
        <TabsContent value="classes">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setClasseDlg({ open: true, data: null })}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une classe
            </Button>
          </div>
          <div className="space-y-6">
            {sesNiveaux.map(niv => {
              const nivClasses = sesClasses.filter(c => c.niveauId === niv.id);
              return (
                <div key={niv.id}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="font-mono text-[11px] font-bold text-[var(--blue)]">{niv.code}</span>
                    <span className="text-[13px] font-semibold text-[var(--ink)]">{niv.lib}</span>
                    <span className="text-[11px] text-[var(--ink-4)]">— {nivClasses.length} classe(s)</span>
                  </div>
                  {nivClasses.length === 0
                    ? <p className="text-[12px] text-[var(--ink-4)] pl-2 py-1">Aucune classe pour ce niveau.</p>
                    : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {nivClasses.map(cl => {
                          const fil = filieres.find(f => f.id === cl.filiereId);
                          return (
                            <Card key={cl.id} className="p-3.5 flex items-center justify-between gap-2">
                              <div>
                                <div className="text-[13px] font-semibold text-[var(--ink)]">{cl.code}</div>
                                <div className="text-[11px] text-[var(--ink-4)] mt-0.5">
                                  {fil ? fil.lib : "Tronc commun"} · max {cl.effectifMax} élèves
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <IconBtn onClick={() => setClasseDlg({ open: true, data: cl })} icon={<Pencil className="w-3.5 h-3.5" />} variant="blue" />
                                <IconBtn onClick={() => deleteClasse(cl.id)} icon={<Trash2 className="w-3.5 h-3.5" />} variant="danger" />
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── MATIÈRES & UNITÉS ────────────────────────────────────────────── */}
        <TabsContent value="matieres">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setMatiereDlg({ open: true, data: null })}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une matière
            </Button>
          </div>
          <div className="space-y-6">
            {sesNiveaux.map(niv => {
              const nivMats = sesMatieres.filter(m => m.niveauId === niv.id);
              return (
                <div key={niv.id}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="font-mono text-[11px] font-bold text-[var(--blue)]">{niv.code}</span>
                    <span className="text-[13px] font-semibold text-[var(--ink)]">{niv.lib}</span>
                  </div>
                  {nivMats.length === 0
                    ? <p className="text-[12px] text-[var(--ink-4)] pl-2 py-1">Aucune matière pour ce niveau.</p>
                    : (
                      <div className="border border-[var(--line)] rounded-[10px] overflow-hidden mb-1">
                        <table className="w-full text-[12.5px]">
                          <thead>
                            <tr className="bg-[var(--ivory)] border-b border-[var(--line)]">
                              {["Code", "Matière", "Coeff", "Vol. H", "Crédits", "Oblig.", ""].map(h => (
                                <th key={h} className={`px-3 py-2.5 font-medium text-[var(--ink-3)] ${h === "Code" || h === "Matière" ? "text-left" : "text-center"}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {nivMats.map((m, i) => {
                              const ue = unites.find(u => u.matiereCode === m.code && u.niveauId === m.niveauId);
                              return (
                                <tr key={`${m.code}-${m.niveauId}`} className={`border-b border-[var(--line)] last:border-0 ${i % 2 ? "bg-[var(--ivory)]" : ""}`}>
                                  <td className="px-3 py-2.5 font-mono font-bold text-[var(--blue)] text-[11px]">{m.code}</td>
                                  <td className="px-3 py-2.5 font-medium text-[var(--ink)]">{m.lib}</td>
                                  <td className="px-3 py-2.5 text-center text-[var(--ink)]">{ue?.coeff ?? "—"}</td>
                                  <td className="px-3 py-2.5 text-center text-[var(--ink)]">{ue?.volumeH != null ? `${ue.volumeH}h` : "—"}</td>
                                  <td className="px-3 py-2.5 text-center text-[var(--ink)]">{ue?.credits ?? "—"}</td>
                                  <td className="px-3 py-2.5 text-center">
                                    {ue?.isObligatoire
                                      ? <Check className="w-3.5 h-3.5 text-[var(--success)] mx-auto" />
                                      : <X className="w-3.5 h-3.5 text-[var(--ink-4)] mx-auto" />}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <div className="flex gap-1 justify-end">
                                      <IconBtn onClick={() => setMatiereDlg({ open: true, data: { ...m, unite: ue } })} icon={<Pencil className="w-3 h-3" />} variant="blue" />
                                      <IconBtn onClick={() => deleteMatiere(m.code, m.niveauId)} icon={<Trash2 className="w-3 h-3" />} variant="danger" />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── PARTICULARITÉS ───────────────────────────────────────────────── */}
        <TabsContent value="particularites">
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-[12.5px] text-[var(--ink-4)] max-w-xl">
              Spécificités d'une matière pour une classe donnée : coefficient différent, option, enseignant dédié, volume horaire ajusté…
            </p>
            <Button size="sm" onClick={() => setParticulariteDlg({ open: true, data: null })}>
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </Button>
          </div>
          <div className="border border-[var(--line)] rounded-[10px] overflow-hidden">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[var(--ivory)] border-b border-[var(--line)]">
                  {["Classe", "Matière", "Coeff", "Vol. H", "Statut", "Note", ""].map(h => (
                    <th key={h} className={`px-3 py-2.5 font-medium text-[var(--ink-3)] ${h === "Classe" || h === "Matière" || h === "Note" ? "text-left" : "text-center"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {particularites.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-[var(--ink-4)]">Aucune particularité définie.</td></tr>
                )}
                {particularites.map((p, i) => {
                  const cl = sesClasses.find(c => c.id === p.classeId);
                  const mat = sesMatieres.find(m => m.code === p.matiereCode);
                  return (
                    <tr key={p.id} className={`border-b border-[var(--line)] last:border-0 ${i % 2 ? "bg-[var(--ivory)]" : ""}`}>
                      <td className="px-3 py-2.5 font-semibold text-[var(--ink)]">{cl?.code ?? p.classeId}</td>
                      <td className="px-3 py-2.5 text-[var(--ink)]">{mat?.lib ?? p.matiereCode}</td>
                      <td className="px-3 py-2.5 text-center">{p.coeff ?? <span className="text-[var(--ink-4)]">hérite</span>}</td>
                      <td className="px-3 py-2.5 text-center">{p.volumeH != null ? `${p.volumeH}h` : <span className="text-[var(--ink-4)]">hérite</span>}</td>
                      <td className="px-3 py-2.5 text-center">
                        {p.isOptionnel
                          ? <EduBadge variant="amber">Optionnel</EduBadge>
                          : <EduBadge variant="green">Obligatoire</EduBadge>}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--ink-3)] text-[11.5px] max-w-[180px] truncate">{p.note || "—"}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 justify-end">
                          <IconBtn onClick={() => setParticulariteDlg({ open: true, data: p })} icon={<Pencil className="w-3 h-3" />} variant="blue" />
                          <IconBtn onClick={() => deleteParticularite(p.id)} icon={<Trash2 className="w-3 h-3" />} variant="danger" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ DIALOGS ══════════════════════════════════════════════════════════ */}

      <NiveauDialog
        key={`niv-${niveauDlg.open}-${niveauDlg.data?.id}`}
        open={niveauDlg.open}
        initial={niveauDlg.data}
        onSave={saveNiveau}
        onClose={() => setNiveauDlg({ open: false, data: null })}
      />
      <FiliereDialog
        key={`fil-${filiereDlg.open}-${filiereDlg.data?.id}`}
        open={filiereDlg.open}
        initial={filiereDlg.data}
        onSave={saveFiliere}
        onClose={() => setFiliereDlg({ open: false, data: null })}
      />
      <ClasseDialog
        key={`cls-${classeDlg.open}-${classeDlg.data?.id}`}
        open={classeDlg.open}
        initial={classeDlg.data}
        niveaux={sesNiveaux}
        filieres={sesFilieres}
        onSave={saveClasse}
        onClose={() => setClasseDlg({ open: false, data: null })}
      />
      <MatiereDialog
        key={`mat-${matiereDlg.open}-${matiereDlg.data?.code}`}
        open={matiereDlg.open}
        initial={matiereDlg.data}
        niveaux={sesNiveaux}
        onSave={saveMatiere}
        onClose={() => setMatiereDlg({ open: false, data: null })}
      />
      <ParticulariteDialog
        key={`par-${particulariteDlg.open}-${particulariteDlg.data?.id}`}
        open={particulariteDlg.open}
        initial={particulariteDlg.data}
        classes={sesClasses}
        matieres={sesMatieres}
        onSave={saveParticularite}
        onClose={() => setParticulariteDlg({ open: false, data: null })}
      />

      {/* Duplicate */}
      <Dialog open={dupDlg} onOpenChange={setDupDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dupliquer une configuration</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <p className="text-[12.5px] text-[var(--ink-3)]">
                La configuration (niveaux, filières, classes, matières) sera copiée vers <strong>{currentSession?.lib}</strong>. Les données existantes pour cette session seront remplacées.
              </p>
              <Field label="Session source">
                <Select value={dupSource} onValueChange={setDupSource}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SESSIONS_REF.filter(s => s.id !== sessionId).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.lib} — {s.statut}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-start gap-2 p-3 bg-[var(--warning-light)] border border-[rgba(180,83,9,0.2)] rounded-[8px] text-[11.5px] text-[var(--warning)]">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Pensez à réviser les coefficients, enseignants et volumes horaires après duplication.
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDupDlg(false)}>Annuler</Button>
            <Button size="sm" onClick={handleDuplicate}><Copy className="w-3.5 h-3.5" /> Dupliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Excel */}
      <Dialog open={importDlg} onOpenChange={setImportDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Importer depuis Excel</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <p className="text-[12.5px] text-[var(--ink-3)]">
                Le fichier doit suivre le modèle EduStar. Onglets attendus : <em>Niveaux, Filières, Classes, Matières</em>.
              </p>
              <div className="border-2 border-dashed border-[var(--line-dark)] rounded-[10px] p-8 text-center cursor-pointer hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-colors group">
                <Upload className="w-8 h-8 text-[var(--ink-4)] group-hover:text-[var(--blue)] mx-auto mb-2 transition-colors" />
                <div className="text-[13px] font-medium text-[var(--ink-2)]">Glisser-déposer ou cliquer pour sélectionner</div>
                <div className="text-[11.5px] text-[var(--ink-4)] mt-1">.xlsx ou .xls — 5 Mo max</div>
              </div>
              <button className="text-[12px] text-[var(--blue)] underline underline-offset-2 hover:text-[var(--blue-dark)]">
                Télécharger le modèle de fichier
              </button>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setImportDlg(false)}>Annuler</Button>
            <Button size="sm" onClick={() => { setImportDlg(false); toast("Aucun fichier sélectionné.", "warning"); }}>
              <Upload className="w-3.5 h-3.5" /> Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Utility micro-components
// ════════════════════════════════════════════════════════════════════════════

function IconBtn({ onClick, icon, variant }: { onClick: () => void; icon: React.ReactNode; variant: "blue" | "danger" }) {
  const cls = variant === "blue"
    ? "text-[var(--ink-4)] hover:text-[var(--blue)] hover:bg-[var(--blue-lighter)]"
    : "text-[var(--ink-4)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)]";
  return (
    <button onClick={onClick} className={`p-1.5 rounded-[6px] transition-colors ${cls}`}>{icon}</button>
  );
}

function EmptyMsg({ text, cols = 1 }: { text: string; cols?: number }) {
  return (
    <div className={`col-span-${cols} text-center py-12 text-[var(--ink-4)] text-[13px]`}>{text}</div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Dialog sub-components
// ════════════════════════════════════════════════════════════════════════════

function NiveauDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial: Niveau | null;
  onSave: (d: Omit<Niveau, "id" | "sessionId">) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ code: initial?.code ?? "", lib: initial?.lib ?? "", ordre: initial?.ordre ?? 1 });
  useEffect(() => { if (open) setForm({ code: initial?.code ?? "", lib: initial?.lib ?? "", ordre: initial?.ordre ?? 1 }); }, [open]);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier le niveau" : "Nouveau niveau"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <Field label="Code *"><Input placeholder="ex : 6EME" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></Field>
            <Field label="Libellé *"><Input placeholder="ex : 6ème" value={form.lib} onChange={e => setForm(p => ({ ...p, lib: e.target.value }))} /></Field>
            <Field label="Ordre d'affichage"><Input type="number" min={1} value={form.ordre} onChange={e => setForm(p => ({ ...p, ordre: Number(e.target.value) }))} /></Field>
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

function FiliereDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial: Filiere | null;
  onSave: (d: Omit<Filiere, "id" | "sessionId">) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ code: initial?.code ?? "", lib: initial?.lib ?? "", description: initial?.description ?? "" });
  useEffect(() => { if (open) setForm({ code: initial?.code ?? "", lib: initial?.lib ?? "", description: initial?.description ?? "" }); }, [open]);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier la filière" : "Nouvelle filière"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <Field label="Code *"><Input placeholder="ex : SCI" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></Field>
            <Field label="Libellé *"><Input placeholder="ex : Scientifique" value={form.lib} onChange={e => setForm(p => ({ ...p, lib: e.target.value }))} /></Field>
            <Field label="Description"><Input placeholder="ex : Séries C et D…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></Field>
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

function ClasseDialog({ open, initial, niveaux, filieres, onSave, onClose }: {
  open: boolean; initial: ClasseConfig | null; niveaux: Niveau[]; filieres: Filiere[];
  onSave: (d: Omit<ClasseConfig, "id" | "sessionId">) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ code: initial?.code ?? "", niveauId: initial?.niveauId ?? niveaux[0]?.id ?? "", filiereId: initial?.filiereId ?? "", effectifMax: initial?.effectifMax ?? 50 });
  useEffect(() => { if (open) setForm({ code: initial?.code ?? "", niveauId: initial?.niveauId ?? niveaux[0]?.id ?? "", filiereId: initial?.filiereId ?? "", effectifMax: initial?.effectifMax ?? 50 }); }, [open]);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier la classe" : "Nouvelle classe"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <Field label="Intitulé *"><Input placeholder="ex : 6ème A" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></Field>
            <Field label="Niveau *">
              <Select value={form.niveauId} onValueChange={v => setForm(p => ({ ...p, niveauId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un niveau" /></SelectTrigger>
                <SelectContent>{niveaux.map(n => <SelectItem key={n.id} value={n.id}>{n.lib}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Filière (optionnel)">
              <Select value={form.filiereId || "__none"} onValueChange={v => setForm(p => ({ ...p, filiereId: v === "__none" ? "" : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Tronc commun</SelectItem>
                  {filieres.map(f => <SelectItem key={f.id} value={f.id}>{f.lib}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Effectif maximum">
              <Input type="number" min={1} value={form.effectifMax} onChange={e => setForm(p => ({ ...p, effectifMax: Number(e.target.value) }))} />
            </Field>
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

type MatiereDialogInput = (MatiereConfig & { unite?: Partial<UniteEnseignement> }) | null;

function MatiereDialog({ open, initial, niveaux, onSave, onClose }: {
  open: boolean; initial: MatiereDialogInput; niveaux: Niveau[];
  onSave: (mat: MatiereConfig, ue: Partial<UniteEnseignement>) => void; onClose: () => void;
}) {
  const [mat, setMat] = useState({ code: initial?.code ?? "", lib: initial?.lib ?? "", niveauId: initial?.niveauId ?? niveaux[0]?.id ?? "", sessionId: initial?.sessionId ?? "" });
  const [ue, setUe] = useState({ coeff: initial?.unite?.coeff ?? 2, volumeH: initial?.unite?.volumeH ?? 2, credits: initial?.unite?.credits ?? 2, isObligatoire: initial?.unite?.isObligatoire ?? true });
  useEffect(() => {
    if (open) {
      setMat({ code: initial?.code ?? "", lib: initial?.lib ?? "", niveauId: initial?.niveauId ?? niveaux[0]?.id ?? "", sessionId: initial?.sessionId ?? "" });
      setUe({ coeff: initial?.unite?.coeff ?? 2, volumeH: initial?.unite?.volumeH ?? 2, credits: initial?.unite?.credits ?? 2, isObligatoire: initial?.unite?.isObligatoire ?? true });
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code *"><Input placeholder="ex : MATH" value={mat.code} onChange={e => setMat(p => ({ ...p, code: e.target.value }))} /></Field>
              <Field label="Niveau *">
                <Select value={mat.niveauId} onValueChange={v => setMat(p => ({ ...p, niveauId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{niveaux.map(n => <SelectItem key={n.id} value={n.id}>{n.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Libellé *"><Input placeholder="ex : Mathématiques" value={mat.lib} onChange={e => setMat(p => ({ ...p, lib: e.target.value }))} /></Field>
            <div className="pt-2 border-t border-[var(--line)]">
              <div className="text-[11px] font-semibold text-[var(--ink-3)] mb-2.5">Unité d'enseignement</div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Coefficient"><Input type="number" min={1} value={ue.coeff} onChange={e => setUe(p => ({ ...p, coeff: Number(e.target.value) }))} /></Field>
                <Field label="Vol. horaire / sem."><Input type="number" min={1} value={ue.volumeH} onChange={e => setUe(p => ({ ...p, volumeH: Number(e.target.value) }))} /></Field>
                <Field label="Crédits"><Input type="number" min={0} value={ue.credits} onChange={e => setUe(p => ({ ...p, credits: Number(e.target.value) }))} /></Field>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer text-[12.5px] text-[var(--ink)]">
                <input type="checkbox" className="accent-[var(--blue)] w-3.5 h-3.5" checked={ue.isObligatoire} onChange={e => setUe(p => ({ ...p, isObligatoire: e.target.checked }))} />
                Matière obligatoire
              </label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button size="sm" onClick={() => onSave(mat, ue)}>{initial ? "Enregistrer" : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ParticulariteDialog({ open, initial, classes, matieres, onSave, onClose }: {
  open: boolean; initial: ParticulariteMatiere | null; classes: ClasseConfig[]; matieres: MatiereConfig[];
  onSave: (d: Omit<ParticulariteMatiere, "id">) => void; onClose: () => void;
}) {
  const blank: Omit<ParticulariteMatiere, "id"> = { matiereCode: "", classeId: "", coeff: null, isOptionnel: false, enseignantId: "", volumeH: null, note: "" };
  const [form, setForm] = useState<Omit<ParticulariteMatiere, "id">>(initial ? { ...initial } : blank);
  useEffect(() => { if (open) setForm(initial ? { matiereCode: initial.matiereCode, classeId: initial.classeId, coeff: initial.coeff, isOptionnel: initial.isOptionnel, enseignantId: initial.enseignantId, volumeH: initial.volumeH, note: initial.note } : blank); }, [open]);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Modifier la particularité" : "Nouvelle particularité"}</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Classe *">
                <Select value={form.classeId} onValueChange={v => setForm(p => ({ ...p, classeId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Matière *">
                <Select value={form.matiereCode} onValueChange={v => setForm(p => ({ ...p, matiereCode: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{matieres.map(m => <SelectItem key={`${m.code}-${m.niveauId}`} value={m.code}>{m.lib}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Coeff. (vide = hérite)">
                <Input type="number" min={1} placeholder="—" value={form.coeff ?? ""} onChange={e => setForm(p => ({ ...p, coeff: e.target.value ? Number(e.target.value) : null }))} />
              </Field>
              <Field label="Vol. H (vide = hérite)">
                <Input type="number" min={1} placeholder="—" value={form.volumeH ?? ""} onChange={e => setForm(p => ({ ...p, volumeH: e.target.value ? Number(e.target.value) : null }))} />
              </Field>
            </div>
            <Field label="Enseignant dédié (ID)">
              <Input placeholder="ex : ENS-007" value={form.enseignantId} onChange={e => setForm(p => ({ ...p, enseignantId: e.target.value }))} />
            </Field>
            <Field label="Note / observation">
              <Input placeholder="ex : Salle spécialisée requise" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-[var(--ink)]">
              <input type="checkbox" className="accent-[var(--blue)] w-3.5 h-3.5" checked={form.isOptionnel} onChange={e => setForm(p => ({ ...p, isOptionnel: e.target.checked }))} />
              Matière optionnelle pour cette classe
            </label>
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
