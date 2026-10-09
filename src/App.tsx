import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DrQuestionsModal } from './components/DrQuestionsModal';
import { EmergencyModal } from './components/EmergencyModal';
import { Header } from './components/Header';
import { PatientSelectorModal } from './components/PatientSelectorModal';
import { ScanReportModal } from './components/ScanReportModal';
import { ThemeStudioDrawer } from './components/ThemeStudioDrawer';
import { AudioReadoutToast } from './components/AudioReadoutToast';
import {
  INITIAL_MEDICATIONS,
  INITIAL_PATIENT,
  INITIAL_RECORDS,
  INITIAL_VITALS,
} from './data/mockData';
import { CareScreen } from './screens/CareScreen';
import { CopilotScreen } from './screens/CopilotScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import {
  AppTab,
  CornerRadius,
  LanguageCode,
  MaterialStyle,
  MedicalRecord,
  MedicationItem,
  PatientProfile,
  ThemePreset,
  VitalMetric,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [vitals, setVitals] = useState<VitalMetric[]>(INITIAL_VITALS);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isElderlyMode, setIsElderlyMode] = useState(true);

  // Appearance & Theme studio states - Variation 1 defaults
  const [themePreset, setThemePreset] = useState<ThemePreset>('bright-white');
  const [materialStyle, setMaterialStyle] = useState<MaterialStyle>('material-flat');
  const [accentColor, setAccentColor] = useState('#B8860B');
  const [accentContainer, setAccentContainer] = useState('#D4AF37');
  const [accentFixed, setAccentFixed] = useState('#F0E68C');
  const [cornerRadius, setCornerRadius] = useState<CornerRadius>('sharp');
  const [isContrastBoosted, setIsContrastBoosted] = useState(false);

  // Modals state
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [isDrQuestionsOpen, setIsDrQuestionsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAudioToastOpen, setIsAudioToastOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Active query to pass to Copilot when jumping from Home
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  // Apply Theme & Material classes to HTML and Body
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Presets variable mappings
    const presetThemes: Record<
      ThemePreset,
      { dark: boolean; vars: Record<string, string> }
    > = {
      'bright-white': {
        dark: false,
        vars: {
          '--bg': '#F8F7F4',
          '--ink': '#1A1A1A',
          '--accent': '#B8860B',
          '--bg-main': '#F8F7F4',
          '--bg-card-lowest': '#FFFFFF',
          '--bg-card-low': '#F4F2EC',
          '--bg-card-mid': '#EBE8E0',
          '--bg-card-high': '#E2DFD6',
          '--text-main': '#1A1A1A',
          '--text-muted': '#5A5852',
          '--border-subtle': 'rgba(0, 0, 0, 0.1)',
        },
      },
      'midnight-dark': {
        dark: true,
        vars: {
          '--bg-main': '#0f172a',
          '--bg-card-lowest': '#1e293b',
          '--bg-card-low': '#1e293b',
          '--bg-card-mid': '#334155',
          '--bg-card-high': '#475569',
          '--text-main': '#f8fafc',
          '--text-muted': '#94a3b8',
          '--border-subtle': '#334155',
        },
      },
      'oled-black': {
        dark: true,
        vars: {
          '--bg-main': '#000000',
          '--bg-card-lowest': '#0a0a0a',
          '--bg-card-low': '#121212',
          '--bg-card-mid': '#18181b',
          '--bg-card-high': '#27272a',
          '--text-main': '#ffffff',
          '--text-muted': '#a1a1aa',
          '--border-subtle': '#27272a',
        },
      },
      'ocean-teal': {
        dark: false,
        vars: {
          '--bg-main': '#f0fdfa',
          '--bg-card-lowest': '#ffffff',
          '--bg-card-low': '#ccfbf1',
          '--bg-card-mid': '#99f6e4',
          '--bg-card-high': '#5eead4',
          '--text-main': '#134e4a',
          '--text-muted': '#115e59',
          '--border-subtle': '#99f6e4',
        },
      },
      'soft-lavender': {
        dark: false,
        vars: {
          '--bg-main': '#faf5ff',
          '--bg-card-lowest': '#ffffff',
          '--bg-card-low': '#f3e8ff',
          '--bg-card-mid': '#e9d5ff',
          '--bg-card-high': '#d8b4fe',
          '--text-main': '#3b0764',
          '--text-muted': '#6b21a8',
          '--border-subtle': '#d8b4fe',
        },
      },
      'fresh-mint': {
        dark: false,
        vars: {
          '--bg-main': '#f0fdf4',
          '--bg-card-lowest': '#ffffff',
          '--bg-card-low': '#dcfce7',
          '--bg-card-mid': '#bbf7d0',
          '--bg-card-high': '#86efac',
          '--text-main': '#064e3b',
          '--text-muted': '#065f46',
          '--border-subtle': '#bbf7d0',
        },
      },
      'warm-sunset': {
        dark: false,
        vars: {
          '--bg-main': '#fff7ed',
          '--bg-card-lowest': '#ffffff',
          '--bg-card-low': '#ffedd5',
          '--bg-card-mid': '#fed7aa',
          '--bg-card-high': '#fdba74',
          '--text-main': '#7c2d12',
          '--text-muted': '#9a3412',
          '--border-subtle': '#fed7aa',
        },
      },
      'hc-light': {
        dark: false,
        vars: {
          '--bg-main': '#ffffff',
          '--bg-card-lowest': '#ffffff',
          '--bg-card-low': '#ffffff',
          '--bg-card-mid': '#f4f4f5',
          '--bg-card-high': '#e4e4e7',
          '--text-main': '#000000',
          '--text-muted': '#18181b',
          '--border-subtle': '#000000',
        },
      },
      'hc-dark': {
        dark: true,
        vars: {
          '--bg-main': '#000000',
          '--bg-card-lowest': '#000000',
          '--bg-card-low': '#0a0a0a',
          '--bg-card-mid': '#121212',
          '--bg-card-high': '#1a1a1a',
          '--text-main': '#ffff00',
          '--text-muted': '#ffffff',
          '--border-subtle': '#ffff00',
        },
      },
    };

    const cfg = presetThemes[themePreset] || presetThemes['ocean-teal'];

    if (cfg.dark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }

    Object.entries(cfg.vars).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val);
    });

    // Material classes
    ['material-flat', 'material-glass', 'material-neumorphic', 'material-crystal'].forEach(
      (m) => body.classList.remove(m)
    );
    body.classList.add(materialStyle);

    // Accent colors
    document.documentElement.style.setProperty('--color-primary', accentColor);
    document.documentElement.style.setProperty(
      '--color-primary-container',
      accentContainer
    );
    document.documentElement.style.setProperty(
      '--color-primary-fixed',
      accentFixed
    );

    // Corner radius
    if (cornerRadius === 'sharp') {
      document.documentElement.style.setProperty('--radius-2xl', '0.25rem');
      document.documentElement.style.setProperty('--radius-xl', '0.25rem');
    } else if (cornerRadius === 'pill') {
      document.documentElement.style.setProperty('--radius-2xl', '1.75rem');
      document.documentElement.style.setProperty('--radius-xl', '1.25rem');
    } else {
      document.documentElement.style.setProperty('--radius-2xl', '1.25rem');
      document.documentElement.style.setProperty('--radius-xl', '1rem');
    }

    // Contrast boost
    if (isContrastBoosted) {
      body.classList.add('contrast-boost');
    } else {
      body.classList.remove('contrast-boost');
    }
  }, [
    themePreset,
    materialStyle,
    accentColor,
    accentContainer,
    accentFixed,
    cornerRadius,
    isContrastBoosted,
  ]);

  const handleResetTheme = () => {
    setThemePreset('ocean-teal');
    setMaterialStyle('material-crystal');
    setAccentColor('#00685f');
    setAccentContainer('#008378');
    setAccentFixed('#89f5e7');
    setCornerRadius('rounded');
    setIsContrastBoosted(false);
  };

  const handleMarkMedicationTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'taken',
              takenAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : m
      )
    );
  };

  const handleSnoozeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, dueInText: 'Snoozed 15 mins' } : m
      )
    );
  };

  const handleAskCopilot = (query: string) => {
    setCopilotInitialQuery(query);
    setCurrentTab('copilot');
  };

  const handleLogNewVital = (
    type: 'bp' | 'glucose',
    val1: string,
    val2?: string
  ) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.type === type) {
          if (type === 'bp') {
            return {
              ...v,
              value: val1,
              subValue: val2 ? `/${val2}` : v.subValue,
              lastChecked: 'Just now',
            };
          }
          return {
            ...v,
            value: val1,
            lastChecked: 'Just now',
          };
        }
        return v;
      })
    );
  };

  const handleAddScannedRecord = (newRec: MedicalRecord) => {
    setRecords((prev) => [newRec, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-300">
      {/* Fixed Top Header */}
      <Header
        patient={patient}
        onOpenPatientModal={() => setIsPatientModalOpen(true)}
        onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        onCycleFontScale={() => setIsElderlyMode(!isElderlyMode)}
      />

      {/* Main Content View Container - Variation 1 max-width: 800px; margin: 0 auto; padding: 2rem */}
      <main className="flex-1 w-full max-w-[800px] mx-auto pt-24 pb-20 px-4 sm:px-8 overflow-y-auto transition-all">
        {currentTab === 'home' && (
          <HomeScreen
            patient={patient}
            medications={medications}
            vitals={vitals}
            records={records}
            language={language}
            materialStyle={materialStyle}
            isElderlyMode={isElderlyMode}
            onSetLanguage={setLanguage}
            onToggleElderlyMode={() => setIsElderlyMode(!isElderlyMode)}
            onMarkMedicationTaken={handleMarkMedicationTaken}
            onSnoozeMedication={handleSnoozeMedication}
            onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
            onOpenDrQuestions={() => setIsDrQuestionsOpen(true)}
            onOpenScanModal={() => setIsScanModalOpen(true)}
            onPlayAudioSummary={() => setIsAudioToastOpen(true)}
            onNavigateTab={setCurrentTab}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {currentTab === 'records' && (
          <RecordsScreen
            patient={patient}
            records={records}
            onOpenScanModal={() => setIsScanModalOpen(true)}
            onOpenDrQuestions={() => setIsDrQuestionsOpen(true)}
          />
        )}

        {currentTab === 'copilot' && (
          <CopilotScreen
            patient={patient}
            initialQuery={copilotInitialQuery}
            onClearInitialQuery={() => setCopilotInitialQuery('')}
            onOpenDrQuestions={() => setIsDrQuestionsOpen(true)}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineScreen
            patient={patient}
            vitals={vitals}
            onLogNewVital={handleLogNewVital}
          />
        )}

        {currentTab === 'care' && (
          <CareScreen
            patient={patient}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Theme Studio Drawer */}
      <ThemeStudioDrawer
        isOpen={isThemeStudioOpen}
        onClose={() => setIsThemeStudioOpen(false)}
        activePreset={themePreset}
        activeMaterial={materialStyle}
        activeAccent={accentColor}
        activeRadius={cornerRadius}
        isContrastBoosted={isContrastBoosted}
        onSelectPreset={setThemePreset}
        onSelectMaterial={setMaterialStyle}
        onSelectAccent={(accent, container, fixed) => {
          setAccentColor(accent);
          setAccentContainer(container);
          setAccentFixed(fixed);
        }}
        onSelectRadius={setCornerRadius}
        onToggleContrast={() => setIsContrastBoosted(!isContrastBoosted)}
        onReset={handleResetTheme}
      />

      {/* Dr Questions Modal */}
      <DrQuestionsModal
        isOpen={isDrQuestionsOpen}
        onClose={() => setIsDrQuestionsOpen(false)}
        initialQuestions={records[0]?.aiQuestionsForDoctor || [
          'Should we begin low-dose iron supplements for Savithri Devi?',
          'Does the low hemoglobin interact with Metformin or Amlodipine?',
          'When should her repeat CBC panel be scheduled?',
        ]}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        patientName={patient.name}
      />

      {/* Patient Selector Modal */}
      <PatientSelectorModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        activePatient={patient}
        onSelectPatient={setPatient}
      />

      {/* Lab Report Scan Modal */}
      <ScanReportModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onAddRecord={handleAddScannedRecord}
      />

      {/* Audio Readout Toast */}
      <AudioReadoutToast
        isOpen={isAudioToastOpen}
        onClose={() => setIsAudioToastOpen(false)}
        language={language}
      />

      {/* Profile & Caregiver Info Drawer */}
      {isProfileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-2">
              <div>
                <div className="mono text-[9px] opacity-60">PATIENT DOSSIER</div>
                <h3 className="font-serif-garamond text-xl font-bold">
                  Caregiver Credentials
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="mono text-xs px-2 py-0.5 border border-[var(--ink)]"
              >
                [X]
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="w-12 h-12 border border-[var(--ink)] object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif-garamond text-xl font-bold">
                    {patient.name}
                  </h4>
                  <p className="text-neutral-500 text-xs">
                    {patient.age} yrs • Female • {patient.bloodGroup}
                  </p>
                  <span className="mono text-[9px] text-[var(--accent)] font-bold">
                    ABHA #{patient.abhaId}
                  </span>
                </div>
              </div>

              <div className="card p-3 bg-white dark:bg-[#1C1B19] space-y-1 mono text-[10px]">
                <p>
                  <strong>PRIMARY CAREGIVER:</strong> {patient.primaryCaregiver}
                </p>
                <p>
                  <strong>TREATING PHYSICIAN:</strong> {patient.treatingPhysician}
                </p>
                <p>
                  <strong>ALLERGIES:</strong> {patient.allergies.join(', ')}
                </p>
                <p>
                  <strong>CONDITIONS:</strong> {patient.conditions.join(', ')}
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setCurrentTab('care');
                  }}
                  className="btn-editorial flex-1 py-2 text-[10px] mono"
                >
                  MANAGE CIRCLE
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileDrawerOpen(false)}
                  className="btn-editorial-outline px-4 py-2 text-[10px] mono"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
