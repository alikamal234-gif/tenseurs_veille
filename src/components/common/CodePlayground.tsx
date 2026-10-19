import React, { useState } from 'react';
import { Copy, Check, Play, RotateCcw, Info, Terminal, AlertTriangle, ExternalLink } from 'lucide-react';
import { SlideCode } from '../../types/presentation';
import { Badge } from './Badge';

interface CodePlaygroundProps {
  codeData: SlideCode;
  onLineSelect?: (lineNumber: number | null, affectedComponent?: string) => void;
  selectedLine?: number | null;
  simulatedOutput?: string;
  errorMessage?: string | null;
  onRunSimulation?: () => void;
  onResetSimulation?: () => void;
  customCodeHeader?: React.ReactNode;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  codeData,
  onLineSelect,
  selectedLine = null,
  simulatedOutput,
  errorMessage = null,
  onRunSimulation,
  onResetSimulation,
  customCodeHeader,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'explanation'>('code');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeData.pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLineClick = (lineNum: number, affected?: string) => {
    if (selectedLine === lineNum) {
      onLineSelect?.(null, undefined);
    } else {
      onLineSelect?.(lineNum, affected);
    }
  };

  const currentLineExplanation = codeData.lines.find((l) => l.lineNumber === selectedLine);

  return (
    <div className="academic-card overflow-hidden border-slate-200 bg-white">
      {/* Playground Header */}
      <div className="px-4 py-2.5 bg-slate-900 text-slate-100 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            {codeData.colabTitle || 'Exemple Python / TensorFlow'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono">
            Python 3.10 + TF 2.x
          </span>
        </div>

        <div className="flex items-center gap-2">
          {customCodeHeader}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            title="Copier le code pour Google Colab"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Distinction Banner */}
      <div className="px-4 py-1.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>
            <strong className="text-slate-800 font-medium">Double environnement :</strong> Code Python réel (exécutable sur Colab) &amp; Simulation active ci-dessous.
          </span>
        </div>
        <span className="text-[11px] text-slate-500 italic">
          Cliquez sur une ligne pour afficher son explication détaillée
        </span>
      </div>

      {/* Code Editor and Lines */}
      <div className="relative font-mono text-xs md:text-sm bg-slate-950 text-slate-100 overflow-x-auto">
        <div className="py-2.5 min-w-full">
          {codeData.lines.map((line) => {
            const isSelected = selectedLine === line.lineNumber;
            return (
              <div
                key={line.lineNumber}
                onClick={() => handleLineClick(line.lineNumber, line.affectedVisualComponent)}
                className={`group flex items-start px-3 py-1 cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-l-4 border-emerald-400 text-white'
                    : line.isKeyLine
                    ? 'bg-slate-900/40 hover:bg-slate-900 border-l-4 border-emerald-600/50'
                    : 'hover:bg-slate-900/60 border-l-4 border-transparent text-slate-300'
                }`}
              >
                {/* Line number */}
                <span className="w-7 text-right pr-3 select-none text-slate-500 group-hover:text-slate-400 font-mono text-xs pt-0.5">
                  {line.lineNumber}
                </span>

                {/* Line code with subtle token styling */}
                <div className="flex-1 whitespace-pre leading-relaxed font-mono">
                  {formatCodeLine(line.code)}
                </div>

                {/* Key line badge */}
                {line.isKeyLine && (
                  <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded ml-2 border border-emerald-800/60 shrink-0 select-none">
                    Clé
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Line Explanation Drawer */}
      {currentLineExplanation && (
        <div className="bg-emerald-50/90 border-t border-b border-emerald-200 px-4 py-2.5 flex items-start gap-2.5 animate-fadeIn">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 flex-1">
            <span className="font-semibold text-emerald-950 mr-1.5">
              Ligne {currentLineExplanation.lineNumber} :
            </span>
            <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono mr-1.5 text-emerald-900">
              {currentLineExplanation.code.trim()}
            </code>
            <p className="mt-1 text-slate-700 leading-relaxed">
              {currentLineExplanation.explanation}
            </p>
          </div>
          <button
            onClick={() => onLineSelect?.(null, undefined)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium ml-2 px-1.5 py-0.5 rounded hover:bg-emerald-100"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Execution / Output Controls */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onRunSimulation && (
            <button
              onClick={onRunSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simuler l'exécution</span>
            </button>
          )}

          {onResetSimulation && (
            <button
              onClick={onResetSimulation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Utilité :</span>
          <span className="truncate max-w-xs md:max-w-md">{codeData.whyUseful}</span>
        </div>
      </div>

      {/* Output Panel / Error messages */}
      <div className="p-3 bg-white border-t border-slate-200 text-xs">
        {errorMessage ? (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-950">Erreur de simulation : </span>
              {errorMessage}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-slate-600">
                <Terminal className="w-3 h-3 text-slate-500" /> Sortie console attendue (Python / Colab) :
              </span>
              <span className="text-emerald-700 font-mono">Status: 200 OK</span>
            </div>
            <pre className="p-2.5 bg-slate-100 rounded text-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-slate-200/80">
              {simulatedOutput || codeData.expectedOutput}
            </pre>
          </div>
        )}

        {/* Common Pitfall Note */}
        {codeData.commonPitfall && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-semibold">Erreur classique à éviter : </strong>
              {codeData.commonPitfall}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for lightweight syntax highlighting
function formatCodeLine(code: string): React.ReactNode {
  if (code.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{code}</span>;
  }

  // Tokenize basic python keywords
  const parts = code.split(/(\b(?:import|from|as|def|return|for|in|print|tf|layers|models)\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (['import', 'from', 'as', 'def', 'return', 'for', 'in'].includes(part)) {
          return (
            <span key={i} className="text-purple-400 font-semibold">
              {part}
            </span>
          );
        }
        if (part === 'tf') {
          return (
            <span key={i} className="text-amber-300 font-semibold">
              {part}
            </span>
          );
        }
        if (['layers', 'models', 'print'].includes(part)) {
          return (
            <span key={i} className="text-sky-300">
              {part}
            </span>
          );
        }
        if (part.includes('"') || part.includes("'")) {
          return (
            <span key={i} className="text-emerald-300">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
