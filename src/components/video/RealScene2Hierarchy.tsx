import React, { useState } from 'react';
import { Layers, Box, Database } from 'lucide-react';

interface RealScene2Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene2Hierarchy: React.FC<RealScene2Props> = () => {
  const [activeRank, setActiveRank] = useState<0 | 1 | 2 | 3 | 4>(3);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-sky-700 font-semibold">
          <Layers className="w-4 h-4" />
          <span>Hiérarchie des Tenseurs : Du Scalaire (0D) au Lot (4D)</span>
        </span>
        <span>Axe et géométrie spatiale</span>
      </div>

      {/* Main visual display */}
      <div className="flex flex-col items-center justify-center min-h-[240px] w-full max-w-3xl py-2">
        {activeRank === 0 && (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-950 font-mono font-bold text-lg shadow-sm">
              215
            </div>
            <div className="text-center font-mono">
              <span className="text-xs font-bold text-slate-800">Rang 0 : Scalaire Unique</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Forme : () • Intensité d'un seul pixel</p>
            </div>
          </div>
        )}

        {activeRank === 1 && (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              {[210, 185, 140, 95, 45, 18].map((v, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded border border-sky-300 bg-white flex flex-col items-center justify-center font-mono text-xs text-sky-950 shadow-xs"
                >
                  <span className="text-[9px] text-slate-400">[{i}]</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs font-bold text-slate-800">Rang 1 : Vecteur (Ligne 1D de pixels)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Forme : (6,) • 1 dimension</p>
            </div>
          </div>
        )}

        {activeRank === 2 && (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 shadow-md">
              <img
                src="/cat.jpg"
                alt="Matrice 2D"
                className="w-36 h-36 object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 text-white font-mono text-[11px]">
                Canal Monochrome (Lignes × Cols)
              </div>
            </div>
            <div className="text-center font-mono">
              <span className="text-xs font-bold text-slate-800">Rang 2 : Matrice (Image 2D Niveaux de Gris)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Forme : (H, W) • 2 dimensions</p>
            </div>
          </div>
        )}

        {activeRank === 3 && (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="relative rounded-lg overflow-hidden border-2 border-emerald-500 shadow-lg">
              <img
                src="/cat.jpg"
                alt="Tenseur 3D"
                className="w-40 h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent flex items-end p-2 text-white font-mono text-[11px]">
                Couleur : Hauteur × Largeur × 3
              </div>
            </div>
            <div className="text-center font-mono">
              <span className="text-xs font-bold text-slate-800">Rang 3 : Tenseur 3D (Photo Couleur Réelle)</span>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Forme : (H, W, 3) • Convention NHWC</p>
            </div>
          </div>
        )}

        {activeRank === 4 && (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="flex items-center gap-3">
              {[
                { title: 'Chat 1', src: '/cat.jpg' },
                { title: 'Perroquet 1', src: '/parrot.jpg' },
                { title: 'Chat 2', src: '/cat.jpg' },
                { title: 'Perroquet 2', src: '/parrot.jpg' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border-2 border-slate-300 shadow-md relative"
                >
                  <img src={item.src} alt={item.title} className="w-18 h-18 sm:w-20 sm:h-20 object-cover" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 text-white px-1 rounded">
                    [{idx}]
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs font-bold text-slate-800">Rang 4 : Lot de Photos (Batch d'images pour CNN)</span>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Forme : (4, H, W, 3) • Prêt pour le GPU</p>
            </div>
          </div>
        )}
      </div>

      {/* Rank Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
        {[
          { r: 0, label: '0D Scalaire' },
          { r: 1, label: '1D Vecteur' },
          { r: 2, label: '2D Matrice' },
          { r: 3, label: '3D Image (H,W,C)' },
          { r: 4, label: '4D Lot (B,H,W,C)' },
        ].map((item) => (
          <button
            key={item.r}
            onClick={() => setActiveRank(item.r as any)}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all ${
              activeRank === item.r
                ? 'bg-white text-emerald-950 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
