"use client";
import { useState } from "react";
import { Send, Search, Star, Inbox, Mail, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/constants/mock-data";
import type { Message } from "@/types";

export default function CommunicationPage() {
  const { t } = useTranslation("communication");
  const [selected, setSelected] = useState<Message | null>(MESSAGES[0]);
  const [compose, setCompose] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");

  const inbox = MESSAGES.filter(m => m.a === "Admin Principal");
  const sent = MESSAGES.filter(m => m.de === "Admin Principal");
  const list = tab === "inbox" ? inbox : sent;
  const unread = inbox.filter(m => !m.lu).length;

  const filtered = list.filter(m =>
    !query.trim() ||
    m.sujet.toLowerCase().includes(query.toLowerCase()) ||
    m.de.toLowerCase().includes(query.toLowerCase())
  );

  const unreadLabel = unread > 1
    ? t("messaging.unreadCountPlural", { count: unread })
    : t("messaging.unreadCount", { count: unread });

  return (
    <div>
      <PageHeader
        title={t("messaging.pageTitle2")}
        subtitle={unreadLabel}
        actions={<Button size="sm" onClick={() => setCompose(true)}><Plus className="w-3.5 h-3.5" /> {t("messaging.newMessageBtn")}</Button>}
      />

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[480px]">
        {/* Left panel */}
        <div className="w-[300px] shrink-0 flex flex-col gap-2">
          {/* Tabs */}
          <div className="flex rounded-[8px] overflow-hidden border border-[var(--line)] shrink-0">
            <button onClick={() => setTab("inbox")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-colors ${tab === "inbox" ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--ink-4)] hover:bg-[var(--ivory)]"}`}>
              <Inbox className="w-3.5 h-3.5" />
              {t("messaging.folders.inboxShort")}
              {unread > 0 && <span className="bg-[var(--danger)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
            </button>
            <button onClick={() => setTab("sent")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-colors ${tab === "sent" ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--ink-4)] hover:bg-[var(--ivory)]"}`}>
              <Send className="w-3.5 h-3.5" />
              {t("messaging.folders.sent")}
            </button>
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
            <Input placeholder={t("messaging.searchPlaceholder")} value={query} onChange={e => setQuery(e.target.value)} className="pl-8 h-8" />
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {filtered.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); setCompose(false); }}
                className={`w-full text-left p-3 rounded-[10px] border transition-all ${
                  selected?.id === msg.id
                    ? "bg-[var(--blue-light)] border-[var(--blue-mid)]"
                    : "bg-white border-[var(--line)] hover:border-[var(--blue-mid)] hover:bg-[var(--blue-lighter)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <EduAvatar name={tab === "inbox" ? msg.de : msg.a} size={24} />
                  <span className={`text-[11.5px] flex-1 truncate ${!msg.lu && tab === "inbox" ? "font-bold text-[var(--ink)]" : "font-medium text-[var(--ink-3)]"}`}>
                    {tab === "inbox" ? msg.de : `${t("messaging.to")} ${msg.a}`}
                  </span>
                  {!msg.lu && tab === "inbox" && <span className="w-2 h-2 rounded-full bg-[var(--blue)] shrink-0" />}
                </div>
                <div className={`text-[11px] truncate mb-1 ${!msg.lu && tab === "inbox" ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-3)]"}`}>{msg.sujet}</div>
                <div className="text-[10px] text-[var(--ink-4)]">{new Date(msg.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-[12px] text-[var(--ink-4)]">{t("messaging.empty")}</div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          {compose ? (
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] shrink-0">
                <h2 className="font-semibold text-[13px] text-[var(--ink)]">{t("messaging.composeForm.title")}</h2>
                <button onClick={() => setCompose(false)} className="text-[var(--ink-4)] hover:text-[var(--ink)] text-[11px]">{t("messaging.composeForm.cancel")}</button>
              </div>
              <div className="flex-1 p-5 space-y-3">
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--ink-4)] block mb-1">{t("messaging.composeForm.recipient")}</label>
                  <Input placeholder={t("messaging.composeForm.recipientPlaceholder")} />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--ink-4)] block mb-1">{t("messaging.composeForm.subject")}</label>
                  <Input placeholder={t("messaging.composeForm.subjectPlaceholder")} />
                </div>
                <div className="flex-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--ink-4)] block mb-1">{t("messaging.composeForm.message")}</label>
                  <Textarea placeholder={t("messaging.composeForm.messagePlaceholder")} className="resize-none h-48" />
                </div>
              </div>
              <div className="flex gap-2 px-5 pb-4 shrink-0">
                <Button className="gap-1.5"><Send className="w-3.5 h-3.5" /> {t("messaging.composeForm.send")}</Button>
                <Button variant="ghost">{t("messaging.composeForm.saveDraft")}</Button>
              </div>
            </Card>
          ) : selected ? (
            <Card className="h-full flex flex-col">
              <div className="flex items-start justify-between px-5 py-4 border-b border-[var(--line)] shrink-0">
                <div>
                  <h2 className="font-semibold text-[15px] text-[var(--ink)] mb-1">{selected.sujet}</h2>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--ink-4)]">
                    <div className="flex items-center gap-1.5">
                      <EduAvatar name={selected.de} size={18} />
                      <span><span className="font-medium text-[var(--ink-3)]">{selected.de}</span> → <span className="font-medium text-[var(--ink-3)]">{selected.a}</span></span>
                    </div>
                    <span>·</span>
                    <span>{new Date(selected.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="icon-sm"><Star className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon-sm"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="max-w-2xl">
                  <p className="text-[13px] text-[var(--ink-2)] leading-relaxed whitespace-pre-wrap">{selected.corps}</p>
                </div>
              </div>

              <div className="px-5 pb-4 border-t border-[var(--line)] pt-3 shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setCompose(true)}>
                  <Mail className="w-3.5 h-3.5" /> {t("messaging.reply")}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-10 h-10 text-[var(--ink-4)] mx-auto mb-2" />
                <p className="text-[13px] text-[var(--ink-4)]">{t("messaging.selectMessage")}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
