import React, { useState } from 'react';
import { Sliders, RefreshCw, Split } from 'lucide-react';

interface RealScene3Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene3RgbChannels: React.FC<RealScene3Props> = () => {
  const [activeChannel, setActiveChannel] = useState<'all' | 'r' | 'g' | 'b'>('all');
  const [redMultiplier, setRedMultiplier] = useState<number>(100);
  const [greenMultiplier, setGreenMultiplier] = useState<number>(100);
  const [blueMultiplier, setBlueMultiplier] = useState<number>(100);

  const resetChannels = () => {
    setActiveChannel('all');
    setRedMultiplier(100);
    setGreenMultiplier(100);
    setBlueMultiplier(100);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-red-600 font-semibold">
          <Split className="w-4 h-4" />
          <span>Décomposition Spectrale des 3 Canaux : Rouge, Vert, Bleu</span>
        </span>
        <button
          onClick={resetChannels}
          className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Main 4-View Layout: Full Image + R, G, B Channels */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 max-w-4xl">
        {/* Composite Photo */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
            <img
              src="/parrot.jpg"
              alt="Photo perroquet RGB"
              className="w-36 h-36 sm:w-44 sm:h-44 object-cover transition-all"
              style={{
                filter:
                  activeChannel === 'r'
                    ? 'sepia(100%) saturate(1000%) hue-rotate(320deg)'
                    : activeChannel === 'g'
                    ? 'sepia(100%) saturate(1000%) hue-rotate(70deg)'
                    : activeChannel === 'b'
                    ? 'sepia(100%) saturate(1000%) hue-rotate(180deg)'
                    : `brightness(${((redMultiplier + greenMultiplier + blueMultiplier) / 300) * 1.1})`,
              }}
            />
            <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
              Image Recombinée (H, W, 3)
            </span>
          </div>
        </div>

        {/* The 3 Separated Channel Views */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Red Channel */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'r' ? 'all' : 'r')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'r' ? 'scale-105 ring-2 ring-red-500 rounded-lg p-1' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="relative rounded-lg overflow-hidden border-2 border-red-300 shadow-sm">
              <img
                src="/parrot.jpg"
                alt="Canal Rouge"
                className="w-20 h-20 sm:w-26 sm:h-26 object-cover"
                style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(320deg) saturate(300%)' }}
              />
              <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-red-950/80 text-white px-1 rounded">
                [:, :, 0]
              </span>
            </div>
            <span className="text-[10px] font-bold text-red-700 font-mono">
              Canal R (Plumes)
            </span>
          </div>

          {/* Green Channel */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'g' ? 'all' : 'g')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'g' ? 'scale-105 ring-2 ring-green-500 rounded-lg p-1' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="relative rounded-lg overflow-hidden border-2 border-green-300 shadow-sm">
              <img
                src="/parrot.jpg"
                alt="Canal Vert"
                className="w-20 h-20 sm:w-26 sm:h-26 object-cover"
                style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(70deg) saturate(300%)' }}
              />
              <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-green-950/80 text-white px-1 rounded">
                [:, :, 1]
              </span>
            </div>
            <span className="text-[10px] font-bold text-green-700 font-mono">
              Canal V (Feuilles)
            </span>
          </div>

          {/* Blue Channel */}
          <div
            onClick={() => setActiveChannel(activeChannel === 'b' ? 'all' : 'b')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeChannel === 'b' ? 'scale-105 ring-2 ring-blue-500 rounded-lg p-1' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="relative rounded-lg overflow-hidden border-2 border-blue-300 shadow-sm">
              <img
                src="/parrot.jpg"
                alt="Canal Bleu"
                className="w-20 h-20 sm:w-26 sm:h-26 object-cover"
                style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(300%)' }}
              />
              <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-blue-950/80 text-white px-1 rounded">
                [:, :, 2]
              </span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 font-mono">
              Canal B (Ailes)
            </span>
          </div>
        </div>
      </div>

      {/* Channel Filters Pill Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
        <span className="text-slate-500">Mode :</span>
        <button
          onClick={() => setActiveChannel('all')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeChannel === 'all'
              ? 'bg-slate-900 text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Synthèse 3 Canaux (RGB)
        </button>
        <button
          onClick={() => setActiveChannel('r')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeChannel === 'r'
              ? 'bg-red-600 text-white font-bold'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          Isoler Rouge
        </button>
        <button
          onClick={() => setActiveChannel('g')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeChannel === 'g'
              ? 'bg-green-600 text-white font-bold'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          Isoler Vert
        </button>
        <button
          onClick={() => setActiveChannel('b')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeChannel === 'b'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Isoler Bleu
        </button>
      </div>
    </div>
  );
};
