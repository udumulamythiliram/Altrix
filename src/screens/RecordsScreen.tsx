import React, { useState } from 'react';
import { MedicalRecord, PatientProfile } from '../types';

interface RecordsScreenProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  onOpenScanModal: () => void;
  onOpenDrQuestions: () => void;
}

export const RecordsScreen: React.FC<RecordsScreenProps> = ({
  patient,
  records,
  onOpenScanModal,
  onOpenDrQuestions,
}) => {
  const [filter, setFilter] = useState<'all' | 'lab_report' | 'consultation'>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords =
    filter === 'all' ? records : records.filter((r) => r.category === filter);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 pb-28 space-y-6">
      {/* Title & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[var(--ink)]/20 pb-4">
        <div>
          <div className="mono text-[10px] opacity-60">ARCHIVAL VAULT • EMR</div>
          <h1 className="font-serif-garamond text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] leading-none pt-1">
            Health Records & Panels
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
            Verified repository for {patient.name} • ABHA #{patient.abhaId}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenScanModal}
          className="btn-editorial px-4 py-2 text-[10px] mono cursor-pointer self-start sm:self-auto"
        >
          + UPLOAD REPORT
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex border border-[var(--ink)]/30 p-0.5">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          ALL ({records.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('lab_report')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            filter === 'lab_report'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          LAB DIAGNOSTICS
        </button>
        <button
          type="button"
          onClick={() => setFilter('consultation')}
          className={`mono text-[10px] px-3 py-1.5 transition-all cursor-pointer ${
            filter === 'consultation'
              ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
              : 'text-[var(--ink)] hover:bg-black/5'
          }`}
        >
          CONSULTATIONS
        </button>
      </div>

      {/* Records list */}
      <div className="space-y-4">
        {filteredRecords.map((rec) => {
          const isAbnormal = rec.highlightMetric?.isAbnormal;

          return (
            <div
              key={rec.id}
              className="card p-6 bg-white dark:bg-[#1C1B19] space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <div>
                  <div className="mono text-[9px] opacity-60">
                    {rec.category.toUpperCase()} • {rec.date}
                  </div>
                  <h3 className="font-serif-garamond text-2xl font-bold text-[var(--ink)] pt-0.5">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-neutral-500 pt-0.5">
                    {rec.provider} {rec.doctorName ? `• ${rec.doctorName}` : ''}
                  </p>
                </div>

                <span
                  className={`mono text-[9px] px-2 py-0.5 border self-start sm:self-auto ${
                    isAbnormal
                      ? 'border-red-600/40 text-red-700 dark:text-red-400 font-bold'
                      : 'border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  [{rec.statusLabel.toUpperCase()}]
                </span>
              </div>

              {rec.highlightMetric && (
                <div className="p-4 bg-[var(--bg)] border border-[var(--ink)]/15 space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-[var(--ink)]">
                      {rec.highlightMetric.name}: {rec.highlightMetric.value}
                    </span>
                    <span
                      className={`mono text-[9px] font-bold ${
                        rec.highlightMetric.isAbnormal ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {rec.highlightMetric.isAbnormal ? 'ATTENTION REQUIRED' : 'NORMAL'}
                    </span>
                  </div>
                  <p className="mono text-[10px] text-neutral-500">
                    Ref: {rec.highlightMetric.reference}
                  </p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 pt-1">
                    {rec.highlightMetric.clinicalNote}
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {rec.summary}
              </p>

              <div className="pt-3 border-t border-[var(--ink)]/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onOpenDrQuestions}
                  className="mono text-[10px] text-[var(--accent)] underline font-bold cursor-pointer"
                >
                  [{rec.aiQuestionsForDoctor.length} Dr. Questions Formulated →]
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="btn-editorial-outline px-3 py-1.5 text-[10px] mono cursor-pointer"
                >
                  View Full File
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record detail modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-3">
              <div>
                <div className="mono text-[9px] opacity-60">RECORD DOSSIER</div>
                <h3 className="font-serif-garamond text-2xl font-bold">
                  {selectedRecord.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="mono text-xs px-2 py-1 border border-[var(--ink)] hover:bg-black/5"
              >
                [X]
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 mono text-[10px]">
                <div>PROVIDER: {selectedRecord.provider}</div>
                <div>DATE: {selectedRecord.date}</div>
                <div>PHYSICIAN: {selectedRecord.doctorName || 'Staff'}</div>
                <div>FILE SIZE: {selectedRecord.fileSize}</div>
              </div>

              <div className="card p-4 bg-white dark:bg-[#1C1B19]">
                <div className="mono text-[9px] opacity-60 mb-1">CLINICAL SUMMARY</div>
                <p className="leading-relaxed">{selectedRecord.summary}</p>
              </div>

              <div className="card p-4 bg-white dark:bg-[#1C1B19] space-y-1.5">
                <div className="mono text-[9px] opacity-60">QUESTIONS FOR DOCTOR</div>
                {selectedRecord.aiQuestionsForDoctor.map((q, i) => (
                  <p key={i} className="pl-2 leading-snug">
                    [{i + 1}] {q}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--ink)]/20 text-right">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="btn-editorial px-4 py-2 text-[10px] mono"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
