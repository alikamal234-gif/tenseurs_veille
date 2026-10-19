import React, { useState, useEffect } from 'react';
import { DIGIT_7_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene7Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene7Classification: React.FC<Scene7Props> = ({ isPlaying }) => {
  const [selectedDigit, setSelectedDigit] = useState<number>(7);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [glowIntensity, setGlowIntensity] = useState<number>(1);

  // 28x28 simulated MNIST representation of digits 0-9
  const digitPatterns: Record<number, number[][]> = {
    7: DIGIT_7_PATTERN_8X8,
    0: [
      [0, 180, 255, 255, 255, 255, 180, 0],
      [180, 255, 0, 0, 0, 0, 255, 180],
      [220, 255, 0, 0, 0, 0, 255, 220],
      [220, 255, 0, 0, 0, 0, 255, 220],
      [220, 255, 0, 0, 0, 0, 255, 220],
      [180, 255, 0, 0, 0, 0, 255, 180],
      [0, 180, 255, 255, 255, 255, 180, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    1: [
      [0, 0, 0, 255, 0, 0, 0, 0],
      [0, 0, 200, 255, 0, 0, 0, 0],
      [0, 0, 0, 255, 0, 0, 0, 0],
      [0, 0, 0, 255, 0, 0, 0, 0],
      [0, 0, 0, 255, 0, 0, 0, 0],
      [0, 0, 0, 255, 0, 0, 0, 0],
      [0, 180, 255, 255, 255, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    3: [
      [0, 200, 255, 255, 255, 0, 0, 0],
      [0, 0, 0, 0, 255, 200, 0, 0],
      [0, 0, 0, 180, 255, 0, 0, 0],
      [0, 0, 200, 255, 255, 0, 0, 0],
      [0, 0, 0, 0, 255, 180, 0, 0],
      [0, 0, 0, 0, 200, 255, 0, 0],
      [0, 200, 255, 255, 255, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  };

  const currentGrid = digitPatterns[selectedDigit] || DIGIT_7_PATTERN_8X8;

  useEffect(() => {
    setIsClassifying(true);
    setGlowIntensity(0.4);
    const timer = setTimeout(() => {
      setIsClassifying(false);
      setGlowIntensity(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedDigit]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white relative select-none">
      {/* Top watermark / video caption */}
      <div className="absolute top-3 left-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Reconnaissance de Chiffres MNIST • Classification CNN</span>
      </div>

      {/* Main Visual: Image 1 match: Digit 7 grid -> Arrow -> 0 to 9 column with 7 glowing */}
      <div className="flex items-center justify-center gap-6 sm:gap-14 md:gap-20 w-full max-w-4xl py-6">
        {/* Left: 28x28 Digit Grid */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-1 sm:p-1.5 bg-black border-2 border-zinc-200 shadow-2xl relative">
            {/* Fine pixel grid lines */}
            <div
              className="grid gap-px bg-zinc-800"
              style={{
                gridTemplateColumns: `repeat(8, minmax(0, 1fr))`,
              }}
            >
              {currentGrid.map((row, y) =>
                row.map((val, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-colors duration-150 border border-zinc-900/60"
                    style={{
                      backgroundColor: `rgb(${val}, ${val}, ${val})`,
                    }}
                    title={`Pixel (${y}, ${x}) = ${val}`}
                  />
                ))
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Image MNIST ({selectedDigit}) • Tenseur (28, 28, 1)
          </span>
        </div>

        {/* Center: Long Animated Connecting Arrow */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="flex items-center">
            {/* Arrow line */}
            <div
              className={`h-0.5 sm:h-1 bg-zinc-500 transition-all duration-300 ${
                isClassifying ? 'w-16 sm:w-28 md:w-40 bg-emerald-400' : 'w-16 sm:w-28 md:w-40'
              }`}
            />
            {/* Arrowhead */}
            <div
              className={`w-0 h-0 border-t-6 border-b-6 border-l-10 border-t-transparent border-b-transparent transition-colors ${
                isClassifying ? 'border-l-emerald-400' : 'border-l-zinc-500'
              }`}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Inférence CNN
          </span>
        </div>

        {/* Right: Vertical Column of 10 Output Boxes (0 to 9) */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {Array.from({ length: 10 }, (_, i) => {
            const isTarget = i === selectedDigit;
            return (
              <div
                key={i}
                onClick={() => setSelectedDigit(i)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                {/* Square checkbox-like box as in user image 1 */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 border transition-all duration-200 flex items-center justify-center ${
                    isTarget
                      ? 'bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-105'
                      : 'bg-black border-zinc-600 group-hover:border-zinc-400'
                  }`}
                  style={{
                    opacity: isTarget ? glowIntensity : 0.6,
                  }}
                />
                {/* Digit label */}
                <span
                  className={`font-mono text-xs sm:text-sm select-none ${
                    isTarget ? 'text-white font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {i}
                </span>
                {isTarget && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1 hidden sm:inline">
                    99.4%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive tester bar */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-zinc-800 text-xs">
        <span className="text-zinc-400">Tester un autre chiffre :</span>
        {[0, 1, 3, 7].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedDigit(num)}
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-all ${
              selectedDigit === num
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Chiffre {num}
          </button>
        ))}
      </div>
    </div>
  );
};
