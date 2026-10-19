import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';

interface RealScene8Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene8Classification: React.FC<RealScene8Props> = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<'cat' | 'parrot'>('cat');

  const classes = selectedAnimal === 'cat'
    ? [
        { label: 'Chat domestique (tabby cat)', prob: 98.4, isTarget: true },
        { label: 'Lynx roux (bobcat)', prob: 1.2, isTarget: false },
        { label: 'Renard (red fox)', prob: 0.2, isTarget: false },
        { label: 'Chien (golden retriever)', prob: 0.1, isTarget: false },
        { label: 'Perroquet ara (macaw)', prob: 0.1, isTarget: false },
      ]
    : [
        { label: 'Perroquet ara (macaw)', prob: 99.1, isTarget: true },
        { label: 'Toucan à bec rouge', prob: 0.5, isTarget: false },
        { label: 'Colibri (hummingbird)', prob: 0.2, isTarget: false },
        { label: 'Chat domestique (tabby cat)', prob: 0.1, isTarget: false },
        { label: 'Papillon paon du jour', prob: 0.1, isTarget: false },
      ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <Award className="w-4 h-4" />
          <span>Inférence CNN Finale • Des Tenseurs aux Probabilités Softmax</span>
        </span>
        <span>Dense(10, activation='softmax')</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 py-2 max-w-4xl">
        {/* Real photo */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg">
            <img
              src={selectedAnimal === 'cat' ? '/cat.jpg' : '/parrot.jpg'}
              alt="Photo test"
              className="w-44 h-44 sm:w-48 sm:h-48 object-cover"
            />
            <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
              Tenseur Entrée (1, 224, 224, 3)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-600 font-medium">
            Photo injectée au modèle
          </span>
        </div>

        {/* Arrow & CNN Icon */}
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Conv2D + Dense
          </span>
          <ArrowRight className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Softmax Probability Bars */}
        <div className="flex flex-col gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-w-[280px] shadow-sm">
          <span className="text-xs font-bold text-slate-800 pb-1 border-b border-slate-200 font-mono">
            Sortie Softmax (Probabilités) :
          </span>

          <div className="space-y-2">
            {classes.map((c, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`truncate max-w-[190px] ${c.isTarget ? 'font-bold text-emerald-950' : 'text-slate-500'}`}>
                    {c.label}
                  </span>
                  <span className={`font-mono text-[11px] font-bold ${c.isTarget ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {c.prob}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      c.isTarget ? 'bg-emerald-600 shadow-sm' : 'bg-slate-300'
                    }`}
                    style={{ width: `${c.prob}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Switch photo */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
        <span className="text-slate-500">Tester une autre photo :</span>
        <button
          onClick={() => setSelectedAnimal('cat')}
          className={`px-3 py-1 rounded-md transition-colors ${
            selectedAnimal === 'cat'
              ? 'bg-emerald-700 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Photo du Chat (281: tabby_cat)
        </button>
        <button
          onClick={() => setSelectedAnimal('parrot')}
          className={`px-3 py-1 rounded-md transition-colors ${
            selectedAnimal === 'parrot'
              ? 'bg-emerald-700 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Photo du Perroquet (88: macaw)
        </button>
      </div>
    </div>
  );
};
