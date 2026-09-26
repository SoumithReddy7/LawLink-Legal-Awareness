import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Trophy, Zap } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'xp' | 'badge' | 'levelup';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    xp: Zap,
    badge: Trophy,
    levelup: Zap,
  };

  const styles: Record<ToastType, string> = {
    success: 'border-green-500/50 bg-green-50 text-green-900',
    error: 'border-red-500/50 bg-red-50 text-red-900',
    info: 'border-blue-500/50 bg-blue-50 text-blue-900',
    xp: 'border-amber-400/50 bg-gradient-to-r from-amber-400 to-orange-400 text-white',
    badge: 'border-purple-400/50 bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
    levelup: 'border-emerald-400/50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-toast-in ${styles[toast.type]}`}
              role="alert"
            >
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.message && <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
