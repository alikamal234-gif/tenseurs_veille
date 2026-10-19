import React from 'react';
import { X, BookOpen, Code2, Calculator } from 'lucide-react';
import { KEYWORD_DEFINITIONS } from '../../data/definitions';

interface DefinitionPopupProps {
  keywordId: string | null;
  onClose: () => void;
}

export const DefinitionPopup: React.FC<DefinitionPopupProps> = ({ keywordId, onClose }) => {
  if (!keywordId) return null;
  const def = KEYWORD_DEFINITIONS[keywordId];
  if (!def) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-800 rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-3.5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              {def.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              {def.term}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Definition */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {def.shortDef}
        </p>

        {/* Math notation if available */}
        {def.mathNotation && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs font-mono text-emerald-900">
            <Calculator className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="text-slate-500 font-sans text-[11px]">Notation :</span>
            <code>{def.mathNotation}</code>
          </div>
        )}

        {/* Python snippet if available */}
        {def.pythonExample && (
          <div className="p-2.5 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono overflow-x-auto">
            <Code2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <code>{def.pythonExample}</code>
          </div>
        )}

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded-md font-semibold transition-colors shadow-2xs"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
};
