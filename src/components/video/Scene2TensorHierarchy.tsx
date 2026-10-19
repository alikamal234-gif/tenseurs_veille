import React, { useState } from 'react';

interface Scene2Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene2TensorHierarchy: React.FC<Scene2Props> = () => {
  const [activeRank, setActiveRank] = useState<0 | 1 | 2 | 3 | 4>(3);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
        <span>Hiérarchie Géométrique des Tenseurs • Du Rang 0 au Rang 4</span>
      </div>

      {/* Main 3D / Geometric View */}
      <div className="flex flex-col items-center justify-center min-h-[240px] w-full max-w-3xl py-4">
        {activeRank === 0 && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-white font-mono font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              42
            </div>
            <div className="text-center font-mono">
              <span className="text-xs text-zinc-400">Scalaire Pur • Rang 0</span>
              <p className="text-xs text-emerald-400 mt-1">Forme : () • tf.constant(42)</p>
            </div>
          </div>
        )}

        {activeRank === 1 && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
              {[1.2, 4.5, 7.8, 9.1, 3.4].map((v, i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded bg-zinc-800 border border-sky-400/80 flex flex-col items-center justify-center font-mono text-xs text-sky-200"
                >
                  <span className="text-[9px] text-zinc-500 font-sans">[{i}]</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs text-zinc-400">Vecteur 1D • Rang 1</span>
              <p className="text-xs text-sky-400 mt-1">Forme : (5,) • 1 axe</p>
            </div>
          </div>
        )}

        {activeRank === 2 && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="grid gap-1.5 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
              {Array.from({ length: 4 }, (_, y) => (
                <div key={y} className="flex gap-1.5">
                  {Array.from({ length: 5 }, (_, x) => (
                    <div
                      key={x}
                      className="w-9 h-9 rounded bg-purple-950 border border-purple-500/60 flex items-center justify-center font-mono text-[10px] text-purple-200"
                    >
                      {y},{x}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs text-zinc-400">Matrice 2D • Rang 2 (Lignes × Colonnes)</span>
              <p className="text-xs text-purple-400 mt-1">Forme : (4, 5) • 20 éléments</p>
            </div>
          </div>
        )}

        {activeRank === 3 && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {['Rouge (R)', 'Vert (V)', 'Bleu (B)'].map((name, c) => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-zinc-400">{name}</span>
                  <div className="grid gap-1 p-2 bg-zinc-900 border border-zinc-700 rounded">
                    {Array.from({ length: 3 }, (_, y) => (
                      <div key={y} className="flex gap-1">
                        {Array.from({ length: 3 }, (_, x) => (
                          <div
                            key={x}
                            className={`w-7 h-7 rounded border font-mono text-[9px] flex items-center justify-center ${
                              c === 0
                                ? 'bg-red-950/70 border-red-500 text-red-200'
                                : c === 1
                                ? 'bg-green-950/70 border-green-500 text-green-200'
                                : 'bg-blue-950/70 border-blue-500 text-blue-200'
                            }`}
                          >
                            {y * 3 + x + 1}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs text-zinc-400">Tenseur 3D • Image Couleur (Hauteur × Largeur × Canaux)</span>
              <p className="text-xs text-emerald-400 mt-1">Forme : (H, W, 3) • Convention NHWC</p>
            </div>
          </div>
        )}

        {activeRank === 4 && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {[0, 1, 2, 3].map((b) => (
                <div
                  key={b}
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 flex flex-col items-center gap-1.5 shadow-lg"
                >
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Échantillon [{b}]
                  </span>
                  <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center font-mono text-[10px] text-zinc-500">
                    Image {b}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center font-mono">
              <span className="text-xs text-zinc-400">Tenseur 4D • Lot d'images (Batch)</span>
              <p className="text-xs text-emerald-400 mt-1">Forme : (4, H, W, C) • Entrée directe d'un CNN</p>
            </div>
          </div>
        )}
      </div>

      {/* Rank Selector Pill Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
        {[
          { r: 0, label: '0D Scalaire' },
          { r: 1, label: '1D Vecteur' },
          { r: 2, label: '2D Matrice' },
          { r: 3, label: '3D Image' },
          { r: 4, label: '4D Lot (Batch)' },
        ].map((item) => (
          <button
            key={item.r}
            onClick={() => setActiveRank(item.r as any)}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              activeRank === item.r
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
