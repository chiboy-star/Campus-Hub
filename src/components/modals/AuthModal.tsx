import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, X, KeyRound, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Role } from '../../domain/models';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    users,
    setCurrentUserById,
    setActiveRole,
    showToast
  } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(currentUser.universityEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(currentUser.role);

  if (!isAuthModalOpen) return null;

  const handleAutoFillCode = () => {
    setOtpCode('892104');
    showToast({
      type: 'info',
      title: 'Demo 2FA Code Injected',
      description: 'One-time passcode 892104 autofilled from PAU Authenticator.',
    });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = users.find(u => u.role === selectedRole);
    if (matchedUser) {
      setCurrentUserById(matchedUser.userId);
      showToast({
        type: 'success',
        title: 'Authentication Successful',
        description: `Signed in as ${matchedUser.fullName} (${matchedUser.role}).`,
      });
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-emerald">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                PAU Single Sign-On (SSO)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pan-Atlantic University Identity Service
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Persona Switcher for Defense */}
        <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Defense Quick Select Persona:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {users.map(u => (
              <button
                key={u.userId}
                type="button"
                onClick={() => {
                  setSelectedRole(u.role);
                  setEmail(u.universityEmail);
                }}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  selectedRole === u.role
                    ? 'border-emerald bg-emerald/10 dark:bg-emerald-subtle-dark font-semibold text-emerald-light dark:text-emerald'
                    : 'border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{u.fullName}</div>
                <div className="text-[10px] text-slate-500 capitalize">{u.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              University Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-oxford dark:focus:ring-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              PAU Portal Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-oxford dark:focus:ring-emerald font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2FA OTP with autofill simulation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber" />
                2FA One-Time Passcode (OTP)
              </label>
              <button
                type="button"
                onClick={handleAutoFillCode}
                className="text-[11px] font-semibold text-oxford dark:text-blue-400 hover:underline"
              >
                Auto-fill Demo Code
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 892104"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              autoComplete="one-time-code"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-oxford dark:focus:ring-emerald font-mono tracking-widest text-center"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-oxford text-white dark:bg-emerald dark:text-white font-semibold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Authenticate & Enter CampusHub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="mt-3 text-[11px] text-center text-slate-400">
          Protected by PAU Information & Communication Technology (ICT) Security Policy.
        </p>
      </div>
    </div>
  );
};
