import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Printer,
  Copy,
  Check,
  AlertCircle,
  FileCheck,
  Trash2,
  ExternalLink,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { formatDateTime, formatNaira } from '../../lib/utils';
import { BookingStatus, Booking } from '../../domain/models';

export const MyBookingsView: React.FC = () => {
  const {
    currentUser,
    activeRole,
    bookings,
    resources,
    fines,
    cancelBooking,
    setPrintFineBooking,
    showToast
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast({
      type: 'info',
      title: 'Copied to Clipboard',
      description: `${label} reference "${text}" copied.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter user's bookings (or show all if manager)
  const userBookings = bookings.filter(b => {
    if (activeRole === 'FacilityManager') return true;
    return b.requesterId === currentUser.userId;
  });

  const getLifecycleStepIndex = (status: BookingStatus): number => {
    switch (status) {
      case 'Requested':
        return 0;
      case 'Approved':
        return 1;
      case 'Active':
        return 2;
      case 'Completed':
        return 3;
      case 'Overdue':
        return 2; // Active but overdue
      case 'Cancelled':
        return -1;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Reservations & Bursary Fines
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-slate-300">
              FR-05 &bull; FR-07 &bull; FR-09
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking lifecycle state transitions, checkout schedules, and university bursary charge records.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          Account: <strong className="text-slate-900 dark:text-white">{currentUser.fullName}</strong> ({currentUser.role})
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {userBookings.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              No reservations found for this account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse the Resource Catalog to submit a facility reservation request.
            </p>
          </div>
        ) : (
          userBookings.map(booking => {
            const res = resources.find(r => r.resourceId === booking.resourceId);
            const stepIdx = getLifecycleStepIndex(booking.status);
            const bookingFine = fines.find(f => f.bookingId === booking.bookingId);
            const canCancel = booking.status === 'Requested' || booking.status === 'Approved';

            return (
              <div
                key={booking.bookingId}
                className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Top Info Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {booking.bookingId}
                      </span>
                      <button
                        onClick={() => handleCopy(booking.bookingId, 'Booking ID')}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                        title="Copy Booking ID"
                      >
                        {copiedId === booking.bookingId ? (
                          <Check className="w-3.5 h-3.5 text-emerald" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'Approved'
                            ? 'bg-emerald-subtle text-emerald dark:bg-emerald-subtle-dark dark:text-emerald-light'
                            : booking.status === 'Active'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : booking.status === 'Overdue'
                            ? 'bg-crimson-subtle text-crimson dark:bg-crimson-subtle-dark dark:text-crimson'
                            : booking.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : booking.status === 'Requested'
                            ? 'bg-amber-subtle text-amber dark:bg-amber-subtle-dark dark:text-amber'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {res?.name || booking.resourceId}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {res?.location}
                    </p>
                  </div>

                  {/* Actions: Cancel, Print Slip */}
                  <div className="flex items-center gap-2">
                    {bookingFine && (
                      <button
                        onClick={() => setPrintFineBooking(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Print official Pan-Atlantic University Bursary fine receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bursary Slip</span>
                      </button>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => cancelBooking(booking.bookingId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-crimson bg-crimson/10 hover:bg-crimson/20 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel (with 5s Undo)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4-Step Lifecycle State Machine Stepper (Peak-End Rule & UX Laws) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: '1. Requested', desc: 'Awaiting Staff' },
                      { label: '2. Approved', desc: 'Schedule Booked' },
                      { label: '3. Active', desc: 'In Session / OnLoan' },
                      { label: '4. Completed', desc: 'Session Closed' },
                    ].map((step, idx) => {
                      const isPast = stepIdx > idx;
                      const isCurrent = stepIdx === idx;
                      const isCancelled = booking.status === 'Cancelled';
                      const isOverdue = booking.status === 'Overdue' && idx === 2;

                      return (
                        <div key={step.label} className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isCancelled
                                ? 'bg-slate-200 dark:bg-slate-700'
                                : isOverdue
                                ? 'bg-crimson animate-pulse'
                                : isCurrent
                                ? 'bg-emerald'
                                : isPast
                                ? 'bg-emerald/50'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                          <p
                            className={`text-[11px] font-semibold ${
                              isCurrent
                                ? 'text-slate-900 dark:text-white font-bold'
                                : isPast
                                ? 'text-emerald'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">
                            {isOverdue ? 'Overstayed Slot' : step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reservation Timing & Fine Details */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateTime(booking.startDateTime)} &rarr; {formatDateTime(booking.endDateTime)}</span>
                    </span>
                  </div>

                  {bookingFine && (
                    <div className="p-2.5 rounded-xl bg-crimson/10 border border-crimson/20 flex items-center gap-3 text-crimson">
                      <Receipt className="w-4 h-4 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold">Bursary Overdue Fine: </span>
                        <span className="font-bold font-mono tabular-nums text-sm">
                          {formatNaira(bookingFine.amount)}
                        </span>
                        <span className="text-[11px] text-crimson/80 ml-2">
                          ({bookingFine.overdueHours}h overdue &bull; Ref: {bookingFine.fineId})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decision / Cancellation Reason Note */}
                {booking.decisionReason && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-700 dark:text-slate-300">Staff Note:</strong> {booking.decisionReason}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
