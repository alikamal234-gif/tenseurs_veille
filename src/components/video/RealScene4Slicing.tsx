import React, { useState } from 'react';
import { Crop, Scissors, ArrowRight } from 'lucide-react';

interface RealScene4Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene4Slicing: React.FC<RealScene4Props> = () => {
  const [preset, setPreset] = useState<'eyes' | 'face' | 'nose'>('eyes');

  // ROI coordinates percentage [top, left, width, height]
  const coordinates = {
    eyes: { top: 40, left: 25, width: 50, height: 26, name: 'Yeux du Chat', pySlice: 'image[200:330, 125:375, :]' },
    face: { top: 25, left: 15, width: 70, height: 60, name: 'Visage Complet', pySlice: 'image[125:425, 75:425, :]' },
    nose: { top: 58, left: 40, width: 22, height: 22, name: 'Museau & Truffe', pySlice: 'image[290:400, 200:310, :]' },
  }[preset];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
          <Scissors className="w-4 h-4" />
          <span>Découpage Tensoriel (Slicing) • Région d'Intérêt (ROI)</span>
        </span>
        <span>Sans copie mémoire</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-2 max-w-4xl">
        {/* Source image with moving bounding box */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
            <img
              src="/cat.jpg"
              alt="Photo originale"
              className="w-48 h-48 sm:w-56 sm:h-56 object-cover"
            />
            {/* Overlay bounding box */}
            <div
              className="absolute border-2 border-emerald-500 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300 pointer-events-none"
              style={{
                top: `${coordinates.top}%`,
                left: `${coordinates.left}%`,
                width: `${coordinates.width}%`,
                height: `${coordinates.height}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Image Source Complète (512×512×3)
          </span>
        </div>

        <div className="hidden sm:flex text-slate-400">
          <ArrowRight className="w-6 h-6 text-emerald-600" />
        </div>

        {/* Cropped Sub-Tensor Output */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg relative bg-slate-100 flex items-center justify-center">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'url(/cat.jpg)',
                backgroundSize: `${100 / (coordinates.width / 100)}% ${100 / (coordinates.height / 100)}%`,
                backgroundPosition: `${(coordinates.left / (100 - coordinates.width)) * 100}% ${(coordinates.top / (100 - coordinates.height)) * 100}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-emerald-800 font-bold">
            Sous-tenseur extrait : {coordinates.name}
          </span>
        </div>
      </div>

      {/* Preset pills & Python code */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-3xl pt-2 border-t border-slate-100 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Sélectionner :</span>
          <button
            onClick={() => setPreset('eyes')}
            className={`px-3 py-1 rounded-md transition-colors ${
              preset === 'eyes'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Yeux verts
          </button>
          <button
            onClick={() => setPreset('face')}
            className={`px-3 py-1 rounded-md transition-colors ${
              preset === 'face'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Visage complet
          </button>
          <button
            onClick={() => setPreset('nose')}
            className={`px-3 py-1 rounded-md transition-colors ${
              preset === 'nose'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Truffe & Museau
          </button>
        </div>

        <div className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          <code>{coordinates.pySlice}</code>
        </div>
      </div>
    </div>
  );
};
