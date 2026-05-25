import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLORS = [
  "from-[#1a3c8f] to-[#0099cc]",
  "from-[#6b48ff] to-[#1a3c8f]",
  "from-[#0099cc] to-[#0a7c4e]",
  "from-[#b45309] to-[#c0392b]",
  "from-[#0a7c4e] to-[#0099cc]",
];

function colorIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % COLORS.length;
}

interface EduAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function EduAvatar({ name, size = 28, className }: EduAvatarProps) {
  const idx = colorIndex(name);
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className={cn(
        `bg-gradient-to-br ${COLORS[idx]} flex items-center justify-center rounded-[6px] shrink-0 text-white font-bold select-none`,
        className
      )}
      style={{ width: size, height: size, fontSize }}
    >
      {initials(name)}
    </div>
  );
}
