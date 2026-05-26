"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import {
  Download, FileText, Archive, Search, CheckSquare,
  Square, Eye, X, Users, BookOpen, TrendingUp,
  AlertCircle, CheckCircle, Loader2, Award, ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { BULLETINS, STUDENTS, CLASSES } from "@/constants/mock-data";
import { useBulletinDownload } from "@/hooks/useBulletinDownload";
import type { Bulletin, Student } from "@/types";

/* PDFViewer needs SSR disabled */
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then(m => m.PDFViewer),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px] text-[var(--ink-4)] text-sm">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement de la visionneuse…
    </div>
  )},
);

const BulletinDocumentDynamic = dynamic(
  () => import("@/components/pdf/BulletinDocument").then(m => m.BulletinDocument),
  { ssr: false },
);

// ── helpers ──────────────────────────────────────────────────────────────────
function getMention(moy: number): { label: string; variant: "green"|"cyan"|"blue"|"amber"|"red" } {
  if (moy >= 16) return { label: "Très bien", variant: "green" };
  if (moy >= 14) return { label: "Bien", variant: "cyan" };
  if (moy >= 12) return { label: "Assez bien", variant: "blue" };
  if (moy >= 10) return { label: "Passable", variant: "amber" };
  return { label: "Insuffisant", variant: "red" };
}

function moyColor(moy: number) {
  if (moy >= 14) return "var(--success)";
  if (moy >= 12) return "var(--cyan)";
  if (moy >= 10) return "var(--warning)";
  return "var(--danger)";
}

// ── Progress Modal ────────────────────────────────────────────────────────────
function ProgressModal({
  open,
  current,
  total,
  status,
  currentName,
  onClose,
  onCancel,
}: {
  open: boolean;
  current: number;
  total: number;
  status: string;
  currentName?: string;
  onClose: () => void;
  onCancel: () => void;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <Dialog open={open} onOpenChange={v => { if (!v && (isDone || isError)) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDone ? (
              <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            ) : isError ? (
              <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
            ) : (
              <Loader2 className="w-5 h-5 text-[var(--blue)] animate-spin" />
            )}
            {isDone ? "Téléchargement terminé" : isError ? "Erreur" : "Génération en cours…"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[var(--ink-4)]">
              <span>{currentName ?? (isDone ? "Terminé" : status === "zipping" ? "Compression ZIP" : "Initialisation…")}</span>
              <span className="font-medium">{current}/{total}</span>
            </div>
            <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isDone ? "var(--success)" : isError ? "var(--danger)" : "var(--blue)",
                }}
              />
            </div>
            <p className="text-right text-xs font-medium text-[var(--ink-4)]">{pct}%</p>
          </div>

          {isDone && (
            <p className="text-sm text-[var(--success)] text-center font-medium">
              {total} bulletin{total > 1 ? "s" : ""} généré{total > 1 ? "s" : ""} avec succès.
            </p>
          )}
          {isError && (
            <p className="text-sm text-[var(--danger)] text-center">
              Une erreur est survenue lors de la génération.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {(isDone || isError) && (
              <Button size="sm" onClick={onClose}>Fermer</Button>
            )}
            {!isDone && !isError && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  open,
  onClose,
  bulletin,
  student,
}: {
  open: boolean;
  onClose: () => void;
  bulletin: Bulletin | null;
  student: Student | null;
}) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-5xl h-[92vh] p-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--line)] shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-[var(--ink)]">
              {student ? `${student.prenom} ${student.nom}` : "Bulletin"}
            </p>
            <p className="text-[11px] text-[var(--ink-4)]">
              {bulletin ? `${bulletin.session} · ${bulletin.semestre}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 min-h-0">
          {bulletin && student && (
            <PDFViewer width="100%" height="100%" showToolbar>
              <BulletinDocumentDynamic bulletin={bulletin} student={student} />
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Download Option Card ──────────────────────────────────────────────────────
function DlCard({
  icon: Icon,
  title,
  desc,
  disabled,
  onDownload,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  disabled?: boolean;
  onDownload: () => void;
}) {
  return (
    <div className={`
      group p-4 rounded-[10px] border flex items-center gap-3
      transition-colors
      ${disabled
        ? "border-[var(--line)] bg-[var(--ivory)] opacity-50"
        : "border-[var(--line)] bg-white hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)] cursor-pointer"}
    `}>
      <div className={`
        w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0
        ${disabled ? "bg-[var(--ivory)]" : "bg-[var(--blue-light)] group-hover:bg-[var(--blue)] transition-colors"}
      `}>
        <Icon className={`w-4 h-4 ${disabled ? "text-[var(--ink-4)]" : "text-[var(--blue)] group-hover:text-white transition-colors"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-[var(--ink)] leading-none mb-[3px]">{title}</p>
        <p className="text-[11px] text-[var(--ink-4)] truncate">{desc}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={onDownload}
        className="shrink-0 text-[11px] h-7 px-3"
      >
        <Download className="w-3 h-3 mr-1" /> Télécharger
      </Button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BulletinsPage() {
  const [semestre, setSemestre] = useState<"S1" | "S2">("S1");
  const [filterClasse, setFilterClasse] = useState("all");
  const [filterFiliere, setFilterFiliere] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterMention, setFilterMention] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [topN, setTopN] = useState("14");

  const { progress, downloadSingle, downloadBatch, reset, cancel } = useBulletinDownload();
  const progressOpen = progress.status !== "idle";

  // Build a map for quick lookup
  const bulletinMap = useMemo(() => {
    const m = new Map<string, Bulletin>();
    BULLETINS.filter(b => b.semestre === semestre).forEach(b => m.set(b.etuCode, b));
    return m;
  }, [semestre]);

  // Filtered list
  const filtered = useMemo(() => {
    return STUDENTS.filter(s => {
      const b = bulletinMap.get(s.code);
      if (!b) return false; // no bulletin for this semester
      if (filterClasse !== "all" && s.classe !== filterClasse) return false;
      if (filterFiliere !== "all" && s.filiere !== filterFiliere) return false;
      if (filterStatut !== "all" && b.statut !== filterStatut) return false;
      if (filterMention !== "all") {
        const m = getMention(b.moyGeneral);
        if (m.label !== filterMention) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!`${s.nom} ${s.prenom} ${s.code}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [bulletinMap, filterClasse, filterFiliere, filterStatut, filterMention, search]);

  const classes = useMemo(() => [...new Set(STUDENTS.map(s => s.classe))].sort(), []);
  const filieres = useMemo(() => [...new Set(STUDENTS.map(s => s.filiere))].sort(), []);

  const allSelected = filtered.length > 0 && filtered.every(s => selected.has(s.code));
  const someSelected = filtered.some(s => selected.has(s.code));

  function toggleSelect(code: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach(s => next.delete(s.code));
      } else {
        filtered.forEach(s => next.add(s.code));
      }
      return next;
    });
  }

  // Selection → items with bulletin
  const selectedItems = useMemo(() => {
    return [...selected]
      .map(code => {
        const student = STUDENTS.find(s => s.code === code);
        const bulletin = bulletinMap.get(code);
        if (!student || !bulletin) return null;
        return { student, bulletin };
      })
      .filter(Boolean) as { student: Student; bulletin: Bulletin }[];
  }, [selected, bulletinMap]);

  // Download handlers
  function dlSelection() {
    downloadBatch(selectedItems, `Bulletins_Sélection_${semestre}`);
  }

  function dlTopN() {
    const threshold = parseFloat(topN);
    const items = filtered
      .map(s => ({ student: s, bulletin: bulletinMap.get(s.code)! }))
      .filter(x => x.bulletin && x.bulletin.moyGeneral >= threshold);
    downloadBatch(items, `Top_Etudiants_Moy${topN}_${semestre}`);
  }

  function dlAll() {
    const items = filtered.map(s => ({ student: s, bulletin: bulletinMap.get(s.code)! }));
    downloadBatch(items, `Tous_Bulletins_${semestre}`);
  }

  function dlClasse(classe: string) {
    const items = STUDENTS
      .filter(s => s.classe === classe)
      .map(s => ({ student: s, bulletin: bulletinMap.get(s.code)! }))
      .filter(x => x.bulletin);
    downloadBatch(items, `Bulletins_${classe}_${semestre}`);
  }

  function openPreview(code: string) {
    setPreviewCode(code);
    setPreviewOpen(true);
  }

  const previewBulletin = previewCode ? bulletinMap.get(previewCode) ?? null : null;
  const previewStudent = previewCode ? STUDENTS.find(s => s.code === previewCode) ?? null : null;

  // Stats for header strip
  const totalWithBulletin = BULLETINS.filter(b => b.semestre === semestre).length;
  const publishedCount = BULLETINS.filter(b => b.semestre === semestre && b.statut === "Publié").length;
  const avgMoy =
    BULLETINS.filter(b => b.semestre === semestre).reduce((acc, b) => acc + b.moyGeneral, 0) /
    (totalWithBulletin || 1);

  return (
    <div>
      <PageHeader
        title="Bulletins de notes"
        subtitle="Prévisualisation, génération et téléchargement des relevés académiques"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedItems.length === 0}
              onClick={dlSelection}
            >
              <Archive className="w-3.5 h-3.5 mr-1.5" />
              ZIP ({selectedItems.length})
            </Button>
            <Button
              size="sm"
              disabled={selectedItems.length !== 1}
              onClick={() => selectedItems[0] && openPreview(selectedItems[0].student.code)}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Prévisualiser
            </Button>
          </div>
        }
      />

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Bulletins total", value: totalWithBulletin, icon: FileText, color: "var(--blue)" },
          { label: "Publiés", value: publishedCount, icon: CheckCircle, color: "var(--success)" },
          { label: "Brouillons", value: totalWithBulletin - publishedCount, icon: AlertCircle, color: "var(--warning)" },
          { label: "Moy. générale", value: avgMoy.toFixed(2), icon: TrendingUp, color: moyColor(avgMoy) },
        ].map(stat => (
          <Card key={stat.label} className="border-[var(--line)] shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}18` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[var(--ink)] leading-none">{stat.value}</p>
                <p className="text-[11px] text-[var(--ink-4)] mt-[2px]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 mb-5 p-3.5 bg-white border border-[var(--line)] rounded-[12px]">
        {/* Semestre toggle */}
        <div className="flex rounded-[8px] border border-[var(--line)] overflow-hidden shrink-0">
          {(["S1", "S2"] as const).map(s => (
            <button
              key={s}
              onClick={() => { setSemestre(s); setSelected(new Set()); }}
              className={`px-4 py-[6px] text-[12px] font-medium transition-colors ${
                semestre === s
                  ? "bg-[var(--blue)] text-white"
                  : "bg-white text-[var(--ink-3)] hover:bg-[var(--ivory)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-[var(--line)]" />

        <Select value={filterClasse} onValueChange={setFilterClasse}>
          <SelectTrigger className="h-8 text-[12px] w-40">
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterFiliere} onValueChange={setFilterFiliere}>
          <SelectTrigger className="h-8 text-[12px] w-36">
            <SelectValue placeholder="Filière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes filières</SelectItem>
            {filieres.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterStatut} onValueChange={setFilterStatut}>
          <SelectTrigger className="h-8 text-[12px] w-32">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="Publié">Publié</SelectItem>
            <SelectItem value="Brouillon">Brouillon</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterMention} onValueChange={setFilterMention}>
          <SelectTrigger className="h-8 text-[12px] w-36">
            <SelectValue placeholder="Mention" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes mentions</SelectItem>
            {["Très bien","Bien","Assez bien","Passable","Insuffisant"].map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="
              pl-8 pr-3 h-8 text-[12px] rounded-[8px]
              border border-[var(--line-dark)] bg-white
              focus:outline-none focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(26,60,143,0.08)]
              w-44 transition-all
            "
          />
        </div>
      </div>

      {/* ── Body: list + download panel ── */}
      <div className="grid grid-cols-[1fr_360px] gap-4 items-start">

        {/* Student list */}
        <Card className="border-[var(--line)] shadow-none overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-[var(--line)] flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <button onClick={toggleAll} className="text-[var(--ink-4)] hover:text-[var(--blue)] transition-colors">
                {allSelected
                  ? <CheckSquare className="w-4 h-4 text-[var(--blue)]" />
                  : someSelected
                    ? <CheckSquare className="w-4 h-4 text-[var(--ink-4)]" />
                    : <Square className="w-4 h-4" />
                }
              </button>
              <span className="text-[12px] text-[var(--ink-4)]">
                {filtered.length} bulletin{filtered.length > 1 ? "s" : ""}
                {selected.size > 0 && (
                  <span className="ml-1 text-[var(--blue)] font-medium">· {selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
                )}
              </span>
            </div>
            {selected.size > 0 && (
              <button onClick={() => setSelected(new Set())} className="text-[11px] text-[var(--ink-4)] hover:text-[var(--danger)] transition-colors">
                Désélectionner
              </button>
            )}
          </CardHeader>
          <div className="divide-y divide-[var(--line)] max-h-[calc(100vh-340px)] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-[var(--ink-4)]">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-[13px]">Aucun bulletin trouvé</p>
              </div>
            ) : (
              filtered.map(student => {
                const bulletin = bulletinMap.get(student.code)!;
                const mention = getMention(bulletin.moyGeneral);
                const isSelected = selected.has(student.code);
                return (
                  <div
                    key={student.code}
                    className={`
                      flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer
                      ${isSelected ? "bg-[var(--blue-lighter)]" : "hover:bg-[var(--ivory)]"}
                    `}
                    onClick={() => toggleSelect(student.code)}
                  >
                    {/* Checkbox */}
                    <button
                      className="shrink-0 text-[var(--ink-4)]"
                      onClick={e => { e.stopPropagation(); toggleSelect(student.code); }}
                    >
                      {isSelected
                        ? <CheckSquare className="w-4 h-4 text-[var(--blue)]" />
                        : <Square className="w-4 h-4" />
                      }
                    </button>

                    {/* Avatar */}
                    <EduAvatar name={`${student.prenom} ${student.nom}`} size={28} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[var(--ink)] leading-none mb-[3px]">
                        {student.prenom} {student.nom}
                      </p>
                      <p className="text-[11px] text-[var(--ink-4)]">
                        {student.classe} · {student.code}
                      </p>
                    </div>

                    {/* Moy + mention */}
                    <div className="text-right shrink-0">
                      <p
                        className="text-[14px] font-bold leading-none mb-[3px]"
                        style={{ color: moyColor(bulletin.moyGeneral) }}
                      >
                        {bulletin.moyGeneral.toFixed(2)}
                      </p>
                      <EduBadge variant={mention.variant}>{mention.label}</EduBadge>
                    </div>

                    {/* Statut */}
                    <EduBadge variant={bulletin.statut === "Publié" ? "green" : "amber"} className="shrink-0">
                      {bulletin.statut}
                    </EduBadge>

                    {/* Preview btn */}
                    <button
                      onClick={e => { e.stopPropagation(); openPreview(student.code); }}
                      className="shrink-0 w-7 h-7 rounded-[6px] flex items-center justify-center text-[var(--ink-4)] hover:bg-[var(--blue-light)] hover:text-[var(--blue)] transition-colors"
                      title="Prévisualiser"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Download panel */}
        <div className="space-y-3 sticky top-4">
          {/* Selection info */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[var(--blue-light)] border border-[rgba(26,60,143,0.2)]">
              <Users className="w-4 h-4 text-[var(--blue)] shrink-0" />
              <p className="text-[12px] text-[var(--blue)] font-medium">
                {selected.size} étudiant{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
              </p>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-[var(--blue)] hover:opacity-70">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Download options */}
          <Card className="border-[var(--line)] shadow-none">
            <CardHeader className="px-4 py-3 border-b border-[var(--line)]">
              <CardTitle className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-2">
                <Download className="w-4 h-4 text-[var(--blue)]" /> Téléchargement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">

              <DlCard
                icon={FileText}
                title={selectedItems.length === 1 ? "PDF individuel" : "Archive ZIP"}
                desc={
                  selectedItems.length === 0
                    ? "Sélectionnez des étudiants"
                    : selectedItems.length === 1
                      ? `PDF pour ${selectedItems[0].student.prenom} ${selectedItems[0].student.nom}`
                      : `${selectedItems.length} bulletins compressés`
                }
                disabled={selectedItems.length === 0}
                onDownload={dlSelection}
              />

              <DlCard
                icon={Eye}
                title="Prévisualiser"
                desc={selectedItems.length === 1 ? "Ouvrir la visionneuse PDF" : "Sélectionnez 1 étudiant"}
                disabled={selectedItems.length !== 1}
                onDownload={() => selectedItems[0] && openPreview(selectedItems[0].student.code)}
              />

              <div className="pt-1 pb-1">
                <p className="text-[10px] font-semibold text-[var(--ink-4)] uppercase tracking-[0.05em] mb-2 px-1">
                  Export groupé
                </p>
              </div>

              {/* By class */}
              {classes.filter(cl => {
                const count = STUDENTS.filter(s => s.classe === cl && bulletinMap.has(s.code)).length;
                return count > 0;
              }).slice(0, 4).map(cl => {
                const count = STUDENTS.filter(s => s.classe === cl && bulletinMap.has(s.code)).length;
                return (
                  <DlCard
                    key={cl}
                    icon={BookOpen}
                    title={`Classe ${cl}`}
                    desc={`${count} bulletin${count > 1 ? "s" : ""} · ${semestre}`}
                    onDownload={() => dlClasse(cl)}
                  />
                );
              })}

              <DlCard
                icon={Archive}
                title={`Tous (${semestre})`}
                desc={`${filtered.length} bulletins filtrés · archive ZIP`}
                onDownload={dlAll}
              />

              {/* Top students */}
              <div className="flex items-center gap-2 p-3 rounded-[10px] border border-[var(--line)] bg-white">
                <div className="w-9 h-9 rounded-[8px] bg-[var(--purple-light)] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[var(--purple)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--ink)] leading-none mb-1">Top étudiants</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[var(--ink-4)]">Moy. ≥</span>
                    <select
                      value={topN}
                      onChange={e => setTopN(e.target.value)}
                      className="text-[11px] border border-[var(--line-dark)] rounded px-1 py-[1px] bg-white text-[var(--ink)] focus:outline-none"
                    >
                      {["10","12","14","16"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <span className="text-[11px] text-[var(--ink-4)]">
                      ({filtered.filter(s => {
                        const b = bulletinMap.get(s.code);
                        return b && b.moyGeneral >= parseFloat(topN);
                      }).length} étudiants)
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={dlTopN} className="text-[11px] h-7 px-3 shrink-0">
                  <Download className="w-3 h-3 mr-1" /> ZIP
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Quick stats for selection */}
          {selectedItems.length > 0 && (
            <Card className="border-[var(--line)] shadow-none">
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold text-[var(--ink-4)] uppercase tracking-[0.05em] mb-3">
                  Résumé sélection
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Moy. min.",
                      value: Math.min(...selectedItems.map(i => i.bulletin.moyGeneral)).toFixed(2),
                    },
                    {
                      label: "Moy. max.",
                      value: Math.max(...selectedItems.map(i => i.bulletin.moyGeneral)).toFixed(2),
                    },
                    {
                      label: "Validés",
                      value: selectedItems.filter(i => i.bulletin.creditsValides === i.bulletin.totalCredits).length,
                    },
                    {
                      label: "En difficulté",
                      value: selectedItems.filter(i => i.bulletin.moyGeneral < 10).length,
                    },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-2 rounded-[8px] bg-[var(--ivory)]">
                      <p className="text-[14px] font-bold text-[var(--ink)]">{stat.value}</p>
                      <p className="text-[10px] text-[var(--ink-4)]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <ProgressModal
        open={progressOpen}
        current={progress.current}
        total={progress.total}
        status={progress.status}
        currentName={progress.currentName}
        onClose={reset}
        onCancel={() => { cancel(); reset(); }}
      />

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        bulletin={previewBulletin}
        student={previewStudent}
      />
    </div>
  );
}
