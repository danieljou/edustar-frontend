"use client";
import { useState, useMemo, useRef } from "react";
import {
  Save, Send, Lock, Unlock, Download, Upload,
  AlertTriangle, CheckCircle, Users, TrendingUp,
  Info, ChevronDown, RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useEvaluationStore, selectTypesEvalPeriode } from "@/stores/useEvaluationStore";
import { normalizeTo20, getMention, pourcentageColor, validateTypesEvaluation } from "@/lib/calcul-engine";
import { STUDENTS, MATIERES, CLASSES } from "@/constants/mock-data";
import type { NoteEntree, TypeEvaluation } from "@/types/evaluation";

// ─── Types locaux ─────────────────────────────────────────────────────────────

type CellValue = number | null | "ABS";

// ─── Cellule d'entrée de note ─────────────────────────────────────────────────

interface NoteCellProps {
  value: CellValue;
  max: number;
  locked: boolean;
  onChange: (v: CellValue) => void;
}

function NoteCell({ value, max, locked, onChange }: NoteCellProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = value === null || value === "ABS"
    ? null
    : normalizeTo20(value as number, max);
  const mention = normalized !== null ? getMention(normalized) : null;

  const displayStr =
    value === "ABS" ? "ABS" :
    value === null ? "" :
    String(value);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "Tab") {
      setEditing(false);
    }
    if (e.key === "a" || e.key === "A") {
      onChange("ABS");
      setEditing(false);
    }
  }

  function handleBlur(raw: string) {
    setEditing(false);
    if (raw === "" || raw.toLowerCase() === "abs") {
      onChange(raw.toLowerCase() === "abs" ? "ABS" : null);
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) { onChange(null); return; }
    onChange(Math.max(0, Math.min(max, num)));
  }

  if (locked) {
    return (
      <div className={`
        w-full h-full flex items-center justify-center rounded-[6px] text-[12px] font-medium
        ${value === "ABS" ? "text-[var(--danger)] bg-[var(--danger-light)]" :
          value === null ? "text-[var(--ink-4)]" :
          "text-[var(--ink)]"}
      `}>
        {value === "ABS" ? "ABS" : value === null ? "—" : (value as number).toFixed(1)}
        {normalized !== null && (
          <span className="ml-1 text-[9px]" style={{ color: mention?.couleur }}>
            /{20}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full h-full flex items-center justify-center cursor-pointer rounded-[6px]
        transition-all group
        ${editing
          ? "ring-2 ring-[var(--blue)] bg-white"
          : value === "ABS"
            ? "bg-[var(--danger-light)]"
            : value !== null
              ? "hover:bg-[var(--blue-lighter)]"
              : "hover:bg-[var(--ivory)]"
        }
      `}
      onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); }}
    >
      {editing ? (
        <input
          ref={inputRef}
          defaultValue={displayStr}
          onBlur={e => handleBlur(e.target.value)}
          onKeyDown={handleKey}
          className="w-full h-full text-center text-[12px] font-medium bg-transparent focus:outline-none px-1"
          placeholder="0–20 / ABS"
        />
      ) : (
        <>
          <span className={`text-[12px] font-medium ${
            value === "ABS" ? "text-[var(--danger)]" :
            value === null ? "text-[var(--ink-4)]" :
            "text-[var(--ink)]"
          }`}>
            {value === "ABS" ? "ABS" : value === null ? "—" : (value as number).toFixed(1)}
          </span>
          {normalized !== null && !editing && (
            <span
              className="absolute -top-1 -right-1 text-[8px] font-bold px-[3px] py-[1px] rounded-[3px] bg-white border"
              style={{ color: mention?.couleur, borderColor: mention?.couleur + "40" }}
            >
              {normalized.toFixed(0)}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// ─── Ligne d'un étudiant ──────────────────────────────────────────────────────

interface StudentRowProps {
  student: { code: string; nom: string; prenom: string; classe: string };
  typesEval: TypeEvaluation[];
  notes: Map<string, CellValue>; // typeEvalId → valeur
  locked: boolean;
  isSelected: boolean;
  moyenneGenerale: number | null;
  onSelectToggle: () => void;
  onNoteChange: (typeEvalId: string, val: CellValue) => void;
}

function StudentRow({
  student,
  typesEval,
  notes,
  locked,
  isSelected,
  moyenneGenerale,
  onSelectToggle,
  onNoteChange,
}: StudentRowProps) {
  const mention = moyenneGenerale !== null ? getMention(moyenneGenerale) : null;

  return (
    <tr className={`
      border-b border-[var(--line)] transition-colors
      ${isSelected ? "bg-[var(--blue-lighter)]" : "hover:bg-[var(--ivory)]"}
    `}>
      {/* Sélection */}
      <td className="px-3 py-2 w-8">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelectToggle}
          className="accent-[var(--blue)] cursor-pointer"
        />
      </td>

      {/* Rang placeholder */}
      <td className="px-2 py-2 text-center text-[11px] text-[var(--ink-4)] w-10 font-mono">
        —
      </td>

      {/* Étudiant */}
      <td className="px-3 py-2 min-w-[180px]">
        <div className="flex items-center gap-2">
          <EduAvatar name={`${student.prenom} ${student.nom}`} size={26} />
          <div>
            <p className="text-[12px] font-semibold text-[var(--ink)] leading-none">
              {student.nom} {student.prenom}
            </p>
            <p className="text-[10px] text-[var(--ink-4)]">{student.code}</p>
          </div>
        </div>
      </td>

      {/* Notes par type d'évaluation */}
      {typesEval.map(te => (
        <td key={te.id} className="px-1 py-1.5 w-24">
          <div className="h-8">
            <NoteCell
              value={notes.get(te.id) ?? null}
              max={te.noteSur}
              locked={locked}
              onChange={v => onNoteChange(te.id, v)}
            />
          </div>
        </td>
      ))}

      {/* Moyenne */}
      <td className="px-3 py-2 w-24 text-center">
        {moyenneGenerale !== null ? (
          <div>
            <p
              className="text-[13px] font-bold"
              style={{ color: mention?.couleur }}
            >
              {moyenneGenerale.toFixed(2)}
            </p>
            <p className="text-[9px] text-[var(--ink-4)]">/ 20</p>
          </div>
        ) : (
          <span className="text-[11px] text-[var(--ink-4)]">—</span>
        )}
      </td>

      {/* Statut */}
      <td className="px-2 py-2 w-24 text-center">
        {moyenneGenerale !== null ? (
          <EduBadge variant={
            moyenneGenerale >= 10 ? "green" :
            moyenneGenerale >= 8 ? "amber" : "red"
          }>
            {moyenneGenerale >= 10 ? "Validé" :
             moyenneGenerale >= 8 ? "Rattr." : "Ajourné"}
          </EduBadge>
        ) : (
          <span className="text-[10px] text-[var(--ink-4)]">En saisie</span>
        )}
      </td>
    </tr>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function SaisieNotesPage() {
  const { periodes, typesEval, notes, setNote, soumettreLot, verrouillerLot } =
    useEvaluationStore();

  const [selectedClasse, setSelectedClasse] = useState(CLASSES[0]?.code ?? "");
  const [selectedMatiere, setSelectedMatiere] = useState(MATIERES[0]?.code ?? "");
  const [selectedPeriodeId, setSelectedPeriodeId] = useState(
    periodes.find(p => p.statut === "EN_COURS" && !p.estAgregat)?.id ?? periodes[0]?.id ?? "",
  );
  const [locked, setLocked] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [localNotes, setLocalNotes] = useState<Map<string, Map<string, CellValue>>>(new Map());
  const [saved, setSaved] = useState(false);

  // Derived
  const periodeCourante = periodes.find(p => p.id === selectedPeriodeId);
  const typesEvalPeriode = useMemo(() =>
    typesEval
      .filter(t => t.periodeId === selectedPeriodeId && t.statut === "ACTIF")
      .sort((a, b) => a.ordre - b.ordre),
    [typesEval, selectedPeriodeId]
  );
  const validation = useMemo(
    () => validateTypesEvaluation(typesEvalPeriode),
    [typesEvalPeriode],
  );

  const studentsClasse = useMemo(
    () => STUDENTS.filter(s => s.classe === selectedClasse),
    [selectedClasse],
  );

  const matiere = MATIERES.find(m => m.code === selectedMatiere);

  // Calcule la moyenne pour un étudiant
  function calcMoyenne(etudiantId: string): number | null {
    const studentNotes = localNotes.get(etudiantId);
    if (!studentNotes || studentNotes.size === 0) return null;
    if (!validation.valid) return null;

    let moy = 0;
    let hasAny = false;
    for (const te of typesEvalPeriode) {
      const val = studentNotes.get(te.id);
      if (val !== undefined && val !== null && val !== "ABS") {
        moy += ((val as number) / te.noteSur) * 20 * (te.pourcentage / 100);
        hasAny = true;
      }
    }
    return hasAny ? moy : null;
  }

  function handleNoteChange(etudiantId: string, typeEvalId: string, val: CellValue) {
    setSaved(false);
    setLocalNotes(prev => {
      const next = new Map(prev);
      const studentMap = new Map(next.get(etudiantId) ?? []);
      studentMap.set(typeEvalId, val);
      next.set(etudiantId, studentMap);
      return next;
    });
  }

  function handleSave() {
    // Persist to store
    localNotes.forEach((studentMap, etudiantId) => {
      studentMap.forEach((val, typeEvalId) => {
        // We use typeEvalId as a proxy examenId for demo
        setNote(
          typeEvalId,
          etudiantId,
          val === "ABS" ? null : (val as number | null),
          val === "ABS",
        );
      });
    });
    setSaved(true);
  }

  function handleSoumettre() {
    handleSave();
    typesEvalPeriode.forEach(te => soumettreLot(te.id));
  }

  function handleVerrouiller() {
    typesEvalPeriode.forEach(te => verrouillerLot(te.id));
    setLocked(true);
  }

  // Stats
  const moyennes = studentsClasse.map(s => calcMoyenne(s.code)).filter(m => m !== null) as number[];
  const moyClasse = moyennes.length > 0 ? moyennes.reduce((a, b) => a + b, 0) / moyennes.length : null;
  const moyMax = moyennes.length > 0 ? Math.max(...moyennes) : null;
  const moyMin = moyennes.length > 0 ? Math.min(...moyennes) : null;
  const saisiesCount = [...localNotes.values()].reduce((acc, m) => acc + m.size, 0);
  const totalCells = studentsClasse.length * typesEvalPeriode.length;
  const completionPct = totalCells > 0 ? Math.round((saisiesCount / totalCells) * 100) : 0;

  const allSelected = studentsClasse.length > 0 &&
    studentsClasse.every(s => selectedStudents.has(s.code));

  function toggleAll() {
    setSelectedStudents(prev => {
      if (allSelected) return new Set();
      return new Set(studentsClasse.map(s => s.code));
    });
  }

  const periodesSimples = periodes
    .filter(p => !p.estAgregat)
    .sort((a, b) => a.ordre - b.ordre);

  return (
    <div>
      <PageHeader
        title="Saisie des notes"
        subtitle={`${matiere?.lib ?? "—"} · ${selectedClasse} · ${periodeCourante?.nom ?? "—"}`}
        actions={
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--success)]">
                <CheckCircle className="w-3.5 h-3.5" />
                Sauvegardé
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Import Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Exporter
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} disabled={locked}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Brouillon
            </Button>
            <Button size="sm" onClick={handleSoumettre} disabled={locked}>
              <Send className="w-3.5 h-3.5 mr-1.5" /> Soumettre
            </Button>
          </div>
        }
      />

      {/* ── Selector bar ── */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-white border border-[var(--line)] rounded-[12px]">
        <Select value={selectedClasse} onValueChange={setSelectedClasse}>
          <SelectTrigger className="h-8 text-[12px] w-40">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            {CLASSES.map(c => (
              <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
          <SelectTrigger className="h-8 text-[12px] w-48">
            <SelectValue placeholder="Matière" />
          </SelectTrigger>
          <SelectContent>
            {MATIERES.map(m => (
              <SelectItem key={m.code} value={m.code}>{m.lib}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPeriodeId} onValueChange={setSelectedPeriodeId}>
          <SelectTrigger className="h-8 text-[12px] w-40">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {periodesSimples.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.nom}
                {p.statut === "EN_COURS" && " ●"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {/* Completion */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${completionPct}%`,
                  backgroundColor: completionPct === 100 ? "var(--success)" : "var(--blue)",
                }}
              />
            </div>
            <span className="text-[11px] text-[var(--ink-4)]">{completionPct}%</span>
          </div>

          {/* Lock toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => locked ? setLocked(false) : handleVerrouiller()}
            className={locked ? "border-[var(--danger)] text-[var(--danger)]" : ""}
          >
            {locked
              ? <><Unlock className="w-3.5 h-3.5 mr-1.5" /> Déverrouiller</>
              : <><Lock className="w-3.5 h-3.5 mr-1.5" /> Verrouiller</>
            }
          </Button>
        </div>
      </div>

      {/* ── Stats rapides ── */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { label: "Étudiants", value: studentsClasse.length, icon: Users },
          { label: "Moy. classe", value: moyClasse !== null ? moyClasse.toFixed(2) : "—", icon: TrendingUp, color: moyClasse ? getMention(moyClasse).couleur : undefined },
          { label: "Meilleure", value: moyMax !== null ? moyMax.toFixed(2) : "—", icon: TrendingUp, color: "var(--success)" },
          { label: "Plus basse", value: moyMin !== null ? moyMin.toFixed(2) : "—", icon: TrendingUp, color: moyMin !== null && moyMin < 10 ? "var(--danger)" : "var(--warning)" },
          { label: "Notes saisies", value: `${saisiesCount}/${totalCells}`, icon: CheckCircle },
        ].map(stat => (
          <Card key={stat.label} className="border-[var(--line)] shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-[18px] font-bold text-[var(--ink)]" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-[var(--ink-4)]">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Avertissements ── */}
      {!validation.valid && typesEvalPeriode.length > 0 && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-[10px] bg-[var(--warning-light)] border border-[rgba(180,83,9,0.2)]">
          <AlertTriangle className="w-4 h-4 text-[var(--warning)] shrink-0 mt-[1px]" />
          <div>
            <p className="text-[12px] font-semibold text-[var(--warning)]">Configuration invalide</p>
            {validation.erreurs.map((e, i) => (
              <p key={i} className="text-[11px] text-[var(--warning)]">{e}</p>
            ))}
          </div>
        </div>
      )}

      {typesEvalPeriode.length === 0 && (
        <div className="flex items-center gap-2 p-4 mb-4 rounded-[12px] border border-dashed border-[var(--line)] text-[var(--ink-4)]">
          <Info className="w-4 h-4 shrink-0" />
          <p className="text-[12px]">
            Aucun type d&apos;évaluation configuré pour cette période.
            <a href="/dashboard/academique/evaluation-system" className="text-[var(--blue)] underline ml-1">
              Configurer le système d&apos;évaluation
            </a>
          </p>
        </div>
      )}

      {/* ── Spreadsheet ── */}
      <Card className="border-[var(--line)] shadow-none overflow-hidden">
        {/* Barre d'actions de sélection */}
        {selectedStudents.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--blue-light)] border-b border-[var(--line)]">
            <span className="text-[12px] text-[var(--blue)] font-medium">
              {selectedStudents.size} étudiant{selectedStudents.size > 1 ? "s" : ""} sélectionné{selectedStudents.size > 1 ? "s" : ""}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-7"
              onClick={() => {
                selectedStudents.forEach(id => {
                  typesEvalPeriode.forEach(te => handleNoteChange(id, te.id, "ABS"));
                });
              }}
            >
              Marquer absents
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-7"
              onClick={() => {
                selectedStudents.forEach(id => {
                  typesEvalPeriode.forEach(te => handleNoteChange(id, te.id, null));
                });
              }}
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Réinitialiser
            </Button>
            <button
              onClick={() => setSelectedStudents(new Set())}
              className="ml-auto text-[11px] text-[var(--ink-4)] hover:text-[var(--danger)]"
            >
              Désélectionner
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* En-tête */}
            <thead>
              <tr className="bg-[var(--blue)] text-white">
                <th className="px-3 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-white cursor-pointer"
                  />
                </th>
                <th className="px-2 py-3 text-center text-[10px] font-bold w-10 uppercase tracking-wide">
                  #
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide min-w-[180px]">
                  Étudiant
                </th>

                {typesEvalPeriode.map(te => {
                  const total = typesEvalPeriode
                    .filter(t => t.statut === "ACTIF")
                    .reduce((a, t) => a + t.pourcentage, 0);
                  const isValid = Math.abs(total - 100) < 0.01;
                  return (
                    <th key={te.id} className="px-1 py-3 w-24">
                      <div className="text-center">
                        <p className="text-[11px] font-bold">{te.abrev}</p>
                        <p className="text-[9px] opacity-75">{te.nom}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span
                            className="text-[9px] px-1.5 py-[1px] rounded-[3px] font-bold"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.2)",
                              color: isValid ? "rgba(255,255,255,0.9)" : "#fcd34d",
                            }}
                          >
                            {te.pourcentage}%
                          </span>
                          <span className="text-[9px] opacity-60">/{te.noteSur}</span>
                        </div>
                      </div>
                    </th>
                  );
                })}

                <th className="px-3 py-3 w-24 text-center text-[10px] font-bold uppercase tracking-wide">
                  Moy./20
                </th>
                <th className="px-2 py-3 w-24 text-center text-[10px] font-bold uppercase tracking-wide">
                  Statut
                </th>
              </tr>
            </thead>

            {/* Corps */}
            <tbody>
              {studentsClasse.length === 0 && (
                <tr>
                  <td
                    colSpan={4 + typesEvalPeriode.length}
                    className="py-10 text-center text-[var(--ink-4)] text-[12px]"
                  >
                    Aucun étudiant dans cette classe.
                  </td>
                </tr>
              )}

              {studentsClasse.map(student => {
                const studentNotes = localNotes.get(student.code) ?? new Map();
                const moy = calcMoyenne(student.code);

                return (
                  <StudentRow
                    key={student.code}
                    student={student}
                    typesEval={typesEvalPeriode}
                    notes={studentNotes}
                    locked={locked}
                    isSelected={selectedStudents.has(student.code)}
                    moyenneGenerale={moy}
                    onSelectToggle={() =>
                      setSelectedStudents(prev => {
                        const next = new Set(prev);
                        next.has(student.code) ? next.delete(student.code) : next.add(student.code);
                        return next;
                      })
                    }
                    onNoteChange={(typeEvalId, val) =>
                      handleNoteChange(student.code, typeEvalId, val)
                    }
                  />
                );
              })}
            </tbody>

            {/* Pied de tableau — stats colonne */}
            {studentsClasse.length > 0 && typesEvalPeriode.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-[var(--line-dark)] bg-[var(--ivory)]">
                  <td colSpan={3} className="px-3 py-2.5">
                    <p className="text-[11px] font-semibold text-[var(--ink)]">
                      Statistiques colonne
                    </p>
                    <p className="text-[10px] text-[var(--ink-4)]">
                      {studentsClasse.length} étudiants · {completionPct}% saisis
                    </p>
                  </td>

                  {typesEvalPeriode.map(te => {
                    const vals = studentsClasse
                      .map(s => {
                        const v = localNotes.get(s.code)?.get(te.id);
                        return v !== null && v !== "ABS" && v !== undefined ? v as number : null;
                      })
                      .filter(v => v !== null) as number[];

                    const moy = vals.length > 0
                      ? vals.reduce((a, b) => a + b, 0) / vals.length
                      : null;

                    return (
                      <td key={te.id} className="px-1 py-2.5 text-center w-24">
                        {moy !== null ? (
                          <div>
                            <p className="text-[12px] font-bold text-[var(--ink)]">
                              {moy.toFixed(1)}
                            </p>
                            <p className="text-[9px] text-[var(--ink-4)]">
                              moy. ({vals.length})
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[var(--ink-4)]">—</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-3 py-2.5 text-center w-24">
                    {moyClasse !== null ? (
                      <p
                        className="text-[13px] font-bold"
                        style={{ color: getMention(moyClasse).couleur }}
                      >
                        {moyClasse.toFixed(2)}
                      </p>
                    ) : (
                      <span className="text-[11px] text-[var(--ink-4)]">—</span>
                    )}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 border-t border-[var(--line)] bg-[var(--ivory)] flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-4)]">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--danger-light)] border border-[var(--danger)]" />
            ABS = Absent
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-4)]">
            <kbd className="px-1.5 py-[1px] rounded border border-[var(--line-dark)] text-[9px] font-mono bg-white">Tab</kbd>
            Cellule suivante
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-4)]">
            <kbd className="px-1.5 py-[1px] rounded border border-[var(--line-dark)] text-[9px] font-mono bg-white">A</kbd>
            Absent
          </div>
          <div className="ml-auto text-[11px] text-[var(--ink-4)]">
            La moyenne est calculée en temps réel selon les pourcentages configurés.
          </div>
        </div>
      </Card>
    </div>
  );
}
