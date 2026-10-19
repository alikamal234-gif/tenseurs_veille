import React, { useState } from 'react';
import { VideoPlayer } from './components/video/VideoPlayer';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { KEYWORD_DEFINITIONS } from './data/definitions';
import { DefinitionPopup } from './components/common/DefinitionPopup';

export function App() {
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);
  const [isGlossaryDrawerOpen, setIsGlossaryDrawerOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Clean White Academic Header */}
      <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white shadow-xs text-sm font-mono">
              TF
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Structure des Tenseurs &amp; Manipulation d'Images
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Présentation interactive et visuelle au format vidéo explicative • TensorFlow &amp; Keras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGlossaryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lexique des Mots-Clés</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Video Process Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-6xl mx-auto">
        <VideoPlayer />
      </main>

      {/* Clean Footer Instruction */}
      <footer className="w-full border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500 font-mono">
        💡 Astuce : Cliquez sur les <span className="text-emerald-800 font-bold border-b-2 border-dashed border-emerald-500 px-1">mots soulignés</span> dans les sous-titres pour ouvrir leur définition et formule mathématique.
      </footer>

      {/* Glossary Drawer (White Aesthetic) */}
      {isGlossaryDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsGlossaryDrawerOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Mots-Clés &amp; Définitions du Cours</span>
              </h3>
              <button
                onClick={() => setIsGlossaryDrawerOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs"
              >
                Fermer
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              {Object.values(KEYWORD_DEFINITIONS).map((def) => (
                <div
                  key={def.id}
                  onClick={() => {
                    setIsGlossaryDrawerOpen(false);
                    setSelectedKeywordId(def.id);
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700 font-mono">
                      {def.term}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {def.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{def.shortDef}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single Definition Popup when a keyword is clicked */}
      <DefinitionPopup
        keywordId={selectedKeywordId}
        onClose={() => setSelectedKeywordId(null)}
      />
    </div>
  );
}

export default App;
