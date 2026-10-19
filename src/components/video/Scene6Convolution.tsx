import React, { useState, useEffect } from 'react';
import { DIGIT_7_PATTERN_8X8 } from '../../utils/imagePatterns';

interface Scene6Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const Scene6Convolution: React.FC<Scene6Props> = ({ isPlaying = false }) => {
  // Sliding kernel coordinate (3x3 on 8x8 space)
  const [kernelPos, setKernelPos] = useState<{ y: number; x: number }>({ y: 1, x: 2 });
  const [activeFilter, setActiveFilter] = useState<'orange' | 'green'>('orange');

  // Kernels from user image 2
  const orangeKernel = [
    [0.1, 0.04, 0.067],
    [-0.174, 0.05, -0.063],
    [-0.025, -0.073, -0.248],
  ];

  const greenKernel = [
    [-0.075, 0.217, 0.155],
    [-0.134, 0.068, 0.114],
    [0.024, 0.155, 0.18],
  ];

  const bias = -2.87;

  // Auto-advance sliding kernel if isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setKernelPos((prev) => {
        let nextX = prev.x + 1;
        let nextY = prev.y;
        if (nextX > 5) {
          nextX = 0;
          nextY = (prev.y + 1) % 6;
        }
        return { y: nextY, x: nextX };
      });
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Compute localized convolution dot product
  const computeActivation = (ky: number, kx: number, kernel: number[][]) => {
    let sum = 0;
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const pixelVal = DIGIT_7_PATTERN_8X8[ky + dy]?.[kx + dx] || 0;
        const normPixel = pixelVal / 255.0;
        sum += normPixel * kernel[dy][dx];
      }
    }
    return Math.max(0, sum + 0.5); // ReLU-like response
  };

  const currentActivation = computeActivation(
    kernelPos.y,
    kernelPos.x,
    activeFilter === 'orange' ? orangeKernel : greenKernel
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 bg-black text-white relative select-none">
      {/* Top watermark */}
      <div className="absolute top-2.5 left-4 text-[11px] font-mono text-zinc-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Convolutional Neural Networks from Scratch | In Depth</span>
      </div>

      {/* Main Visual matching User Image 2 */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12 w-full max-w-5xl py-4">
        {/* Left: Input Image with moving 3x3 bounding box */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-1 bg-black border-2 border-white shadow-2xl relative">
            <div
              className="grid gap-px bg-zinc-800"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {DIGIT_7_PATTERN_8X8.map((row, y) =>
                row.map((val, x) => {
                  const isInKernel =
                    y >= kernelPos.y &&
                    y < kernelPos.y + 3 &&
                    x >= kernelPos.x &&
                    x < kernelPos.x + 3;

                  return (
                    <div
                      key={`${y}-${x}`}
                      onClick={() => {
                        const newY = Math.max(0, Math.min(5, y));
                        const newX = Math.max(0, Math.min(5, x));
                        setKernelPos({ y: newY, x: newX });
                      }}
                      className={`w-5 h-5 sm:w-7 sm:h-7 transition-all duration-150 cursor-pointer relative ${
                        isInKernel
                          ? activeFilter === 'orange'
                            ? 'ring-2 ring-amber-500 z-10'
                            : 'ring-2 ring-emerald-500 z-10'
                          : ''
                      }`}
                      style={{
                        backgroundColor: `rgb(${val}, ${val}, ${val})`,
                      }}
                      title={`Pixel (${y}, ${x}) = ${val}`}
                    />
                  );
                })
              )}
            </div>

            {/* Sliding 3x3 Overlay outline */}
            <div
              className={`absolute pointer-events-none transition-all duration-200 border-2 ${
                activeFilter === 'orange' ? 'border-amber-500 bg-amber-500/10' : 'border-emerald-500 bg-emerald-500/10'
              }`}
              style={{
                top: `${kernelPos.y * (100 / 8)}%`,
                left: `${kernelPos.x * (100 / 8)}%`,
                width: `${3 * (100 / 8)}%`,
                height: `${3 * (100 / 8)}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Image MNIST (28×28×1)
          </span>
        </div>

        {/* Center: The Two 3x3 Kernels (Orange and Green) & Bias */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Orange Filter */}
          <div
            onClick={() => setActiveFilter('orange')}
            className={`cursor-pointer transition-all ${
              activeFilter === 'orange' ? 'scale-105 ring-2 ring-amber-400' : 'opacity-70'
            }`}
          >
            <div
              className="grid gap-px bg-amber-950 p-1 border border-amber-600 rounded"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {orangeKernel.map((row, r) =>
                row.map((w, c) => (
                  <div
                    key={`o-${r}-${c}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#b45309] text-white flex items-center justify-center font-mono text-[9px] sm:text-[10px] p-0.5 text-center leading-tight font-medium"
                  >
                    {w}
                  </div>
                ))
              )}
            </div>
            <span className="text-[9px] font-mono text-amber-400 block text-center mt-1">
              Filtre #1 (Bordures)
            </span>
          </div>

          {/* Green Filter */}
          <div
            onClick={() => setActiveFilter('green')}
            className={`cursor-pointer transition-all ${
              activeFilter === 'green' ? 'scale-105 ring-2 ring-emerald-400' : 'opacity-70'
            }`}
          >
            <div
              className="grid gap-px bg-emerald-950 p-1 border border-emerald-600 rounded"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {greenKernel.map((row, r) =>
                row.map((w, c) => (
                  <div
                    key={`g-${r}-${c}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#15803d] text-white flex items-center justify-center font-mono text-[9px] sm:text-[10px] p-0.5 text-center leading-tight font-medium"
                  >
                    {w}
                  </div>
                ))
              )}
            </div>
            <span className="text-[9px] font-mono text-emerald-400 block text-center mt-1">
              Filtre #2 (Coins)
            </span>
          </div>

          {/* Bias Label */}
          <div className="font-mono text-sm sm:text-base text-zinc-300 font-bold ml-1">
            , {bias}
          </div>
        </div>

        {/* Right: The Two Resulting Feature Maps */}
        <div className="flex flex-col gap-2.5">
          {/* Top Feature Map (Active result) */}
          <div className="flex flex-col items-center">
            <div className="p-1 bg-black border border-white">
              <div
                className="grid gap-px bg-zinc-900"
                style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
              >
                {Array.from({ length: 6 }, (_, fy) =>
                  Array.from({ length: 6 }, (_, fx) => {
                    const isCurrent = fy === kernelPos.y && fx === kernelPos.x;
                    const val = Math.round(
                      computeActivation(fy, fx, activeFilter === 'orange' ? orangeKernel : greenKernel) * 220
                    );

                    return (
                      <div
                        key={`f1-${fy}-${fx}`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border border-zinc-900 ${
                          isCurrent ? 'ring-2 ring-white scale-110 z-10' : ''
                        }`}
                        style={{
                          backgroundColor: isCurrent
                            ? '#ffffff'
                            : `rgb(${val}, ${val}, ${val})`,
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 mt-1">
              Feature Map #1 (6×6)
            </span>
          </div>

          {/* Bottom Feature Map (Secondary) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-26 sm:h-26 border border-white bg-black flex items-center justify-center">
              <div className="text-[10px] font-mono text-zinc-600">Feature Map #2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Real-time Math Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl pt-2 border-t border-zinc-800 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono">Position :</span>
          <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-white">
            y={kernelPos.y}, x={kernelPos.x}
          </span>
          <span className="text-zinc-500 font-mono ml-2">Produit scalaire :</span>
          <span className="font-mono text-emerald-400 font-bold">
            {currentActivation.toFixed(3)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setKernelPos((prev) => {
                let nextX = prev.x + 1;
                let nextY = prev.y;
                if (nextX > 5) {
                  nextX = 0;
                  nextY = (prev.y + 1) % 6;
                }
                return { y: nextY, x: nextX };
              });
            }}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-mono font-medium"
          >
            Glisser le filtre d'un pas (Stride 1) →
          </button>
        </div>
      </div>
    </div>
  );
};
