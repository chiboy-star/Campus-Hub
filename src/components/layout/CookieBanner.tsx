import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { isCookieAccepted, setIsCookieAccepted } = useApp();

  if (isCookieAccepted) return null;

  const handleAccept = () => {
    localStorage.setItem('campushub_ndpa_accepted', 'true');
    setIsCookieAccepted(true);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-md p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-xs leading-relaxed text-slate-600 dark:text-slate-300 transition-all duration-300 no-print">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-slate-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            Nigeria Data Protection Act (NDPA 2023) Notice
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-3">
            CampusHub securely records user session tokens, idempotency keys, and facility booking timestamps for academic audit compliance at Pan-Atlantic University.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 rounded-lg bg-oxford text-white dark:bg-slate-100 dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
            >
              Acknowledge & Accept
            </button>
            <button
              onClick={() => setIsCookieAccepted(true)}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsCookieAccepted(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
