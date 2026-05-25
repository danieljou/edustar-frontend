"use client";

import { useState } from "react";
import {
  Camera, Save, Shield, Key, LogOut, Mail, Phone, MapPin,
  Briefcase, Building2, Calendar, Clock, CheckCircle2,
  CreditCard, GraduationCap, FileText, UserCheck, Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const RECENT_ACTIVITY = [
  { icon: GraduationCap, color: "bg-[var(--blue-light)] text-[var(--blue)]", text: "Admission de Patrick Essono validée", time: "Il y a 12 min" },
  { icon: CreditCard, color: "bg-[var(--success-light)] text-[var(--success)]", text: "Paiement de 250 000 FCFA enregistré — ETU-009", time: "Il y a 34 min" },
  { icon: FileText, color: "bg-purple-50 text-purple-600", text: "Rapport semestriel exporté (PDF)", time: "Il y a 2h" },
  { icon: UserCheck, color: "bg-[var(--cyan-light)] text-[var(--cyan)]", text: "Feuille de présence INF101 clôturée", time: "Il y a 3h" },
  { icon: Shield, color: "bg-amber-50 text-amber-600", text: "Connexion depuis un nouvel appareil", time: "Hier, 18:42" },
];

const STATS = [
  { label: "Sessions actives", value: "1" },
  { label: "Connexions ce mois", value: "38" },
  { label: "Actions effectuées", value: "214" },
  { label: "Membre depuis", value: "2022" },
];

export default function ProfilePage() {
  const showToast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    prenom: "Admin",
    nom: "Principal",
    email: "admin@edustar.cm",
    phone: "+237 699 000 000",
    poste: "Administrateur système",
    departement: "Direction générale",
    location: "Yaoundé, Cameroun",
    bio: "Responsable de la gestion académique, administrative et financière de la plateforme EduStar.",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  function handleSaveProfile() {
    setEditMode(false);
    showToast("Profil mis à jour avec succès !");
  }

  function handleChangePassword() {
    if (!passwords.current || !passwords.next) {
      setPwError("Veuillez remplir tous les champs.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (passwords.next.length < 8) {
      setPwError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setPwError("");
    setPasswords({ current: "", next: "", confirm: "" });
    showToast("Mot de passe modifié !");
  }

  const initials = `${profile.prenom[0]}${profile.nom[0]}`.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Hero card ─────────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] relative" />

        <CardContent className="pt-0 px-5 sm:px-7 pb-5 sm:pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-12">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl border-4 border-white shadow-lg select-none">
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-[var(--line)] flex items-center justify-center shadow-sm hover:bg-[var(--ivory)] transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                </button>
              </div>
              <div className="mb-1">
                <h1 className="font-serif text-[20px] sm:text-[22px] text-[var(--ink)] leading-tight tracking-[-0.02em]">
                  {profile.prenom} {profile.nom}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] text-[var(--ink-4)]">{profile.poste}</span>
                  <span className="text-[var(--ink-5)]">·</span>
                  <span className="text-[12px] text-[var(--blue)] font-medium">{profile.departement}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:mb-1">
              {editMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Annuler</Button>
                  <Button size="sm" onClick={handleSaveProfile}>
                    <Save className="w-3.5 h-3.5" /> Sauvegarder
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit2 className="w-3.5 h-3.5" /> Modifier le profil
                </Button>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[var(--line)]">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-[20px] text-[var(--ink)] tracking-[-0.02em]">{s.value}</div>
                <div className="text-[10.5px] text-[var(--ink-4)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-[12px] text-[var(--blue)] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Modifier
                </button>
              )}
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" value={profile.prenom}
                      onChange={e => setProfile(p => ({ ...p, prenom: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" value={profile.nom}
                      onChange={e => setProfile(p => ({ ...p, nom: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="poste">Poste</Label>
                    <Input id="poste" value={profile.poste}
                      onChange={e => setProfile(p => ({ ...p, poste: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="departement">Département</Label>
                    <Input id="departement" value={profile.departement}
                      onChange={e => setProfile(p => ({ ...p, departement: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input id="location" value={profile.location}
                      onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea id="bio" value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      className="resize-none" rows={3}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Annuler</Button>
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="w-3.5 h-3.5" /> Sauvegarder
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {[
                    { icon: Mail, label: "Email", value: profile.email },
                    { icon: Phone, label: "Téléphone", value: profile.phone },
                    { icon: Briefcase, label: "Poste", value: profile.poste },
                    { icon: Building2, label: "Département", value: profile.departement },
                    { icon: MapPin, label: "Localisation", value: profile.location },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[var(--ivory)] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-5)]">{label}</div>
                        <div className="text-[13px] text-[var(--ink)] truncate">{value}</div>
                      </div>
                    </div>
                  ))}
                  {profile.bio && (
                    <>
                      <Separator />
                      <p className="text-[13px] text-[var(--ink-3)] leading-relaxed">{profile.bio}</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="pw-current">Mot de passe actuel</Label>
                  <Input id="pw-current" type="password" placeholder="••••••••"
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pw-new">Nouveau mot de passe</Label>
                    <Input id="pw-new" type="password" placeholder="8 caractères min."
                      value={passwords.next}
                      onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="pw-confirm">Confirmer</Label>
                    <Input id="pw-confirm" type="password" placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                </div>

                {/* Password strength */}
                {passwords.next.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          passwords.next.length >= i * 2
                            ? i <= 1 ? "bg-[var(--danger)]"
                              : i <= 2 ? "bg-[var(--warning)]"
                              : i <= 3 ? "bg-[var(--cyan)]"
                              : "bg-[var(--success)]"
                            : "bg-[var(--line)]"
                        )} />
                      ))}
                    </div>
                    <div className="text-[10.5px] text-[var(--ink-4)]">
                      {passwords.next.length < 4 ? "Trop court" :
                       passwords.next.length < 6 ? "Faible" :
                       passwords.next.length < 8 ? "Moyen" : "Fort"}
                    </div>
                  </div>
                )}

                {pwError && (
                  <p className="text-[11.5px] text-[var(--danger)] font-medium">{pwError}</p>
                )}

                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={handleChangePassword}>
                    <Key className="w-3.5 h-3.5" /> Modifier le mot de passe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ────────────────────────────────── */}
        <div className="space-y-5">

          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <span className="text-[10.5px] text-[var(--ink-4)]">Aujourd'hui</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--line)]">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-[var(--blue-lighter)] transition-colors">
                    <div className={cn("w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5", item.color)}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[var(--ink)] leading-snug">{item.text}</p>
                      <p className="text-[11px] text-[var(--ink-4)] mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statut du compte */}
          <Card>
            <CardHeader>
              <CardTitle>Statut du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: CheckCircle2, label: "Compte vérifié", color: "text-[var(--success)]" },
                { icon: Shield, label: "Accès administrateur", color: "text-[var(--blue)]" },
                { icon: Calendar, label: "Connecté depuis 2022", color: "text-[var(--ink-3)]" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className={cn("w-4 h-4 shrink-0", color)} />
                  <span className="text-[12.5px] text-[var(--ink)]">{label}</span>
                </div>
              ))}
              <Separator />
              <button className="flex items-center gap-2 text-[12.5px] text-[var(--danger)] font-medium hover:underline w-full">
                <LogOut className="w-3.5 h-3.5" /> Se déconnecter de tous les appareils
              </button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
