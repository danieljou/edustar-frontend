"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LANGS = [
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "en", flag: "🇬🇧", label: "EN" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current: LangCode = i18n.language?.startsWith("fr") ? "fr" : "en";

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex items-center p-[3px] rounded-[11px] bg-[var(--ivory)] border border-[var(--line)] gap-[2px]"
    >
      {LANGS.map(lang => {
        const isActive = lang.code === current;
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-pressed={isActive}
            className={`
              relative flex items-center gap-[5px] px-[10px] py-[5px]
              rounded-[8px] text-[11px] font-semibold select-none
              transition-colors duration-150 outline-none
              focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-1
              ${isActive ? "text-[var(--ink)]" : "text-[var(--ink-4)] hover:text-[var(--ink-2)]"}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="lang-active-bg"
                className="absolute inset-0 rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.10)] border border-[var(--line)]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 text-[14px] leading-none">{lang.flag}</span>
            <span className="relative z-10 tracking-wider">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
