import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Maximize2, Minimize2 } from 'lucide-react';
import { SlideId } from '../../types/presentation';

interface BottomNavProps {
  currentSlideId: SlideId;
  totalSlides: number;
  completedSlides: number[];
  onPrev: () => void;
  onNext: () => void;
  onSelectSlide: (id: SlideId) => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentSlideId,
  totalSlides,
  completedSlides,
  onPrev,
  onNext,
  onSelectSlide,
  isPresentationMode,
  onTogglePresentationMode,
}) => {
  const isFirst = currentSlideId === 1;
  const isLast = currentSlideId === totalSlides;

  return (
    <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200 py-2.5 px-4 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-2xs'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Précédent</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
            [←]
          </span>
        </button>

        {/* Center: Segmented Progress Bar & Slide indicators */}
        <div className="flex-1 max-w-xl mx-2 flex flex-col items-center gap-1">
          <div className="w-full flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: totalSlides }, (_, i) => {
              const slideNum = (i + 1) as SlideId;
              const isCurrent = slideNum === currentSlideId;
              const isDone = completedSlides.includes(slideNum);

              return (
                <button
                  key={slideNum}
                  onClick={() => onSelectSlide(slideNum)}
                  className={`flex-1 h-2 rounded-full transition-all duration-200 relative group ${
                    isCurrent
                      ? 'bg-emerald-600 ring-2 ring-emerald-200'
                      : isDone
                      ? 'bg-emerald-300 hover:bg-emerald-400'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`Slide ${slideNum}`}
                  aria-label={`Aller au slide ${slideNum}`}
                >
                  <span className="sr-only">Slide {slideNum}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-2">
            <span>
              Slide <strong className="text-slate-800">{currentSlideId}</strong> sur {totalSlides}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Touches ← et → pour naviguer</span>
          </div>
        </div>

        {/* Next / Finish Button */}
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
        >
          <span>{isLast ? 'Atelier & Évaluation' : 'Suivant'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px] text-emerald-200 font-mono">
            [→]
          </span>
        </button>
      </div>
    </footer>
  );
};
