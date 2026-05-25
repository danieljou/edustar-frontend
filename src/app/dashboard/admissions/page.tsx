"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, CheckCircle, XCircle, Clock, FileText, MoreVertical, Eye, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogBody } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ADMISSIONS } from "@/constants/mock-data";
import { age, formatDate } from "@/lib/utils";
import type { Admission } from "@/types";

export default function AdmissionsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Admission | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const filtered = useMemo(() => {
    if (!query.trim()) return ADMISSIONS;
    const q = query.toLowerCase();
    return ADMISSIONS.filter(a =>
      a.nom.toLowerCase().includes(q) || a.prenom.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) || a.filiere.toLowerCase().includes(q)
    );
  }, [query]);

  const counts = {
    all: ADMISSIONS.length,
    pending: ADMISSIONS.filter(a => a.statut === "En attente").length,
    validated: ADMISSIONS.filter(a => a.statut === "Validé").length,
    rejected: ADMISSIONS.filter(a => a.statut === "Rejeté").length,
  };

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle={`${counts.all} dossiers · ${counts.pending} en attente`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> Nouveau dossier</Button>}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {[
          { label: "En attente", value: counts.pending, icon: <Clock className="w-4 h-4" />, accent: "bg-[var(--warning-light)] text-[var(--warning)]" },
          { label: "Validées", value: counts.validated, icon: <CheckCircle className="w-4 h-4" />, accent: "bg-[var(--success-light)] text-[var(--success)]" },
          { label: "Rejetées", value: counts.rejected, icon: <XCircle className="w-4 h-4" />, accent: "bg-[var(--danger-light)] text-[var(--danger)]" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${c.accent}`}>{c.icon}</div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{c.label}</div>
              <div className="font-serif text-[22px] text-[var(--ink)]">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Nom, ID, filière…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{counts.all}</span></TabsTrigger>
          <TabsTrigger value="pending">En attente <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{counts.pending}</span></TabsTrigger>
          <TabsTrigger value="validated">Validées</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées</TabsTrigger>
        </TabsList>

        {(["all", "pending", "validated", "rejected"] as const).map(tab => {
          const tabFiltered = filtered.filter(a =>
            tab === "all" ? true :
            tab === "pending" ? a.statut === "En attente" :
            tab === "validated" ? a.statut === "Validé" :
            a.statut === "Rejeté"
          );
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="bg-[var(--ivory)]">
                        {["ID", "Candidat", "Filière / Niveau", "Documents", "Date", "Statut", ""].map(h => (
                          <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap last:w-10">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tabFiltered.length === 0 && (
                        <tr><td colSpan={7}><EmptyState title="Aucune admission" description="Aucun dossier ne correspond aux critères." /></td></tr>
                      )}
                      {tabFiltered.map(a => (
                        <tr key={a.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] cursor-pointer transition-colors" onClick={() => setSelected(a)}>
                          <td className="px-3.5 py-[10px]"><span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{a.id}</span></td>
                          <td className="px-3.5 py-[10px]">
                            <div className="flex items-center gap-2">
                              <EduAvatar name={`${a.prenom} ${a.nom}`} size={28} />
                              <div>
                                <div className="font-semibold text-[var(--ink)]">{a.prenom} {a.nom}</div>
                                <div className="text-[10.5px] text-[var(--ink-4)]">{a.sexe === "F" ? "Féminin" : "Masculin"} · {age(a.dob)} ans</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            <div className="font-semibold text-[11px]">{a.filiere}</div>
                            <div className="text-[10px] text-[var(--ink-4)]">{a.niveau}</div>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-bold text-[var(--ink)]">{a.docs.length}</span>
                              <span className="text-[10.5px] text-[var(--ink-4)]">/ 5 docs</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {[0,1,2,3,4].map(i => (
                                <div key={i} className={`w-4 h-1.5 rounded-full ${i < a.docs.length ? "bg-[var(--success)]" : "bg-[var(--line)]"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-3.5 py-[10px] text-[var(--ink-4)] whitespace-nowrap">{formatDate(a.date)}</td>
                          <td className="px-3.5 py-[10px]"><EduBadge variant={statusBadge(a.statut)}>{a.statut}</EduBadge></td>
                          <td className="px-3.5 py-[10px]" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelected(a)}><Eye className="w-3.5 h-3.5" /> Voir dossier</DropdownMenuItem>
                                {a.statut === "En attente" && (
                                  <>
                                    <DropdownMenuItem onClick={() => showToast(`Admission ${a.id} validée !`)}><Check className="w-3.5 h-3.5" /> Valider</DropdownMenuItem>
                                    <DropdownMenuItem destructive onClick={() => showToast(`Admission ${a.id} rejetée.`)}><X className="w-3.5 h-3.5" /> Rejeter</DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <EduAvatar name={`${selected.prenom} ${selected.nom}`} size={40} />
                  <div>
                    <DialogTitle>{selected.prenom} {selected.nom}</DialogTitle>
                    <p className="text-[11px] text-[var(--ink-4)] mt-0.5">{selected.id} · {selected.filiere} {selected.niveau}</p>
                  </div>
                  <EduBadge variant={statusBadge(selected.statut)} className="ml-auto">{selected.statut}</EduBadge>
                </div>
              </DialogHeader>
              <DialogBody>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    {[
                      { label: "Date de naissance", value: `${formatDate(selected.dob)} (${age(selected.dob)} ans)` },
                      { label: "Téléphone", value: selected.tel },
                      { label: "Email", value: selected.email || "—" },
                      { label: "Date dossier", value: formatDate(selected.date) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-[12.5px]">
                        <span className="text-[var(--ink-4)]">{label}</span>
                        <span className="font-medium text-[var(--ink)]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">Documents fournis ({selected.docs.length})</div>
                    <div className="space-y-1.5">
                      {["Baccalauréat", "Relevé de notes", "Photo", "Extrait de naissance", "Certificat médical"].map(doc => (
                        <div key={doc} className="flex items-center gap-2 text-[12px]">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${selected.docs.includes(doc) ? "bg-[var(--success)]" : "bg-[var(--line)]"}`}>
                            {selected.docs.includes(doc) && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <span className={selected.docs.includes(doc) ? "text-[var(--ink)]" : "text-[var(--ink-4)] line-through"}>{doc}</span>
                        </div>
                      ))}
                    </div>
                    {selected.notes && (
                      <div className="mt-3 p-2.5 bg-[var(--blue-lighter)] rounded-[8px] text-[12px] text-[var(--ink-2)]">
                        <strong className="text-[var(--blue)] text-[10px] uppercase tracking-widest block mb-1">Notes</strong>
                        {selected.notes}
                      </div>
                    )}
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Fermer</Button>
                {selected.statut === "En attente" && (
                  <>
                    <Button variant="danger" size="sm" onClick={() => { setSelected(null); showToast("Admission rejetée."); }}><X className="w-3.5 h-3.5" /> Rejeter</Button>
                    <Button variant="success" size="sm" onClick={() => { setSelected(null); showToast("Admission validée !"); }}><Check className="w-3.5 h-3.5" /> Valider</Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-5 right-5 z-[9999] bg-[var(--ink)] text-white rounded-[10px] px-4 py-3 flex items-center gap-3 shadow-lg border-l-[3px] border-[var(--success)] text-[12.5px] font-medium max-w-[300px]"
          >
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")}><X className="w-3.5 h-3.5 text-white/40 hover:text-white/80" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
