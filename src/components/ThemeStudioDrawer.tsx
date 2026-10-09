import React from 'react';
import { CornerRadius, MaterialStyle, ThemePreset } from '../types';

interface ThemeStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: ThemePreset;
  activeMaterial: MaterialStyle;
  activeAccent: string;
  activeRadius: CornerRadius;
  isContrastBoosted: boolean;
  onSelectPreset: (preset: ThemePreset) => void;
  onSelectMaterial: (mat: MaterialStyle) => void;
  onSelectAccent: (accent: string, container: string, fixed: string) => void;
  onSelectRadius: (r: CornerRadius) => void;
  onToggleContrast: () => void;
  onReset: () => void;
}

export const ThemeStudioDrawer: React.FC<ThemeStudioDrawerProps> = ({
  isOpen,
  onClose,
  activePreset,
  activeMaterial,
  activeAccent,
  activeRadius,
  isContrastBoosted,
  onSelectPreset,
  onSelectMaterial,
  onSelectAccent,
  onSelectRadius,
  onToggleContrast,
  onReset,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      id: 'bright-white' as ThemePreset,
      name: 'Bright White',
      sub: 'Clean minimal',
      dotClass: 'bg-white border border-slate-300',
      bgClass: 'bg-white text-slate-900 border-slate-200',
    },
    {
      id: 'midnight-dark' as ThemePreset,
      name: 'Midnight Dark',
      sub: 'Deep slate 0x0f172a',
      dotClass: 'bg-indigo-500',
      bgClass: 'bg-slate-900 text-white border-slate-700',
    },
    {
      id: 'oled-black' as ThemePreset,
      name: 'OLED Black',
      sub: 'True #000000 black',
      dotClass: 'bg-emerald-400',
      bgClass: 'bg-black text-white border-zinc-800',
    },
    {
      id: 'ocean-teal' as ThemePreset,
      name: 'Ocean Teal',
      sub: 'Deep cyan & marine',
      dotClass: 'bg-teal-600',
      bgClass: 'bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-950 border-teal-200',
    },
    {
      id: 'soft-lavender' as ThemePreset,
      name: 'Soft Lavender',
      sub: 'Pastel lilac calm',
      dotClass: 'bg-purple-600',
      bgClass: 'bg-gradient-to-br from-purple-50 to-violet-100 text-violet-950 border-purple-200',
    },
    {
      id: 'fresh-mint' as ThemePreset,
      name: 'Fresh Mint',
      sub: 'Emerald soothing',
      dotClass: 'bg-emerald-500',
      bgClass: 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-950 border-emerald-200',
    },
    {
      id: 'warm-sunset' as ThemePreset,
      name: 'Warm Sunset',
      sub: 'Rose cream glow',
      dotClass: 'bg-orange-500',
      bgClass: 'bg-gradient-to-br from-orange-50 to-amber-100 text-amber-950 border-orange-200',
    },
    {
      id: 'hc-light' as ThemePreset,
      name: 'WCAG AAA Light',
      sub: 'Bold accessibility',
      dotClass: 'bg-black',
      bgClass: 'bg-white text-black border-2 border-black',
    },
    {
      id: 'hc-dark' as ThemePreset,
      name: 'WCAG AAA Dark',
      sub: 'High visibility',
      dotClass: 'bg-yellow-400',
      bgClass: 'bg-black text-yellow-300 border-2 border-yellow-400',
    },
  ];

  const materials = [
    {
      id: 'material-flat' as MaterialStyle,
      name: 'Standard Flat',
      icon: 'view_quilt',
      desc: 'Modern clean, solid surfaces & crisp borders',
    },
    {
      id: 'material-glass' as MaterialStyle,
      name: 'Glassmorphism',
      icon: 'blur_on',
      desc: 'Frosted glass blur with soft ambient shadows',
    },
    {
      id: 'material-neumorphic' as MaterialStyle,
      name: 'Neumorphism',
      icon: 'layers',
      desc: 'Tactile soft-UI dual shadows & extruded elements',
    },
    {
      id: 'material-crystal' as MaterialStyle,
      name: 'Crystalmorphic',
      icon: 'diamond',
      desc: 'Faceted translucent prismatic jewel refraction',
    },
  ];

  const accents = [
    { name: 'Teal', hex: '#00685f', container: '#008378', fixed: '#89f5e7' },
    { name: 'Cyan Blue', hex: '#0284c7', container: '#0369a1', fixed: '#bae6fd' },
    { name: 'Indigo', hex: '#4f46e5', container: '#4338ca', fixed: '#c7d2fe' },
    { name: 'Emerald', hex: '#059669', container: '#047857', fixed: '#a7f3d0' },
    { name: 'Amber Orange', hex: '#d97706', container: '#b45309', fixed: '#fde68a' },
    { name: 'Rose Pink', hex: '#e11d48', container: '#be123c', fixed: '#fecdd3' },
    { name: 'Amethyst Violet', hex: '#7c3aed', container: '#6d28d9', fixed: '#ddd6fe' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="relative w-full max-h-[88vh] bg-[var(--bg)] text-[var(--ink)] border-t-2 border-[var(--ink)] shadow-2xl flex flex-col overflow-hidden z-10 transition-transform">
        {/* Drag handle & Header */}
        <div className="px-6 pt-4 pb-3 border-b border-[var(--ink)]/20 flex flex-col gap-2 flex-shrink-0">
          <div
            className="w-12 h-1 bg-[var(--ink)]/40 mx-auto cursor-pointer"
            onClick={onClose}
          />
          <div className="flex items-baseline justify-between">
            <div>
              <div className="mono text-[9px] opacity-60">[THEME STUDIO]</div>
              <h3 className="font-serif-garamond text-2xl font-bold">
                Aesthetic & Material Controls
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Appearance Studio"
              className="mono text-xs px-2 py-0.5 border border-[var(--ink)] hover:bg-black/5"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="overflow-y-auto px-6 py-4 space-y-6 pb-12">
          {/* Section 1: Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">
                  format_paint
                </span>
                Theme Presets (Spec 3.2)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-700/10 text-teal-800 dark:text-teal-300 font-semibold">
                {activePreset}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presets.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPreset(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all active:scale-[0.97] flex flex-col justify-between h-20 shadow-sm cursor-pointer ${
                      p.bgClass
                    } ${
                      isSelected
                        ? 'ring-2 ring-teal-700 ring-offset-2 border-teal-700 shadow-md'
                        : 'border-outline-variant/40 hover:border-teal-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className={`w-3.5 h-3.5 rounded-full ${p.dotClass}`} />
                    </div>
                    <span className="text-[11px] opacity-75">{p.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Material & Surface Textures */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">
                  texture
                </span>
                Surface & Material Style
              </span>
              <span className="text-xs text-slate-500 font-medium">Card Finish</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {materials.map((m) => {
                const isSelected = activeMaterial === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMaterial(m.id)}
                    className={`p-3 rounded-xl text-left transition-all active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'border-2 border-teal-700 bg-teal-700/10 dark:bg-teal-900/30'
                        : 'border border-outline-variant/50 bg-surface-container-low hover:border-teal-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-[18px] text-teal-700">
                        {m.icon}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-teal-800 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {m.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Accent Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">
                  colorize
                </span>
                Primary Accent Hue
              </span>
              <span className="text-xs text-slate-500 font-medium">Brand Tone</span>
            </div>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-0.5">
              {accents.map((acc) => {
                const isSelected = activeAccent.toLowerCase() === acc.hex.toLowerCase();
                return (
                  <button
                    key={acc.name}
                    type="button"
                    onClick={() => onSelectAccent(acc.hex, acc.container, acc.fixed)}
                    aria-label={`${acc.name} Accent`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer ${
                      isSelected ? 'ring-2 ring-offset-2 ring-teal-700 scale-105' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: acc.hex }}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Corner Radius & Contrast Booster */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Corner Radius */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  rounded_corner
                </span>
                Corner Radius
              </label>
              <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-xl">
                {(['sharp', 'rounded', 'pill'] as CornerRadius[]).map((r) => {
                  const isSelected = activeRadius === r;
                  const label = r === 'sharp' ? '4px' : r === 'rounded' ? '16px' : '28px';
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onSelectRadius(r)}
                      className={`py-1.5 text-center text-xs rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-surface-container-lowest font-bold shadow-sm text-teal-800 dark:text-teal-300'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-surface-container-highest'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contrast Booster */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  contrast
                </span>
                Legibility Boost
              </label>
              <button
                type="button"
                onClick={onToggleContrast}
                className="w-full h-[40px] px-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between text-xs cursor-pointer"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isContrastBoosted ? 'Boosted' : 'Normal'}
                </span>
                <div
                  className={`w-9 h-5 rounded-full relative p-0.5 transition-colors ${
                    isContrastBoosted ? 'bg-teal-700' : 'bg-outline-variant/60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      isContrastBoosted ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-editorial flex-1 py-3 text-xs mono cursor-pointer"
            >
              APPLY SETTINGS
            </button>
            <button
              type="button"
              onClick={onReset}
              className="btn-editorial-outline px-4 py-3 text-xs mono cursor-pointer"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
