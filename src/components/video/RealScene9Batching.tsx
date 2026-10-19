import React, { useState } from 'react';
import { Layers, Database, Cpu, CheckCircle2 } from 'lucide-react';

interface RealScene9Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene9Batching: React.FC<RealScene9Props> = () => {
  const [batchSize, setBatchSize] = useState<number>(4);
  const [hasExpandDims, setHasExpandDims] = useState<boolean>(true);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <Layers className="w-4 h-4" />
          <span>Constitution des Lots (Batches) • Dimension Fantôme tf.expand_dims</span>
        </span>
        <span>Convention Keras : (B, H, W, C)</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-3.5 sm:gap-4 py-1 max-w-4xl w-full">
        {/* Real photo batch stack */}
        <div className="relative w-72 h-32 sm:h-36 flex items-center justify-center my-1">
          {Array.from({ length: hasExpandDims ? batchSize : 1 }, (_, i) => {
            const offset = (i - (hasExpandDims ? batchSize : 1) / 2) * 14;
            const imgSrc = i % 2 === 0 ? '/cat.jpg' : '/parrot.jpg';
            return (
              <div
                key={i}
                className="absolute w-36 h-26 sm:w-40 sm:h-28 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg transition-all duration-300 bg-white"
                style={{
                  transform: `translate(${offset}px, ${-offset * 0.25}px)`,
                  zIndex: i + 1,
                }}
              >
                <img src={imgSrc} alt="Échantillon du lot" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded font-bold">
                  Image [{i}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Shape Result Banner */}
        <div className="text-center font-mono space-y-0.5">
          <span className="text-xs text-slate-500">Tenseur 4D injecté dans Keras :</span>
          <div className="text-lg sm:text-2xl font-bold text-emerald-800">
            {hasExpandDims ? `(${batchSize}, 224, 224, 3)` : `(224, 224, 3) ❌ Rejeté (Attendu : 4D)`}
          </div>
          <p className="text-[11px] text-slate-600 font-sans max-w-md mx-auto">
            {hasExpandDims
              ? 'Le modèle traite simultanément les images en parallèle sur les cœurs vectoriels du GPU.'
              : 'Une image isolée a 3 dimensions. tf.expand_dims(img, axis=0) insère l\'axe de lot obligatoire.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-slate-100 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-800 transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={hasExpandDims}
              onChange={(e) => setHasExpandDims(e.target.checked)}
              className="accent-emerald-600 w-4 h-4 cursor-pointer"
            />
            <span>Appliquer tf.expand_dims(axis=0)</span>
          </label>

          {hasExpandDims && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] px-1">Taille de lot :</span>
              {[1, 4, 16, 32].map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchSize(b)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    batchSize === b
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
