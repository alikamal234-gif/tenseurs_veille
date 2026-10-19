import React, { useState } from 'react';
import { DIGIT_7_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene1Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene1PixelsGrid: React.FC<Scene1Props> = () => {
  const [hoveredPixel, setHoveredPixel] = useState<{ y: number; x: number }>({ y: 1, x: 3 });
  const [showValues, setShowValues] = useState<boolean>(true);

  const currentVal = DIGIT_7_PATTERN_8X8[hoveredPixel.y]?.[hoveredPixel.x] ?? 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      {/* Top watermark */}
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Représentation Matricielle des Pixels • Format uint8 [0, 255]</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full max-w-4xl py-4">
        {/* Left: Pixel Grid */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-1 bg-black border-2 border-white shadow-2xl relative">
            <div
              className="grid gap-px bg-zinc-800"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {DIGIT_7_PATTERN_8X8.map((row, y) =>
                row.map((val, x) => {
                  const isHovered = hoveredPixel.y === y && hoveredPixel.x === x;
                  const textColor = val > 128 ? '#000000' : '#ffffff';

                  return (
                    <div
                      key={`${y}-${x}`}
                      onMouseEnter={() => setHoveredPixel({ y, x })}
                      onClick={() => setHoveredPixel({ y, x })}
                      className={`w-8 h-8 sm:w-11 sm:h-11 transition-all duration-100 cursor-pointer flex items-center justify-center font-mono text-[9px] sm:text-[11px] font-bold ${
                        isHovered ? 'ring-2 ring-emerald-400 z-10 scale-105 shadow-lg' : 'hover:ring-1 hover:ring-zinc-400'
                      }`}
                      style={{
                        backgroundColor: `rgb(${val}, ${val}, ${val})`,
                        color: textColor,
                      }}
                    >
                      {showValues && val > 0 && val}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Grille de Pixels 8×8 (MNIST)
          </span>
        </div>

        {/* Right: Microscope Inspector */}
        <div className="flex flex-col gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-lg min-w-[260px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-mono text-zinc-400">Pixel Actif :</span>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              [y={hoveredPixel.y}, x={hoveredPixel.x}]
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-zinc-600 shadow-inner"
              style={{ backgroundColor: `rgb(${currentVal}, ${currentVal}, ${currentVal})` }}
            />
            <div className="text-xs font-mono">
              <div className="text-zinc-400">Luminance :</div>
              <div className="text-lg font-bold text-white">{currentVal} / 255</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Type de données :</span>
              <span className="text-white">tf.uint8 (1 octet)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Indexation TF :</span>
              <span className="text-emerald-300">img[{hoveredPixel.y}, {hoveredPixel.x}]</span>
            </div>
          </div>

          <button
            onClick={() => setShowValues(!showValues)}
            className="mt-2 py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono transition-colors"
          >
            {showValues ? 'Masquer les nombres' : 'Afficher les nombres'}
          </button>
        </div>
      </div>
    </div>
  );
};
