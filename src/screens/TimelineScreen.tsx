import React, { useState } from 'react';
import { PatientProfile, VitalMetric } from '../types';

interface TimelineScreenProps {
  patient: PatientProfile;
  vitals: VitalMetric[];
  onLogNewVital?: (type: 'bp' | 'glucose', val1: string, val2?: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  patient,
  vitals,
  onLogNewVital,
}) => {
  const [activeMetric, setActiveMetric] = useState<'bp' | 'glucose' | 'hb'>('bp');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<'bp' | 'glucose'>('bp');
  const [systolic, setSystolic] = useState('126');
  const [diastolic, setDiastolic] = useState('80');
  const [glucoseVal, setGlucoseVal] = useState('115');

  const bpVital = vitals.find((v) => v.type === 'bp') || vitals[0];
  const glucoseVital = vitals.find((v) => v.type === 'glucose') || vitals[1];
  const hbVital = vitals.find((v) => v.type === 'hb') || vitals[2];

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogNewVital) {
      if (logType === 'bp') {
        onLogNewVital('bp', systolic, diastolic);
      } else {
        onLogNewVital('glucose', glucoseVal);
      }
    }
    setIsLogModalOpen(false);
  };

  const adherenceDays = [
    { day: 'THU', date: 'FEB 20', taken: 3, total: 3, status: 'all' },
    { day: 'FRI', date: 'FEB 21', taken: 3, total: 3, status: 'all' },
    { day: 'SAT', date: 'FEB 22', taken: 3, total: 3, status: 'all' },
    { day: 'SUN', date: 'FEB 23', taken: 2, total: 3, status: 'partial' },
    { day: 'MON', date: 'FEB 24', taken: 3, total: 3, status: 'all' },
    { day: 'TUE', date: 'FEB 25', taken: 3, total: 3, status: 'all' },
    { day: 'TODAY', date: 'FEB 26', taken: 1, total: 3, status: 'in_progress' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 pb-28 space-y-6">
      {/* Title & Log Button */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[var(--ink)]/20 pb-4">
        <div>
          <div className="mono text-[10px] opacity-60">[04] BIOMETRIC TIMELINE</div>
          <h1 className="font-serif-garamond text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] leading-none pt-1">
            Telemetry & Adherence
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
            Continuous health telemetry tracking for {patient.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogModalOpen(true)}
          className="btn-editorial px-4 py-2 text-[10px] mono cursor-pointer self-start sm:self-auto"
        >
          + LOG READING
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="inline-flex border border-[var(--ink)]/30 p-0.5">
        <button
          type="button"
          onClick={() => setActiveMetric('bp')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            activeMetric === 'bp'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          BLOOD PRESSURE
        </button>
        <button
          type="button"
          onClick={() => setActiveMetric('glucose')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            activeMetric === 'glucose'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          FASTING SUGAR
        </button>
        <button
          type="button"
          onClick={() => setActiveMetric('hb')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            activeMetric === 'hb'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          HEMOGLOBIN
        </button>
      </div>

      {/* Primary Trend Card */}
      {activeMetric === 'bp' && (
        <div className="card p-6 bg-white dark:bg-[#1C1B19] space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="mono text-[10px] opacity-60">LATEST READING</div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="font-serif-garamond text-5xl font-bold tabular-nums">
                  {bpVital.value}
                </span>
                <span className="font-serif-garamond text-3xl text-neutral-500 tabular-nums">
                  {bpVital.subValue}
                </span>
                <span className="mono text-[10px] ml-1.5">mmHg</span>
              </div>
            </div>
            <span className="mono text-[10px] px-2 py-0.5 border border-emerald-600/40 text-emerald-800 dark:text-emerald-300">
              [TARGET: &lt;130/85 mmHg]
            </span>
          </div>

          <div className="pt-4 border-t border-[var(--ink)]/10">
            <div className="mono text-[9px] opacity-60 mb-2">7-DAY SYSTOLIC TREND</div>
            <div className="h-32 flex items-end justify-between gap-2 px-2">
              {[
                { day: 'FEB 20', sys: 134 },
                { day: 'FEB 21', sys: 130 },
                { day: 'FEB 22', sys: 132 },
                { day: 'FEB 23', sys: 126 },
                { day: 'FEB 24', sys: 129 },
                { day: 'FEB 25', sys: 125 },
                { day: 'TODAY', sys: 128, active: true },
              ].map((pt) => {
                const heightPercent = ((pt.sys - 100) / 45) * 100;
                return (
                  <div key={pt.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="mono text-[10px] font-bold tabular-nums">
                      {pt.sys}
                    </span>
                    <div className="w-full max-w-[36px] bg-[var(--bg)] border border-[var(--ink)]/20 h-24 flex items-end">
                      <div
                        className={`w-full transition-all ${
                          pt.active ? 'bg-[var(--ink)]' : 'bg-[var(--ink)]/40'
                        }`}
                        style={{ height: `${Math.max(15, heightPercent)}%` }}
                      />
                    </div>
                    <span className="mono text-[8px] opacity-60">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeMetric === 'glucose' && (
        <div className="card p-6 bg-white dark:bg-[#1C1B19] space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="mono text-[10px] opacity-60">LATEST FASTING VALUE</div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="font-serif-garamond text-5xl font-bold tabular-nums">
                  {glucoseVital.value}
                </span>
                <span className="mono text-[10px] ml-1.5">mg/dL</span>
              </div>
            </div>
            <span className="mono text-[10px] px-2 py-0.5 border border-emerald-600/40 text-emerald-800 dark:text-emerald-300">
              [TARGET: 100-125 mg/dL]
            </span>
          </div>
          <div className="p-4 bg-[var(--bg)] border border-[var(--ink)]/10 space-y-1 mono text-[10px]">
            <div>• LAST HBA1C: 6.8% (WELL CONTROLLED)</div>
            <div>• 2-HR POST-PRANDIAL GLUCOSE: 146 mg/dL</div>
            <div>• GLYCEMIC REGULATION: METFORMIN 500mg AT LUNCH</div>
          </div>
        </div>
      )}

      {activeMetric === 'hb' && (
        <div className="card p-6 bg-white dark:bg-[#1C1B19] space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="mono text-[10px] opacity-60">LATEST HEMOGLOBIN (APOLLO)</div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="font-serif-garamond text-5xl font-bold text-red-700 dark:text-red-400 tabular-nums">
                  {hbVital.value}
                </span>
                <span className="mono text-[10px] ml-1.5">g/dL</span>
              </div>
            </div>
            <span className="mono text-[10px] px-2 py-0.5 border border-red-600/40 text-red-700 dark:text-red-400 font-bold">
              [LOW • STANDARD: 12.0-15.0]
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Mild iron deficiency pattern verified on Complete Hemogram panel dated Feb 24, 2025.
          </p>
        </div>
      )}

      {/* 7-Day Adherence Streak */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] opacity-60">ADHERENCE PROTOCOL</div>
          <span className="mono text-[10px] opacity-70">[95% COMPLIANCE RATE]</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {adherenceDays.map((d) => (
            <div
              key={d.day}
              className={`p-3 border flex flex-col justify-between h-20 ${
                d.status === 'all'
                  ? 'bg-white dark:bg-[#1C1B19] border-[var(--ink)]'
                  : d.status === 'partial'
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-600/50'
                  : 'bg-[var(--bg)] border-[var(--ink)]/20'
              }`}
            >
              <span className="mono text-[9px] font-bold">{d.day}</span>
              <span className="font-serif-garamond text-lg font-bold">
                {d.taken}/{d.total}
              </span>
              <span className="mono text-[8px] opacity-60">
                {d.status === 'all' ? 'FULL' : d.status === 'partial' ? '2 OF 3' : 'IN PROG'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Log Vital Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl">
            <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-2">
              <h3 className="font-serif-garamond text-xl font-bold">
                Log Telemetry Entry
              </h3>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="mono text-xs px-2 py-0.5 border border-[var(--ink)]"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="pt-4 space-y-4">
              <div className="inline-flex border border-[var(--ink)]/30 p-0.5 w-full">
                <button
                  type="button"
                  onClick={() => setLogType('bp')}
                  className={`mono text-[10px] flex-1 py-1 ${
                    logType === 'bp' ? 'bg-[var(--ink)] text-[var(--bg)] font-bold' : ''
                  }`}
                >
                  BLOOD PRESSURE
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('glucose')}
                  className={`mono text-[10px] flex-1 py-1 ${
                    logType === 'glucose' ? 'bg-[var(--ink)] text-[var(--bg)] font-bold' : ''
                  }`}
                >
                  GLUCOSE
                </button>
              </div>

              {logType === 'bp' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mono text-[9px] block mb-1">SYSTOLIC</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="mono text-[9px] block mb-1">DIASTOLIC</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mono text-[9px] block mb-1">FASTING GLUCOSE (mg/dL)</label>
                  <input
                    type="number"
                    value={glucoseVal}
                    onChange={(e) => setGlucoseVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/40 mono text-xs"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="btn-editorial flex-1 py-2 text-[10px] mono"
                >
                  SAVE RECORD
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
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
