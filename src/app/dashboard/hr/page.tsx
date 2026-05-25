"use client";
import { useState, useMemo } from "react";
import { UserPlus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { hrColumns } from "@/components/data-table/columns/hr-columns";
import { PERSONNEL } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";

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
              <Card>
                <DataTable
                  columns={hrColumns}
                  data={tabFiltered}
                  searchKey="nom"
                  searchPlaceholder="Rechercher un membre…"
                  pagination
                  pageSize={10}
                />
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
