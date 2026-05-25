"use client";
import { useState, useMemo } from "react";
import { UserPlus, Search, MoreVertical, Eye, Edit, Briefcase, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PERSONNEL } from "@/constants/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function HRPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return PERSONNEL;
    const q = query.toLowerCase();
    return PERSONNEL.filter(p =>
      p.nom.toLowerCase().includes(q) || p.prenom.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) || p.dept.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPayroll = PERSONNEL.filter(p => p.statut === "Actif").reduce((s, p) => s + p.salaire, 0);
  const roleGroups = PERSONNEL.reduce((acc, p) => {
    acc[p.role] = (acc[p.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Ressources Humaines"
        subtitle={`${PERSONNEL.length} membres · ${PERSONNEL.filter(p => p.statut === "Actif").length} actifs`}
        actions={<Button size="sm"><UserPlus className="w-3.5 h-3.5" /> Nouveau membre</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white border border-[var(--line)] rounded-[14px] p-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--blue)] rounded-l-[14px]" />
          <div className="pl-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">Masse salariale</div>
            <div className="font-serif text-[18px] text-[var(--ink)] mt-1 leading-tight">{formatCurrency(totalPayroll)}</div>
            <div className="text-[11px] text-[var(--ink-4)] mt-0.5">mensuelle</div>
          </div>
        </div>
        {Object.entries(roleGroups).slice(0, 3).map(([role, count]) => (
          <div key={role} className="bg-white border border-[var(--line)] rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{role}s</div>
            <div className="font-serif text-[22px] text-[var(--ink)] mt-1">{count}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tout le personnel</TabsTrigger>
          <TabsTrigger value="teachers">Enseignants</TabsTrigger>
          <TabsTrigger value="admin">Administratifs</TabsTrigger>
        </TabsList>

        {(["all", "teachers", "admin"] as const).map(tab => {
          const tabFiltered = filtered.filter(p =>
            tab === "all" ? true :
            tab === "teachers" ? p.role === "Enseignant" :
            p.role === "Administratif" || p.role === "Technicien"
          );
          return (
            <TabsContent key={tab} value={tab}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
                  <Input placeholder="Nom, département…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
                </div>
              </div>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="bg-[var(--ivory)]">
                        {["ID", "Membre", "Rôle / Dept.", "Contact", "Salaire", "Contrat", "Statut", ""].map(h => (
                          <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap last:w-10">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tabFiltered.length === 0 && <tr><td colSpan={8}><EmptyState title="Aucun membre" /></td></tr>}
                      {tabFiltered.map(p => (
                        <tr key={p.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
                          <td className="px-3.5 py-[10px]"><span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{p.id}</span></td>
                          <td className="px-3.5 py-[10px]">
                            <div className="flex items-center gap-2">
                              <EduAvatar name={`${p.prenom} ${p.nom}`} size={30} />
                              <div>
                                <div className="font-semibold text-[var(--ink)]">{p.prenom} {p.nom}</div>
                                <div className="text-[10.5px] text-[var(--ink-4)]">{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            <EduBadge variant={p.role === "Enseignant" ? "blue" : p.role === "Direction" ? "purple" : "neutral"}>{p.role}</EduBadge>
                            <div className="text-[10.5px] text-[var(--ink-4)] mt-1">{p.dept}</div>
                          </td>
                          <td className="px-3.5 py-[10px]">
                            <div className="text-[12px]">{p.tel}</div>
                            <div className="text-[10.5px] text-[var(--ink-4)]">Depuis {formatDate(p.entree)}</div>
                          </td>
                          <td className="px-3.5 py-[10px]"><span className="font-bold text-[var(--ink)]">{formatCurrency(p.salaire)}</span></td>
                          <td className="px-3.5 py-[10px]"><EduBadge variant={p.contrat === "CDI" ? "green" : p.contrat === "CDD" ? "amber" : "neutral"}>{p.contrat}</EduBadge></td>
                          <td className="px-3.5 py-[10px]"><EduBadge variant={statusBadge(p.statut)}>{p.statut}</EduBadge></td>
                          <td className="px-3.5 py-[10px]" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="w-3.5 h-3.5" /> Voir fiche</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="w-3.5 h-3.5" /> Modifier</DropdownMenuItem>
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
    </div>
  );
}
