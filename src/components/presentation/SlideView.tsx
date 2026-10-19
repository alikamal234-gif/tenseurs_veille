import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Target, BookOpen, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';
import { SlideMetadata, SlideId } from '../../types/presentation';
import { CodePlayground } from '../common/CodePlayground';
import { KnowledgeCheck } from '../common/KnowledgeCheck';
import { Badge } from '../common/Badge';

// Visualizers
import { PixelInspector } from '../visualizers/PixelInspector';
import { TensorRankExplorer } from '../visualizers/TensorRankExplorer';
import { ShapeInspector } from '../visualizers/ShapeInspector';
import { RgbChannelSplitter } from '../visualizers/RgbChannelSplitter';
import { TensorIndexingExplorer } from '../visualizers/TensorIndexingExplorer';
import { ImageResizeSimulator } from '../visualizers/ImageResizeSimulator';
import { BatchBuilder } from '../visualizers/BatchBuilder';
import { NormalizationSimulator } from '../visualizers/NormalizationSimulator';
import { PreprocessingComparison } from '../visualizers/PreprocessingComparison';
import { CnnInputShapeChecker } from '../visualizers/CnnInputShapeChecker';
import { ErrorDebuggerClinic } from '../visualizers/ErrorDebuggerClinic';
import { EndToEndLab } from '../visualizers/EndToEndLab';
import { FinalQuiz } from '../visualizers/FinalQuiz';
import { DatasetPipelineVisualizer } from '../visualizers/DatasetPipelineVisualizer';

interface SlideViewProps {
  slide: SlideMetadata;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenGlossaryWithTerm?: (termId: string) => void;
  onMarkCompleted: (slideId: SlideId) => void;
}

export const SlideView: React.FC<SlideViewProps> = ({
  slide,
  totalSlides,
  onPrev,
  onNext,
  onOpenGlossaryWithTerm,
  onMarkCompleted,
}) => {
  const [selectedCodeLine, setSelectedCodeLine] = useState<number | null>(null);
  const [highlightedComponent, setHighlightedComponent] = useState<string | undefined>(undefined);

  const handleLineSelect = (lineNum: number | null, affectedComponent?: string) => {
    setSelectedCodeLine(lineNum);
    setHighlightedComponent(affectedComponent);
  };

  // Render the appropriate visualizer for the slide
  const renderVisualizer = () => {
    switch (slide.id) {
      case 1:
        return <PixelInspector />;
      case 2:
        return <TensorRankExplorer />;
      case 3:
        return <ShapeInspector />;
      case 4:
        return <RgbChannelSplitter />;
      case 5:
        return <TensorIndexingExplorer />;
      case 6:
        return <ImageResizeSimulator />;
      case 7:
        return (
          <div className="space-y-4">
            <DatasetPipelineVisualizer />
            <BatchBuilder />
          </div>
        );
      case 8:
        return <NormalizationSimulator />;
      case 9:
        return <PreprocessingComparison />;
      case 10:
        return <CnnInputShapeChecker />;
      case 11:
        return <ErrorDebuggerClinic />;
      case 12:
        return (
          <div className="space-y-6">
            <EndToEndLab />
            <FinalQuiz />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Slide Header & Title */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="md">
              Module {slide.numberString} / {totalSlides.toString().padStart(2, '0')}
            </Badge>
            <span className="text-xs text-slate-500 font-medium capitalize">
              Section : {slide.sectionId.replace('-', ' ')}
            </span>
          </div>

          <button
            onClick={() => onMarkCompleted(slide.id)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Valider ce module</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {slide.title}
        </h2>
      </div>

      {/* 1. Learning Objective */}
      <div className="academic-card p-4 bg-emerald-50/40 border-emerald-200 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-md shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
            Objectif d'apprentissage
          </h3>
          <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            {slide.objective}
          </p>
        </div>
      </div>

      {/* 2. Definitions and Key Notions */}
      {slide.definitions && slide.definitions.length > 0 && (
        <div className="academic-card p-4 bg-white border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Définitions &amp; Formalismes Mathématiques</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {slide.definitions.map((def, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {def.term}
                  </span>
                  {def.mathNotation && (
                    <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-800 font-semibold">
                      {def.mathNotation}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {def.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Intuition & Explanation in French */}
      <div className="academic-card p-4 bg-white border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Lightbulb className="w-4 h-4 text-emerald-700" />
          <span>Explication &amp; Intuition Mathématique</span>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {slide.explanationFrench.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* 4. Visual Interactive Simulator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Démonstration &amp; Expérimentation Visuelle Interactive
          </span>
          <span className="text-[11px] text-slate-400">
            Modifiez les paramètres pour observer les impacts
          </span>
        </div>
        {renderVisualizer()}
      </div>

      {/* 5. Code Section & Line Explainer */}
      {slide.code && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              Implémentation TensorFlow / Keras (Python)
            </span>
            <span className="text-[11px] text-slate-400">
              Code exécutable sur Google Colab
            </span>
          </div>
          <CodePlayground
            codeData={slide.code}
            onLineSelect={handleLineSelect}
            selectedLine={selectedCodeLine}
          />
        </div>
      )}

      {/* 6. Mini Knowledge Check if available */}
      {slide.miniQuiz && (
        <KnowledgeCheck check={slide.miniQuiz} slideNumber={slide.numberString} />
      )}

      {/* 7. Key Takeaways */}
      <div className="academic-card p-4 bg-slate-50 border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>À retenir pour ce module (Ce que vous avez appris)</span>
        </div>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 pl-5 list-disc leading-relaxed">
          {slide.keyTakeaway.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Slide Bottom Navigation Controls */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200">
        <button
          onClick={onPrev}
          disabled={slide.id === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Slide précédent</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
        >
          <span>{slide.id === totalSlides ? 'Terminer le cours' : 'Passer au slide suivant'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
