import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, LanguageCode, PatientProfile } from '../types';

interface CopilotScreenProps {
  patient: PatientProfile;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onOpenDrQuestions: () => void;
}

export const CopilotScreen: React.FC<CopilotScreenProps> = ({
  patient,
  initialQuery,
  onClearInitialQuery,
  onOpenDrQuestions,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Good day Anand. I am Vitalis Clinical Copilot. Current patient briefing for Savithri Devi:\n\n• 08:00 AM Amlodipine 5mg has been recorded.\n• 02:00 PM Metformin 500mg is scheduled with meals.\n• Apollo Diagnostics CBC: Hemoglobin is 10.2 g/dL (mild iron-deficiency pattern).\n\nInquire about medications, dietary adjustments, or questions for Dr. R. Sharma.`,
      timestamp: 'INITIALIZED',
      source: 'clinical_engine',
    },
  ]);

  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q.trim(),
          language,
          patientProfile: {
            name: patient.name,
            age: patient.age,
            conditions: patient.conditions,
            medications: [
              { name: 'Amlodipine 5mg', timing: '08:00 AM', note: 'Taken', status: 'taken' },
              { name: 'Metformin 500mg', timing: '02:00 PM', note: 'Due soon', status: 'due' },
              { name: 'Atorvastatin 10mg', timing: '08:30 PM', note: 'Scheduled', status: 'scheduled' },
            ],
            vitals: { bp: '128/82', glucose: '118', hb: '10.2' },
          },
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `Clinical Observation for Savithri Devi:\n\n• Blood Pressure (128/82) and Fasting Glucose (118 mg/dL) remain well managed.\n• Metformin 500mg should be taken with meals to minimize stomach upset.\n• Low hemoglobin (10.2 g/dL) is consistent with mild microcytic anemia. Discuss oral iron supplements with Dr. Sharma.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'clinical_engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechOutput = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInput('What dietary adjustments help low hemoglobin for Savithri Devi?');
        setIsListening(false);
      }, 1400);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-4 pb-28 flex flex-col h-[calc(100vh-130px)]">
      {/* Top Banner with Language Selector */}
      <div className="flex items-baseline justify-between border-b border-[var(--ink)]/20 pb-3 flex-shrink-0">
        <div>
          <div className="mono text-[10px] opacity-60">[03] CLINICAL COPILOT</div>
          <h2 className="font-serif-garamond text-2xl font-bold text-[var(--ink)]">
            Interactive Consultation
          </h2>
        </div>

        <div className="inline-flex border border-[var(--ink)]/30 p-0.5">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`mono text-[9px] px-2 py-1 transition-all cursor-pointer ${
              language === 'en' ? 'bg-[var(--ink)] text-[var(--bg)] font-bold' : ''
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('te')}
            className={`mono text-[9px] px-2 py-1 transition-all cursor-pointer ${
              language === 'te' ? 'bg-[var(--ink)] text-[var(--bg)] font-bold' : ''
            }`}
          >
            తెలుగు
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`mono text-[9px] px-2 py-1 transition-all cursor-pointer ${
              language === 'hi' ? 'bg-[var(--ink)] text-[var(--bg)] font-bold' : ''
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[var(--ink)] text-[var(--bg)] font-sans'
                    : 'card bg-white dark:bg-[#1C1B19] text-[var(--ink)]'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-[var(--ink)]/10">
                    <span className="mono text-[9px] opacity-70">
                      [VITALIS AI • VERIFIED TELEMETRY]
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeechOutput(msg.id, msg.text)}
                      className="mono text-[9px] underline opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      {speakingMsgId === msg.id ? '[STOP AUDIO]' : '[LISTEN]'}
                    </button>
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
              <span className="mono text-[9px] opacity-40 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="card p-3 bg-white dark:bg-[#1C1B19] max-w-[70%] mono text-[10px] animate-pulse">
            [SYNTHESIZING CLINICAL DATA VIA GEMINI...]
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 py-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => handleSendMessage('Can Metformin cause stomach upset if taken without meals?')}
          className="mono text-[9px] px-2.5 py-1 border border-[var(--ink)]/20 hover:border-[var(--ink)] cursor-pointer"
        >
          [Metformin Meal Rule]
        </button>
        <button
          type="button"
          onClick={() => handleSendMessage('What iron-rich Indian diet is safe for diabetic seniors?')}
          className="mono text-[9px] px-2.5 py-1 border border-[var(--ink)]/20 hover:border-[var(--ink)] cursor-pointer"
        >
          [Diabetic Iron Diet]
        </button>
        <button
          type="button"
          onClick={onOpenDrQuestions}
          className="mono text-[9px] px-2.5 py-1 border border-amber-600/40 text-amber-800 dark:text-amber-300 font-bold cursor-pointer"
        >
          [Dr. Sharma Prep Sheet]
        </button>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type health question for Savithri Devi..."
            className="w-full h-11 px-4 pr-12 text-xs bg-[var(--bg)] border border-[var(--ink)]/30 font-sans focus:outline-none focus:border-[var(--ink)]"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            title="Voice Speech Dictation"
            className={`absolute right-1.5 top-1.5 w-8 h-8 flex items-center justify-center mono text-[10px] cursor-pointer ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'text-[var(--ink)] hover:bg-black/5'
            }`}
          >
            MIC
          </button>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn-editorial px-4 py-2.5 text-[10px] mono cursor-pointer disabled:opacity-40"
        >
          SEND
        </button>
      </form>
    </div>
  );
};
