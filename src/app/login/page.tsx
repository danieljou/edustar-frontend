"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_USERS = [
  { email: "admin@edustar.cm", password: "admin123", label: "Admin Principal", role: "SCHOOL_ADMIN" },
  { email: "direction@edustar.cm", password: "dir123", label: "Directeur", role: "DIRECTOR" },
  { email: "enseignant@edustar.cm", password: "ens123", label: "Enseignant", role: "TEACHER" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      router.push("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  const fillDemo = (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center mb-3 shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="font-serif text-[22px] text-[var(--ink)] tracking-[-0.02em]">EduStar</div>
          <div className="text-[12px] text-[var(--ink-4)] mt-1">School Management System</div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[var(--line)] rounded-[16px] shadow-sm p-7">
          <h1 className="font-serif text-[20px] text-[var(--ink)] mb-1">Connexion</h1>
          <p className="text-[12px] text-[var(--ink-4)] mb-6">Accédez à votre espace de gestion</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@edustar.cm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <button type="button" className="text-[11px] text-[var(--blue)] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-[var(--danger-light)] border border-[rgba(192,57,43,0.2)] rounded-[8px] text-[12px] text-[var(--danger)]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : "Se connecter"}
            </Button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 bg-white border border-[var(--line)] rounded-[12px] p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-3">
            Comptes de démonstration
          </div>
          <div className="space-y-1.5">
            {DEMO_USERS.map(u => (
              <button
                key={u.email}
                onClick={() => fillDemo(u)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-[var(--blue-lighter)] transition-colors text-left group"
              >
                <div>
                  <div className="text-[12px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)]">{u.label}</div>
                  <div className="text-[10.5px] text-[var(--ink-4)]">{u.email}</div>
                </div>
                <span className="text-[10px] text-[var(--blue)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Utiliser →
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--ink-4)] mt-5">
          © 2026 EduStar · Tous droits réservés
        </p>
      </div>
    </div>
  );
}
