import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  X,
  ShieldAlert,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { Booking } from '../../domain/models';

export const ApprovalsView: React.FC = () => {
  const {
    activeRole,
    currentUser,
    bookings,
    resources,
    users,
    approveBooking,
    rejectBooking,
    setActiveRole
  } = useApp();

  // Reject Modal state
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  // 1. Role Guard for Students (FR-01)
  if (activeRole === 'Student') {
    return (
      <div className="py-16 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-crimson/10 text-crimson flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Access Restricted: Staff Role Required (FR-01)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Students do not hold privilege to approve or reject campus facility requests under the PAU Object-Oriented RBAC security policy.
        </p>
        <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-left">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            OOAD Defense Role Demonstration:
          </p>
          <p className="text-[11px] text-slate-500">
            Switch your active role persona in the top walkthrough bar to test staff workflows:
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setActiveRole('FacilityManager')}
              className="px-3 py-1.5 rounded-lg bg-oxford text-white text-[11px] font-semibold hover:opacity-90"
            >
              Switch to Facility Manager
            </button>
            <button
              onClick={() => setActiveRole('LabTechnician')}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-[11px] font-medium hover:bg-slate-300"
            >
              Switch to Lab Tech
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter requests according to staff privileges:
  // Facility Manager sees all resources.
  // Lab Technician sees Lab Equipment only.
  const pendingRequests = bookings.filter(b => {
    if (b.status !== 'Requested') return false;
    const res = resources.find(r => r.resourceId === b.resourceId);
    if (!res) return false;
    if (activeRole === 'LabTechnician') {
      return res.type === 'LabEquipment';
    }
    return true; // Facility Manager
  });

  const processedDecisions = bookings.filter(b => b.status === 'Approved' || (b.status === 'Cancelled' && b.decisionReason?.includes('Rejected')));

  const handleOpenReject = (booking: Booking) => {
    setRejectingBooking(booking);
    setRejectionReason('');
    setRejectionError(null);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectionError('Mandatory rejection reason required by UC-02 specification.');
      return;
    }
    if (rejectingBooking) {
      rejectBooking(rejectingBooking.bookingId, rejectionReason.trim());
      setRejectingBooking(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Staff Facility Approvals & Review
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber/20 text-amber-900 dark:text-amber-300 font-semibold">
              FR-05 &bull; FR-06 &bull; UC-02
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="font-semibold text-slate-900 dark:text-white">{currentUser.fullName}</strong> ({activeRole}).
            {activeRole === 'LabTechnician'
              ? ' Displaying Lab Equipment reservations only.'
              : ' Displaying all campus facility reservations.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {pendingRequests.length} Pending Review
          </span>
        </div>
      </div>

      {/* Pending Requests Queue */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Pending Request Queue
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <CheckCircle2 className="w-8 h-8 text-emerald mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              All caught up! No pending requests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Switch role to Student and submit a booking request from the Resource Catalog to test the approval workflow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pendingRequests.map(booking => {
              const res = resources.find(r => r.resourceId === booking.resourceId);
              const requester = users.find(u => u.userId === booking.requesterId);
              const supervisor = booking.supervisingLecturerId
                ? users.find(u => u.userId === booking.supervisingLecturerId)
                : null;

              return (
                <div
                  key={booking.bookingId}
                  className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-oxford dark:text-white">
                        {booking.bookingId}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/20 text-amber-900 dark:text-amber-300 font-semibold">
                        Requested
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Idem: {booking.idempotencyKey.slice(0, 14)}...
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {res?.name || booking.resourceId}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {res?.location}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>Requester:</strong> {requester?.fullName || booking.requesterId} ({requester?.role})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(booking.startDateTime)} &rarr; {formatDateTime(booking.endDateTime)}
                      </span>
                    </div>

                    {/* Supervising Lecturer Callout for Student Lab Booking */}
                    {supervisor && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald/10 border border-emerald/20 text-xs text-emerald-light dark:text-emerald flex items-center gap-2">
                        <UserCheck className="w-4 h-4 shrink-0" />
                        <span>
                          <strong>Supervising Lecturer Approved:</strong> {supervisor.fullName} ({supervisor.universityEmail})
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 italic mt-1">
                      "{booking.purpose}"
                    </p>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <button
                      onClick={() => approveBooking(booking.bookingId)}
                      className="px-3.5 py-2 rounded-xl bg-emerald text-white text-xs font-semibold hover:bg-emerald-light transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={() => handleOpenReject(booking)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-crimson hover:bg-crimson/10 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mandatory Rejection Confirmation Modal (UC-02) */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-crimson/10 text-crimson shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reject Booking Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  «include» Enter mandatory rejection reason for Booking {rejectingBooking.bookingId}.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3.5">
              {rejectionError && (
                <p className="text-xs text-crimson font-medium bg-crimson/10 p-2 rounded-lg">
                  {rejectionError}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Rejection <span className="text-crimson">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="e.g. Schedule conflict with university faculty meeting, or safety prerequisites incomplete..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-crimson resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-crimson text-white text-xs font-semibold hover:opacity-90"
                >
                  Confirm Rejection & Notify Requester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historical Decisions Table */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Recent Decision History
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Decision Notes</th>
                <th className="py-2.5 px-3">Decision Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {processedDecisions.map(b => (
                <tr key={b.bookingId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {b.bookingId}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {resources.find(r => r.resourceId === b.resourceId)?.name || b.resourceId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === 'Approved'
                          ? 'bg-emerald/15 text-emerald'
                          : 'bg-crimson/15 text-crimson'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {b.decisionReason || 'Approved'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {b.decisionDateTime ? formatDateTime(b.decisionDateTime) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
