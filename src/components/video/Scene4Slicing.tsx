import React, { useState } from 'react';
import { SUNSET_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene4Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene4Slicing: React.FC<Scene4Props> = () => {
  const [y1, setY1] = useState<number>(2);
  const [y2, setY2] = useState<number>(6);
  const [x1, setX1] = useState<number>(2);
  const [x2, setX2] = useState<number>(6);

  // Cropped slice
  const croppedSlice: { r: number; g: number; b: number }[][] = [];
  for (let y = y1; y < y2; y++) {
    const row = [];
    for (let x = x1; x < x2; x++) {
      row.push(SUNSET_PATTERN_8X8[y][x]);
    }
    croppedSlice.push(row);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
        <span>Découpage Tensoriel (Slicing) • image[y1:y2, x1:x2, :]</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 py-4 max-w-4xl">
        {/* Source image with moving bounding box */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-1 bg-black border-2 border-zinc-500 relative">
            <div
              className="grid gap-px bg-zinc-800"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  const isInCrop = y >= y1 && y < y2 && x >= x1 && x < x2;
                  return (
                    <div
                      key={`src-${y}-${x}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-opacity ${
                        isInCrop ? 'opacity-100 ring-1 ring-white/60' : 'opacity-25'
                      }`}
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                    />
                  );
                })
              )}
            </div>
            {/* Visual crop border */}
            <div
              className="absolute pointer-events-none border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
              style={{
                top: `${y1 * 12.5}%`,
                left: `${x1 * 12.5}%`,
                width: `${(x2 - x1) * 12.5}%`,
                height: `${(y2 - y1) * 12.5}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Image Source (8×8×3)
          </span>
        </div>

        {/* Arrow */}
        <div className="text-zinc-600 font-mono text-xl">→</div>

        {/* Cropped resulting tensor */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-zinc-950 border border-emerald-500 rounded shadow-lg min-h-[140px] flex items-center justify-center">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${x2 - x1}, minmax(0, 1fr))` }}
            >
              {croppedSlice.map((row, y) =>
                row.map((p, x) => (
                  <div
                    key={`c-${y}-${x}`}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs border border-white/20"
                    style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                  />
                ))
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            Sous-tenseur : ({y2 - y1}, {x2 - x1}, 3)
          </span>
        </div>
      </div>

      {/* Code syntax bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-2xl pt-2 border-t border-zinc-800 text-xs font-mono">
        <div className="text-emerald-300">
          Syntaxe Python : <code className="bg-zinc-900 px-2 py-0.5 rounded text-white font-bold">image[{y1}:{y2}, {x1}:{x2}, :]</code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setY1(2); setY2(6); setX1(2); setX2(6); }}
            className="px-2 py-0.5 bg-zinc-800 text-zinc-300 hover:text-white rounded"
          >
            Centre 4×4
          </button>
          <button
            onClick={() => { setY1(0); setY2(4); setX1(0); setX2(4); }}
            className="px-2 py-0.5 bg-zinc-800 text-zinc-300 hover:text-white rounded"
          >
            Coin haut-gauche
          </button>
        </div>
      </div>
    </div>
  );
};
