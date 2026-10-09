import React from 'react';
import { PatientProfile } from '../types';

interface PatientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePatient: PatientProfile;
  onSelectPatient: (p: PatientProfile) => void;
}

export const PatientSelectorModal: React.FC<PatientSelectorModalProps> = ({
  isOpen,
  onClose,
  activePatient,
  onSelectPatient,
}) => {
  if (!isOpen) return null;

  const profiles: PatientProfile[] = [
    {
      ...activePatient,
    },
    {
      id: 'pat-anand-02',
      name: 'Anand Kumar',
      age: 44,
      gender: 'Male',
      relationTag: 'Son & Caregiver',
      conditions: ['Mild Pre-diabetes', 'Work Stress'],
      allergies: ['None'],
      bloodGroup: 'O positive',
      abhaId: '91-3312-9920-1124',
      primaryCaregiver: 'Self Managed',
      treatingPhysician: 'Dr. Anita Mehta (General Physician)',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      lastSyncTime: '4 mins ago',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-2">
          <div>
            <div className="mono text-[9px] opacity-60">HOUSEHOLD PROFILES</div>
            <h3 className="font-serif-garamond text-xl font-bold">
              Select Active Subject
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mono text-xs px-2 py-0.5 border border-[var(--ink)] hover:bg-black/5"
          >
            [X]
          </button>
        </div>

        <div className="space-y-2.5">
          {profiles.map((p) => {
            const isSelected = p.id === activePatient.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectPatient(p);
                  onClose();
                }}
                className={`w-full p-4 card text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--ink)] bg-white dark:bg-[#1C1B19]'
                    : 'hover:bg-black/5 opacity-80'
                }`}
              >
                <div>
                  <div className="font-serif-garamond text-xl font-bold">
                    {p.name}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {p.age} yrs • {p.relationTag}
                  </p>
                </div>
                {isSelected && (
                  <span className="mono text-[10px] font-bold text-[var(--accent)]">
                    [ACTIVE]
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[var(--ink)]/20 text-center">
          <p className="mono text-[9px] opacity-60">
            SYNC PROTOCOL ACTIVE ACROSS 2 REGISTERED TERMINALS
          </p>
        </div>
      </div>
    </div>
  );
};

