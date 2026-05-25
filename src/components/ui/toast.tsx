"use client";
import { createContext, useContext, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: React.ReactNode }> = {
  success: {
    border: "border-l-[3px] border-[var(--success)]",
    icon: <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0" />,
  },
  error: {
    border: "border-l-[3px] border-[var(--danger)]",
    icon: <XCircle className="w-4 h-4 text-[var(--danger)] shrink-0" />,
  },
  warning: {
    border: "border-l-[3px] border-[var(--warning)]",
    icon: <AlertTriangle className="w-4 h-4 text-[var(--warning)] shrink-0" />,
  },
  info: {
    border: "border-l-[3px] border-[var(--blue)]",
    icon: <Info className="w-4 h-4 text-[var(--blue)] shrink-0" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const style = VARIANT_STYLES[t.variant];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto bg-[var(--ink)] text-white rounded-[10px] px-4 py-3 flex items-center gap-3 shadow-lg text-[12.5px] font-medium max-w-[320px] ${style.border}`}
              >
                {style.icon}
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-white/40 hover:text-white/80 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
