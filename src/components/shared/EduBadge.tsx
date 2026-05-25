import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "green" | "red" | "amber" | "cyan" | "purple" | "neutral";

const VARIANTS: Record<BadgeVariant, string> = {
  blue: "bg-[var(--blue-light)] text-[var(--blue)] border-[rgba(26,60,143,0.18)]",
  green: "bg-[var(--success-light)] text-[var(--success)] border-[rgba(10,124,78,0.18)]",
  red: "bg-[var(--danger-light)] text-[var(--danger)] border-[rgba(192,57,43,0.18)]",
  amber: "bg-[var(--warning-light)] text-[var(--warning)] border-[rgba(180,83,9,0.18)]",
  cyan: "bg-[var(--cyan-light)] text-[var(--cyan)] border-[rgba(0,153,204,0.18)]",
  purple: "bg-[var(--purple-light)] text-[var(--purple)] border-[rgba(107,72,255,0.18)]",
  neutral: "bg-[var(--ivory)] text-[var(--ink-4)] border-[var(--line-dark)]",
};

interface EduBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function EduBadge({ variant = "neutral", className, children, ...props }: EduBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-[7px] py-[2px] rounded-[4px] text-[10px] font-bold tracking-[0.02em] border",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function statusBadge(statut: string) {
  const map: Record<string, BadgeVariant> = {
    Actif: "green", Suspendu: "red", Diplômé: "blue", Abandonné: "neutral",
    "En attente": "amber", Validé: "green", Rejeté: "red",
    Active: "green", Clôturée: "neutral", "À venir": "blue",
    "En cours": "blue", "En retard": "amber", Critique: "red", Soldé: "green",
    Congé: "amber", Inactif: "neutral",
    "Présent": "green", "Absent": "red", "Retard": "amber", "Justifié": "cyan",
  };
  return map[statut] ?? "neutral";
}
