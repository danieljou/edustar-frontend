"use client";
import { useState, useMemo } from "react";
import { Plus, Search, Download, MoreVertical, Eye, CreditCard, AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { PAYMENTS, MORATORIUMS, STUDENTS } from "@/constants/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const [query, setQuery] = useState("");
  const toast = useToast();

  const totalCollected = PAYMENTS.filter(p => p.statut === "Validé").reduce((s, p) => s + p.montant, 0);
  const totalPending = PAYMENTS.filter(p => p.statut === "En attente").reduce((s, p) => s + p.montant, 0);
  const totalDebt = STUDENTS.reduce((s, st) => s + st.solde, 0);

  const filtered = useMemo(() => {
    if (!query.trim()) return PAYMENTS;
    const q = query.toLowerCase();
    return PAYMENTS.filter(p => p.id.toLowerCase().includes(q) || p.etuCode.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  }, [query]);

  const getStudent = (code: string) => STUDENTS.find(s => s.code === code);

  return (
    <div>
      <PageHeader
        title="Paiements"
        subtitle="Gestion des paiements, moratoires et soldes"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Exporter</Button>
            <Button size="sm"><Plus className="w-3.5 h-3.5" /> Nouveau paiement</Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {[
          { label: "Revenus collectés", value: formatCurrency(totalCollected), icon: <TrendingUp className="w-4 h-4" />, color: "bg-[var(--success-light)] text-[var(--success)]", accent: "var(--success)" },
          { label: "En attente validation", value: formatCurrency(totalPending), icon: <CreditCard className="w-4 h-4" />, color: "bg-[var(--warning-light)] text-[var(--warning)]", accent: "var(--warning)" },
          { label: "Soldes impayés total", value: formatCurrency(totalDebt), icon: <AlertTriangle className="w-4 h-4" />, color: "bg-[var(--danger-light)] text-[var(--danger)]", accent: "var(--danger)" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]" style={{ background: c.accent }} />
            <div className="flex items-start justify-between pl-1">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{c.label}</div>
                <div className="font-serif text-[20px] text-[var(--ink)] mt-1.5 leading-tight">{c.value}</div>
              </div>
              <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${c.color}`}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{PAYMENTS.length}</span></TabsTrigger>
          <TabsTrigger value="moratoriums">Moratoires <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{MORATORIUMS.length}</span></TabsTrigger>
          <TabsTrigger value="debts">Soldes impayés</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
              <Input placeholder="ID paiement, étudiant…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-[var(--ivory)]">
                    {["Réf.", "Étudiant", "Type", "Montant", "Mode", "Date", "Statut", ""].map(h => (
                      <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap last:w-10">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan={8}><EmptyState title="Aucune transaction" /></td></tr>}
                  {filtered.map(p => {
                    const stu = getStudent(p.etuCode);
                    return (
                      <tr key={p.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
                        <td className="px-3.5 py-[10px]"><span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{p.ref}</span></td>
                        <td className="px-3.5 py-[10px]">
                          <div className="flex items-center gap-2">
                            {stu && <EduAvatar name={`${stu.prenom} ${stu.nom}`} size={26} />}
                            <div>
                              <div className="font-semibold">{stu ? `${stu.prenom} ${stu.nom}` : p.etuCode}</div>
                              <div className="text-[10.5px] text-[var(--ink-4)]">{p.etuCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{p.type}</td>
                        <td className="px-3.5 py-[10px]"><span className="font-bold text-[var(--ink)]">{formatCurrency(p.montant)}</span></td>
                        <td className="px-3.5 py-[10px]">
                          <EduBadge variant={p.mode === "Mobile Money" ? "cyan" : p.mode === "Virement" ? "blue" : p.mode === "Chèque" ? "purple" : "neutral"}>{p.mode}</EduBadge>
                        </td>
                        <td className="px-3.5 py-[10px] text-[var(--ink-4)] whitespace-nowrap">{formatDate(p.date)}</td>
                        <td className="px-3.5 py-[10px]"><EduBadge variant={statusBadge(p.statut)}>{p.statut}</EduBadge></td>
                        <td className="px-3.5 py-[10px]" onClick={e => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="w-3.5 h-3.5" /> Détails</DropdownMenuItem>
                              <DropdownMenuItem><Download className="w-3.5 h-3.5" /> Reçu PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="moratoriums">
          <div className="space-y-3">
            {MORATORIUMS.map(m => {
              const stu = getStudent(m.etuCode);
              const pct = Math.round((m.montantPaye / m.montantTotal) * 100);
              return (
                <Card key={m.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {stu && <EduAvatar name={`${stu.prenom} ${stu.nom}`} size={36} />}
                      <div>
                        <div className="font-semibold text-[var(--ink)]">{stu ? `${stu.prenom} ${stu.nom}` : m.etuCode}</div>
                        <div className="text-[11px] text-[var(--ink-4)]">{m.etuCode} · {stu?.classe}</div>
                      </div>
                    </div>
                    <EduBadge variant={statusBadge(m.statut)}>{m.statut}</EduBadge>
                  </div>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="text-[var(--ink-4)]">Progression</span>
                    <span className="font-bold text-[var(--ink)]">{formatCurrency(m.montantPaye)} / {formatCurrency(m.montantTotal)}</span>
                  </div>
                  <Progress value={pct} className="mb-3" />
                  <div className="grid grid-cols-3 gap-2">
                    {m.echeances.map((e, i) => (
                      <div key={i} className={`rounded-[8px] p-2.5 text-center border ${
                        e.statut === "Payé" ? "bg-[var(--success-light)] border-[rgba(10,124,78,0.2)]" :
                        e.statut === "En retard" ? "bg-[var(--danger-light)] border-[rgba(192,57,43,0.2)]" :
                        "bg-[var(--ivory)] border-[var(--line)]"
                      }`}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">{e.statut}</div>
                        <div className="text-[12.5px] font-bold text-[var(--ink)]">{formatCurrency(e.mont)}</div>
                        <div className="text-[10px] text-[var(--ink-4)] mt-0.5">{formatDate(e.date)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="debts">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-[var(--ivory)]">
                    {["Étudiant", "Classe", "Solde dû", "Absences", "Statut"].map(h => (
                      <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.filter(s => s.solde > 0).map(s => (
                    <tr key={s.code} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
                      <td className="px-3.5 py-[10px]">
                        <div className="flex items-center gap-2">
                          <EduAvatar name={`${s.prenom} ${s.nom}`} size={28} />
                          <div>
                            <div className="font-semibold text-[var(--ink)]">{s.prenom} {s.nom}</div>
                            <div className="text-[10.5px] text-[var(--ink-4)]">{s.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-[10px] text-[11px] font-semibold">{s.classe}</td>
                      <td className="px-3.5 py-[10px]"><span className="text-[var(--danger)] font-bold">{formatCurrency(s.solde)}</span></td>
                      <td className="px-3.5 py-[10px]"><EduBadge variant={s.absences >= 10 ? "red" : s.absences >= 5 ? "amber" : "neutral"}>{s.absences} abs.</EduBadge></td>
                      <td className="px-3.5 py-[10px]"><EduBadge variant={statusBadge(s.statut)}>{s.statut}</EduBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
