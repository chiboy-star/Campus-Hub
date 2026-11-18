import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, LabEquipment } from '../../domain/models';
import {
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const BookingModal: React.FC = () => {
  const {
    bookingTargetResource,
    setBookingTargetResource,
    currentUser,
    users,
    createBooking,
    joinQueue
  } = useApp();

  const [startDate, setStartDate] = useState('2026-11-22T09:00');
  const [endDate, setEndDate] = useState('2026-11-22T12:00');
  const [purpose, setPurpose] = useState('Senior Academic Capstone & Laboratory Analysis');
  const [supervisingLecturerId, setSupervisingLecturerId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [generatedIdemKey] = useState(`idem_pau_req_${Math.random().toString(36).substring(2, 9)}`);

  if (!bookingTargetResource) return null;

  const lecturers = users.filter(u => u.role === 'Lecturer');
  const isStudentBookingLabEquipment =
    currentUser.role === 'Student' && bookingTargetResource.type === 'LabEquipment';

  const isBlockedStatus =
    bookingTargetResource.status === 'Retired' ||
    bookingTargetResource.status === 'UnderMaintenance' ||
    bookingTargetResource.status === 'CalibrationDue';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isBlockedStatus) {
      setErrorMessage(`Cannot book resource: Currently ${bookingTargetResource.status}.`);
      return;
    }

    if (isStudentBookingLabEquipment && !supervisingLecturerId) {
      setErrorMessage(
        'FR-04 Violation: A Supervising Lecturer is strictly required for all Student LabEquipment bookings.'
      );
      return;
    }

    const res = createBooking(
      bookingTargetResource.resourceId,
      new Date(startDate).toISOString(),
      new Date(endDate).toISOString(),
      purpose,
      supervisingLecturerId || undefined
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to submit booking request.');
    } else if (res.booking) {
      setSuccessBookingId(res.booking.bookingId);
    }
  };

  const handleJoinQueue = () => {
    joinQueue(
      bookingTargetResource.resourceId,
      new Date(startDate).toISOString(),
      new Date(endDate).toISOString()
    );
    setBookingTargetResource(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-oxford/10 dark:bg-emerald/20 text-oxford dark:text-emerald font-semibold">
                UC-01 &bull; {bookingTargetResource.type}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {bookingTargetResource.resourceId}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Book {bookingTargetResource.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {bookingTargetResource.location}
            </p>
          </div>
          <button
            onClick={() => setBookingTargetResource(null)}
            className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {successBookingId ? (
          <div className="py-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Booking Request Submitted!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Reference Token: <strong className="font-mono text-slate-900 dark:text-slate-200">{successBookingId}</strong>
            </p>

            {/* Lifecycle diagram */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-left">
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Booking Lifecycle State Machine:
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-emerald">Requested (Active)</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-slate-400">Approved</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-slate-400">Active</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-slate-400">Completed</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setBookingTargetResource(null)}
                className="px-4 py-2 rounded-xl bg-oxford text-white dark:bg-emerald text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Close & View in My Bookings
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Blocked State Warning */}
            {isBlockedStatus && (
              <div className="p-3 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson flex items-start gap-2.5 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Resource Not Available for Booking</p>
                  <p className="text-crimson/80 mt-0.5">
                    This resource is flagged as <strong>{bookingTargetResource.status}</strong>. CampusHub blocks reservation requests until the resource is verified or maintenance is concluded.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-crimson/10 border border-crimson/30 text-crimson flex items-start gap-2 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                  {errorMessage.includes('Slot conflict') && (
                    <button
                      type="button"
                      onClick={handleJoinQueue}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-oxford text-white dark:bg-slate-800 text-xs font-medium hover:opacity-90"
                    >
                      <span>Join Waiting Queue (UC-03)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Date and Time Picker */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Purpose & Activity
              </label>
              <textarea
                rows={2}
                required
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="State your department, course code, or research rationale..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-oxford dark:focus:ring-emerald resize-none"
              />
            </div>

            {/* MANDATORY CAMPUS RULE: Supervising Lecturer Selector for Students booking LabEquipment */}
            {isStudentBookingLabEquipment && (
              <div className="p-3 rounded-xl bg-amber/10 border border-amber/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
                  <UserCheck className="w-4 h-4 text-amber" />
                  <span>Mandatory Campus Rule: Supervising Lecturer («extend»)</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-snug">
                  PAU laboratory safety policy mandates that undergraduate students operating advanced analytical equipment must be under an appointed faculty advisor.
                </p>
                <select
                  required
                  value={supervisingLecturerId}
                  onChange={e => setSupervisingLecturerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber"
                >
                  <option value="">-- Select Accredited Supervising Lecturer --</option>
                  {lecturers.map(lec => (
                    <option key={lec.userId} value={lec.userId}>
                      {lec.fullName} ({lec.universityEmail})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Fine Policy Preview for Recognition > Recall UX Law */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Polymorphic Overdue Rule: </span>
                <span className="font-mono text-[11px] text-oxford dark:text-slate-300">
                  {bookingTargetResource.getFineFormulaDescription()}
                </span>
              </div>
            </div>

            {/* Idempotency Key & Footer */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Idempotency-Key: {generatedIdemKey}</span>
                <span>NFR-05 Double-Booking Guard</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBookingTargetResource(null)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBlockedStatus}
                  className="px-4 py-2 rounded-xl bg-oxford text-white dark:bg-emerald dark:text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span>Submit Booking Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
