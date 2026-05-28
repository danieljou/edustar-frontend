"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Search, Bell, Sun, Moon, ChevronRight, User, Settings, LogOut,
  GraduationCap, FileText, X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { BREADCRUMB_MAP } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const SEARCH_RESULTS = [
  { label: "Christian Mballa", sub: "ETU-001 · L1-INFO-A", type: "Étudiant", href: "/dashboard/students" },
  { label: "Laetitia Nguema", sub: "ETU-002 · L1-INFO-A", type: "Étudiant", href: "/dashboard/students" },
  { label: "Paiements", sub: "Gestion des paiements et moratoriums", type: "Module", href: "/dashboard/payments" },
  { label: "Emploi du temps", sub: "Grille hebdomadaire des cours", type: "Module", href: "/dashboard/timetable" },
  { label: "ADM-001 — Patrick Essono", sub: "Admission en attente · Informatique L1", type: "Admission", href: "/dashboard/admissions" },
];

interface TopbarProps {
  onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
  const { t } = useTranslation("dashboard");
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split("/").filter(Boolean);
  const currentPage = BREADCRUMB_MAP[segments[segments.length - 1]] || "Dashboard";

  const filteredResults = searchQuery.length > 1
    ? SEARCH_RESULTS.filter(r =>
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sub.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_RESULTS;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const NOTIFS = [
    { id: 1, text: "Nouveau paiement reçu — ETU-009", time: "12 min", color: "bg-[var(--blue)]" },
    { id: 2, text: "Admission validée — Judith Mekongo", time: "34 min", color: "bg-[var(--success)]" },
    { id: 3, text: "Alerte moratoire — Boris Kamdem", time: "1h", color: "bg-[var(--warning)]" },
    { id: 4, text: "Résultats INF101 publiés", time: "3h", color: "bg-purple-[var(--purple)]" },
  ];

  return (
    <header className="h-14 bg-white border-b-[1.5px] border-[var(--line)] flex items-center px-5 gap-3 sticky top-0 z-50 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-1.5 rounded-[6px] text-[var(--ink-3)] hover:bg-[var(--ivory)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--ink-4)]">
          <span className="text-[var(--ink-3)]">EduStar</span>
          {segments.length > 1 && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[var(--ink)]">{currentPage}</span>
            </>
          )}
        </div>
        <div className="font-serif text-[16px] text-[var(--ink)] leading-tight mt-0.5 tracking-[-0.02em]">
          {currentPage}
        </div>
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-[380px] ml-4 hidden md:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--ink-4)] pointer-events-none" />
        <input
          type="search"
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setShowSearch(true)}
          className={cn(
            "w-full bg-[var(--ivory)] border-[1.5px] border-[var(--line-dark)] rounded-[10px]",
            "pl-7 pr-10 py-[7px] text-[12.5px] text-[var(--ink)] outline-none transition-all",
            "placeholder:text-[var(--ink-4)]",
            "focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(26,60,143,0.1)]"
          )}
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9.5px] text-[var(--ink-5)] bg-[var(--line)] rounded-[3px] px-1 font-mono">
          ⌘K
        </kbd>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border-[1.5px] border-[var(--line-dark)] rounded-[10px] shadow-lg z-[300] overflow-hidden"
            >
              {filteredResults.map((r, i) => (
                <Link
                  key={i}
                  href={r.href}
                  onClick={() => setShowSearch(false)}
                  className="flex items-center gap-2.5 px-3 py-[9px] hover:bg-[var(--blue-lighter)] border-b border-[var(--line)] last:border-0 transition-colors"
                >
                  <div className="w-[26px] h-[26px] rounded-[6px] bg-[var(--blue-light)] flex items-center justify-center shrink-0">
                    {r.type === "Étudiant" ? <GraduationCap className="w-3 h-3 text-[var(--blue)]" /> :
                     r.type === "Admission" ? <FileText className="w-3 h-3 text-[var(--blue)]" /> :
                     <Search className="w-3 h-3 text-[var(--blue)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-[var(--ink)] truncate">{r.label}</div>
                    <div className="text-[11px] text-[var(--ink-4)] truncate">{r.sub}</div>
                  </div>
                  <span className="text-[8.5px] font-bold font-mono uppercase px-[5px] py-[1px] rounded-[3px] bg-[var(--blue-light)] text-[var(--blue)] shrink-0">
                    {r.type}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Session badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[var(--blue-light)] text-[var(--blue)] text-[11px] font-semibold mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
          2025–2026
        </div>

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[var(--ink-3)] hover:bg-[var(--ivory)] transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[var(--ink-3)] hover:bg-[var(--ivory)] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[var(--danger)] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              7
            </span>
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] w-[300px] bg-white border-[1.5px] border-[var(--line-dark)] rounded-[10px] shadow-lg z-[300] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-[var(--ink)]">{t("notifications.title")}</span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-[3px] bg-[var(--danger-light)] text-[var(--danger)]">
                    {t("notifications.newCount", { count: 7 })}
                  </span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {NOTIFS.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--blue-lighter)] border-b border-[var(--line)] last:border-0 cursor-pointer transition-colors">
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.color)} />
                      <div>
                        <div className="text-[12px] font-medium text-[var(--ink)]">{n.text}</div>
                        <div className="text-[11px] text-[var(--ink-4)] mt-0.5">
                          {t("notifications.ago", { time: n.time })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <Link href="/dashboard/notifications" onClick={() => setShowNotifs(false)} className="text-[12px] text-[var(--blue)] font-semibold hover:underline">
                    {t("notifications.viewAll")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-[#1a3c8f] to-[#0099cc] flex items-center justify-center text-[10.5px] font-bold text-white ml-1 hover:opacity-90 transition-opacity"
          >
            AD
          </button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white border-[1.5px] border-[var(--line-dark)] rounded-[10px] shadow-lg z-[300] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--line)]">
                  <div className="text-[12.5px] font-bold text-[var(--ink)]">Admin Principal</div>
                  <div className="text-[11px] text-[var(--ink-4)]">admin@edustar.cm</div>
                </div>
                <div className="p-1">
                  {[
                    { icon: User, labelKey: "userMenu.profile", href: "/dashboard/profile" },
                    { icon: Settings, labelKey: "userMenu.settings", href: "/dashboard/settings" },
                  ].map(({ icon: Icon, labelKey, href }) => (
                    <Link
                      key={labelKey}
                      href={href}
                      onClick={() => setShowUser(false)}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-[12.5px] font-medium text-[var(--ink)] hover:bg-[var(--blue-lighter)] hover:text-[var(--blue)] transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(labelKey)}
                    </Link>
                  ))}
                  <div className="h-px bg-[var(--line)] my-1" />
                  <button className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-[12.5px] font-medium text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    {t("userMenu.logout")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
