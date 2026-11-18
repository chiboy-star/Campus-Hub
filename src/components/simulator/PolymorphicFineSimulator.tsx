import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Sliders,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Receipt,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatNaira } from '../../lib/utils';
import { LectureHall, LabEquipment, StudyRoom, EventGrounds } from '../../domain/models';

export const PolymorphicFineSimulator: React.FC = () => {
  const {
    resources,
    bookings,
    activeRole,
    markBookingOverdue,
    assessDamageFine,
    showToast
  } = useApp();

  const [overdueHours, setOverdueHours] = useState<number>(6);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('BK-2026-003');

  // Damage fine modal state
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [damageAmount, setDamageAmount] = useState(25000);
  const [damageNotes, setDamageNotes] = useState('Optical lens scratched during checkout');

  // Concrete sample instances to demonstrate polymorphism side-by-side
  const sampleLectureHall = resources.find(r => r instanceof LectureHall) as LectureHall ||
    new LectureHall('LH-DEMO', 'SST Lecture Theatre 1', 'SST', 'Available', '', '', 250, []);

  const sampleLabEquipment = resources.find(r => r instanceof LabEquipment) as LabEquipment ||
    new LabEquipment('EQ-DEMO', 'Agilent UV-Vis Spectrometer', 'SST Lab', 'Available', '', '', 'Valid', '2027-01-01', 18500000);

  const sampleStudyRoom = resources.find(r => r instanceof StudyRoom) as StudyRoom ||
    new StudyRoom('SR-DEMO', 'Main Library Pod B2', 'Library', 'Available', '', '', 3);

  const sampleEventGrounds = resources.find(r => r instanceof EventGrounds) as EventGrounds ||
    new EventGrounds('EG-DEMO', 'Campus Green Lawn', 'Quadrangle', 'Available', '', '', 3500, true);

  // Live polymorphic calculation results
  const lectureHallFine = sampleLectureHall.calculateFine(overdueHours);
  const labEquipmentFine = sampleLabEquipment.calculateFine(overdueHours);
  const studyRoomFine = sampleStudyRoom.calculateFine(overdueHours);
  const eventGroundsFine = sampleEventGrounds.calculateFine(overdueHours);

  const activeBookings = bookings.filter(b => b.status === 'Active' || b.status === 'Approved' || b.status === 'Requested');

  const handleTriggerScheduler = () => {
    if (!selectedBookingId) {
      showToast({
        type: 'error',
        title: 'Select a Booking',
        description: 'Pick an active reservation to simulate automated overdue detection.',
      });
      return;
    }

    try {
      const fine = markBookingOverdue(selectedBookingId, overdueHours);
      showToast({
        type: 'success',
        title: 'UC-05 Scheduler Executed',
        description: `Booking ${selectedBookingId} marked Overdue. Generated Bursary Fine: ₦${fine.amount.toLocaleString()}.`,
      });
    } catch (e: any) {
      showToast({
        type: 'error',
        title: 'Execution Error',
        description: e.message || 'Could not transition booking.',
      });
    }
  };

  const handleAssessDamage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    assessDamageFine(selectedBookingId, Number(damageAmount), damageNotes);
    setIsDamageModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Polymorphic Overdue Fine Simulator
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-crimson/15 text-crimson font-semibold">
              FR-07 &bull; FR-09 &bull; UC-05
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interactive OOAD evaluation panel executing dynamic runtime dispatch: <code className="font-mono text-oxford dark:text-emerald">resource.calculateFine(hours)</code> across subclass hierarchies.
          </p>
        </div>

        {/* Damage Charge Trigger (Facility Manager only) */}
        {activeRole === 'FacilityManager' && (
          <button
            onClick={() => setIsDamageModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-crimson text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Assess Damage Charge (Facility Mgr)</span>
          </button>
        )}
      </div>

      {/* 1. Global Interactive Slider */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-emerald">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Simulated Overdue Duration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Drag slider to test hourly thresholds, day roundups, and replacement value caps.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-oxford dark:text-white tabular-nums">
              {overdueHours}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              {overdueHours === 1 ? 'hour overdue' : 'hours overdue'}
            </span>
            <div className="text-[11px] font-mono text-slate-400">
              ({(overdueHours / 24).toFixed(1)} days started: {Math.ceil(overdueHours / 24)} days)
            </div>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={72}
          step={1}
          value={overdueHours}
          onChange={e => setOverdueHours(Number(e.target.value))}
          className="w-full accent-oxford dark:accent-emerald cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>1 hour</span>
          <span>12 hours</span>
          <span>24 hours (1 day)</span>
          <span>48 hours (2 days)</span>
          <span>72 hours (3 days)</span>
        </div>
      </div>

      {/* 2. Side-by-Side Polymorphic Execution Cards (Section 3 & 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LectureHall Subclass */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                LectureHall Subclass
              </span>
              <span className="text-xs text-slate-400 font-mono">₦2,000 / hr</span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              {sampleLectureHall.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Formula: <code className="font-mono text-slate-700 dark:text-slate-300">{sampleLectureHall.getFineFormulaDescription()}</code>
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Calculation:</span>
                <span className="font-mono">₦2,000 &times; {Math.ceil(overdueHours)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Computed Fine:</span>
                <span className="text-lg font-bold font-mono text-crimson tabular-nums">
                  {formatNaira(lectureHallFine)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            Linear hourly penalty for auditorium scheduling disruption.
          </div>
        </div>

        {/* LabEquipment Subclass */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold">
                LabEquipment Subclass
              </span>
              <span className="text-xs text-slate-400 font-mono">₦1,500 / day</span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              {sampleLabEquipment.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Formula: <code className="font-mono text-slate-700 dark:text-slate-300">{sampleLabEquipment.getFineFormulaDescription()}</code>
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Started Days:</span>
                <span className="font-mono">⌈{overdueHours}/24⌉ = {Math.ceil(overdueHours / 24)} days</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Cap Check:</span>
                <span className="font-mono text-[10px]">Capped at {formatNaira(sampleLabEquipment.replacementValue)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Computed Fine:</span>
                <span className="text-lg font-bold font-mono text-crimson tabular-nums">
                  {formatNaira(labEquipmentFine)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            Daily rate rounded up, strictly capped at hardware replacement value.
          </div>
        </div>

        {/* StudyRoom Subclass */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold">
                StudyRoom Subclass
              </span>
              <span className="text-xs text-slate-400 font-mono">Tiered Rate</span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              {sampleStudyRoom.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Formula: <code className="font-mono text-slate-700 dark:text-slate-300">{sampleStudyRoom.getFineFormulaDescription()}</code>
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tier Breakdown:</span>
                <span className="font-mono">
                  {overdueHours <= 2
                    ? `${overdueHours}h @ ₦500`
                    : `2h @ ₦500 + ${overdueHours - 2}h @ ₦1,000`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Computed Fine:</span>
                <span className="text-lg font-bold font-mono text-crimson tabular-nums">
                  {formatNaira(studyRoomFine)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            Progressive rate to prevent hogging high-demand student study pods.
          </div>
        </div>
      </div>

      {/* 3. UC-05: Trigger Automated Scheduler on an Active Booking */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            UC-05: Execute System Scheduler (Mark Booking Overdue)
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          In a production deployment, CampusHub's cron scheduler triggers at 15-minute intervals. Select a reservation below and click "Trigger Scheduler" to dispatch the polymorphic overdue transition and log the Bursary invoice.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Active / Approved Booking
            </label>
            <select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
            >
              {activeBookings.map(b => {
                const res = resources.find(r => r.resourceId === b.resourceId);
                return (
                  <option key={b.bookingId} value={b.bookingId}>
                    {b.bookingId} &bull; {res?.name || b.resourceId} ({b.status})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleTriggerScheduler}
              className="w-full py-2.5 px-4 rounded-xl bg-crimson text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Trigger Scheduler (UC-05)</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <Receipt className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-700 dark:text-slate-300">PAU Bursary Settlement Policy: </strong>
            Fine collections and payments are handled exclusively through the Pan-Atlantic University Bursary Portal. CampusHub assesses and logs the charge tokens (<code className="font-mono text-slate-700 dark:text-slate-300">FN-2026-...</code>) and leaves settlement verification to University finance.
          </div>
        </div>
      </div>

      {/* Damage Fine Modal */}
      {isDamageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Assess Damage Charge (Facility Manager)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Levying physical property damage charge against reservation {selectedBookingId}.
            </p>

            <form onSubmit={handleAssessDamage} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Damage Assessment (₦)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={damageAmount}
                  onChange={e => setDamageAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Damage Inspection Notes</label>
                <textarea
                  rows={2}
                  required
                  value={damageNotes}
                  onChange={e => setDamageNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDamageModalOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-crimson text-white font-semibold hover:opacity-90"
                >
                  Confirm & Route to Bursary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
