import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabEquipment, MaintenanceLog } from '../../domain/models';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Clock,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  X
} from 'lucide-react';
import { formatNaira, formatDateTime, formatDate } from '../../lib/utils';

export const LabEquipmentView: React.FC = () => {
  const {
    resources,
    bookings,
    activeRole,
    inspectAndReturnEquipment,
    simulateCalibrationExpiry,
    recordNewCalibration
  } = useApp();

  const [inspectingItem, setInspectingItem] = useState<{
    item: LabEquipment;
    bookingId: string;
  } | null>(null);
  const [returnCondition, setReturnCondition] = useState<'Good' | 'Damaged'>('Good');
  const [damageNotes, setDamageNotes] = useState('');

  // Calibration modal
  const [calibratingItem, setCalibratingItem] = useState<LabEquipment | null>(null);
  const [nextCalDate, setNextCalDate] = useState('2027-11-30');
  const [calNotes, setCalNotes] = useState('NIST traceability verification and sensor zeroing');

  const labItems = resources.filter(r => r instanceof LabEquipment) as LabEquipment[];

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingItem) return;

    inspectAndReturnEquipment(
      inspectingItem.item.resourceId,
      inspectingItem.bookingId,
      returnCondition,
      returnCondition === 'Damaged' ? damageNotes : undefined
    );
    setInspectingItem(null);
    setDamageNotes('');
  };

  const handleCalibrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calibratingItem) return;

    recordNewCalibration(calibratingItem.resourceId, nextCalDate, calNotes);
    setCalibratingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lab Equipment Statechart & Inspection
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-semibold">
              FR-10 &bull; UC-04
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervising lifecycle state machines, NIST calibration cycles, and returns inspection for advanced laboratory hardware.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Active Persona:</span>
          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
            {activeRole}
          </span>
        </div>
      </div>

      {/* Visual Interactive Statechart Diagram (UML State Machine) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactive LabEquipment State Machine Diagram
          </p>
          <span className="text-[10px] font-mono text-slate-400">UML Statechart Pattern</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono py-2 overflow-x-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald/15 text-emerald font-bold border border-emerald/30">
            Available
          </div>
          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-amber/15 text-amber font-bold border border-amber/30">
            Reserved
          </div>
          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-800">
            OnLoan
          </div>
          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">
            UnderMaintenance
          </div>
          <span className="text-slate-400 font-bold">or</span>

          <div className="px-3 py-1.5 rounded-xl bg-amber/20 text-amber font-bold border border-amber/30">
            CalibrationDue
          </div>
          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-crimson/15 text-crimson font-bold border border-crimson/30">
            Retired
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Items in <code className="text-amber">CalibrationDue</code> or <code className="text-slate-400">UnderMaintenance</code> are automatically excluded from student booking availability.
        </p>
      </div>

      {/* Lab Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {labItems.map(item => {
          // Find any active booking for this item
          const activeBooking = bookings.find(
            b => b.resourceId === item.resourceId && (b.status === 'Active' || b.status === 'Approved')
          );

          const isCalDue = item.status === 'CalibrationDue' || item.calibrationState === 'CalibrationDue';
          const isUnderMaint = item.status === 'UnderMaintenance';
          const isOnLoan = item.status === 'OnLoan';

          return (
            <div
              key={item.resourceId}
              className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {item.resourceId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Available'
                            ? 'bg-emerald/15 text-emerald'
                            : item.status === 'OnLoan'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : item.status === 'CalibrationDue'
                            ? 'bg-amber/20 text-amber'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.location}
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-[10px] text-slate-400 block">Replacement Cap</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatNaira(item.replacementValue)}
                    </span>
                  </div>
                </div>

                {/* Calibration Details */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Calibration Status:</span>
                    <span
                      className={`font-semibold font-mono ${
                        item.calibrationState === 'Valid' ? 'text-emerald' : 'text-amber'
                      }`}
                    >
                      {item.calibrationState}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Next Due Date:</span>
                    <span className="font-mono">{formatDate(item.nextCalibrationDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">Fine Policy Formula:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                      {item.getFineFormulaDescription()}
                    </span>
                  </div>
                </div>

                {/* Maintenance Log Records */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Recent Maintenance & Damage History:
                  </p>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 text-xs">
                    {item.maintenanceHistory.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px]">No maintenance incidents recorded.</p>
                    ) : (
                      item.maintenanceHistory.map(log => (
                        <div
                          key={log.logId}
                          className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-[11px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                            <span>{log.logId}</span>
                            <span>{formatDate(log.maintenanceDate)}</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200">{log.activity}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Technician Controls (UC-04 & Calibration) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Simulate Expiry */}
                  <button
                    onClick={() => simulateCalibrationExpiry(item.resourceId)}
                    disabled={isCalDue}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                    title="Simulate calibration lapse to test booking availability guard"
                  >
                    Simulate Cal Expiry
                  </button>

                  {/* Re-calibrate */}
                  <button
                    onClick={() => setCalibratingItem(item)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-emerald/15 text-emerald hover:bg-emerald/25 font-semibold transition-colors"
                  >
                    Record Calibration
                  </button>
                </div>

                {/* UC-04: Receive & Inspect Equipment */}
                {isOnLoan ? (
                  <button
                    onClick={() =>
                      setInspectingItem({
                        item,
                        bookingId: activeBooking?.bookingId || 'BK-2026-003',
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-oxford text-white dark:bg-blue-600 text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inspect Return (UC-04)</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    {item.status === 'Available' ? 'Ready for Dispatch' : 'Excluded from Catalog'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UC-04 Inspection Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Receive & Inspect Equipment (UC-04)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inspecting {inspectingItem.item.name} returned for Booking {inspectingItem.bookingId}.
            </p>

            <form onSubmit={handleInspectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-2">Inspection Outcome</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnCondition('Good')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      returnCondition === 'Good'
                        ? 'border-emerald bg-emerald/10 text-emerald font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <div>
                      <div>Good Order</div>
                      <div className="text-[10px] font-normal opacity-80">Restores to Available</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnCondition('Damaged')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      returnCondition === 'Damaged'
                        ? 'border-crimson bg-crimson/10 text-crimson font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <div>
                      <div>Damaged («extend»)</div>
                      <div className="text-[10px] font-normal opacity-80">Sets UnderMaintenance</div>
                    </div>
                  </button>
                </div>
              </div>

              {returnCondition === 'Damaged' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="block font-semibold text-crimson">
                    Damage Details & Technician Notes <span className="text-crimson">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={damageNotes}
                    onChange={e => setDamageNotes(e.target.value)}
                    placeholder="Describe lens fracture, broken cable harness, or calibration sensor misalignment..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-crimson/40 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[11px] text-slate-500">
                    Equipment will be flagged <code className="text-crimson">UnderMaintenance</code> and excluded from student searches. Facility Manager will be alerted for fine assessment.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingItem(null)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-oxford text-white dark:bg-emerald font-semibold hover:opacity-90"
                >
                  Confirm Inspection & Update State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Calibration Modal */}
      {calibratingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Record NIST Calibration Certification
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Restoring {calibratingItem.name} to Valid Calibration & Available state.
            </p>

            <form onSubmit={handleCalibrationSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">New Next Calibration Expiry Date</label>
                <input
                  type="date"
                  required
                  value={nextCalDate}
                  onChange={e => setNextCalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Calibration Activity Notes</label>
                <textarea
                  rows={2}
                  required
                  value={calNotes}
                  onChange={e => setCalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCalibratingItem(null)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald text-white font-semibold hover:opacity-90"
                >
                  Certify & Mark Available
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
