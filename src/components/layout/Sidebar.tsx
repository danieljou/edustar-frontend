"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, Bell, GraduationCap, ClipboardList, CalendarRange, School, BookOpen,
  UserCheck, FileText, Award, Clock, CreditCard, Users, Library, Bus,
  MessageSquare, Megaphone, BarChart3, Settings, DoorOpen, UserCog,
  Building2, Settings2, Layers, PenLine,
  ChevronRight, X, LogOut,
} from "lucide-react";
import { NAV_SECTIONS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Bell, GraduationCap, ClipboardList, CalendarRange, School, BookOpen,
  UserCheck, FileText, Award, Clock, CreditCard, Users, Library, Bus,
  MessageSquare, Megaphone, BarChart3, Settings, DoorOpen, UserCog,
  Building2, Settings2, Layers, PenLine,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[rgba(13,27,42,0.6)] backdrop-blur-[4px]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-[60] h-screen w-[240px] flex flex-col",
          "bg-[#0d1b2a]",
        )}
      >
        {/* On desktop, always visible */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-3.5 py-[18px] border-b border-white/[0.08] shrink-0">
            <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="font-serif text-[13px] text-white leading-tight tracking-[-0.01em]">
                EduStar
              </div>
              <div className="text-[9.5px] text-white/30 mt-0.5 truncate">
                School Management System
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-white/30 hover:text-white/70 transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-1.5 scrollbar-none">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="px-3.5 pt-3.5 pb-1 text-[9px] font-bold text-white/25 uppercase tracking-[0.1em]">
                  {t(section.titleKey ?? section.title, { defaultValue: section.title })}
                </div>
                {section.items.map((item) => {
                  const Icon = ICON_MAP[item.icon];
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 mx-1.5 px-3 py-[8px] rounded-[6px] text-[12px] font-medium border transition-all duration-150 mb-[1px]",
                        active
                          ? "sb-active text-white border-white/12"
                          : "text-white/45 border-transparent hover:bg-white/[0.06] hover:text-white/80"
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "w-[14px] h-[14px] shrink-0",
                            active ? "opacity-100" : "opacity-75"
                          )}
                        />
                      )}
                      <span className="truncate flex-1">{t(item.labelKey ?? item.label, { defaultValue: item.label })}</span>
                      {item.badge !== undefined && (
                        <span className={cn(
                          "text-[9.5px] font-bold font-mono px-[5px] py-[1px] rounded-[3px]",
                          active ? "bg-white/25 text-white" : "bg-white/12 text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="shrink-0 p-2.5 border-t border-white/[0.07]">
            <div className="flex items-center gap-2.5 p-2 rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-[6px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                AD
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[11.5px] font-semibold text-white/80 truncate">Admin Principal</div>
                <div className="text-[10px] text-white/30">{t("sidebar.role")}</div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}

interface SidebarDesktopProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarDesktop({ collapsed, onToggleCollapse }: SidebarDesktopProps) {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-[#0d1b2a] transition-[width] duration-200 ease-in-out overflow-hidden",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-white/[0.08] shrink-0 transition-all duration-200",
        collapsed ? "px-[14px] py-[18px] justify-center" : "gap-2.5 px-3.5 py-[18px]"
      )}>
        <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-[#1a3c8f] to-[#0099cc] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-serif text-[13px] text-white leading-tight tracking-[-0.01em]">EduStar</div>
            <div className="text-[9.5px] text-white/30 mt-0.5 whitespace-nowrap">School Management System</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1.5 scrollbar-none">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <div className="px-3.5 pt-3.5 pb-1 text-[9px] font-bold text-white/25 uppercase tracking-[0.1em]">
                {t(section.titleKey ?? section.title, { defaultValue: section.title })}
              </div>
            )}
            {collapsed && <div className="pt-3" />}
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isActive(item.href);
              const label = t(item.labelKey ?? item.label, { defaultValue: item.label });
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "flex items-center border transition-all duration-150 mb-[1px]",
                    collapsed
                      ? "mx-1.5 px-0 py-[8px] rounded-[6px] justify-center gap-0"
                      : "gap-2 mx-1.5 px-3 py-[8px] rounded-[6px]",
                    "text-[12px] font-medium",
                    active
                      ? "sb-active text-white border-white/[0.12]"
                      : "text-white/45 border-transparent hover:bg-white/[0.06] hover:text-white/80"
                  )}
                >
                  {Icon && <Icon className={cn("w-[14px] h-[14px] shrink-0", active ? "opacity-100" : "opacity-75")} />}
                  {!collapsed && <span className="truncate flex-1">{label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span className={cn("text-[9.5px] font-bold font-mono px-[5px] py-[1px] rounded-[3px]", active ? "bg-white/25 text-white" : "bg-white/12 text-white")}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-2.5 border-t border-white/[0.07] space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "w-full flex items-center rounded-[6px] text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors py-[7px]",
            collapsed ? "justify-center px-0" : "gap-2 px-2"
          )}
          title={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          <ChevronRight className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200", collapsed ? "rotate-0" : "rotate-180")} />
          {!collapsed && <span className="text-[11px] font-medium">{t("sidebar.collapse")}</span>}
        </button>

        {/* User */}
        <Link
          href="/dashboard/profile"
          title={collapsed ? "Mon profil" : undefined}
          className={cn(
            "flex items-center p-2 rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer group",
            collapsed ? "justify-center" : "gap-2.5"
          )}>
          <div className="w-7 h-7 rounded-[6px] bg-gradient-to-br from-[#1a3c8f] to-[#0099cc] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            AD
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <div className="text-[11.5px] font-semibold text-white/80 truncate">Admin Principal</div>
                <div className="text-[10px] text-white/30">{t("sidebar.role")}</div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
