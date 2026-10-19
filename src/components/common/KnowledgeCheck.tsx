import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { KnowledgeCheckItem } from '../../types/presentation';

interface KnowledgeCheckProps {
  check: KnowledgeCheckItem;
  slideNumber: string;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({ check, slideNumber }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const isSubmitted = selectedIdx !== null;
  const isCorrect = selectedIdx === check.correctIndex;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsRevealed(false);
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden my-4">
      {/* Header */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Vérification des acquis — Slide {slideNumber}
          </span>
        </div>
        {isSubmitted && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Question */}
        <p className="text-sm font-medium text-slate-800 leading-snug">
          {check.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {check.options.map((opt, idx) => {
            let btnStyle = 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700';

            if (isSubmitted) {
              if (idx === check.correctIndex) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium ring-1 ring-emerald-400';
              } else if (idx === selectedIdx) {
                btnStyle = 'bg-red-50 border-red-400 text-red-950';
              } else {
                btnStyle = 'opacity-50 border-slate-200 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && handleSelect(idx)}
                disabled={isSubmitted}
                className={`text-left text-xs md:text-sm px-3.5 py-2 rounded border transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isSubmitted && idx === check.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && idx === selectedIdx && idx !== check.correctIndex && (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer explanation toggle / reveal */}
        {isSubmitted && (
          <div className="pt-2 animate-fadeIn">
            <div
              className={`p-3 rounded text-xs leading-relaxed border ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exact ! Bonne réponse.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span>Pas tout à fait. La bonne réponse est : {String.fromCharCode(65 + check.correctIndex)}.</span>
                  </>
                )}
              </div>
              <p className="text-slate-700 mt-1">{check.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
