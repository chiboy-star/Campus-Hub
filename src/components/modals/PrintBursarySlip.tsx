import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import { formatDateTime, formatNaira } from '../../lib/utils';

export const PrintBursarySlip: React.FC = () => {
  const { printFineBooking, setPrintFineBooking, resources, users, fines } = useApp();

  if (!printFineBooking) return null;

  const res = resources.find(r => r.resourceId === printFineBooking.resourceId);
  const requester = users.find(u => u.userId === printFineBooking.requesterId);
  const fine = fines.find(f => f.bookingId === printFineBooking.bookingId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl overflow-y-auto max-h-[90vh] print-page">
        {/* Print Action Bar (Hidden when printed) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald" />
            <span>Official University Document Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-oxford text-white text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip / Save PDF</span>
            </button>
            <button
              onClick={() => setPrintFineBooking(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official PAU Document Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">
            Federal Republic of Nigeria
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
            Pan-Atlantic University
          </h1>
          <p className="text-xs text-slate-600">
            Km 52, Lekki-Epe Expressway, Ibeju-Lekki, Lagos State &bull; Office of the University Bursar
          </p>
          <div className="inline-block mt-3 px-3 py-1 rounded bg-slate-100 text-xs font-bold font-mono uppercase tracking-wider text-slate-800 border border-slate-300">
            Official CampusHub Facility Overstay Fine Assessment Slip
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-4 py-6 text-xs border-b border-slate-200">
          <div>
            <span className="text-slate-500 block">Fine Assessment Token:</span>
            <strong className="font-mono text-sm text-slate-900">
              {fine?.fineId || 'FN-2026-PAU-01'}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Assessment Timestamp:</span>
            <span className="font-mono">{fine ? formatDateTime(fine.assessedAt) : formatDateTime(new Date().toISOString())}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Booking Reference Token:</span>
            <strong className="font-mono text-slate-900">{printFineBooking.bookingId}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Idempotency Token:</span>
            <span className="font-mono text-[11px] text-slate-600">{printFineBooking.idempotencyKey}</span>
          </div>
        </div>

        {/* Student/Faculty Information */}
        <div className="py-4 border-b border-slate-200 text-xs space-y-2">
          <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Requester / Accountable Party:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Full Name: </strong>{requester?.fullName || printFineBooking.requesterId}
            </div>
            <div>
              <strong>Role / Category: </strong>{requester?.role || 'Student'}
            </div>
            <div>
              <strong>University Email: </strong>{requester?.universityEmail || 'chinedu.eze@pau.edu.ng'}
            </div>
            <div>
              <strong>PAU Contact Phone: </strong>{requester?.phone || '+234 803 123 4567'}
            </div>
          </div>
        </div>

        {/* Facility Information & Formula */}
        <div className="py-4 border-b border-slate-200 text-xs space-y-2">
          <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Facility & Polymorphic Fine Computation:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Resource Name: </strong>{res?.name || printFineBooking.resourceId}
            </div>
            <div>
              <strong>Subclass Category: </strong>{res?.type || 'LectureHall'}
            </div>
            <div>
              <strong>Scheduled Slot: </strong>{formatDateTime(printFineBooking.startDateTime)} &rarr; {formatDateTime(printFineBooking.endDateTime)}
            </div>
            <div>
              <strong>Assessed Overdue Duration: </strong>{fine?.overdueHours || 6} hours
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
            <span className="text-slate-500 block text-[11px]">Subclass Calculation Rule Executed:</span>
            <code className="font-mono text-xs font-semibold text-slate-900">
              {res?.getFineFormulaDescription() || 'Standard Subclass Rate'}
            </code>
          </div>
        </div>

        {/* Amount Due Box */}
        <div className="py-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 block">Total Fine Assessed:</span>
            <span className="text-2xl font-bold font-mono text-slate-950 tabular-nums">
              {fine ? formatNaira(fine.amount) : '₦5,000'}
            </span>
          </div>
          <div className="text-right text-xs">
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
              Payment Pending at University Bursary
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="pt-4 border-t-2 border-dashed border-slate-300 text-[11px] text-slate-500 space-y-1 leading-relaxed">
          <p>
            <strong>Payment Instructions:</strong> Present this slip or quote reference <strong>{fine?.fineId}</strong> at the PAU Bursary Cash Office or remit via the PAU Online Student Portal under "Facility Overstay Charges".
          </p>
          <p>
            System Generated by CampusHub (Pan-Atlantic University Facility & Resource Management System).
          </p>
        </div>
      </div>
    </div>
  );
};
