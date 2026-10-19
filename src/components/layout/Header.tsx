import React from 'react';
import { BookOpen, RotateCcw, Maximize2, Minimize2, Menu, X, CheckCircle, HelpCircle } from 'lucide-react';
import { SlideMetadata } from '../../types/presentation';

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
}) => {
  const progressPercent = Math.round((completedSlides.length / totalSlides) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Sidebar toggle, Course & Slide info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors md:hidden"
            aria-label="Basculer le menu latéral"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-100 text-emerald-800">
                TensorFlow &amp; Keras
              </span>
              <h1 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                Structure des Tenseurs &amp; Manipulation d'Images
              </h1>
            </div>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-emerald-700 font-medium">
                Slide {currentSlide.numberString} :
              </span>
              <span className="font-medium text-slate-700">{currentSlide.title}</span>
            </p>
          </div>
        </div>

        {/* Right: Controls & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
            <span className="hidden md:inline">Réinitialiser</span>
          </button>

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
    </header>
  );
};
