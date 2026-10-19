import React, { useState } from 'react';

interface Scene8Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene8Batching: React.FC<Scene8Props> = () => {
  const [batchSize, setBatchSize] = useState<number>(4);
  const [hasExpandDims, setHasExpandDims] = useState<boolean>(true);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Mise en Lots &amp; Dimension Fantôme • tf.expand_dims(img, axis=0)</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 py-6 max-w-4xl">
        {/* Visual 3D Stack of images */}
        <div className="relative w-72 h-36 flex items-center justify-center">
          {Array.from({ length: hasExpandDims ? batchSize : 1 }, (_, i) => {
            const offset = (i - (hasExpandDims ? batchSize : 1) / 2) * 12;
            return (
              <div
                key={i}
                className="absolute w-40 h-24 rounded border border-emerald-400 bg-zinc-900 shadow-2xl flex items-center justify-between px-3 text-xs font-mono transition-all duration-300"
                style={{
                  transform: `translate(${offset}px, ${-offset * 0.4}px)`,
                  zIndex: i + 1,
                  backgroundColor: i === 0 ? '#064e3b' : '#18181b',
                }}
              >
                <span className="text-emerald-300 font-bold">Image [{i}]</span>
                <span className="text-zinc-400 text-[10px]">28×28×1</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Shape result */}
        <div className="text-center font-mono space-y-1">
          <div className="text-xs text-zinc-400">Forme finale injectée au modèle CNN :</div>
          <div className="text-xl font-bold text-emerald-400">
            {hasExpandDims ? `(${batchSize}, 28, 28, 1)` : `(28, 28, 1)  ❌ Erreur 3D !`}
          </div>
          <span className="text-[11px] text-zinc-500 block">
            {hasExpandDims
              ? 'Tenseur 4D valide conforme à la convention NHWC de Keras'
              : 'Keras attend obligatoirement 4 dimensions (ValueError: Expected 4D, got 3D)'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-800 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded border border-zinc-700">
            <input
              type="checkbox"
              checked={hasExpandDims}
              onChange={(e) => setHasExpandDims(e.target.checked)}
              className="accent-emerald-500"
            />
            <span>Activer tf.expand_dims(axis=0)</span>
          </label>

          {hasExpandDims && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Taille de lot :</span>
              {[1, 4, 16, 32].map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchSize(b)}
                  className={`px-2 py-1 rounded ${
                    batchSize === b ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-zinc-300'
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
