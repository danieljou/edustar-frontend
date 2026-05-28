"use client";
import { useState } from "react";
import { Save, School, Bell, Shield, Palette, Database } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { t } = useTranslation("systeme");
  const showToast = useToast();

  const NOTIF_ITEMS = [
    { id: "payments",   label: t("settings.notifItems.payments.label"),   desc: t("settings.notifItems.payments.desc") },
    { id: "admissions", label: t("settings.notifItems.admissions.label"), desc: t("settings.notifItems.admissions.desc") },
    { id: "absences",   label: t("settings.notifItems.absences.label"),   desc: t("settings.notifItems.absences.desc") },
    { id: "resultats",  label: t("settings.notifItems.resultats.label"),  desc: t("settings.notifItems.resultats.desc") },
    { id: "rapports",   label: t("settings.notifItems.rapports.label"),   desc: t("settings.notifItems.rapports.desc") },
  ];

  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(i => [i.id, true]))
  );

  const toggleNotif = (id: string) => setNotifPrefs(prev => ({ ...prev, [id]: !prev[id] }));

  const [general, setGeneral] = useState({
    schoolName: "EduStar University",
    email: "contact@edustar.cm",
    phone: "+237 222 000 000",
    address: "Avenue de l'Indépendance, Yaoundé, Cameroun",
    website: "www.edustar.cm",
    session: "2025-2026",
  });

  const SETTINGS_NAV = [
    { value: "general",       label: t("settings.tabs.school"),        icon: School   },
    { value: "notifications", label: t("settings.tabs.notifications"), icon: Bell     },
    { value: "appearance",    label: t("settings.tabs.appearance"),    icon: Palette  },
    { value: "security",      label: t("settings.tabs.security"),      icon: Shield   },
    { value: "data",          label: t("settings.tabs.data"),          icon: Database },
  ];

  return (
    <div>
      <PageHeader
        title={t("settings.pageTitle2")}
        subtitle={t("settings.pageSubtitle2")}
      />

      <Tabs defaultValue="general">
        <TabsList>
          {SETTINGS_NAV.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General / School info */}
        <TabsContent value="general">
          <div className="max-w-2xl">
            <Card>
              <CardHeader><CardTitle>{t("settings.school.infoTitle")}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "schoolName", label: t("settings.school.schoolNameLabel"), placeholder: "EduStar University" },
                    { id: "email",      label: t("settings.school.officialEmail"),   placeholder: "contact@edustar.cm", type: "email" },
                    { id: "phone",      label: t("settings.school.mainPhone"),       placeholder: "+237 XXX XXX XXX" },
                    { id: "website",    label: t("settings.school.website"),         placeholder: "www.edustar.cm" },
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
                    <Label htmlFor="address">{t("settings.school.addressFull")}</Label>
                    <Input id="address" placeholder="Avenue, Quartier, Ville, Pays" value={general.address}
                      onChange={e => setGeneral(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>{t("settings.general.currentSession")}</Label>
                    <Select value={general.session} onValueChange={v => setGeneral(prev => ({ ...prev, session: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025–2026</SelectItem>
                        <SelectItem value="2024-2025">2024–2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("settings.general.primaryLanguage")}</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">{t("settings.general.french")}</SelectItem>
                        <SelectItem value="en">{t("settings.general.english")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex justify-end">
                  <Button onClick={() => showToast(t("settings.settingsSaved"))}>
                    <Save className="w-3.5 h-3.5" /> {t("settings.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="max-w-2xl space-y-3">
            {NOTIF_ITEMS.map(item => {
              const on = notifPrefs[item.id];
              return (
                <Card key={item.id}>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--ink)]">{item.label}</div>
                      <div className="text-[11.5px] text-[var(--ink-4)] mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.id)}
                      className={`w-9 h-5 rounded-full flex items-center transition-all duration-200 shrink-0 ${on ? "bg-[var(--blue)] justify-end pr-0.5" : "bg-[var(--line-dark)] justify-start pl-0.5"}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </Card>
              );
            })}
            <div className="flex justify-end">
              <Button onClick={() => showToast(t("settings.notifSaved"))}>
                <Save className="w-3.5 h-3.5" /> {t("settings.save")}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="max-w-2xl">
            <Card>
              <CardHeader><CardTitle>{t("settings.appearance.themeTitle")}</CardTitle></CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>{t("settings.appearance.colorLabel")}</Label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { name: t("settings.appearance.colorBlue"),   colors: "from-[#1a3c8f] to-[#0099cc]" },
                      { name: t("settings.appearance.colorPurple"), colors: "from-[#6b48ff] to-[#0099cc]" },
                      { name: t("settings.appearance.colorGreen"),  colors: "from-[#0a7c4e] to-[#0099cc]" },
                    ].map(th => (
                      <button
                        key={th.name}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${th.colors} ring-2 ring-offset-2 ring-[var(--blue)] cursor-pointer`}
                        title={th.name}
                      />
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <Label>{t("settings.appearance.displayMode")}</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { key: "light", label: t("settings.appearance.light") },
                      { key: "dark",  label: t("settings.appearance.dark")  },
                      { key: "auto",  label: t("settings.appearance.auto")  },
                    ].map(mode => (
                      <button
                        key={mode.key}
                        className={`p-3 rounded-[8px] border-[1.5px] text-[12.5px] font-semibold transition-all ${
                          mode.key === "light"
                            ? "border-[var(--blue)] bg-[var(--blue-lighter)] text-[var(--blue)]"
                            : "border-[var(--line)] text-[var(--ink-4)] hover:border-[var(--blue)]"
                        }`}
                      >
                        {mode.label}
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
              <CardHeader><CardTitle>{t("settings.security.changePassword")}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "current", label: t("settings.security.currentPassword") },
                    { id: "new",     label: t("settings.security.newPassword")      },
                    { id: "confirm", label: t("settings.security.confirmPassword")  },
                  ].map(f => (
                    <div key={f.id}>
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <Input id={f.id} type="password" placeholder="••••••••" />
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <Button onClick={() => showToast(t("settings.passwordChanged"))}>
                      <Shield className="w-3.5 h-3.5" /> {t("settings.security.changeBtn")}
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
              { titleKey: "settings.data.exportTitle", descKey: "settings.data.exportDesc", actionKey: "settings.data.exportAction", variant: "outline" as const },
              { titleKey: "settings.data.backupTitle", descKey: "settings.data.backupDesc", actionKey: "settings.data.backupAction", variant: "primary" as const },
              { titleKey: "settings.data.importTitle", descKey: "settings.data.importDesc", actionKey: "settings.data.importAction", variant: "outline" as const },
            ].map(item => (
              <Card key={item.titleKey}>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{t(item.titleKey)}</div>
                    <div className="text-[11.5px] text-[var(--ink-4)] mt-0.5">{t(item.descKey)}</div>
                  </div>
                  <Button variant={item.variant} size="sm" onClick={() => showToast(t("settings.data.actionInProgress", { action: t(item.actionKey) }))}>
                    {t(item.actionKey)}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
