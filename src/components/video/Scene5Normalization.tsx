import React, { useState } from 'react';
import { DIGIT_7_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene5Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene5Normalization: React.FC<Scene5Props> = () => {
  const [isNormalized, setIsNormalized] = useState<boolean>(true);
  const [sliderVal, setSliderVal] = useState<number>(255);

  const rawSample = [0, 64, 128, 200, 255];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Normalisation des Pixels • x / 255.0 → Intervalle [0.0, 1.0]</span>
      </div>

      {/* Main transformation visualizer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 py-4 max-w-4xl">
        {/* Visual Digit 7 with morphing numbers */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-1 bg-black border-2 border-white shadow-2xl">
            <div
              className="grid gap-px bg-zinc-800"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {DIGIT_7_PATTERN_8X8.map((row, y) =>
                row.map((val, x) => {
                  const displayNum = isNormalized
                    ? (val / 255).toFixed(1)
                    : val.toString();
                  const textColor = val > 128 ? '#000000' : '#ffffff';

                  return (
                    <div
                      key={`norm-${y}-${x}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-bold transition-all duration-300"
                      style={{
                        backgroundColor: `rgb(${val}, ${val}, ${val})`,
                        color: textColor,
                      }}
                    >
                      {val > 0 && displayNum}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {isNormalized ? 'Tenseur Normalisé float32 [0.0, 1.0]' : 'Image Brute uint8 [0, 255]'}
          </span>
        </div>

        {/* Diagnostic comparison panel */}
        <div className="flex flex-col gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-lg min-w-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono">
            <span className="text-zinc-400">Échelle Active :</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                isNormalized ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {isNormalized ? '[0.0, 1.0] (Normalisé)' : '[0, 255] (Brut)'}
            </span>
          </div>

          {/* Sample values translation */}
          <div className="space-y-1.5 text-xs font-mono">
            {rawSample.map((v) => (
              <div key={v} className="flex items-center justify-between p-1 bg-zinc-900 rounded">
                <span className="text-zinc-400">{v} uint8 →</span>
                <span className="text-emerald-300 font-bold">
                  {isNormalized ? (v / 255).toFixed(3) : v} float32
                </span>
              </div>
            ))}
          </div>

          {/* Gradient stability indicator */}
          <div
            className={`p-2.5 rounded text-xs leading-tight font-sans border ${
              isNormalized
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : 'bg-amber-950/40 border-amber-800 text-amber-200'
            }`}
          >
            {isNormalized
              ? '✓ Gradients stables : descente de gradient fluide et sans explosion.'
              : '⚠️ Danger : 255 sature les fonctions d\'activation et bloque l\'apprentissage.'}
          </div>

          <button
            onClick={() => setIsNormalized(!isNormalized)}
            className="mt-1 py-1.5 px-3 bg-white text-black hover:bg-zinc-200 font-bold rounded text-xs font-mono transition-colors shadow-sm"
          >
            {isNormalized ? 'Basculer en [0, 255] Brut' : 'Normaliser en [0.0, 1.0]'}
          </button>
        </div>
      </div>
    </div>
  );
};
