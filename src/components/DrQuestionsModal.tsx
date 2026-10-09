import React, { useState } from 'react';

interface DrQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  initialQuestions: string[];
}

export const DrQuestionsModal: React.FC<DrQuestionsModalProps> = ({
  isOpen,
  onClose,
  doctorName = 'Dr. R. Sharma (Cardiopulmonary)',
  initialQuestions,
}) => {
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setQuestions([...questions, newQuestionText.trim()]);
    setNewQuestionText('');
  };

  const handleCopyAll = () => {
    const textToCopy = `Questions for ${doctorName} (Patient: Savithri Devi, 72 yrs):\n\n` +
      questions.map((q, i) => `[${i + 1}] ${q}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-[var(--bg)] text-[var(--ink)] border-2 border-[var(--ink)] p-6 shadow-2xl max-h-[90vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-baseline border-b border-[var(--ink)]/20 pb-3">
          <div>
            <div className="mono text-[9px] opacity-60">[03] CLINICAL PREPARATION</div>
            <h3 className="font-serif-garamond text-2xl font-bold">
              Physician Consultation Sheet
            </h3>
            <p className="text-xs text-neutral-500 pt-0.5">
              Prepared for {doctorName}
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

        {/* Content */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          <div className="card p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-600/30">
            <div className="mono text-[9px] text-amber-800 dark:text-amber-300 font-bold mb-1">
              [VITALIS AI SYNTHESIS]
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Synthesized from Savithri Devi's latest Apollo CBC lab panel (Hemoglobin 10.2 g/dL) and daily medication schedule.
            </p>
          </div>

          <div className="space-y-2.5">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="card p-4 bg-white dark:bg-[#1C1B19] flex items-start gap-3"
              >
                <span className="mono text-[10px] font-bold text-[var(--accent)] pt-0.5">
                  [{idx + 1}]
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed flex-1">
                  {q}
                </p>
                <button
                  type="button"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                  title="Remove question"
                  className="mono text-[10px] text-neutral-400 hover:text-red-600"
                >
                  [DEL]
                </button>
              </div>
            ))}
          </div>

          {/* Add custom question */}
          <form onSubmit={handleAddQuestion} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add question for Dr. Sharma..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#1C1B19] border border-[var(--ink)]/30 font-sans focus:outline-none focus:border-[var(--ink)]"
            />
            <button
              type="submit"
              className="btn-editorial px-3 py-2 text-[10px] mono"
            >
              ADD
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--ink)]/20 flex justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyAll}
            className="btn-editorial px-4 py-2 text-[10px] mono flex-1"
          >
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY ALL QUESTIONS'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-editorial-outline px-4 py-2 text-[10px] mono"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

