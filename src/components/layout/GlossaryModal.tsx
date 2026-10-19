import React, { useState } from 'react';
import { Search, X, BookOpen, Code2, Calculator, Tag } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../data/glossaryData';
import { GlossaryTerm } from '../../types/presentation';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTermId, setActiveTermId] = useState<string | null>(initialTermId);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous les termes' },
    { id: 'Tensor', label: 'Tenseurs' },
    { id: 'Image', label: 'Images & Couleurs' },
    { id: 'Pipeline', label: 'Pipelines & tf.data' },
    { id: 'Keras/Model', label: 'Keras & CNN' },
    { id: 'Optimization', label: 'Normalisation' },
  ];

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.fullDefinition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Glossaire Universitaire : Tenseurs &amp; TensorFlow
              </h2>
              <p className="text-xs text-slate-500">
                Définitions mathématiques, formalisations et exemples de code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher un terme (ex: NHWC, batch, normalisation, rank...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Aucun terme correspondant à votre recherche.
            </div>
          ) : (
            filteredTerms.map((t) => (
              <div key={t.id} className="pt-3.5 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    {t.term}
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {t.category}
                    </span>
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {t.fullDefinition}
                </p>

                {/* Math notation if available */}
                {t.mathNotation && (
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-700">
                    <Calculator className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-slate-500 text-[11px] font-sans">Formalisme :</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-900">
                      {t.mathNotation}
                    </span>
                  </div>
                )}

                {/* Python example if available */}
                {t.pythonExample && (
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-300">
                    <Code2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <code>{t.pythonExample}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            Fermer le glossaire
          </button>
        </div>
      </div>
    </div>
  );
};
