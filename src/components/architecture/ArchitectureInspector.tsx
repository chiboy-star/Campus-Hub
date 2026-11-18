import React from 'react';
import {
  Boxes,
  Code2,
  GitBranch,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Cpu,
  BookOpen
} from 'lucide-react';

export const ArchitectureInspector: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            OOAD Architecture & UML Model Inspector
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-slate-300 font-semibold">
            Pan-Atlantic University Defense Reference
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed technical breakdown of the Object-Oriented Analysis & Design domain model, polymorphism hierarchies, state machines, and use case relationships.
        </p>
      </div>

      {/* 4 Pillars of OOAD in CampusHub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Polymorphism</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Abstract method <code className="font-mono text-oxford dark:text-emerald">calculateFine(duration)</code> declared in base class <code className="font-mono">Resource</code> and dynamically dispatched per concrete subclass: hourly for <code className="font-mono">LectureHall</code>, day-rounded with cap for <code className="font-mono">LabEquipment</code>, tiered for <code className="font-mono">StudyRoom</code>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inheritance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Concrete subclasses <code className="font-mono">LectureHall</code>, <code className="font-mono">LabEquipment</code>, <code className="font-mono">StudyRoom</code>, and <code className="font-mono">EventGrounds</code> inherit protected attributes (<code className="font-mono">#resourceId</code>, <code className="font-mono">#status</code>, <code className="font-mono">#location</code>) and slot availability verification algorithms from <code className="font-mono">Resource</code>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Encapsulation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All class attributes are strictly guarded using private/protected visibilities (<code className="font-mono">private _seatingCapacity</code>, <code className="font-mono">private _replacementValue</code>) and accessed solely through validated getters, setters, and business methods.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber/15 text-amber flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">State Machines</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Dual statecharts: Booking lifecycle (<code className="font-mono">Requested &rarr; Approved &rarr; Active &rarr; Completed / Overdue</code>) and Hardware lifecycle (<code className="font-mono">Available &rarr; Reserved &rarr; OnLoan &rarr; UnderMaintenance / CalibrationDue &rarr; Retired</code>).
          </p>
        </div>
      </div>

      {/* UML Class Diagram Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-oxford dark:text-emerald" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Domain Class Structure & Responsibilities
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">domain/models.ts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-oxford dark:text-white text-sm flex items-center justify-between">
              <span>«abstract» Resource</span>
              <span className="text-[10px] text-slate-400">Base Class</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
              <div># resourceId: string</div>
              <div># name: string</div>
              <div># location: string</div>
              <div># status: ResourceStatus</div>
              <div># imageUrl: string</div>
              <div># blurHash: string</div>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] space-y-1">
              <div>+ checkAvailability(start: Date, end: Date, bookings: Booking[]): boolean</div>
              <div>+ abstract calculateFine(durationHours: number): number</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-oxford dark:text-white text-sm flex items-center justify-between">
              <span>LabEquipment : Resource</span>
              <span className="text-[10px] text-emerald font-semibold">Subclass</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
              <div>- calibrationState: 'Valid' | 'CalibrationDue'</div>
              <div>- nextCalibrationDate: string</div>
              <div>- replacementValue: number</div>
              <div>- maintenanceHistory: MaintenanceLog[]</div>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] space-y-1">
              <div>+ calculateFine(hours): min(1500 &times; ⌈hours/24⌉, replacementValue)</div>
              <div>+ recordDamage(details, techName): MaintenanceLog</div>
              <div>+ recordMaintenance(activity, nextCalDate): MaintenanceLog</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-oxford dark:text-white text-sm flex items-center justify-between">
              <span>LectureHall : Resource</span>
              <span className="text-[10px] text-emerald font-semibold">Subclass</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
              <div>- seatingCapacity: number</div>
              <div>- avFacilities: string[]</div>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] space-y-1">
              <div>+ calculateFine(hours): 2000 &times; ⌈hours⌉</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-oxford dark:text-white text-sm flex items-center justify-between">
              <span>StudyRoom : Resource</span>
              <span className="text-[10px] text-emerald font-semibold">Subclass</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
              <div>- maxConsecutiveHours: number</div>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] space-y-1">
              <div>+ calculateFine(hours): h &le; 2 ? h &times; 500 : 1000 + (h - 2) &times; 1000</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Use Cases (UC-01 to UC-05) Reference Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Formal Use Cases (UC-01 to UC-05) Mapping
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-start gap-3">
            <span className="font-mono font-bold text-oxford dark:text-white shrink-0 w-16">UC-01</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Book Facility / Equipment</div>
              <div className="text-slate-500">
                Primary Actor: Student / Lecturer. Includes slot overlap verification and <code className="font-mono text-amber">«extend»</code> dynamic Supervising Lecturer requirement when Student selects LabEquipment.
              </div>
            </div>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span className="font-mono font-bold text-oxford dark:text-white shrink-0 w-16">UC-02</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Review & Approve / Reject Booking Request</div>
              <div className="text-slate-500">
                Primary Actor: Facility Manager / Lab Technician. Mandatory <code className="font-mono text-crimson">«include» Enter rejection reason</code> on rejection, logging approver ID and timestamp.
              </div>
            </div>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span className="font-mono font-bold text-oxford dark:text-white shrink-0 w-16">UC-03</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Respond to 15-Minute Slot Offer</div>
              <div className="text-slate-500">
                Primary Actor: Waiting User #1. Automatically dispatched upon cancellation of an existing booking. 15-minute countdown offer to Accept or Decline (passes to User #2).
              </div>
            </div>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span className="font-mono font-bold text-oxford dark:text-white shrink-0 w-16">UC-04</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Receive & Inspect Equipment</div>
              <div className="text-slate-500">
                Primary Actor: Lab Technician. Return in good order restores to Available; <code className="font-mono text-crimson">«extend» Log equipment damage</code> transitions hardware to UnderMaintenance and alerts manager for damage fee.
              </div>
            </div>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span className="font-mono font-bold text-oxford dark:text-white shrink-0 w-16">UC-05</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Mark Booking Overdue (Scheduler)</div>
              <div className="text-slate-500">
                Primary Actor: System Time Scheduler. Executes polymorphic <code className="font-mono text-oxford dark:text-emerald">calculateFine(duration)</code> based on concrete resource subclass, logging invoice token for University Bursary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
