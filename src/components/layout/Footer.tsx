import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  // Read any active UTM parameter from window
  const utmSource = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || 'ooad_defense_eval' : 'ooad_defense_eval';

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 text-xs py-8 px-4 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: PAU Branding & Copyright */}
        <div className="space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Pan-Atlantic University &bull; CampusHub Smart Facility Management System
          </p>
          <p className="text-[11px] text-slate-400">
            Km 52, Lekki-Epe Expressway, Ibeju-Lekki, Lagos State, Nigeria &bull; &copy; 2026 PAU Estates & ICT Directorate.
          </p>
        </div>

        {/* Right: NDPA & UTM context */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            <span>NDPA 2023 Compliant</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
            <span>Ref:</span>
            <span className="text-oxford dark:text-slate-300 font-semibold">{utmSource}</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
