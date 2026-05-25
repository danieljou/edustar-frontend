"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { usersColumns } from "@/components/data-table/columns/users-columns";
import { APP_USERS } from "@/constants/mock-data";
import type { AppUser } from "@/types";

const PROFIL_LABELS: Record<string, string> = {
  ADM: "Administrateur",
  DIR: "Direction",
  ENS: "Enseignant",
  SCO: "Scolarité",
  CPT: "Comptabilité",
  BIB: "Bibliothécaire",
};

const PROFIL_COLOR: Record<string, string> = {
  ADM: "var(--danger)",
  DIR: "var(--purple)",
  ENS: "var(--blue)",
  SCO: "var(--cyan)",
  CPT: "var(--success)",
  BIB: "var(--warning)",
};

const STATUT_VARIANT: Record<string, "green" | "red" | "amber"> = {
  Actif: "green",
  Inactif: "amber",
  Suspendu: "red",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [profil, setProfil] = useState("all");
  const [statut, setStatut] = useState("all");

  const filtered = APP_USERS.filter(u => {
    const matchProfil = profil === "all" || u.profil === profil;
    const matchStatut = statut === "all" || u.statut === statut;
    const matchQuery = !query.trim() || (`${u.prenom} ${u.nom}`).toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    return matchProfil && matchStatut && matchQuery;
  });

  const actifs = APP_USERS.filter(u => u.statut === "Actif").length;

  return (
    <div>
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle={`${APP_USERS.length} comptes · ${actifs} actifs`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> Créer un compte</Button>}
      />

      {/* Role distribution */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {Object.entries(PROFIL_LABELS).map(([code, label]) => {
          const count = APP_USERS.filter(u => u.profil === code).length;
          return (
            <button
              key={code}
              onClick={() => setProfil(profil === code ? "all" : code)}
              className={`bg-white border rounded-[12px] p-3 text-center transition-all ${profil === code ? "border-[var(--blue)] shadow-sm" : "border-[var(--line)] hover:border-[var(--blue-mid)]"}`}
            >
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mx-auto mb-1.5 text-[11px] font-bold" style={{ background: `${PROFIL_COLOR[code]}18`, color: PROFIL_COLOR[code] }}>
                {code}
              </div>
              <div className="font-serif text-[18px]" style={{ color: PROFIL_COLOR[code] }}>{count}</div>
              <div className="text-[9.5px] text-[var(--ink-4)] truncate">{label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Nom, email…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-44">
          <Select value={profil} onValueChange={setProfil}>
            <SelectTrigger><SelectValue placeholder="Profil" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les profils</SelectItem>
              {Object.entries(PROFIL_LABELS).map(([code, label]) => <SelectItem key={code} value={code}>{code} — {label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-36">
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="Suspendu">Suspendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DataTable */}
      <Card>
        <DataTable
          columns={usersColumns}
          data={filtered}
          searchKey="id"
          searchPlaceholder="Rechercher par nom ou email…"
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}
