import { useEffect, useState } from 'react';
import { Rocket, X } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Level up celebration"
    >
      <div
        className={`relative max-w-sm w-full ${show ? 'animate-scale-in' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-gradient-to-br from-navy-900 via-blue-900 to-navy-800 rounded-3xl p-8 text-center shadow-2xl border border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
          <div className="relative">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 animate-badge-spin shadow-lg shadow-orange-500/50">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <p className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-2">
              Level Up
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">You reached Level {level}</h2>
            <p className="text-blue-200 text-sm mb-6">
              Keep learning, keep growing. Your legal knowledge is expanding!
            </p>
            <button onClick={onClose} className="btn-accent w-full">
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
