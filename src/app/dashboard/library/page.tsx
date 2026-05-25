"use client";
import { useState } from "react";
import { Search, BookOpen, Clock, AlertTriangle, Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIVRES, EMPRUNTS, STUDENTS } from "@/constants/mock-data";

const CATEGORIES = ["all", "Informatique", "Gestion", "Droit"];

const STATUT_VARIANT: Record<string, "green" | "red" | "amber"> = {
  "En cours": "green",
  "Retourné": "green",
  "En retard": "red",
};

export default function LibraryPage() {
  const [catFilter, setCatFilter] = useState("all");
  const [searchLivre, setSearchLivre] = useState("");

  const filteredLivres = LIVRES.filter(l => {
    const matchCat = catFilter === "all" || l.categorie === catFilter;
    const matchSearch = !searchLivre.trim() || l.titre.toLowerCase().includes(searchLivre.toLowerCase()) || l.auteur.toLowerCase().includes(searchLivre.toLowerCase());
    return matchCat && matchSearch;
  });

  const enRetard = EMPRUNTS.filter(e => e.statut === "En retard").length;
  const enCours = EMPRUNTS.filter(e => e.statut === "En cours").length;
  const totalDispo = LIVRES.reduce((s, l) => s + l.disponibles, 0);
  const totalExemplaires = LIVRES.reduce((s, l) => s + l.exemplaires, 0);

  return (
    <div>
      <PageHeader
        title="Bibliothèque"
        subtitle={`${LIVRES.length} ouvrages · ${totalDispo} disponibles`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RotateCcw className="w-3.5 h-3.5" /> Enregistrer retour</Button>
            <Button size="sm"><Plus className="w-3.5 h-3.5" /> Nouvel emprunt</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Total ouvrages", value: LIVRES.length, color: "var(--blue)", icon: <BookOpen className="w-4 h-4" /> },
          { label: "Exemplaires disponibles", value: `${totalDispo}/${totalExemplaires}`, color: "var(--success)", icon: <BookOpen className="w-4 h-4" /> },
          { label: "Emprunts en cours", value: enCours, color: "var(--cyan)", icon: <Clock className="w-4 h-4" /> },
          { label: "Retards", value: enRetard, color: enRetard > 0 ? "var(--danger)" : "var(--success)", icon: <AlertTriangle className="w-4 h-4" /> },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${k.color}18`, color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{k.label}</div>
              <div className="font-serif text-[22px]" style={{ color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="catalogue">
        <TabsList className="mb-4">
          <TabsTrigger value="catalogue">Catalogue ({LIVRES.length})</TabsTrigger>
          <TabsTrigger value="emprunts">Emprunts ({EMPRUNTS.filter(e => e.statut === "En cours").length})</TabsTrigger>
          <TabsTrigger value="retards">Retards <span className="ml-1 bg-[var(--danger)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{enRetard}</span></TabsTrigger>
        </TabsList>

        {/* Catalogue */}
        <TabsContent value="catalogue">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
              <Input placeholder="Titre, auteur, ISBN…" value={searchLivre} onChange={e => setSearchLivre(e.target.value)} className="pl-8" />
            </div>
            <div className="w-40">
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c === "all" ? "Toutes catégories" : c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredLivres.map(livre => (
              <Card key={livre.id} className="hover:border-[var(--blue-mid)] transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 rounded-[6px] bg-gradient-to-b from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12.5px] text-[var(--ink)] leading-snug line-clamp-2 mb-0.5">{livre.titre}</div>
                      <div className="text-[11px] text-[var(--ink-4)]">{livre.auteur} · {livre.annee}</div>
                      <div className="text-[10px] text-[var(--ink-4)] mt-0.5">{livre.editeur}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--line)]">
                    <div className="flex items-center gap-2">
                      <EduBadge variant="neutral">{livre.categorie}</EduBadge>
                      <span className="text-[10px] text-[var(--ink-4)]">{livre.localisation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[11px] font-bold ${livre.disponibles === 0 ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                        {livre.disponibles}/{livre.exemplaires}
                      </span>
                      <span className="text-[10px] text-[var(--ink-4)]">ex.</span>
                    </div>
                  </div>

                  {livre.disponibles === 0 && (
                    <div className="mt-2 text-[10.5px] text-[var(--danger)] font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Tous les exemplaires sont empruntés
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emprunts en cours */}
        <TabsContent value="emprunts">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-[var(--ivory)]">
                    {["Ouvrage", "Étudiant", "Date emprunt", "Date retour prévue", "Statut", "Action"].map(h => (
                      <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPRUNTS.filter(e => e.statut === "En cours").map(emp => {
                    const livre = LIVRES.find(l => l.id === emp.livreId);
                    const etu = STUDENTS.find(s => s.code === emp.etuCode);
                    return (
                      <tr key={emp.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                        <td className="px-3.5 py-[10px]">
                          <div className="font-medium text-[var(--ink)] max-w-[200px] truncate">{livre?.titre ?? "—"}</div>
                          <div className="text-[10px] text-[var(--ink-4)]">{livre?.auteur}</div>
                        </td>
                        <td className="px-3.5 py-[10px]">
                          {etu ? (
                            <div className="flex items-center gap-1.5">
                              <EduAvatar name={`${etu.prenom} ${etu.nom}`} size={24} />
                              <div>
                                <div className="font-medium text-[var(--ink)]">{etu.prenom} {etu.nom}</div>
                                <div className="text-[10px] text-[var(--ink-4)]">{etu.classe}</div>
                              </div>
                            </div>
                          ) : <span className="text-[var(--ink-4)]">{emp.etuCode}</span>}
                        </td>
                        <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{new Date(emp.dateEmprunt).toLocaleDateString("fr-FR")}</td>
                        <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{new Date(emp.dateRetourPrevu).toLocaleDateString("fr-FR")}</td>
                        <td className="px-3.5 py-[10px]"><EduBadge variant={STATUT_VARIANT[emp.statut]}>{emp.statut}</EduBadge></td>
                        <td className="px-3.5 py-[10px]"><Button variant="outline" size="xs">Retour</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Retards */}
        <TabsContent value="retards">
          {EMPRUNTS.filter(e => e.statut === "En retard").length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-[var(--ink-4)] text-[13px]">Aucun retard en cours.</p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-[var(--danger-light)]">
                      {["Ouvrage", "Étudiant", "Date emprunt", "Date retour prévue", "Jours de retard", "Action"].map(h => (
                        <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--danger)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EMPRUNTS.filter(e => e.statut === "En retard").map(emp => {
                      const livre = LIVRES.find(l => l.id === emp.livreId);
                      const etu = STUDENTS.find(s => s.code === emp.etuCode);
                      const joursRetard = Math.floor((new Date("2026-05-25").getTime() - new Date(emp.dateRetourPrevu).getTime()) / 86400000);
                      return (
                        <tr key={emp.id} className="border-b border-[var(--line)] last:border-0 bg-[var(--danger-light)]/30 hover:bg-[var(--danger-light)]/60 transition-colors">
                          <td className="px-3.5 py-[10px]">
                            <div className="font-medium text-[var(--ink)] max-w-[200px] truncate">{livre?.titre ?? "—"}</div>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            {etu ? (
                              <div className="flex items-center gap-1.5">
                                <EduAvatar name={`${etu.prenom} ${etu.nom}`} size={24} />
                                <span className="font-medium text-[var(--ink)]">{etu.prenom} {etu.nom}</span>
                              </div>
                            ) : <span>{emp.etuCode}</span>}
                          </td>
                          <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{new Date(emp.dateEmprunt).toLocaleDateString("fr-FR")}</td>
                          <td className="px-3.5 py-[10px] text-[var(--danger)] font-medium">{new Date(emp.dateRetourPrevu).toLocaleDateString("fr-FR")}</td>
                          <td className="px-3.5 py-[10px]">
                            <span className="font-bold text-[var(--danger)]">+{joursRetard} jour{joursRetard > 1 ? "s" : ""}</span>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            <Button variant="outline" size="xs" className="border-[var(--danger)] text-[var(--danger)]">Relancer</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
