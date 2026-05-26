"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Save, Shield, Key, LogOut, Mail, Phone, MapPin,
  Briefcase, Building2, Calendar, Clock, CheckCircle2,
  CreditCard, GraduationCap, FileText, UserCheck, Edit2,
  Eye, EyeOff, Check, X, Activity, Zap, ChevronRight,
  TrendingUp, Users, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/* ── Static data ──────────────────────────────────────────────────────────── */

const RECENT_ACTIVITY = [
  { icon: GraduationCap, color: "bg-[var(--blue-light)] text-[var(--blue)]",     text: "Admission de Patrick Essono validée",          time: "Il y a 12 min" },
  { icon: CreditCard,    color: "bg-[var(--success-light)] text-[var(--success)]",text: "Paiement de 250 000 FCFA enregistré — ETU-009", time: "Il y a 34 min" },
  { icon: FileText,      color: "bg-purple-50 text-purple-600",                   text: "Rapport semestriel exporté (PDF)",               time: "Il y a 2h"    },
  { icon: UserCheck,     color: "bg-[var(--cyan-light)] text-[var(--cyan)]",      text: "Feuille de présence INF101 clôturée",            time: "Il y a 3h"    },
  { icon: Shield,        color: "bg-amber-50 text-amber-600",                     text: "Connexion depuis un nouvel appareil",            time: "Hier, 18:42"  },
];

const STATS = [
  { label: "Connexions",  value: "38",  icon: TrendingUp, color: "text-[var(--blue)]",    bg: "bg-[var(--blue-light)]"   },
  { label: "Actions",     value: "214", icon: Zap,        color: "text-[var(--cyan)]",    bg: "bg-[var(--cyan-light)]"   },
  { label: "Sessions",    value: "1",   icon: Activity,   color: "text-[var(--success)]", bg: "bg-[var(--success-light)]"},
  { label: "Depuis",      value: "2022",icon: Star,       color: "text-purple-500",        bg: "bg-purple-50"             },
];

const INFO_FIELDS = [
  { icon: Mail,      label: "Email",        key: "email",        color: "bg-[var(--blue-light)] text-[var(--blue)]"     },
  { icon: Phone,     label: "Téléphone",    key: "phone",        color: "bg-[var(--cyan-light)] text-[var(--cyan)]"     },
  { icon: Briefcase, label: "Poste",        key: "poste",        color: "bg-[var(--blue-light)] text-[var(--blue)]"     },
  { icon: Building2, label: "Département",  key: "departement",  color: "bg-purple-50 text-purple-500"                   },
  { icon: MapPin,    label: "Localisation", key: "location",     color: "bg-[var(--success-light)] text-[var(--success)]"},
] as const;

/* ── Password helpers ─────────────────────────────────────────────────────── */

function getPwStrength(pw: string) {
  return [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
}

const PW_REQS = [
  { label: "8 caractères minimum",  test: (pw: string) => pw.length >= 8         },
  { label: "Une majuscule",         test: (pw: string) => /[A-Z]/.test(pw)       },
  { label: "Un chiffre",            test: (pw: string) => /[0-9]/.test(pw)       },
  { label: "Un caractère spécial",  test: (pw: string) => /[^A-Za-z0-9]/.test(pw)},
];

const STRENGTH_LABELS = ["", "Faible", "Passable", "Bon", "Fort"];
const STRENGTH_COLORS = ["", "bg-[var(--danger)]", "bg-[var(--warning)]", "bg-[var(--cyan)]", "bg-[var(--success)]"];
const STRENGTH_TEXT   = ["", "text-[var(--danger)]", "text-[var(--warning)]", "text-[var(--cyan)]", "text-[var(--success)]"];

/* ── Component ────────────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const showToast = useToast();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    prenom: "Admin", nom: "Principal",
    email: "admin@edustar.cm",
    phone: "+237 699 000 000",
    poste: "Administrateur système",
    departement: "Direction générale",
    location: "Yaoundé, Cameroun",
    bio: "Responsable de la gestion académique, administrative et financière de la plateforme EduStar.",
  });

  const [passwords, setPasswords]     = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]           = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError]         = useState("");

  const initials = `${profile.prenom[0]}${profile.nom[0]}`.toUpperCase();

  const pwStrengths = getPwStrength(passwords.next);
  const pwScore     = pwStrengths.filter(Boolean).length;

  function handleSaveProfile() {
    setEditMode(false);
    showToast("Profil mis à jour avec succès !");
  }

  function handleChangePassword() {
    if (!passwords.current || !passwords.next) { setPwError("Veuillez remplir tous les champs."); return; }
    if (passwords.next !== passwords.confirm)  { setPwError("Les mots de passe ne correspondent pas."); return; }
    if (passwords.next.length < 8)            { setPwError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setPwError("");
    setPasswords({ current: "", next: "", confirm: "" });
    showToast("Mot de passe modifié !");
  }

  /* ────────────────────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-5"
    >

      {/* ══ HERO CARD ══════════════════════════════════════════════════════ */}
      <Card className="overflow-hidden border-[var(--line)]">

        {/* Banner */}
        <div className="h-36 sm:h-44 relative overflow-hidden bg-gradient-to-r from-[var(--blue)] via-[#1e4fac] to-[var(--cyan)]">
          {/* Dot-mesh overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 left-1/3  w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-white/[0.04]" />
        </div>

        <CardContent className="pt-0 px-5 sm:px-7 pb-6 sm:pb-7">

          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14">

            {/* Avatar + name */}
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                {/* Outer ring */}
                <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] opacity-30 blur-sm" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[16px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-white font-bold text-3xl sm:text-4xl border-4 border-white shadow-xl select-none">
                  {initials}
                  {/* Online dot */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--success)] border-2 border-white" />
                </div>
                <button
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-[var(--line)] flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all"
                  title="Changer la photo"
                >
                  <Camera className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                </button>
              </div>

              <div className="mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl text-[var(--ink)] tracking-[-0.02em] leading-tight">
                    {profile.prenom} {profile.nom}
                  </h1>
                  {/* Admin badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white shadow-sm">
                    <Shield className="w-2.5 h-2.5" /> Admin
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[12px] text-[var(--ink-4)]">{profile.poste}</span>
                  <span className="text-[var(--ink-5)]">·</span>
                  <span className="text-[12px] text-[var(--blue)] font-semibold">{profile.departement}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  <span className="text-[11px] text-[var(--success)] font-medium">En ligne</span>
                </div>
              </div>
            </div>

            {/* Edit actions */}
            <div className="flex items-center gap-2 sm:mb-2">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Annuler</Button>
                    <Button size="sm" onClick={handleSaveProfile} className="gap-1.5">
                      <Save className="w-3.5 h-3.5" /> Sauvegarder
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" /> Modifier le profil
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[var(--line)]">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--ivory)] border border-[var(--line)] hover:border-[var(--line-dark)] hover:shadow-sm transition-all"
              >
                <div className={cn("w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0", s.bg)}>
                  <s.icon className={cn("w-4 h-4", s.color)} />
                </div>
                <div>
                  <div className={cn("font-serif text-[18px] leading-none tracking-[-0.02em]", s.color)}>{s.value}</div>
                  <div className="text-[10px] text-[var(--ink-4)] mt-0.5 font-medium">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ══ BODY GRID ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Informations personnelles */}
          <Card className="border-[var(--line)]">
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
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "prenom",      label: "Prénom",       key: "prenom"      as const },
                        { id: "nom",         label: "Nom",          key: "nom"         as const },
                        { id: "email",       label: "Email",        key: "email"       as const, type: "email" },
                        { id: "phone",       label: "Téléphone",    key: "phone"       as const },
                        { id: "poste",       label: "Poste",        key: "poste"       as const },
                        { id: "departement", label: "Département",  key: "departement" as const },
                        { id: "location",    label: "Localisation", key: "location"    as const },
                      ].map(({ id, label, key, type }) => (
                        <div key={id}>
                          <Label htmlFor={id}>{label}</Label>
                          <Input id={id} type={type} value={profile[key]}
                            onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea id="bio" value={profile.bio}
                          onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                          className="resize-none" rows={3} />
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                        <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Annuler</Button>
                        <Button size="sm" onClick={handleSaveProfile} className="gap-1.5">
                          <Save className="w-3.5 h-3.5" /> Sauvegarder
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="view-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1.5">
                    {INFO_FIELDS.map(({ icon: Icon, label, key, color }) => (
                      <div
                        key={label}
                        className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-[var(--blue-lighter)] transition-colors cursor-default"
                      >
                        <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0", color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-5)]">{label}</div>
                          <div className="text-[13.5px] text-[var(--ink)] font-medium truncate">{profile[key]}</div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--ink-5)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}

                    {/* Bio */}
                    {profile.bio && (
                      <div className="mt-2 px-3 py-3.5 rounded-xl bg-[var(--blue-lighter)] border-l-[3px] border-[var(--blue)]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--blue)] mb-1">Biographie</div>
                        <p className="text-[13px] text-[var(--ink-3)] leading-relaxed">{profile.bio}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="border-[var(--line)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-amber-50 flex items-center justify-center">
                  <Key className="w-4 h-4 text-amber-500" />
                </div>
                <CardTitle>Sécurité du compte</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">

                {/* Current password */}
                <div className="space-y-1.5">
                  <Label htmlFor="pw-current">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="pw-current"
                      type={showPw.current ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink-2)] transition-colors"
                    >
                      {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New + confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["next", "confirm"] as const).map((field) => (
                    <div key={field} className="space-y-1.5">
                      <Label htmlFor={`pw-${field}`}>
                        {field === "next" ? "Nouveau mot de passe" : "Confirmer"}
                      </Label>
                      <div className="relative">
                        <Input
                          id={`pw-${field}`}
                          type={showPw[field] ? "text" : "password"}
                          placeholder={field === "next" ? "8 min." : "••••••••"}
                          value={passwords[field]}
                          onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink-2)] transition-colors"
                        >
                          {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strength + requirements */}
                <AnimatePresence>
                  {passwords.next.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {/* Strength bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[var(--ink-4)] font-medium uppercase tracking-wider">Force</span>
                          <span className={cn("text-[11px] font-semibold", STRENGTH_TEXT[pwScore])}>
                            {STRENGTH_LABELS[pwScore]}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--line)]">
                              <motion.div
                                className={cn("h-full rounded-full", i < pwScore ? STRENGTH_COLORS[pwScore] : "")}
                                initial={{ width: 0 }}
                                animate={{ width: i < pwScore ? "100%" : "0%" }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements checklist */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {PW_REQS.map(({ label, test }) => {
                          const ok = test(passwords.next);
                          return (
                            <div key={label} className="flex items-center gap-1.5">
                              <div className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all",
                                ok ? "bg-[var(--success)] text-white" : "bg-[var(--line)] text-[var(--ink-5)]"
                              )}>
                                {ok
                                  ? <Check className="w-2.5 h-2.5" />
                                  : <X className="w-2.5 h-2.5" />
                                }
                              </div>
                              <span className={cn("text-[11px]", ok ? "text-[var(--success)]" : "text-[var(--ink-4)]")}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {pwError && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-1.5 text-[12px] text-[var(--danger)] font-medium"
                    >
                      <X className="w-3.5 h-3.5 shrink-0" /> {pwError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={handleChangePassword} className="gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Modifier le mot de passe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Activité récente */}
          <Card className="border-[var(--line)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[var(--blue-light)] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[var(--blue)]" />
                </div>
                <div>
                  <CardTitle>Activité récente</CardTitle>
                  <p className="text-[10.5px] text-[var(--ink-4)]">Aujourd'hui</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="relative px-5">
                {/* Timeline connector */}
                <div className="absolute left-[2.35rem] top-0 bottom-0 w-px bg-[var(--line)]" />

                {RECENT_ACTIVITY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="flex items-start gap-3 py-3 hover:bg-[var(--blue-lighter)] -mx-5 px-5 transition-colors group rounded-xl cursor-default"
                  >
                    <div className={cn("w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 relative z-10 ring-2 ring-white", item.color)}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[var(--ink)] leading-snug">{item.text}</p>
                      <p className="text-[11px] text-[var(--ink-4)] mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {item.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-[var(--line)]">
                <button className="text-[12px] text-[var(--blue)] font-semibold hover:underline flex items-center gap-1 w-full justify-center">
                  Voir tout l'historique <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Statut du compte */}
          <Card className="border-[var(--line)]">
            <CardHeader>
              <CardTitle>Statut du compte</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {[
                {
                  icon: CheckCircle2, label: "Compte vérifié",
                  desc: "Email confirmé",
                  iconBg: "bg-[var(--success-light)]", iconColor: "text-[var(--success)]",
                  dot: "bg-[var(--success)]",
                },
                {
                  icon: Shield, label: "Accès administrateur",
                  desc: "Toutes permissions",
                  iconBg: "bg-[var(--blue-light)]", iconColor: "text-[var(--blue)]",
                  dot: "bg-[var(--blue)]",
                },
                {
                  icon: Calendar, label: "Membre depuis 2022",
                  desc: "3 ans d'ancienneté",
                  iconBg: "bg-amber-50", iconColor: "text-amber-500",
                  dot: "bg-amber-400",
                },
              ].map(({ icon: Icon, label, desc, iconBg, iconColor, dot }) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--ivory)] border border-[var(--line)]">
                  <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0", iconBg)}>
                    <Icon className={cn("w-4.5 h-4.5", iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-[var(--ink)] leading-tight">{label}</div>
                    <div className="text-[11px] text-[var(--ink-4)]">{desc}</div>
                  </div>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />
                </div>
              ))}

              <Separator className="my-1" />

              {/* Danger zone */}
              <div className="px-3 py-2.5 rounded-xl bg-[var(--danger-light)]/60 border border-[var(--danger)]/15">
                <button className="flex items-center gap-2 text-[12.5px] text-[var(--danger)] font-semibold w-full hover:opacity-80 transition-opacity">
                  <LogOut className="w-4 h-4" />
                  <span className="flex-1 text-left">Déconnecter tous les appareils</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  );
}
