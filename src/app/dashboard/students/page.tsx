"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, Search, Download, Edit } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogBody } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { getStudentsColumns } from "@/components/data-table/columns/students-columns";
import { STUDENTS } from "@/constants/mock-data";
import { formatCurrency, age, formatDate } from "@/lib/utils";
import type { Student } from "@/types";

type Filter = "all" | "actif" | "suspendu" | "risque";

export default function StudentsPage() {
  const { t } = useTranslation("academique");
  const { t: tc } = useTranslation("common");

  const FILTER_LABELS: Record<Filter, string> = {
    all: tc("misc.all"),
    actif: t("students.status.actif"),
    suspendu: t("students.status.suspendu"),
    risque: "À risque",
  };

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    nom: "", prenom: "", dob: "", sexe: "M", tel: "", email: "",
    adresse: "", classe: "", filiere: "", tuteurNom: "", tuteurTel: "", notes: "",
  });

  const columns = useMemo(() => getStudentsColumns(t), [t]);

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
        title={t("students.pageTitle")}
        subtitle={`${filtered.length} étudiant(s) · ${STUDENTS.filter(s => s.statut === "Actif").length} actifs`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> {tc("actions.export")}</Button>
            <Button size="sm" onClick={() => setShowForm(true)}><UserPlus className="w-3.5 h-3.5" /> {t("students.addStudent")}</Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder={t("students.searchPlaceholder")} value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
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

      {/* DataTable */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="code"
          searchPlaceholder={t("students.searchPlaceholder")}
          filterFields={[
            { columnId: "statut", title: t("students.columns.status"), options: [
              { label: t("students.status.actif"), value: "Actif" },
              { label: t("students.status.suspendu"), value: "Suspendu" },
            ]},
            { columnId: "filiere", title: t("students.columns.filiere"), options: [
              { label: "Informatique", value: "Informatique" },
              { label: "Gestion", value: "Gestion" },
              { label: "Droit", value: "Droit" },
            ]},
            { columnId: "classe", title: t("students.columns.class"), options: [
              { label: "L1-INFO-A", value: "L1-INFO-A" },
              { label: "L1-INFO-B", value: "L1-INFO-B" },
              { label: "L2-INFO-B", value: "L2-INFO-B" },
              { label: "L1-GESTION-A", value: "L1-GESTION-A" },
              { label: "L2-GESTION-B", value: "L2-GESTION-B" },
              { label: "L3-DROIT-A", value: "L3-DROIT-A" },
              { label: "M1-INFO-A", value: "M1-INFO-A" },
            ]},
          ]}
          initialColumnVisibility={{ filiere: false }}
          pagination
          pageSize={10}
          emptyContent={<EmptyState title={tc("misc.noData")} description="Ajustez les filtres ou créez un nouveau dossier étudiant." />}
        />
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
                    { label: t("students.columns.average"), value: `${selected.moy}/20`, color: selected.moy >= 14 ? "var(--success)" : selected.moy >= 10 ? "var(--warning)" : "var(--danger)" },
                    { label: t("students.columns.absences"), value: `${selected.absences}`, color: selected.absences >= 10 ? "var(--danger)" : "var(--ink)" },
                    { label: t("students.columns.balance"), value: selected.solde > 0 ? formatCurrency(selected.solde) : "Soldé", color: selected.solde > 0 ? "var(--danger)" : "var(--success)" },
                    { label: t("students.columns.enrollmentDate"), value: formatDate(selected.created), color: "var(--ink)" },
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
                        { label: t("students.columns.birthDate"), value: `${formatDate(selected.dob)} (${age(selected.dob)} ans)` },
                        { label: t("students.columns.phone"), value: selected.tel },
                        { label: t("students.columns.email"), value: selected.email || "—" },
                        { label: t("students.columns.address"), value: selected.adresse },
                        { label: t("students.columns.gender"), value: selected.sexe === "F" ? tc("fields.female") : tc("fields.male") },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-[12.5px]">
                          <span className="text-[var(--ink-4)]">{label}</span>
                          <span className="font-medium text-[var(--ink)] text-right max-w-[55%]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">{t("students.columns.guardian")} / Contact urgence</div>
                    <div className="space-y-2">
                      {[
                        { label: tc("fields.name"), value: selected.tuteurNom || "—" },
                        { label: t("students.columns.guardianPhone"), value: selected.tuteurTel || "—" },
                        { label: t("students.columns.session"), value: selected.session },
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
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>{tc("actions.close")}</Button>
                <Button size="sm"><Edit className="w-3.5 h-3.5" /> {tc("actions.edit")}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add student modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("students.addStudent")}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "nom", label: `${t("students.columns.lastName")} *`, placeholder: "Mballa" },
                { id: "prenom", label: `${t("students.columns.firstName")} *`, placeholder: "Christian" },
                { id: "dob", label: `${t("students.columns.birthDate")} *`, type: "date" },
                { id: "tel", label: `${t("students.columns.phone")} *`, placeholder: "+237 6XX XXX XXX" },
                { id: "email", label: t("students.columns.email"), placeholder: "email@exemple.cm" },
                { id: "adresse", label: t("students.columns.address"), placeholder: "Quartier, Ville" },
                { id: "tuteurNom", label: t("students.columns.guardian"), placeholder: "Nom du tuteur" },
                { id: "tuteurTel", label: t("students.columns.guardianPhone"), placeholder: "+237 6XX XXX XXX" },
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
                <Label htmlFor="sexe">{t("students.columns.gender")}</Label>
                <Select value={formData.sexe} onValueChange={v => setFormData(prev => ({ ...prev, sexe: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">{tc("fields.male")}</SelectItem>
                    <SelectItem value="F">{tc("fields.female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filiere">{t("students.columns.filiere")}</Label>
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
                <Label htmlFor="classe">{t("students.columns.class")}</Label>
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
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>{tc("actions.cancel")}</Button>
            <Button size="sm" onClick={() => { setShowForm(false); toast("Étudiant créé avec succès !"); }}>
              <UserPlus className="w-3.5 h-3.5" /> {tc("actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
