import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Filter } from 'lucide-react';

interface RealScene7Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene7Convolution: React.FC<RealScene7Props> = ({ isPlaying = false }) => {
  const [activeKernel, setActiveKernel] = useState<'edges' | 'horizontal' | 'sharpen'>('edges');
  const [boxPos, setBoxPos] = useState<{ x: number; y: number }>({ x: 45, y: 40 });

  // 3x3 Kernels
  const kernels = {
    edges: {
      name: 'Détecteur de Contours (Laplacien)',
      matrix: [
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]
      ],
      filterCss: 'contrast(200%) invert(80%) grayscale(100%)',
    },
    horizontal: {
      name: 'Contours Horizontaux (Sobel H)',
      matrix: [
        [-1, -2, -1],
        [ 0,  0,  0],
        [ 1,  2,  1]
      ],
      filterCss: 'grayscale(100%) contrast(180%)',
    },
    sharpen: {
      name: 'Rehaussement de Netteté (Sharpen)',
      matrix: [
        [ 0, -1,  0],
        [-1,  5, -1],
        [ 0, -1,  0]
      ],
      filterCss: 'contrast(150%) brightness(105%)',
    },
  }[activeKernel];

  // Moving bounding box if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBoxPos((prev) => ({
        x: (prev.x + 8) % 70 + 15,
        y: (prev.y + 6) % 60 + 20,
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
          <Filter className="w-4 h-4" />
          <span>Convolution 2D sur Photo Réelle • Filtres 3×3 &amp; Cartes d'Activation</span>
        </span>
        <span>tf.keras.layers.Conv2D(32, (3,3))</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-2 max-w-4xl">
        {/* Real photo with sliding 3x3 kernel box */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
            <img
              src="/cat.jpg"
              alt="Photo originale du chat"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover"
            />
            {/* Sliding 3x3 filter box */}
            <div
              className="absolute w-12 h-12 border-2 border-amber-500 bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.6)] transition-all duration-300 pointer-events-none"
              style={{
                left: `${boxPos.x}%`,
                top: `${boxPos.y}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Image Entrée (224×224×3)
          </span>
        </div>

        {/* 3x3 Filter Kernel Card */}
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg shadow-sm">
            <div
              className="grid gap-1 bg-amber-950 p-1.5 rounded"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {kernels.matrix.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="w-6 h-6 sm:w-7 sm:h-7 bg-[#b45309] text-white flex items-center justify-center font-mono text-xs font-bold rounded-xs shadow-2xs"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-800">
            Noyau 3×3
          </span>
        </div>

        {/* Resulting Feature Map (Cartes d'activation) */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-800 shadow-lg bg-black">
            <img
              src="/cat.jpg"
              alt="Feature map"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover"
              style={{ filter: kernels.filterCss }}
            />
            <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
              Feature Map (Conv2D)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-800 font-bold">
            Motifs &amp; Contours Extraits
          </span>
        </div>
      </div>

      {/* Filter type switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-3xl pt-2 border-t border-slate-100 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Choisir le filtre :</span>
          <button
            onClick={() => setActiveKernel('edges')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeKernel === 'edges'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Contours &amp; Moustaches
          </button>
          <button
            onClick={() => setActiveKernel('horizontal')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeKernel === 'horizontal'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Contours Horizontaux
          </button>
          <button
            onClick={() => setActiveKernel('sharpen')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeKernel === 'sharpen'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Netteté (Textures)
          </button>
        </div>

        <span className="text-slate-500 text-[11px]">
          {kernels.name}
        </span>
      </div>
    </div>
  );
};
