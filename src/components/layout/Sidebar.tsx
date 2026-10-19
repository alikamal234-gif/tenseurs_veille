import React from 'react';
import { CheckCircle2, Circle, ChevronRight, Layers, HelpCircle, Award } from 'lucide-react';
import { LearningSection, SlideMetadata, SlideId } from '../../types/presentation';

interface SidebarProps {
  sections: LearningSection[];
  slides: SlideMetadata[];
  currentSlideId: SlideId;
  completedSlides: number[];
  onSelectSlide: (slideId: SlideId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  slides,
  currentSlideId,
  completedSlides,
  onSelectSlide,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-12 z-40 md:z-20 h-[calc(100vh-3rem)] w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Plan du cours (12 Modules)
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {completedSlides.length} / 12 validés
          </span>
        </div>

        {/* Sections and Slides Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => {
            const sectionSlides = slides.filter((s) => section.slideIds.includes(s.id));
            const isSectionCompleted = sectionSlides.every((s) => completedSlides.includes(s.id));

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span className="truncate">{section.title}</span>
                  {isSectionCompleted && (
                    <span className="text-[10px] text-emerald-600 font-medium lowercase">terminé</span>
                  )}
                </div>

                {/* Section Slides List */}
                <div className="space-y-1">
                  {sectionSlides.map((slide) => {
                    const isCurrent = slide.id === currentSlideId;
                    const isCompleted = completedSlides.includes(slide.id);

                    return (
                      <button
                        key={slide.id}
                        onClick={() => {
                          onSelectSlide(slide.id);
                          onClose();
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all flex items-center justify-between group ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-950 font-semibold border-l-4 border-emerald-600 shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Status Icon */}
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isCurrent ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'
                              }`}
                            />
                          )}

                          {/* Slide Number */}
                          <span
                            className={`font-mono text-[11px] shrink-0 ${
                              isCurrent ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {slide.numberString}.
                          </span>

                          {/* Slide Short Title */}
                          <span className="truncate">{slide.shortTitle}</span>
                        </div>

                        {/* Current Indicator Arrow or Final Badge */}
                        {slide.id === 12 ? (
                          <Award
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCurrent ? 'text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        ) : isCurrent ? (
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Hint */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-600">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-600">
              →
            </kbd>
            <span className="ml-1">Navigation clavier</span>
          </span>
          <span className="text-emerald-700 font-medium">Universitaire</span>
        </div>
      </aside>
    </>
  );
};
