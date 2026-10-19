import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft, HelpCircle, Trophy } from 'lucide-react';
import { FINAL_QUIZ_QUESTIONS } from '../../data/quizData';
import { Badge } from '../common/Badge';

export const FinalQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalQuestions = FINAL_QUIZ_QUESTIONS.length;
  const currentQ = FINAL_QUIZ_QUESTIONS[currentIdx];
  const selectedOption = userAnswers[currentQ.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQ.correctIndex;

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  // Score calculation
  const correctCount = Object.entries(userAnswers).filter(
    ([id, ans]) => {
      const q = FINAL_QUIZ_QUESTIONS.find((item) => item.id === Number(id));
      return q && q.correctIndex === ans;
    }
  ).length;

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  let mention = 'À revoir (Poursuivre l\'entraînement)';
  if (scorePercentage >= 90) mention = 'Félicitations ! Mention Très Bien (Expertise Tenseurs TensorFlow)';
  else if (scorePercentage >= 70) mention = 'Mention Bien (Solides compétences acquises)';
  else if (scorePercentage >= 50) mention = 'Mention Assez Bien (Notions fondamentales comprises)';

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Évaluation Académique Finale (10 Questions de Synthèse)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">
            {Object.keys(userAnswers).length} / {totalQuestions} répondues
          </Badge>
          <button
            onClick={handleReset}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            title="Recommencer le quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {!isCompleted ? (
          <div className="space-y-4">
            {/* Progress bar across 10 questions */}
            <div className="flex items-center gap-1">
              {FINAL_QUIZ_QUESTIONS.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCurrent = idx === currentIdx;
                let bg = 'bg-slate-200';
                if (ans !== undefined) {
                  bg = ans === q.correctIndex ? 'bg-emerald-500' : 'bg-red-400';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`flex-1 h-1.5 rounded-full transition-all ${bg} ${
                      isCurrent ? 'ring-2 ring-emerald-300' : ''
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Question card */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-800">
                  Question {currentIdx + 1} sur {totalQuestions}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono text-[10px]">
                    {currentQ.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px]">
                    {currentQ.difficulty}
                  </span>
                </div>
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options list */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  let btnStyle = 'border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 bg-white';

                  if (isAnswered) {
                    if (optIdx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                    } else if (optIdx === selectedOption) {
                      btnStyle = 'bg-red-50 border-red-400 text-red-950';
                    } else {
                      btnStyle = 'opacity-50 border-slate-200 text-slate-500 bg-slate-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                      className={`text-left text-xs md:text-sm px-4 py-2.5 rounded-md border transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-xs shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && optIdx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div
                  className={`p-3 rounded text-xs leading-relaxed border animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <strong className="block mb-1">
                    {isCorrect ? '✅ Bonne réponse !' : `❌ Réponse incorrecte. La bonne réponse était ${String.fromCharCode(65 + currentQ.correctIndex)}.`}
                  </strong>
                  <p className="text-slate-700">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Nav controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Question précédente</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <span>{currentIdx === totalQuestions - 1 ? 'Voir mon bilan final' : 'Question suivante'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Final Results Screen */
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-700 shadow-md">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Bilan de l'Évaluation Finale
              </h3>
              <p className="text-xs text-slate-600 mt-1">{mention}</p>
            </div>

            <div className="inline-block p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
              <div className="text-3xl font-bold font-mono text-emerald-800">
                {correctCount} / {totalQuestions}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Score : {scorePercentage}% de réussite
              </span>
            </div>

            <div className="max-w-md mx-auto text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded border border-slate-200 text-left space-y-1.5">
              <div className="font-semibold text-slate-900 pb-1 border-b border-slate-100">
                Compétences validées :
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compréhension géométrique des rangs 0D, 1D, 2D, 3D, 4D</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format spatial NHWC et manipulation des canaux RGB</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Normalisation des pixels et spécificités de preprocess_input</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Débogage des formes d'entrées et intégration tf.data</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer l'évaluation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
