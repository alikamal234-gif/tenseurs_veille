import React, { useState } from 'react';
import { Maximize2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RealScene5Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene5Resize: React.FC<RealScene5Props> = () => {
  const [method, setMethod] = useState<'bilinear' | 'nearest'>('bilinear');
  const [targetSize, setTargetSize] = useState<number>(224);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <Maximize2 className="w-4 h-4" />
          <span>Redimensionnement &amp; Interpolation : Bilinéaire vs Plus Proche Voisin</span>
        </span>
        <span>Standard CNN : 224×224</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-2 max-w-4xl">
        {/* Original HD Photo */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
            <img
              src="/cat.jpg"
              alt="Photo originale HD"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover"
            />
            <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
              Original (1024×1024)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Résolution Source Variable
          </span>
        </div>

        {/* Resized Result */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg">
            <img
              src="/cat.jpg"
              alt="Photo redimensionnée"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover transition-all"
              style={{
                imageRendering: method === 'nearest' ? 'pixelated' : 'auto',
                filter: method === 'nearest' ? 'contrast(120%)' : 'none',
              }}
            />
            <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-emerald-950/80 text-emerald-200 px-1.5 py-0.5 rounded">
              {targetSize}×{targetSize} ({method.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 font-bold">
            Forme Keras : ({targetSize}, {targetSize}, 3)
          </span>
        </div>
      </div>

      {/* Method toggles and resolution selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-3xl pt-2 border-t border-slate-100 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Algorithme :</span>
          <button
            onClick={() => setMethod('bilinear')}
            className={`px-3 py-1 rounded-md transition-colors ${
              method === 'bilinear'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bilinéaire (Lisse &amp; Continu)
          </button>
          <button
            onClick={() => setMethod('nearest')}
            className={`px-3 py-1 rounded-md transition-colors ${
              method === 'nearest'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Plus Proche Voisin (Crénelé)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Taille :</span>
          {[64, 128, 224].map((s) => (
            <button
              key={s}
              onClick={() => setTargetSize(s)}
              className={`px-2 py-0.5 rounded ${
                targetSize === s ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
