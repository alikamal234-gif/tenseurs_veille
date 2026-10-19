import React, { useState } from 'react';
import { SUNSET_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene3Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene3RgbChannels: React.FC<Scene3Props> = () => {
  const [activeChannel, setActiveChannel] = useState<'all' | 'r' | 'g' | 'b'>('all');
  const [redFactor, setRedFactor] = useState<number>(100);
  const [greenFactor, setGreenFactor] = useState<number>(100);
  const [blueFactor, setBlueFactor] = useState<number>(100);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span>Décomposition des Canaux Spectraux • Format RGB (3 Plans)</span>
      </div>

      {/* Main 3 Channels Display */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6 max-w-4xl">
        {/* Composite Full Image */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-1 bg-black border-2 border-white shadow-2xl">
            <div
              className="grid gap-px bg-zinc-800"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  let r = (p.r * redFactor) / 100;
                  let g = (p.g * greenFactor) / 100;
                  let b = (p.b * blueFactor) / 100;
                  if (activeChannel === 'r') { g = 0; b = 0; }
                  if (activeChannel === 'g') { r = 0; b = 0; }
                  if (activeChannel === 'b') { r = 0; g = 0; }

                  return (
                    <div
                      key={`c-${y}-${x}`}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                    />
                  );
                })
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-300 font-bold">
            Image Recombinée (8×8×3)
          </span>
        </div>

        {/* Separated 3 Channels */}
        <div className="flex items-center gap-3">
          {/* Red */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'r' ? 'all' : 'r')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'r' ? 'scale-105 ring-2 ring-red-500 rounded p-1' : 'opacity-80'
            }`}
          >
            <span className="text-[10px] font-mono text-red-400">Canal R [:, :, 0]</span>
            <div
              className="grid gap-px bg-zinc-900 p-1 border border-red-900 rounded"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => (
                  <div
                    key={`r-${y}-${x}`}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ backgroundColor: `rgb(${p.r}, 0, 0)` }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Green */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'g' ? 'all' : 'g')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'g' ? 'scale-105 ring-2 ring-green-500 rounded p-1' : 'opacity-80'
            }`}
          >
            <span className="text-[10px] font-mono text-green-400">Canal V [:, :, 1]</span>
            <div
              className="grid gap-px bg-zinc-900 p-1 border border-green-900 rounded"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => (
                  <div
                    key={`g-${y}-${x}`}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ backgroundColor: `rgb(0, ${p.g}, 0)` }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Blue */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'b' ? 'all' : 'b')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'b' ? 'scale-105 ring-2 ring-blue-500 rounded p-1' : 'opacity-80'
            }`}
          >
            <span className="text-[10px] font-mono text-blue-400">Canal B [:, :, 2]</span>
            <div
              className="grid gap-px bg-zinc-900 p-1 border border-blue-900 rounded"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => (
                  <div
                    key={`b-${y}-${x}`}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ backgroundColor: `rgb(0, 0, ${p.b})` }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Channel toggles */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-xs font-mono">
        <span className="text-zinc-500">Isoler :</span>
        <button
          onClick={() => setActiveChannel('all')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeChannel === 'all' ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          Tous les canaux
        </button>
        <button
          onClick={() => setActiveChannel('r')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeChannel === 'r' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-red-300'
          }`}
        >
          Rouge
        </button>
        <button
          onClick={() => setActiveChannel('g')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeChannel === 'g' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-green-300'
          }`}
        >
          Vert
        </button>
        <button
          onClick={() => setActiveChannel('b')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeChannel === 'b' ? 'bg-blue-600 text-white font-bold' : 'bg-zinc-800 text-blue-300'
          }`}
        >
          Bleu
        </button>
      </div>
    </div>
  );
};
