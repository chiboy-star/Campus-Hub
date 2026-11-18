import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../domain/models';
import {
  Sun,
  Moon,
  Search,
  Command,
  Clock,
  ShieldCheck,
  User as UserIcon,
  RotateCcw,
  BookOpen,
  CheckSquare,
  CalendarCheck,
  Cpu,
  Calculator,
  FileText,
  Boxes,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    setActiveRole,
    sessionTimeLeft,
    resetSessionTimer,
    isDarkMode,
    toggleDarkMode,
    setIsCommandPaletteOpen,
    setIsAuthModalOpen,
    activeTab,
    setActiveTab,
    bookings,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pendingApprovalsCount = bookings.filter(b => b.status === 'Requested').length;

  const sessionMinutes = Math.floor(sessionTimeLeft / 60);
  const sessionSeconds = sessionTimeLeft % 60;
  const sessionFormatted = `${String(sessionMinutes).padStart(2, '0')}:${String(sessionSeconds).padStart(2, '0')}`;

  const roles: { role: Role; label: string; tag: string }[] = [
    { role: 'Student', label: 'Student', tag: 'Chinedu Eze' },
    { role: 'Lecturer', label: 'Lecturer', tag: 'Dr. Adewale' },
    { role: 'LabTechnician', label: 'Lab Tech', tag: 'Engr. Emmanuel' },
    { role: 'FacilityManager', label: 'Facility Mgr', tag: 'Mrs. Folashade' },
  ];

  const navItems = [
    { id: 'catalog', label: 'Resource Catalog', icon: BookOpen },
    {
      id: 'approvals',
      label: 'Staff Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      restrictedForStudent: true,
    },
    { id: 'my-bookings', label: 'My Bookings & Fines', icon: CalendarCheck },
    { id: 'lab-equipment', label: 'Lab Statechart (UC-04)', icon: Cpu },
    { id: 'simulator', label: 'Polymorphic Simulator (UC-05)', icon: Calculator },
    { id: 'audit', label: 'Immutable Audit Trail', icon: FileText },
    { id: 'architecture', label: 'OOAD Architecture', icon: Boxes },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors no-print">
      {/* 1. TOP OOAD DEFENSE WALKTHROUGH BAR */}
      <div className="bg-oxford text-slate-100 px-4 py-1.5 text-xs border-b border-slate-800 ooad-defense-bar">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Defense Title & PAU Tag */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider uppercase bg-emerald text-white px-1.5 py-0.5 rounded font-semibold">
              OOAD Defense Model
            </span>
            <span className="hidden sm:inline text-slate-300">
              Pan-Atlantic University &bull; Smart Campus Facility System
            </span>
          </div>

          {/* Quick 1-Click Role Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">Switch Role:</span>
            {roles.map(r => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setActiveRole(r.role)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald text-white shadow-sm ring-1 ring-emerald-light'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Switch active persona to ${r.tag} (${r.label})`}
                >
                  <span>{r.label}</span>
                  <span className="text-[10px] opacity-75 hidden lg:inline">({r.tag.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Session Timer & Credentials */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded"
              title="10-minute session inactivity timer. Clicks reset the timer."
            >
              <Clock className="w-3 h-3 text-amber" />
              <span className="tabular-nums">{sessionFormatted}</span>
              <button
                onClick={resetSessionTimer}
                aria-label="Reset session timer"
                className="hover:text-white p-0.5 text-slate-400 ml-1"
                title="Reset session timer to 10:00"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-medium"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">{currentUser.fullName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-oxford text-white dark:bg-emerald flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10 group-hover:scale-105 transition-transform">
              CH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  CampusHub
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  PAU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Facility & Resource Management
              </p>
            </div>
          </button>
        </div>

        {/* Global Search & Command Menu Button */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search facilities, equipment, locations, or IDs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-oxford dark:focus:ring-emerald/50 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Command className="w-2.5 h-2.5" />K
            </button>
          </div>
        </div>

        {/* Controls: Command Menu, Dark Mode, Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Command Palette"
          >
            <Command className="w-4 h-4" />
          </button>

          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-oxford" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. DESKTOP TAB NAVIGATION */}
      <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isStudentRestricted = item.restrictedForStudent && activeRole === 'Student';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-oxford dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                } ${isStudentRestricted ? 'opacity-80' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald dark:text-emerald-light' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber text-white tabular-nums">
                    {item.badge}
                  </span>
                )}
                {isStudentRestricted && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Staff
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-950 flex flex-col gap-1 animate-in slide-in-from-top-2">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search facilities & equipment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-oxford dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
