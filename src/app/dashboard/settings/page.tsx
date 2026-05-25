"use client";
import { useState } from "react";
import { Save, School, Globe, Bell, Shield, Palette, Database } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SettingsPage() {
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const [general, setGeneral] = useState({
    schoolName: "EduStar University",
    email: "contact@edustar.cm",
    phone: "+237 222 000 000",
    address: "Avenue de l'Indépendance, Yaoundé, Cameroun",
    website: "www.edustar.cm",
    session: "2025-2026",
  });

  const SETTINGS_NAV = [
    { value: "general", label: "Établissement", icon: School },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "appearance", label: "Apparence", icon: Palette },
    { value: "security", label: "Sécurité", icon: Shield },
    { value: "data", label: "Données", icon: Database },
  ];

  return (
    <div>
      <PageHeader
        title="Paramètres système"
        subtitle="Configuration globale de la plateforme EduStar"
      />

      <Tabs defaultValue="general">
        <TabsList>
          {SETTINGS_NAV.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Informations de l'établissement</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "schoolName", label: "Nom de l'établissement *", placeholder: "EduStar University" },
                    { id: "email", label: "Email officiel", placeholder: "contact@edustar.cm", type: "email" },
                    { id: "phone", label: "Téléphone principal", placeholder: "+237 XXX XXX XXX" },
                    { id: "website", label: "Site web", placeholder: "www.edustar.cm" },
                  ].map(f => (
                    <div key={f.id}>
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <Input id={f.id} type={f.type || "text"} placeholder={f.placeholder}
                        value={(general as any)[f.id]}
                        onChange={e => setGeneral(prev => ({ ...prev, [f.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <Label htmlFor="address">Adresse complète</Label>
                    <Input id="address" placeholder="Avenue, Quartier, Ville, Pays" value={general.address}
                      onChange={e => setGeneral(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Session en cours</Label>
                    <Select value={general.session} onValueChange={v => setGeneral(prev => ({ ...prev, session: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025–2026</SelectItem>
                        <SelectItem value="2024-2025">2024–2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Langue principale</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex justify-end">
                  <Button onClick={() => showToast("Paramètres sauvegardés !")}>
                    <Save className="w-3.5 h-3.5" /> Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="max-w-2xl space-y-3">
            {[
              { label: "Paiements en retard", desc: "Recevoir une alerte lorsqu'un paiement dépasse la date d'échéance" },
              { label: "Nouvelles admissions", desc: "Notification à chaque nouveau dossier de candidature reçu" },
              { label: "Absences répétées", desc: "Alerte lorsqu'un étudiant dépasse 10 absences" },
              { label: "Résultats publiés", desc: "Notification lors de la publication des notes d'examen" },
              { label: "Rapports hebdomadaires", desc: "Résumé automatique chaque lundi matin" },
            ].map((item, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{item.label}</div>
                    <div className="text-[11.5px] text-[var(--ink-4)] mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-9 h-5 rounded-full bg-[var(--blue)] flex items-center justify-end pr-0.5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex justify-end">
              <Button onClick={() => showToast("Préférences de notification sauvegardées !")}>
                <Save className="w-3.5 h-3.5" /> Sauvegarder
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Thème et apparence</CardTitle></CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Couleur principale</Label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { name: "Bleu (défaut)", colors: "from-[#1a3c8f] to-[#0099cc]" },
                      { name: "Violet", colors: "from-[#6b48ff] to-[#0099cc]" },
                      { name: "Vert", colors: "from-[#0a7c4e] to-[#0099cc]" },
                    ].map(t => (
                      <button
                        key={t.name}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.colors} ring-2 ring-offset-2 ring-[var(--blue)] cursor-pointer`}
                        title={t.name}
                      />
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <Label>Mode d'affichage</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Clair", "Sombre", "Auto"].map(mode => (
                      <button
                        key={mode}
                        className={`p-3 rounded-[8px] border-[1.5px] text-[12.5px] font-semibold transition-all ${
                          mode === "Clair"
                            ? "border-[var(--blue)] bg-[var(--blue-lighter)] text-[var(--blue)]"
                            : "border-[var(--line)] text-[var(--ink-4)] hover:border-[var(--blue)]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="max-w-2xl space-y-4">
            <Card>
              <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "current", label: "Mot de passe actuel" },
                    { id: "new", label: "Nouveau mot de passe" },
                    { id: "confirm", label: "Confirmer le nouveau mot de passe" },
                  ].map(f => (
                    <div key={f.id}>
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <Input id={f.id} type="password" placeholder="••••••••" />
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <Button onClick={() => showToast("Mot de passe modifié !")}>
                      <Shield className="w-3.5 h-3.5" /> Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data">
          <div className="max-w-2xl space-y-4">
            {[
              { title: "Exporter les données", desc: "Télécharger toutes les données au format CSV ou JSON", action: "Exporter", variant: "outline" as const },
              { title: "Sauvegarder la base", desc: "Créer une sauvegarde complète de la base de données", action: "Sauvegarder", variant: "primary" as const },
              { title: "Importer des données", desc: "Importer des étudiants, notes ou paiements depuis un fichier CSV", action: "Importer", variant: "outline" as const },
            ].map(item => (
              <Card key={item.title}>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{item.title}</div>
                    <div className="text-[11.5px] text-[var(--ink-4)] mt-0.5">{item.desc}</div>
                  </div>
                  <Button variant={item.variant} size="sm" onClick={() => showToast(`${item.action} en cours…`)}>
                    {item.action}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-5 right-5 z-[9999] bg-[var(--ink)] text-white rounded-[10px] px-4 py-3 flex items-center gap-3 shadow-lg border-l-[3px] border-[var(--success)] text-[12.5px] font-medium"
          >
            <span>{toast}</span>
            <button onClick={() => setToast("")}><X className="w-3.5 h-3.5 text-white/40 hover:text-white/80" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
