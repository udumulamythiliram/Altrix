import React, { useEffect, useState } from 'react';
import { AUDIO_SUMMARIES } from '../data/mockData';
import { LanguageCode } from '../types';

interface AudioReadoutToastProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const AudioReadoutToast: React.FC<AudioReadoutToastProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const langNames = {
    en: 'ENGLISH',
    te: 'TELUGU (తెలుగు)',
    hi: 'HINDI (हिंदी)',
  };

  const textToSpeak = AUDIO_SUMMARIES[language] || AUDIO_SUMMARIES.en;

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        if (language === 'te') {
          utterance.lang = 'te-IN';
        } else if (language === 'hi') {
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'en-US';
        }

        utterance.onend = () => {
          setIsPlaying(false);
        };
        utterance.onerror = () => {
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, language, textToSpeak]);

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 max-w-lg mx-auto z-50 bg-[var(--ink)] text-[var(--bg)] p-4 border-2 border-[var(--bg)] shadow-2xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="mono text-xs px-2.5 py-1.5 border border-[var(--bg)] hover:bg-white/10 cursor-pointer"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="mono text-[9px] text-[var(--accent)] font-bold">
              [AUDIO SYNTHESIS • {langNames[language]}]
            </span>
          </div>
          <p className="text-xs truncate opacity-80 pt-0.5">
            {textToSpeak.slice(0, 55)}...
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Stop readout"
        className="mono text-xs px-2 py-1 border border-[var(--bg)] hover:bg-white/10 cursor-pointer"
      >
        [DISMISS]
      </button>
    </div>
  );
};

