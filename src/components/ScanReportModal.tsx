import React, { useState } from 'react';
import { MedicalRecord } from '../types';

interface ScanReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord?: (rec: MedicalRecord) => void;
}

export const ScanReportModal: React.FC<ScanReportModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'result'>('upload');
  const [selectedSample, setSelectedSample] = useState<'cbc' | 'lipid' | 'glucose'>('cbc');

  if (!isOpen) return null;

  const handleStartScan = (sample: 'cbc' | 'lipid' | 'glucose') => {
    setSelectedSample(sample);
    setStep('scanning');
    setTimeout(() => {
      setStep('result');
    }, 1500);
  };

  const handleConfirmAdd = () => {
    if (onAddRecord) {
      if (selectedSample === 'cbc') {
        onAddRecord({
          id: `rec-scan-${Date.now()}`,
          title: 'Complete Blood Count (CBC) - Scanned',
          category: 'lab_report',
          provider: 'Apollo Diagnostics',
          date: 'Feb 24, 2025',
          status: 'review_needed',
          statusLabel: 'Review Needed',
          telemetryVerified: true,
          highlightMetric: {
            name: 'Hemoglobin',
            value: '10.2 g/dL',
            reference: '12.0 - 15.0 g/dL',
            clinicalNote: 'Mild iron deficiency detected. Recommend clinical review.',
            isAbnormal: true,
          },
          summary:
            'Extracted from uploaded report: Hemoglobin 10.2 g/dL, RBC 3.8 mil/mcL, Platelets 240,000/mcL. Telemetry verified.',
          aiQuestionsForDoctor: [
            'Is oral iron supplementation indicated for Savithri Devi?',
            'Should we schedule a follow-up CBC in 8 weeks?',
          ],
        });
      }
    }
    setStep('upload');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl flex flex-col max-h-[90vh] space-y-4">
        {/* Header */}
        <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-3">
          <div>
            <div className="mono text-[9px] opacity-60">[01] TELEMETRY PARSER</div>
            <h3 className="font-serif-garamond text-2xl font-bold">
              Extract Diagnostic Panel
            </h3>
            <p className="text-xs text-neutral-500 pt-0.5">
              OCR extraction & FHIR telemetry parser
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep('upload');
              onClose();
            }}
            className="mono text-xs px-2 py-0.5 border border-[var(--ink)] hover:bg-black/5"
          >
            [X]
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 space-y-4">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[var(--ink)]/30 p-6 text-center bg-white dark:bg-[#1C1B19]">
                <div className="mono text-xs font-bold">[DRAG & DROP MEDICAL PDF OR PHOTO]</div>
                <p className="text-xs text-neutral-500 pt-1">
                  Supports Apollo, SRL, and hospital pathology records
                </p>
                <div className="mt-4">
                  <label className="btn-editorial px-4 py-2 text-[10px] mono cursor-pointer inline-block">
                    SELECT FILE
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={() => handleStartScan('cbc')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <span className="mono text-[9px] opacity-60 block mb-2">
                  OR TEST WITH PRELOADED ARCHIVE:
                </span>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleStartScan('cbc')}
                    className="card p-3.5 bg-white dark:bg-[#1C1B19] w-full text-left hover:bg-black/5 flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-serif-garamond text-lg font-bold">
                        Apollo CBC Hemogram Report
                      </div>
                      <p className="mono text-[9px] text-neutral-500">Hemoglobin, RBC, Platelet counts</p>
                    </div>
                    <span className="mono text-[9px] font-bold text-[var(--ink)]">
                      [PARSE →]
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartScan('glucose')}
                    className="card p-3.5 bg-white dark:bg-[#1C1B19] w-full text-left hover:bg-black/5 flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-serif-garamond text-lg font-bold">
                        Fasting & PP Glucose Panel
                      </div>
                      <p className="mono text-[9px] text-neutral-500">Glucose values & HbA1c 6.8%</p>
                    </div>
                    <span className="mono text-[9px] font-bold text-[var(--ink)]">
                      [PARSE →]
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="py-8 text-center space-y-4">
              <div className="mono text-xs font-bold animate-pulse">
                [PARSING DIAGNOSTIC TELEMETRY VIA OCR...]
              </div>
              <div className="card p-4 bg-white dark:bg-[#1C1B19] text-left mono text-[10px] space-y-1.5 max-w-xs mx-auto">
                <div>• Header: Apollo Diagnostics (Verified)</div>
                <div>• 14 Laboratory parameters extracted</div>
                <div className="text-[var(--accent)]">• Formulating physician questions...</div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-3">
              <div className="card p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-600/40">
                <span className="mono text-[9px] text-amber-800 dark:text-amber-300 font-bold">
                  [EXTRACTED • APOLLO CBC HEMOGRAM]
                </span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 pt-1">
                  Hemoglobin flagged low at <strong>10.2 g/dL</strong> (Ref: 12.0 - 15.0 g/dL).
                </p>
              </div>

              <div className="space-y-2 mono text-[10px]">
                <div className="card p-3 bg-white dark:bg-[#1C1B19] flex justify-between">
                  <span>HEMOGLOBIN</span>
                  <span className="text-red-600 font-bold">10.2 g/dL [LOW]</span>
                </div>
                <div className="card p-3 bg-white dark:bg-[#1C1B19] flex justify-between">
                  <span>PLATELET COUNT</span>
                  <span>240,000 /mcL [OPTIMAL]</span>
                </div>
                <div className="card p-3 bg-white dark:bg-[#1C1B19] flex justify-between">
                  <span>TOTAL WBC COUNT</span>
                  <span>6,800 /mcL [NORMAL]</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="btn-editorial flex-1 py-2 text-[10px] mono"
                >
                  SAVE TO DOSSIER
                </button>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="btn-editorial-outline px-4 py-2 text-[10px] mono"
                >
                  BACK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

