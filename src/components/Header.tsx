import React from 'react';
import { PatientProfile } from '../types';

interface HeaderProps {
  patient: PatientProfile;
  onOpenPatientModal: () => void;
  onOpenThemeStudio: () => void;
  onOpenEmergencyModal: () => void;
  onOpenProfileDrawer: () => void;
  onCycleFontScale: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  onOpenPatientModal,
  onOpenThemeStudio,
  onOpenEmergencyModal,
  onOpenProfileDrawer,
  onCycleFontScale,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg)] border-b-2 border-[var(--ink)] px-4 sm:px-8 md:px-12 py-4 sm:py-5 flex justify-between items-baseline transition-colors">
      <div className="max-w-[800px] w-full mx-auto flex justify-between items-baseline">
        <div>
          <div className="mono">[01] VITALIS</div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif-garamond text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)] leading-tight">
              Clinical Copilot
            </h1>
            <button
              type="button"
              onClick={onOpenPatientModal}
              className="mono text-[10px] text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity underline decoration-dotted cursor-pointer hidden md:inline"
            >
              [{patient.name.toUpperCase()}]
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenThemeStudio}
            className="btn-editorial-outline px-2.5 py-1.5 text-[10px] mono hidden sm:inline-flex items-center cursor-pointer"
            title="Appearance Studio"
          >
            [STUDIO]
          </button>

          <button
            type="button"
            onClick={onCycleFontScale}
            className="btn-editorial-outline px-2.5 py-1.5 text-[10px] mono cursor-pointer"
            title="Toggle Font Scale"
          >
            Aa
          </button>

          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="btn"
          >
            Emergency 112
          </button>

          <button
            type="button"
            onClick={onOpenProfileDrawer}
            className="w-9 h-9 border border-[var(--ink)] p-0.5 cursor-pointer hover:opacity-80 transition-opacity ml-1 hidden xs:block"
            title="Profile"
          >
            <img
              src={patient.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

