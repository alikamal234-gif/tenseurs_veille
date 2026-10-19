import React from 'react';
import { BookOpen, RotateCcw, Maximize2, Minimize2, Menu, X, CheckCircle, HelpCircle } from 'lucide-react';
import { SlideMetadata } from '../../types/presentation';

export type AppMode = 'presentation' | 'livrables' | 'video';

interface HeaderProps {
  currentSlide: SlideMetadata;
  totalSlides: number;
  completedSlides: number[];
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onResetExperiment: () => void;
  onOpenGlossary: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeAppMode: AppMode;
  onSelectAppMode: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSlide,
  totalSlides,
  completedSlides,
  isPresentationMode,
  onTogglePresentationMode,
  onResetExperiment,
  onOpenGlossary,
  isSidebarOpen,
  onToggleSidebar,
  activeAppMode,
  onSelectAppMode,
}) => {
  const progressPercent = Math.round((completedSlides.length / totalSlides) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Sidebar toggle, Course & Slide info */}
        <div className="flex items-center gap-3 min-w-0">
          {activeAppMode === 'presentation' && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors md:hidden"
              aria-label="Basculer le menu latéral"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-100 text-emerald-800 font-mono">
                TF &amp; Keras
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Structure des Tenseurs &amp; Manipulation d'Images
              </h1>
            </div>
            {activeAppMode === 'presentation' ? (
              <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-emerald-700 font-medium">
                  Slide {currentSlide.numberString} :
                </span>
                <span className="font-medium text-slate-700">{currentSlide.title}</span>
              </p>
            ) : activeAppMode === 'livrables' ? (
              <p className="text-xs text-emerald-700 font-medium truncate mt-0.5">
                Livrables officiels : Schéma 3D/4D, Tableau comparatif, Code Python commenté &amp; Chrono 25-30 min
              </p>
            ) : (
              <p className="text-xs text-emerald-700 font-medium truncate mt-0.5">
                Capsule Vidéo &amp; Démonstrateur Interactif sur Photos Réelles
              </p>
            )}
          </div>
        </div>

        {/* Center: App Mode Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => onSelectAppMode('presentation')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeAppMode === 'presentation'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Diaporama (25-30 min)
          </button>

          <button
            onClick={() => onSelectAppMode('livrables')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeAppMode === 'livrables'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>Livrables Attendus</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          </button>

          <button
            onClick={() => onSelectAppMode('video')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeAppMode === 'video'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Capsule Vidéo Démo
          </button>
        </div>

        {/* Right: Controls & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activeAppMode === 'presentation' && (
            <>
              {/* Progress badge */}
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs">
                <span className="text-slate-500">Progression :</span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-mono font-medium text-slate-700">{progressPercent}%</span>
              </div>

              {/* Slide counter */}
              <div className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md font-mono text-xs font-semibold text-slate-700">
                {currentSlide.numberString} / {totalSlides.toString().padStart(2, '0')}
              </div>

              {/* Reset current experiment */}
              <button
                onClick={onResetExperiment}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                title="Réinitialiser l'expérience en cours"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Réinitialiser</span>
              </button>
            </>
          )}

          {/* Glossary button */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            title="Consulter le glossaire des termes clés"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Glossaire</span>
          </button>

          {/* Presentation mode toggle */}
          <button
            onClick={onTogglePresentationMode}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
            title={isPresentationMode ? "Quitter le mode présentation" : "Mode présentation plein écran"}
          >
            {isPresentationMode ? (
              <Minimize2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="flex md:hidden border-t border-slate-200 px-4 py-1.5 bg-slate-50 gap-1 overflow-x-auto">
        <button
          onClick={() => onSelectAppMode('presentation')}
          className={`flex-1 min-w-[90px] py-1 text-[11px] font-semibold rounded text-center transition-all ${
            activeAppMode === 'presentation'
              ? 'bg-emerald-700 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Diaporama
        </button>
        <button
          onClick={() => onSelectAppMode('livrables')}
          className={`flex-1 min-w-[90px] py-1 text-[11px] font-semibold rounded text-center transition-all ${
            activeAppMode === 'livrables'
              ? 'bg-emerald-700 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Livrables
        </button>
        <button
          onClick={() => onSelectAppMode('video')}
          className={`flex-1 min-w-[90px] py-1 text-[11px] font-semibold rounded text-center transition-all ${
            activeAppMode === 'video'
              ? 'bg-emerald-700 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Vidéo Démo
        </button>
      </div>
    </header>
  );
};
