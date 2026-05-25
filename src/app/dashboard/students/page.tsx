"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Download, Filter, MoreVertical, Eye, Edit, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogBody } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { STUDENTS } from "@/constants/mock-data";
import { formatCurrency, age, formatDate } from "@/lib/utils";
import type { Student } from "@/types";

type Filter = "all" | "actif" | "suspendu" | "risque";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Tous", actif: "Actifs", suspendu: "Suspendus", risque: "À risque",
};

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    nom: "", prenom: "", dob: "", sexe: "M", tel: "", email: "",
    adresse: "", classe: "", filiere: "", tuteurNom: "", tuteurTel: "", notes: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const filtered = useMemo(() => {
    let list = STUDENTS;
    if (filter === "actif") list = list.filter(s => s.statut === "Actif");
    else if (filter === "suspendu") list = list.filter(s => s.statut === "Suspendu");
    else if (filter === "risque") list = list.filter(s => s.absences >= 10 || s.solde > 300000 || s.moy < 10);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.code.toLowerCase().includes(q) ||
        s.nom.toLowerCase().includes(q) ||
        s.prenom.toLowerCase().includes(q) ||
        s.classe.toLowerCase().includes(q) ||
        s.filiere.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, filter]);

  return (
    <div>
      <PageHeader
        title="Étudiants"
        subtitle={`${filtered.length} étudiant(s) · ${STUDENTS.filter(s => s.statut === "Actif").length} actifs`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Exporter</Button>
            <Button size="sm" onClick={() => setShowForm(true)}><UserPlus className="w-3.5 h-3.5" /> Nouvel étudiant</Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Nom, prénom, code…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-[5px] rounded-full text-[11.5px] font-semibold border-[1.5px] transition-all ${
              filter === f
                ? "bg-[var(--blue-lighter)] border-[var(--blue)] text-[var(--blue)]"
                : "bg-white border-[var(--line-dark)] text-[var(--ink-4)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lighter)]"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[var(--ivory)]">
                {["Code", "Étudiant", "Classe", "Moy.", "Absences", "Solde", "Statut", ""].map(h => (
                  <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap last:w-10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8}><EmptyState title="Aucun étudiant trouvé" description="Ajustez les filtres ou créez un nouveau dossier étudiant." /></td></tr>
              )}
              {filtered.map(s => (
                <motion.tr
                  key={s.code}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <td className="px-3.5 py-[10px]">
                    <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{s.code}</span>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <div className="flex items-center gap-2">
                      <EduAvatar name={`${s.prenom} ${s.nom}`} size={28} />
                      <div>
                        <div className="font-semibold text-[var(--ink)]">{s.prenom} {s.nom}</div>
                        <div className="text-[10.5px] text-[var(--ink-4)]">{s.sexe === "F" ? "Féminin" : "Masculin"} · {age(s.dob)} ans</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <div className="font-semibold text-[var(--ink)] text-[11px]">{s.classe}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">{s.filiere}</div>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <EduBadge variant={s.moy >= 14 ? "green" : s.moy >= 10 ? "amber" : "red"}>{s.moy}/20</EduBadge>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <EduBadge variant={s.absences >= 10 ? "red" : s.absences >= 5 ? "amber" : "neutral"}>{s.absences} abs.</EduBadge>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    {s.solde > 0
                      ? <span className="text-[var(--danger)] font-bold">{formatCurrency(s.solde)}</span>
                      : <EduBadge variant="green">Soldé</EduBadge>
                    }
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <EduBadge variant={statusBadge(s.statut)}>{s.statut}</EduBadge>
                  </td>
                  <td className="px-3.5 py-[10px]" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelected(s)}><Eye className="w-3.5 h-3.5" /> Voir dossier</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-3.5 h-3.5" /> Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive><Trash2 className="w-3.5 h-3.5" /> Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent size="lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <EduAvatar name={`${selected.prenom} ${selected.nom}`} size={40} />
                  <div>
                    <DialogTitle>{selected.prenom} {selected.nom}</DialogTitle>
                    <p className="text-[11px] text-[var(--ink-4)] mt-0.5">{selected.code} · {selected.classe} · {selected.filiere}</p>
                  </div>
                  <EduBadge variant={statusBadge(selected.statut)} className="ml-auto">{selected.statut}</EduBadge>
                </div>
              </DialogHeader>
              <DialogBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Moyenne", value: `${selected.moy}/20`, color: selected.moy >= 14 ? "var(--success)" : selected.moy >= 10 ? "var(--warning)" : "var(--danger)" },
                    { label: "Absences", value: `${selected.absences}`, color: selected.absences >= 10 ? "var(--danger)" : "var(--ink)" },
                    { label: "Solde dû", value: selected.solde > 0 ? formatCurrency(selected.solde) : "Soldé", color: selected.solde > 0 ? "var(--danger)" : "var(--success)" },
                    { label: "Inscription", value: formatDate(selected.created), color: "var(--ink)" },
                  ].map(item => (
                    <div key={item.label} className="bg-[var(--ivory)] rounded-[10px] p-3 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">{item.label}</div>
                      <div className="text-[15px] font-bold" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">Informations personnelles</div>
                    <div className="space-y-2">
                      {[
                        { label: "Date de naissance", value: `${formatDate(selected.dob)} (${age(selected.dob)} ans)` },
                        { label: "Téléphone", value: selected.tel },
                        { label: "Email", value: selected.email || "—" },
                        { label: "Adresse", value: selected.adresse },
                        { label: "Sexe", value: selected.sexe === "F" ? "Féminin" : "Masculin" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-[12.5px]">
                          <span className="text-[var(--ink-4)]">{label}</span>
                          <span className="font-medium text-[var(--ink)] text-right max-w-[55%]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">Tuteur / Contact urgence</div>
                    <div className="space-y-2">
                      {[
                        { label: "Nom", value: selected.tuteurNom || "—" },
                        { label: "Téléphone", value: selected.tuteurTel || "—" },
                        { label: "Session", value: selected.session },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-[12.5px]">
                          <span className="text-[var(--ink-4)]">{label}</span>
                          <span className="font-medium text-[var(--ink)]">{value}</span>
                        </div>
                      ))}
                    </div>
                    {selected.notes && (
                      <div className="mt-4 p-3 bg-[var(--blue-lighter)] rounded-[8px] border border-[var(--blue-light)]">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--blue)] mb-1">Notes</div>
                        <p className="text-[12.5px] text-[var(--ink-2)]">{selected.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Fermer</Button>
                <Button size="sm"><Edit className="w-3.5 h-3.5" /> Modifier</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add student modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel étudiant</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "nom", label: "Nom *", placeholder: "Mballa" },
                { id: "prenom", label: "Prénom *", placeholder: "Christian" },
                { id: "dob", label: "Date de naissance *", type: "date" },
                { id: "tel", label: "Téléphone *", placeholder: "+237 6XX XXX XXX" },
                { id: "email", label: "Email", placeholder: "email@exemple.cm" },
                { id: "adresse", label: "Adresse", placeholder: "Quartier, Ville" },
                { id: "tuteurNom", label: "Nom tuteur", placeholder: "Nom du tuteur" },
                { id: "tuteurTel", label: "Tél. tuteur", placeholder: "+237 6XX XXX XXX" },
              ].map(({ id, label, placeholder, type }) => (
                <div key={id} className={id === "adresse" ? "col-span-2" : ""}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type || "text"}
                    placeholder={placeholder}
                    value={(formData as any)[id]}
                    onChange={e => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <Label htmlFor="sexe">Sexe</Label>
                <Select value={formData.sexe} onValueChange={v => setFormData(prev => ({ ...prev, sexe: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filiere">Filière</Label>
                <Select value={formData.filiere} onValueChange={v => setFormData(prev => ({ ...prev, filiere: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    {["Informatique", "Gestion", "Droit", "Lettres"].map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="classe">Classe</Label>
                <Select value={formData.classe} onValueChange={v => setFormData(prev => ({ ...prev, classe: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir une classe…" /></SelectTrigger>
                  <SelectContent>
                    {["L1-INFO-A","L1-INFO-B","L2-INFO-B","L1-GESTION-A","L2-GESTION-B","L3-DROIT-A","M1-INFO-A"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button size="sm" onClick={() => { setShowForm(false); showToast("Étudiant créé avec succès !"); }}>
              <UserPlus className="w-3.5 h-3.5" /> Créer le dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-5 right-5 z-[9999] bg-[var(--ink)] text-white rounded-[10px] px-4 py-3 flex items-center gap-3 shadow-lg border-l-[3px] border-[var(--success)] text-[12.5px] font-medium max-w-[300px]"
          >
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")} className="text-white/40 hover:text-white/80"><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
