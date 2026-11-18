import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Polymorphic Overdue Fine calculation work across facility types?',
      a: 'CampusHub uses Object-Oriented Polymorphism via an abstract calculateFine(durationHours) method on the Resource base class. Concrete subclasses override this with tailored university policies: LectureHall charges ₦2,000 per started hour; LabEquipment charges ₦1,500 per started day (capped strictly at the equipment replacement value); StudyRoom applies a progressive tier of ₦500/hr for the first 2 hours, then ₦1,000/hr thereafter; EventGrounds charges a flat ₦5,000/hr.'
    },
    {
      q: 'What is the 15-Minute Reservation Queue Slot Offer rule (UC-03)?',
      a: 'When an active or approved booking is cancelled by a user or staff member, CampusHub automatically checks the waiting list for that resource and dispatches a 15-Minute Slot Offer with a live countdown timer to User #1 in the queue. If User #1 accepts, their entry converts to a booking request. If declined or if the 15-minute window lapses, the offer cascades immediately to User #2.'
    },
    {
      q: 'Why is a Supervising Lecturer strictly required for student lab bookings (FR-04)?',
      a: 'Under the Pan-Atlantic University Laboratory Safety Protocol, undergraduate students are prohibited from operating high-precision optical, biological, and electronic equipment (e.g. UV-Vis spectrometers, high-bandwidth oscilloscopes) without a registered faculty supervisor. The system dynamically enforces this rule in code and blocks form submission if no accredited supervisor is selected.'
    },
    {
      q: 'How are fines paid and cleared?',
      a: 'CampusHub assesses and logs all overdue and damage fine reference tokens (FN-2026-...) into an immutable audit trail. Payment is not processed directly inside CampusHub; students and staff present their generated Bursary Slip or quote their Fine ID at the Pan-Atlantic University Bursary Portal. Bursary confirmation triggers fine settlement status.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-oxford dark:text-emerald" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions & Campus Facility Policies
        </h2>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-3">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left font-semibold text-slate-900 dark:text-slate-100 hover:text-oxford dark:hover:text-emerald transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-oxford dark:text-white' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed pr-6 animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
