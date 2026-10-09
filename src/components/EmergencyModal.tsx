import React from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  patientName = 'Savithri Devi',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-3">
          <div>
            <div className="mono text-[9px] text-red-600 font-bold">[EMERGENCY PROTOCOL]</div>
            <h2 className="font-serif-garamond text-2xl font-bold">
              Emergency Response 112
            </h2>
            <p className="text-xs text-neutral-500 pt-0.5">
              Patient: {patientName} • Age 72
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mono text-xs px-2 py-0.5 border border-[var(--ink)] hover:bg-black/5"
          >
            [X]
          </button>
        </div>

        {/* Action contacts */}
        <div className="space-y-3">
          {/* 112 National Emergency */}
          <a
            href="tel:112"
            className="card p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-700 block text-left group hover:bg-red-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="mono text-[9px] text-red-700 font-bold">
                  [NATIONAL DISPATCH]
                </span>
                <div className="font-serif-garamond text-xl font-bold text-red-900 dark:text-red-200">
                  Dial 112 Ambulance
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Immediate triage response
                </p>
              </div>
              <span className="btn-editorial bg-red-700 text-white border-red-700 text-[10px]">
                CALL 112
              </span>
            </div>
          </a>

          {/* Dr. Sharma */}
          <a
            href="tel:+919988011223"
            className="card p-3.5 bg-white dark:bg-[#1C1B19] flex justify-between items-center group hover:bg-black/5"
          >
            <div>
              <span className="mono text-[9px] opacity-60">[SPECIALIST DESK]</span>
              <div className="font-serif-garamond text-lg font-bold">
                Dr. R. Sharma (Cardiologist)
              </div>
              <p className="mono text-[10px] text-neutral-500">+91 99880 11223</p>
            </div>
            <span className="btn-editorial-outline text-[9px] px-2.5 py-1">
              CALL
            </span>
          </a>

          {/* Apollo 1066 */}
          <a
            href="tel:1066"
            className="card p-3.5 bg-white dark:bg-[#1C1B19] flex justify-between items-center group hover:bg-black/5"
          >
            <div>
              <span className="mono text-[9px] opacity-60">[HOSPITAL HOTLINE]</span>
              <div className="font-serif-garamond text-lg font-bold">
                Apollo Emergency Desk: 1066
              </div>
              <p className="mono text-[10px] text-neutral-500">24/7 Priority Emergency</p>
            </div>
            <span className="btn-editorial-outline text-[9px] px-2.5 py-1">
              CALL
            </span>
          </a>

          {/* Primary Caregiver (Anand) */}
          <a
            href="tel:+919849028190"
            className="card p-3.5 bg-white dark:bg-[#1C1B19] flex justify-between items-center group hover:bg-black/5"
          >
            <div>
              <span className="mono text-[9px] opacity-60">[PRIMARY CAREGIVER]</span>
              <div className="font-serif-garamond text-lg font-bold">
                Anand Kumar (Son)
              </div>
              <p className="mono text-[10px] text-neutral-500">+91 98490 28190</p>
            </div>
            <span className="btn-editorial-outline text-[9px] px-2.5 py-1">
              CALL
            </span>
          </a>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[var(--ink)]/20 text-center">
          <p className="mono text-[9px] opacity-60">
            SYMPTOMS LIKE SEVERE CHEST DISCOMFORT REQUIRE CALLING 112 IMMEDIATELY.
          </p>
        </div>
      </div>
    </div>
  );
};

