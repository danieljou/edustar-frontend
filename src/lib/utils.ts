import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-CM", { minimumFractionDigits: 0 }).format(amount) + " FCFA";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function age(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let y = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) y--;
  return y;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function avatarColor(str: string): string {
  const palette = [
    "from-blue-DEFAULT to-cyan-DEFAULT",
    "from-purple-DEFAULT to-blue-DEFAULT",
    "from-cyan-DEFAULT to-success-DEFAULT",
    "from-warning-DEFAULT to-danger-DEFAULT",
    "from-success-DEFAULT to-cyan-DEFAULT",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

const BG_COLORS = [
  "bg-blue-light text-blue-DEFAULT",
  "bg-purple-light text-purple-DEFAULT",
  "bg-cyan-light text-cyan-DEFAULT",
  "bg-success-light text-success-DEFAULT",
  "bg-warning-light text-warning-DEFAULT",
];

export function avatarBgColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}
