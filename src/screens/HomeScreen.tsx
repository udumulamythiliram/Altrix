import React, { useState } from 'react';
import {
  AppTab,
  LanguageCode,
  MaterialStyle,
  MedicalRecord,
  MedicationItem,
  PatientProfile,
  VitalMetric,
} from '../types';

interface HomeScreenProps {
  patient: PatientProfile;
  medications: MedicationItem[];
  vitals: VitalMetric[];
  records: MedicalRecord[];
  language: LanguageCode;
  materialStyle: MaterialStyle;
  isElderlyMode: boolean;
  onSetLanguage: (lang: LanguageCode) => void;
  onToggleElderlyMode: () => void;
  onMarkMedicationTaken: (id: string) => void;
  onSnoozeMedication: (id: string) => void;
  onOpenThemeStudio: () => void;
  onOpenDrQuestions: () => void;
  onOpenScanModal: () => void;
  onPlayAudioSummary: () => void;
  onNavigateTab: (tab: AppTab) => void;
  onAskCopilot: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  patient,
  medications,
  vitals,
  records,
  language,
  materialStyle,
  isElderlyMode,
  onSetLanguage,
  onToggleElderlyMode,
  onMarkMedicationTaken,
  onSnoozeMedication,
  onOpenThemeStudio,
  onOpenDrQuestions,
  onOpenScanModal,
  onPlayAudioSummary,
  onNavigateTab,
  onAskCopilot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [metforminTaken, setMetforminTaken] = useState(false);
  const [metforminSnoozed, setMetforminSnoozed] = useState(false);
  const [viewNotesOpen, setViewNotesOpen] = useState(false);
  const [abhaExportSuccess, setAbhaExportSuccess] = useState(false);

  const bpVital = vitals.find((v) => v.type === 'bp') || vitals[0];
  const sugarVital = vitals.find((v) => v.type === 'glucose') || vitals[1];
  const hbVital = vitals.find((v) => v.type === 'hb') || vitals[2];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onAskCopilot(searchQuery.trim());
    setSearchQuery('');
  };

  const handleAbhaExport = () => {
    setAbhaExportSuccess(true);
    setTimeout(() => setAbhaExportSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 pb-28 space-y-8">
      {/* SECTION 1: Patient Profile */}
      <section className="card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="mono">Patient Profile</div>
            <h1
              style={{ fontSize: '3rem', lineHeight: 0.9 }}
              className="font-serif-garamond font-bold tracking-tight text-[var(--ink)] mt-2"
            >
              {patient.name}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {patient.age} yrs • {patient.conditions.join(' & ')}
            </p>
          </div>

          {/* Language Switcher & Audio */}
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 flex-shrink-0 pt-1">
            <div className="inline-flex border border-[var(--ink)]/30 p-0.5" role="group">
              <button
                type="button"
                onClick={() => onSetLanguage('en')}
                className={`mono text-[10px] px-2.5 py-1 transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
                    : 'text-[var(--ink)] hover:bg-black/5'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSetLanguage('te')}
                className={`mono text-[10px] px-2.5 py-1 transition-all cursor-pointer ${
                  language === 'te'
                    ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
                    : 'text-[var(--ink)] hover:bg-black/5'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => onSetLanguage('hi')}
                className={`mono text-[10px] px-2.5 py-1 transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[var(--ink)] text-[var(--bg)] font-bold'
                    : 'text-[var(--ink)] hover:bg-black/5'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              type="button"
              onClick={onPlayAudioSummary}
              className="btn-editorial-outline px-2.5 py-1 text-[9px] mono flex items-center gap-1 cursor-pointer"
            >
              <span>▶ AUDIO READOUT</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: System Status */}
      <section style={{ marginTop: '2rem' }}>
        <div className="mono">System Status</div>
        <div
          className="card"
          style={{ borderLeft: '4px solid var(--accent)', marginTop: '0.5rem' }}
        >
          <div className="flex items-center justify-between">
            <h2 style={{ fontSize: '1.5rem' }} className="font-serif-garamond font-bold text-[var(--ink)]">
              Attention Required
            </h2>
            <span className="mono text-[9px] px-2 py-0.5 border border-amber-600/40 text-amber-800 dark:text-amber-300">
              [2 PENDING]
            </span>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mt-1">
            1 unreviewed Apollo lab report needs your approval & 2:00 PM Metformin is scheduled shortly.
          </p>
          <div className="mt-4 pt-3 border-t border-[var(--ink)]/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('records')}
              className="btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
            >
              Review Lab Report
            </button>
            <button
              type="button"
              onClick={onOpenDrQuestions}
              className="btn-editorial-outline px-3 py-1.5 text-[10px] mono cursor-pointer"
            >
              View Dr Questions
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Medication Schedule */}
      <section style={{ marginTop: '2rem' }}>
        <div className="mono">Medication Schedule</div>
        
        {/* Amlodipine */}
        <div className="card" style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-serif-garamond text-xl font-bold text-[var(--ink)]">
              Amlodipine 5mg
            </span>
            <span className="mono">08:00 AM - TAKEN</span>
          </div>
          <p className="text-xs text-neutral-500 pt-1">
            After breakfast • For Blood Pressure
          </p>
        </div>

        {/* Metformin (Due Soon) */}
        <div
          className="card"
          style={{ marginTop: '1rem', background: '#EEE' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="font-serif-garamond text-xl font-bold text-[#1A1A1A]">
                Metformin 500mg
              </span>
              <p className="text-xs text-neutral-600 pt-0.5">
                Take with meal • Blood Sugar regulation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-mark-metformin"
                disabled={metforminTaken}
                onClick={() => {
                  setMetforminTaken(true);
                  onMarkMedicationTaken('med-02');
                }}
                className="btn"
              >
                {metforminTaken ? 'Taken' : 'Take Now'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMetforminSnoozed(true);
                  onSnoozeMedication('med-02');
                }}
                className="btn-editorial-outline px-3 py-2 text-[10px] mono cursor-pointer"
                title="Snooze 15 minutes"
              >
                +15M
              </button>
            </div>
          </div>
          <div className="mono" style={{ marginTop: '0.5rem' }}>
            {metforminTaken
              ? '02:00 PM - RECORDED'
              : metforminSnoozed
              ? '02:00 PM - SNOOZED +15M'
              : '02:00 PM - DUE SOON'}
          </div>
        </div>

        {/* Atorvastatin */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-serif-garamond text-xl font-bold text-[var(--ink)]">
              Atorvastatin 10mg
            </span>
            <span className="mono">08:30 PM - SCHEDULED</span>
          </div>
          <p className="text-xs text-neutral-500 pt-1">
            Before bedtime • Cholesterol
          </p>
        </div>
      </section>

      {/* SECTION 4: Biometric Telemetry */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] opacity-60">BIOMETRIC TELEMETRY</div>
          <button
            type="button"
            onClick={() => onNavigateTab('timeline')}
            className="mono text-[10px] text-[var(--ink)] underline cursor-pointer"
          >
            [VIEW TIMELINE]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BP */}
          <div className="card p-5 bg-white dark:bg-[#1C1B19]">
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] opacity-70">BLOOD PRESSURE</span>
              <span className="mono text-[9px] text-emerald-700 dark:text-emerald-400">NORMAL</span>
            </div>
            <div className="pt-2 flex items-baseline gap-1">
              <span className="font-serif-garamond text-4xl font-bold tabular-nums">
                {bpVital.value}
              </span>
              <span className="font-serif-garamond text-2xl text-neutral-500 tabular-nums">
                {bpVital.subValue}
              </span>
              <span className="mono text-[10px] ml-1">mmHg</span>
            </div>
            <p className="text-[11px] text-neutral-500 pt-1">
              Controlled on Amlodipine 5mg
            </p>
          </div>

          {/* Glucose */}
          <div className="card p-5 bg-white dark:bg-[#1C1B19]">
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] opacity-70">FASTING GLUCOSE</span>
              <span className="mono text-[9px] text-emerald-700 dark:text-emerald-400">STABLE</span>
            </div>
            <div className="pt-2 flex items-baseline gap-1">
              <span className="font-serif-garamond text-4xl font-bold tabular-nums">
                {sugarVital.value}
              </span>
              <span className="mono text-[10px] ml-1">mg/dL</span>
            </div>
            <p className="text-[11px] text-neutral-500 pt-1">
              Target 100-125 mg/dL • Last HbA1c 6.8%
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Ask Vitalis AI (Inquiry) */}
      <section className="space-y-2">
        <div className="mono text-[10px] opacity-60">CLINICAL INQUIRY • COPILOT</div>
        <div className="card p-5 bg-white dark:bg-[#1C1B19]">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Inquire regarding medications, telemetry, or diet..."
              className="flex-1 px-4 py-2.5 text-xs bg-[var(--bg)] border border-[var(--ink)]/30 font-sans focus:outline-none focus:border-[var(--ink)]"
            />
            <button
              type="button"
              onClick={onOpenScanModal}
              title="Scan Lab Report"
              className="btn-editorial-outline px-3 py-2 text-[10px] mono cursor-pointer"
            >
              SCAN
            </button>
            <button
              type="submit"
              className="btn-editorial px-4 py-2 text-[10px] mono cursor-pointer"
            >
              ASK
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-3">
            <button
              type="button"
              onClick={() => onAskCopilot('Explain HbA1c test and what 6.8% indicates')}
              className="mono text-[9px] px-2.5 py-1 border border-[var(--ink)]/20 hover:border-[var(--ink)] transition-colors cursor-pointer"
            >
              [HbA1c Context]
            </button>
            <button
              type="button"
              onClick={() => onAskCopilot('What are today pill timings and dietary requirements?')}
              className="mono text-[9px] px-2.5 py-1 border border-[var(--ink)]/20 hover:border-[var(--ink)] transition-colors cursor-pointer"
            >
              [Pill Timing]
            </button>
            <button
              type="button"
              onClick={() => onAskCopilot('Explain why Hemoglobin is 10.2 and dietary advice')}
              className="mono text-[9px] px-2.5 py-1 border border-[var(--ink)]/20 hover:border-[var(--ink)] transition-colors cursor-pointer"
            >
              [Hemoglobin 10.2 g/dL]
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: Recent Summaries */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] opacity-60">RECENT SUMMARIES</div>
          <span className="mono text-[10px] opacity-70">[2 SYNCHRONIZED]</span>
        </div>

        <div className="space-y-3">
          {/* Apollo CBC */}
          <div className="card p-5 bg-white dark:bg-[#1C1B19] space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif-garamond text-xl font-bold text-[var(--ink)]">
                  Complete Blood Count (CBC)
                </span>
                <p className="mono text-[10px] text-neutral-500">
                  APOLLO DIAGNOSTICS • FEB 24, 2025
                </p>
              </div>
              <span className="mono text-[9px] px-2 py-0.5 border border-red-600/40 text-red-700 dark:text-red-400 font-bold">
                [REVIEW NEEDED]
              </span>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug">
              <strong>Hemoglobin: 10.2 g/dL</strong> (Standard reference: 12.0 - 15.0 g/dL). Mild iron-deficiency pattern observed.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenDrQuestions}
                className="mono text-[10px] text-[var(--accent)] underline font-bold cursor-pointer"
              >
                [3 AI Questions for Doctor →]
              </button>
              <button
                type="button"
                onClick={() => setViewNotesOpen(!viewNotesOpen)}
                className="mono text-[10px] text-[var(--ink)] underline cursor-pointer"
              >
                {viewNotesOpen ? '[Hide Data]' : '[View Lab Data]'}
              </button>
            </div>

            {viewNotesOpen && (
              <div className="p-3 bg-[var(--bg)] border border-[var(--ink)]/10 text-xs space-y-1 mono text-[10px]">
                <div>• RBC: 3.82 mil/mcL</div>
                <div>• Platelets: 240,000 /mcL</div>
                <div>• Total WBC: 6,800 /mcL</div>
              </div>
            )}
          </div>

          {/* Dr. Sharma Note */}
          <div className="card p-5 bg-white dark:bg-[#1C1B19]">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif-garamond text-xl font-bold text-[var(--ink)]">
                  Dr. R. Sharma Visit Note
                </span>
                <p className="mono text-[10px] text-neutral-500">
                  CARDIOPULMONARY CARE • FEB 18, 2025
                </p>
              </div>
              <span className="mono text-[9px] text-emerald-700 dark:text-emerald-400">
                [VERIFIED BY ANAND]
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-2">
              3 medicines successfully parsed and mapped into daily schedule. Resting ECG verified normal sinus rhythm.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Health Actions Grid */}
      <section className="space-y-2">
        <div className="mono text-[10px] opacity-60">QUICK PROTOCOLS</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={onOpenScanModal}
            className="card p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="mono text-[9px] opacity-60">[01]</div>
            <div className="font-serif-garamond text-lg font-bold text-[var(--ink)] mt-1">
              Scan Report
            </div>
            <p className="mono text-[9px] text-neutral-500 mt-1">OCR EXTRACT</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('care')}
            className="card p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="mono text-[9px] opacity-60">[02]</div>
            <div className="font-serif-garamond text-lg font-bold text-[var(--ink)] mt-1">
              Family Sync
            </div>
            <p className="mono text-[9px] text-neutral-500 mt-1">2 CAREGIVERS</p>
          </button>

          <button
            type="button"
            onClick={onOpenDrQuestions}
            className="card p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="mono text-[9px] opacity-60">[03]</div>
            <div className="font-serif-garamond text-lg font-bold text-[var(--ink)] mt-1">
              Dr. Prep
            </div>
            <p className="mono text-[9px] text-neutral-500 mt-1">3 QUESTIONS</p>
          </button>

          <button
            type="button"
            onClick={handleAbhaExport}
            className="card p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="mono text-[9px] opacity-60">[04]</div>
            <div className="font-serif-garamond text-lg font-bold text-[var(--ink)] mt-1">
              {abhaExportSuccess ? 'Exported' : 'ABHA Sync'}
            </div>
            <p className="mono text-[9px] text-neutral-500 mt-1">FHIR PROTOCOL</p>
          </button>
        </div>
      </section>

      {/* SECTION 8: Clinical Transparency Footer */}
      <footer className="card p-5 text-center space-y-2 bg-[var(--bg)] border border-[var(--ink)]/20">
        <div className="mono text-[9px] opacity-70">
          [CLINICAL TRANSPARENCY STANDARD]
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Vitalis AI assists in organizing and translating complex medical records into understandable language. It is not an alternative to professional clinical diagnosis or physician oversight.
        </p>
      </footer>
    </div>
  );
};

