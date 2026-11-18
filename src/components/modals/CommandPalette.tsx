import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  BookOpen,
  CheckSquare,
  CalendarCheck,
  Cpu,
  Calculator,
  FileText,
  Boxes,
  User,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Role } from '../../domain/models';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setActiveRole,
    resources,
    setBookingTargetResource,
    bookings
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectRole = (role: Role) => {
    setActiveRole(role);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectResource = (resource: any) => {
    setBookingTargetResource(resource);
    setIsCommandPaletteOpen(false);
  };

  const filteredResources = resources.filter(
    r =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.resourceId.toLowerCase().includes(query.toLowerCase()) ||
      r.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, search facilities, or switch roles..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Sections */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {/* Quick Views */}
          <div className="py-1.5">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation & Views
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSelectTab('catalog')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald" />
                  <span>Resource Catalog & Search (FR-02, FR-03)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelectTab('approvals')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-amber" />
                  <span>Staff Approvals & Rejections (UC-02)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelectTab('simulator')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-crimson" />
                  <span>Polymorphic Overdue Fine Simulator (UC-05)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelectTab('lab-equipment')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Lab Equipment Inspection & Statechart (UC-04)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelectTab('architecture')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 text-oxford dark:text-slate-300" />
                  <span>OOAD Architecture & Class Diagrams</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="py-1.5">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Switch Persona / Role (FR-01)
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              <button
                onClick={() => handleSelectRole('Student')}
                className="px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Student (Chinedu Eze)</span>
              </button>
              <button
                onClick={() => handleSelectRole('Lecturer')}
                className="px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Lecturer (Dr. Adewale)</span>
              </button>
              <button
                onClick={() => handleSelectRole('LabTechnician')}
                className="px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Lab Tech (Engr. Emmanuel)</span>
              </button>
              <button
                onClick={() => handleSelectRole('FacilityManager')}
                className="px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Facility Mgr (Mrs. Folashade)</span>
              </button>
            </div>
          </div>

          {/* Matching Facilities & Equipment */}
          {filteredResources.length > 0 && (
            <div className="py-1.5">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Matching Campus Resources ({filteredResources.length})
              </p>
              <div className="space-y-0.5">
                {filteredResources.slice(0, 5).map(res => (
                  <button
                    key={res.resourceId}
                    onClick={() => handleSelectResource(res)}
                    className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{res.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{res.resourceId}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                        {res.location}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">↵</kbd> Select</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">Esc</kbd> Dismiss</span>
          </div>
          <span>Pan-Atlantic University CampusHub</span>
        </div>
      </div>
    </div>
  );
};
