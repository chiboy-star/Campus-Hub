import React, { useState } from 'react';
import { HelpCircle, X, Phone, Mail, CheckSquare, Shield, ExternalLink } from 'lucide-react';

export const HelpdeskWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'FR-01': true,
    'FR-02': true,
    'FR-03': true,
    'FR-04': true,
    'FR-05': true,
    'FR-06': true,
    'FR-07': true,
    'FR-08': true,
    'FR-09': true,
    'FR-10': true,
  });

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 no-print floating-widget">
      {isOpen ? (
        <div className="w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-xs animate-in zoom-in-95 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <strong className="text-slate-900 dark:text-white font-bold">
                PAU ICT Support & Defense Checklist
              </strong>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Close widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Contacts */}
          <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
              Emergency Facility Contacts:
            </p>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>SST Lab Lead: +234 818 555 7788</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>facilities@pau.edu.ng (Ext. 402)</span>
            </div>
          </div>

          {/* OOAD Defense Checklist */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <p className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
              OOAD Requirements Defense Checklist:
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {[
                { id: 'FR-01', label: 'FR-01: RBAC & Instant Role Switcher' },
                { id: 'FR-02', label: 'FR-02: Catalog CRUD & Soft Delete' },
                { id: 'FR-03', label: 'FR-03: Real-Time Instant Search' },
                { id: 'FR-04', label: 'FR-04: Supervising Lecturer Rule' },
                { id: 'FR-05', label: 'FR-05: 5s Undo Toast on Cancel' },
                { id: 'FR-06', label: 'FR-06: Mandatory Rejection Reason' },
                { id: 'FR-07', label: 'FR-07: 4-Step Lifecycle Stepper' },
                { id: 'FR-08', label: 'FR-08: 15-Min Slot Offer (UC-03)' },
                { id: 'FR-09', label: 'FR-09: Polymorphic Fine Formulas' },
                { id: 'FR-10', label: 'FR-10: Equipment Statechart (UC-04)' },
              ].map(item => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="rounded border-slate-300 text-emerald focus:ring-emerald w-3 h-3"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-oxford text-white dark:bg-slate-800 dark:text-slate-100 shadow-lg border border-slate-700/20 text-xs font-semibold hover:bg-oxford-600 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-emerald" />
          <span>PAU ICT & Defense Checklist</span>
        </button>
      )}
    </div>
  );
};
