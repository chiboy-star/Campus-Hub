import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Check, X, BellRing } from 'lucide-react';

export const SlotOfferBanner: React.FC = () => {
  const { activeSlotOffer, acceptSlotOffer, declineOrExpireSlotOffer } = useApp();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeSlotOffer) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeSlotOffer.expiresAt - now) / 1000));
      setSecondsLeft(diff);

      if (diff === 0) {
        declineOrExpireSlotOffer();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSlotOffer, declineOrExpireSlotOffer]);

  if (!activeSlotOffer) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-amber/15 dark:bg-amber-950/40 border-b border-amber/30 px-4 py-2.5 transition-all animate-in slide-in-from-top-2 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber text-white shrink-0 animate-pulse">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                UC-03: 15-Minute Waitlist Slot Offer
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-amber/20 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                {formattedCountdown}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              A previously booked slot for <strong className="font-semibold">{activeSlotOffer.resourceName}</strong> became available. Position #1 in queue offered to you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={acceptSlotOffer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-light transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Accept Slot Offer
          </button>
          <button
            onClick={declineOrExpireSlotOffer}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Decline / Pass to User #2
          </button>
        </div>
      </div>
    </div>
  );
};
