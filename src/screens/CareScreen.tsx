import React, { useState } from 'react';
import { CAREGIVERS } from '../data/mockData';
import { CaregiverContact, PatientProfile } from '../types';

interface CareScreenProps {
  patient: PatientProfile;
  onOpenEmergencyModal: () => void;
}

export const CareScreen: React.FC<CareScreenProps> = ({
  patient,
  onOpenEmergencyModal,
}) => {
  const [caregivers, setCaregivers] = useState<CaregiverContact[]>(CAREGIVERS);
  const [medRemindersSync, setMedRemindersSync] = useState(true);
  const [labAlertsSync, setLabAlertsSync] = useState(true);
  const [sosBroadcastSync, setSosBroadcastSync] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRelation, setInviteRelation] = useState('Family Member');
  const [invitePhone, setInvitePhone] = useState('');

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !invitePhone.trim()) return;

    const newCg: CaregiverContact = {
      id: `cg-${Date.now()}`,
      name: inviteName.trim(),
      relation: inviteRelation,
      role: 'Family Observer',
      phone: invitePhone.trim(),
      activeStatus: 'Active Now',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    };

    setCaregivers([...caregivers, newCg]);
    setInviteName('');
    setInvitePhone('');
    setInviteModalOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 pb-28 space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[var(--ink)]/20 pb-4">
        <div>
          <div className="mono text-[10px] opacity-60">[05] HOUSEHOLD CIRCLE</div>
          <h1 className="font-serif-garamond text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] leading-none pt-1">
            Caregiver Network
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
            Multi-device synchronized care circle for {patient.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInviteModalOpen(true)}
          className="btn-editorial px-4 py-2 text-[10px] mono cursor-pointer self-start sm:self-auto"
        >
          + ADD CAREGIVER
        </button>
      </div>

      {/* Sync Status Banner */}
      <div className="card p-5 bg-white dark:bg-[#1C1B19] flex justify-between items-center">
        <div>
          <div className="mono text-[9px] text-emerald-700 dark:text-emerald-400 font-bold">
            [LIVE SYNC ACTIVE]
          </div>
          <div className="font-serif-garamond text-xl font-bold text-[var(--ink)] pt-0.5">
            Active Multi-Caregiver Telemetry
          </div>
          <p className="text-xs text-neutral-500 pt-0.5">
            Synchronized 12 mins ago across 2 connected family terminals
          </p>
        </div>
        <span className="mono text-[10px] px-2.5 py-1 border border-emerald-600/40 text-emerald-800 dark:text-emerald-300">
          ONLINE
        </span>
      </div>

      {/* Household Caregivers List */}
      <div className="space-y-3">
        <div className="mono text-[10px] opacity-60">REGISTERED CARE PERSONNEL</div>

        {caregivers.map((cg) => (
          <div
            key={cg.id}
            className="card p-5 bg-white dark:bg-[#1C1B19] flex flex-col sm:flex-row justify-between sm:items-center gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-garamond text-xl font-bold text-[var(--ink)]">
                  {cg.name}
                </span>
                {cg.isDoctor && (
                  <span className="mono text-[8px] px-1.5 py-0.2 border border-[var(--ink)]">
                    MD
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 pt-0.5">
                {cg.relation} • {cg.role}
              </p>
              <div className="mono text-[9px] text-emerald-700 dark:text-emerald-400 pt-1">
                STATUS: {cg.activeStatus.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={`tel:${cg.phone}`}
                className="btn-editorial-outline px-3 py-1.5 text-[9px] mono inline-block"
              >
                CALL: {cg.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Telemetry Controls */}
      <section className="card p-6 bg-white dark:bg-[#1C1B19] space-y-4">
        <div className="mono text-[10px] opacity-60">TELEMETRY PERMISSIONS</div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--ink)]/10">
            <div>
              <span className="font-bold">Medication Missed / Due Pushes</span>
              <p className="text-neutral-500 text-[11px]">
                Notify Anand if Savithri misses Metformin or Amlodipine
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMedRemindersSync(!medRemindersSync)}
              className="mono text-[10px] px-2 py-1 border border-[var(--ink)] cursor-pointer"
            >
              {medRemindersSync ? '[ENABLED]' : '[DISABLED]'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[var(--ink)]/10">
            <div>
              <span className="font-bold">Critical Lab Findings Alerts</span>
              <p className="text-neutral-500 text-[11px]">
                Immediate push on abnormal test results (e.g. CBC Low Hb)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLabAlertsSync(!labAlertsSync)}
              className="mono text-[10px] px-2 py-1 border border-[var(--ink)] cursor-pointer"
            >
              {labAlertsSync ? '[ENABLED]' : '[DISABLED]'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">Emergency 112 SOS Broadcast</span>
              <p className="text-neutral-500 text-[11px]">
                Automated SMS with GPS location dispatched to household on SOS
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSosBroadcastSync(!sosBroadcastSync)}
              className="mono text-[10px] px-2 py-1 border border-[var(--ink)] cursor-pointer"
            >
              {sosBroadcastSync ? '[ENABLED]' : '[DISABLED]'}
            </button>
          </div>
        </div>
      </section>

      {/* Emergency dispatch trigger */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="btn-editorial w-full py-3 text-xs mono text-center cursor-pointer bg-red-700 text-white border-red-700"
        >
          OPEN EMERGENCY 112 PROTOCOL
        </button>
      </div>

      {/* Add caregiver modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl">
            <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-2">
              <h3 className="font-serif-garamond text-xl font-bold">
                Add Family Caregiver
              </h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="mono text-xs px-2 py-0.5 border border-[var(--ink)]"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleAddCaregiver} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="mono text-[9px] block mb-1">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 text-xs"
                />
              </div>

              <div>
                <label className="mono text-[9px] block mb-1">RELATIONSHIP</label>
                <select
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 text-xs"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Home Nurse">Home Nurse</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>

              <div>
                <label className="mono text-[9px] block mb-1">PHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="btn-editorial flex-1 py-2 text-[10px] mono"
                >
                  CONFIRM MEMBER
                </button>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="btn-editorial-outline px-4 py-2 text-[10px] mono"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
