import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: Array<{ id: AppTab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'records', label: 'Records' },
    { id: 'copilot', label: 'Copilot' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'care', label: 'Care' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[var(--bg)] border-t border-[var(--ink)]/10 px-4 py-4 flex justify-center items-center gap-6 sm:gap-8 transition-colors"
      style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
      aria-label="Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`mono cursor-pointer transition-all ${
              isActive
                ? 'opacity-100 font-bold border-b-2 border-[var(--ink)] pb-0.5'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

