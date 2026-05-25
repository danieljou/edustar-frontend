"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bell, GraduationCap, ClipboardList, CalendarRange, School, BookOpen,
  UserCheck, FileText, Award, Clock, CreditCard, Users, Library, Bus,
  MessageSquare, Megaphone, BarChart3, Settings, DoorOpen, UserCog,
  ChevronRight, X, Menu, LogOut, User, HelpCircle,
} from "lucide-react";
import { NAV_SECTIONS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Bell, GraduationCap, ClipboardList, CalendarRange, School, BookOpen,
  UserCheck, FileText, Award, Clock, CreditCard, Users, Library, Bus,
  MessageSquare, Megaphone, BarChart3, Settings, DoorOpen, UserCog,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[rgba(13,27,42,0.6)] backdrop-blur-[4px] lg:hidden"
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
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
        style={{ transform: undefined }}
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
                  {section.title}
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
                      <span className="truncate flex-1">{item.label}</span>
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
                <div className="text-[10px] text-white/30">Administrateur</div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function SidebarDesktop() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 bg-[#0d1b2a]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-[18px] border-b border-white/[0.08] shrink-0">
        <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-[#1a3c8f] to-[#0099cc] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div className="overflow-hidden">
          <div className="font-serif text-[13px] text-white leading-tight tracking-[-0.01em]">EduStar</div>
          <div className="text-[9.5px] text-white/30 mt-0.5">School Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1.5 scrollbar-none">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3.5 pt-3.5 pb-1 text-[9px] font-bold text-white/25 uppercase tracking-[0.1em]">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 mx-1.5 px-3 py-[8px] rounded-[6px] text-[12px] font-medium border transition-all duration-150 mb-[1px]",
                    active
                      ? "sb-active text-white border-white/[0.12]"
                      : "text-white/45 border-transparent hover:bg-white/[0.06] hover:text-white/80"
                  )}
                >
                  {Icon && <Icon className={cn("w-[14px] h-[14px] shrink-0", active ? "opacity-100" : "opacity-75")} />}
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && (
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
      <div className="shrink-0 p-2.5 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 p-2 rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-[6px] bg-gradient-to-br from-[#1a3c8f] to-[#0099cc] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-[11.5px] font-semibold text-white/80 truncate">Admin Principal</div>
            <div className="text-[10px] text-white/30">Administrateur</div>
          </div>
          <LogOut className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
