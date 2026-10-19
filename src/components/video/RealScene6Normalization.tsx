import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RealScene6Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene6Normalization: React.FC<RealScene6Props> = () => {
  const [mode, setMode] = useState<'zero_one' | 'minus_one_one' | 'raw'>('zero_one');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <Activity className="w-4 h-4" />
          <span>Normalisation des Pixels • Éviter la Saturation des Gradients</span>
        </span>
        <span>tf.keras.layers.Rescaling</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-2 max-w-4xl">
        {/* Real photo representation */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
            <img
              src="/cat.jpg"
              alt="Photo chat normalisée"
              className="w-44 h-44 sm:w-52 sm:h-52 object-cover"
              style={{
                filter:
                  mode === 'raw'
                    ? 'contrast(130%)'
                    : mode === 'zero_one'
                    ? 'none'
                    : 'contrast(110%) brightness(95%)',
              }}
            />
            <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
              {mode === 'raw'
                ? 'Valeurs Brutes uint8 [0, 255]'
                : mode === 'zero_one'
                ? 'Normalisé float32 [0.0, 1.0]'
                : 'Centré en zéro [-1.0, 1.0]'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {mode === 'raw' ? '1 octet / pixel' : '4 octets / pixel (float32)'}
          </span>
        </div>

        {/* Numerical translation card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 min-w-[280px] text-xs font-mono shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-sans font-semibold">Échantillon</span>
            <span className="font-bold text-slate-800">Transformation</span>
          </div>

          <div className="space-y-1.5">
            {[
              { name: 'Oeil Vert', raw: [45, 140, 70] },
              { name: 'Pelage Blanc', raw: [240, 238, 235] },
              { name: 'Ombre sombre', raw: [15, 18, 22] },
            ].map((item, idx) => {
              const val = item.raw[1]; // Green component
              const transformed =
                mode === 'raw'
                  ? val
                  : mode === 'zero_one'
                  ? (val / 255).toFixed(3)
                  : ((val / 127.5) - 1.0).toFixed(3);

              return (
                <div key={idx} className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-sans text-slate-600">{item.name} ({val})</span>
                  <span className="text-emerald-700 font-bold font-mono">
                    → {transformed}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Diagnostic status */}
          <div
            className={`p-2 rounded text-[11px] font-sans leading-tight border ${
              mode === 'raw'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {mode === 'raw' ? (
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                255 risque de saturer les neurones et de bloquer l'apprentissage.
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Valeurs réduites : Descente de gradient fluide et stable.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
        <span className="text-slate-500">Échelle :</span>
        <button
          onClick={() => setMode('zero_one')}
          className={`px-3 py-1 rounded-md transition-colors ${
            mode === 'zero_one'
              ? 'bg-emerald-700 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Rescaling [0.0, 1.0] (1./255)
        </button>
        <button
          onClick={() => setMode('minus_one_one')}
          className={`px-3 py-1 rounded-md transition-colors ${
            mode === 'minus_one_one'
              ? 'bg-emerald-700 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Centré [-1.0, 1.0] (x/127.5 - 1)
        </button>
        <button
          onClick={() => setMode('raw')}
          className={`px-3 py-1 rounded-md transition-colors ${
            mode === 'raw'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Brut [0, 255] (uint8)
        </button>
      </div>
    </div>
  );
};
