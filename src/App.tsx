import React, { useState, useEffect, useCallback } from 'react';
import { Header, AppMode } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { SlideView } from './components/presentation/SlideView';
import { LivrablesView } from './components/presentation/LivrablesView';
import { VideoPlayer } from './components/video/VideoPlayer';
import { GlossaryModal } from './components/layout/GlossaryModal';
import { DefinitionPopup } from './components/common/DefinitionPopup';
import { LEARNING_SECTIONS, SLIDES_DATA } from './data/slidesData';
import { SlideId } from './types/presentation';

export function App() {
  const [currentSlideId, setCurrentSlideId] = useState<SlideId>(1);
  const [completedSlides, setCompletedSlides] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [glossaryTermId, setGlossaryTermId] = useState<string | null>(null);
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);
  const [experimentKey, setExperimentKey] = useState<number>(0);
  const [activeAppMode, setActiveAppMode] = useState<AppMode>('presentation');

  const totalSlides = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA.find((s) => s.id === currentSlideId) || SLIDES_DATA[0];

  // Navigation handlers
  const handlePrevSlide = useCallback(() => {
    setCurrentSlideId((prev) => {
      const newId = Math.max(1, prev - 1) as SlideId;
      return newId;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideId((prev) => {
      const newId = Math.min(totalSlides, prev + 1) as SlideId;
      return newId;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalSlides]);

  const handleSelectSlide = (id: SlideId) => {
    setCurrentSlideId(id);
    setActiveAppMode('presentation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkCompleted = (id: SlideId) => {
    if (!completedSlides.includes(id)) {
      setCompletedSlides([...completedSlides, id]);
    }
  };

  const handleResetExperiment = () => {
    setExperimentKey((prev) => prev + 1);
  };

  const handleOpenGlossaryWithTerm = (termId: string) => {
    setGlossaryTermId(termId);
    setIsGlossaryOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' && activeAppMode === 'presentation') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' && activeAppMode === 'presentation') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        setIsGlossaryOpen(false);
        setIsSidebarOpen(false);
        setSelectedKeywordId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, activeAppMode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Universal Academic Header */}
      <Header
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        completedSlides={completedSlides}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        onResetExperiment={handleResetExperiment}
        onOpenGlossary={() => {
          setGlossaryTermId(null);
          setIsGlossaryOpen(true);
        }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeAppMode={activeAppMode}
        onSelectAppMode={setActiveAppMode}
      />

      {/* Main Workspace Stage */}
      {activeAppMode === 'presentation' ? (
        <div className="flex-1 flex w-full relative">
          {/* Collapsible Left Sidebar (Hidden in full Presentation Mode) */}
          {!isPresentationMode && (
            <Sidebar
              sections={LEARNING_SECTIONS}
              slides={SLIDES_DATA}
              currentSlideId={currentSlideId}
              completedSlides={completedSlides}
              onSelectSlide={handleSelectSlide}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Central Interactive Slide Content */}
          <main className="flex-1 overflow-x-hidden min-w-0" key={experimentKey}>
            <SlideView
              slide={currentSlide}
              totalSlides={totalSlides}
              onPrev={handlePrevSlide}
              onNext={handleNextSlide}
              onOpenGlossaryWithTerm={handleOpenGlossaryWithTerm}
              onMarkCompleted={handleMarkCompleted}
            />
          </main>
        </div>
      ) : activeAppMode === 'livrables' ? (
        <main className="flex-1 overflow-x-hidden w-full">
          <LivrablesView />
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-6xl mx-auto">
          <VideoPlayer />
        </main>
      )}

      {/* Sticky Bottom Navigation Bar (Visible in Presentation mode) */}
      {activeAppMode === 'presentation' && (
        <BottomNav
          currentSlideId={currentSlideId}
          totalSlides={totalSlides}
          completedSlides={completedSlides}
          onPrev={handlePrevSlide}
          onNext={handleNextSlide}
          onSelectSlide={handleSelectSlide}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        />
      )}

      {/* Universitary Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialTermId={glossaryTermId}
      />

      {/* Dynamic Keyword Definition Popup */}
      <DefinitionPopup
        keywordId={selectedKeywordId}
        onClose={() => setSelectedKeywordId(null)}
      />
    </div>
  );
}

export default App;
