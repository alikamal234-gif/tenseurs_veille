import React, { useState } from 'react';
import { Maximize, Minimize, RefreshCw, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DIGIT_7_PATTERN_8X8, SUNSET_PATTERN_8X8 } from '../../utils/imagePatterns';
import { Badge } from '../common/Badge';

export const ImageResizeSimulator: React.FC = () => {
  const [targetSize, setTargetSize] = useState<number>(16);
  const [method, setMethod] = useState<'nearest' | 'bilinear'>('bilinear');
  const [selectedImage, setSelectedImage] = useState<'digit' | 'sunset'>('sunset');

  const sourceH = 8;
  const sourceW = 8;

  // Bilinear vs Nearest algorithm simulation on an 8x8 matrix
  const sourceMatrix = selectedImage === 'digit'
    ? DIGIT_7_PATTERN_8X8.map(row => row.map(v => ({ r: v, g: v, b: v })))
    : SUNSET_PATTERN_8X8;

  const resampled: { r: number; g: number; b: number }[][] = [];

  for (let ty = 0; ty < targetSize; ty++) {
    const row = [];
    // Normalized position in source space
    const sy = (ty + 0.5) * (sourceH / targetSize) - 0.5;

    for (let tx = 0; tx < targetSize; tx++) {
      const sx = (tx + 0.5) * (sourceW / targetSize) - 0.5;

      if (method === 'nearest') {
        const nearY = Math.max(0, Math.min(sourceH - 1, Math.round(sy)));
        const nearX = Math.max(0, Math.min(sourceW - 1, Math.round(sx)));
        row.push(sourceMatrix[nearY][nearX]);
      } else {
        // Bilinear interpolation
        const y0 = Math.max(0, Math.min(sourceH - 1, Math.floor(sy)));
        const y1 = Math.max(0, Math.min(sourceH - 1, Math.ceil(sy)));
        const x0 = Math.max(0, Math.min(sourceW - 1, Math.floor(sx)));
        const x1 = Math.max(0, Math.min(sourceW - 1, Math.ceil(sx)));

        const wy = sy - Math.floor(sy);
        const wx = sx - Math.floor(sx);

        const p00 = sourceMatrix[y0][x0];
        const p10 = sourceMatrix[y0][x1];
        const p01 = sourceMatrix[y1][x0];
        const p11 = sourceMatrix[y1][x1];

        // Bilinear blend
        const interp = (c00: number, c10: number, c01: number, c11: number) => {
          const top = c00 * (1 - wx) + c10 * wx;
          const bot = c01 * (1 - wx) + c11 * wx;
          return Math.round(top * (1 - wy) + bot * wy);
        };

        row.push({
          r: interp(p00.r, p10.r, p01.r, p11.r),
          g: interp(p00.g, p10.g, p01.g, p11.g),
          b: interp(p00.b, p10.b, p01.b, p11.b),
        });
      }
    }
    resampled.push(row);
  }

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Maximize className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Simulateur d'Interpolation : Nearest Neighbor vs Bilinear
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Sortie : ({targetSize}, {targetSize}, 3)</Badge>
          <Badge variant="blue">Méthode : {method.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          {/* Target resolution */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">
              Résolution cible : {targetSize} × {targetSize}
            </label>
            <div className="flex gap-1.5">
              {[8, 12, 16, 24].map((size) => (
                <button
                  key={size}
                  onClick={() => setTargetSize(size)}
                  className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors ${
                    targetSize === size
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Facteur d'échelle : {(targetSize / sourceH).toFixed(1)}x
            </span>
          </div>

          {/* Interpolation method */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">
              Méthode d'interpolation :
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setMethod('bilinear')}
                className={`flex-1 py-1 px-1 rounded text-[11px] font-medium border transition-colors ${
                  method === 'bilinear'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Bilinéaire (Lisse)
              </button>
              <button
                onClick={() => setMethod('nearest')}
                className={`flex-1 py-1 px-1 rounded text-[11px] font-medium border transition-colors ${
                  method === 'nearest'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Nearest (Crénelé)
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {method === 'bilinear' ? 'Moyenne pondérée des 4 voisins' : 'Copie brute du pixel le plus proche'}
            </span>
          </div>

          {/* Sample image */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">
              Image source :
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedImage('sunset')}
                className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors ${
                  selectedImage === 'sunset'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Paysage RGB
              </button>
              <button
                onClick={() => setSelectedImage('digit')}
                className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors ${
                  selectedImage === 'digit'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Chiffre '7'
              </button>
            </div>
          </div>
        </div>

        {/* Side by side visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Source 8x8 */}
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Image source brute (8 × 8 pixels)
            </span>
            <div className="p-2 bg-slate-900 rounded border border-slate-700">
              <div
                className="grid gap-0.5"
                style={{ gridTemplateColumns: `repeat(${sourceW}, minmax(0, 1fr))` }}
              >
                {sourceMatrix.map((row, y) =>
                  row.map((p, x) => (
                    <div
                      key={`src-${y}-${x}`}
                      className="w-5 h-5 rounded-xs"
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                      title={`(${y}, ${x}): rgb(${p.r}, ${p.g}, ${p.b})`}
                    />
                  ))
                )}
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Shape : (8, 8, 3)</span>
          </div>

          {/* Resized Result */}
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Résultat après redimensionnement ({targetSize} × {targetSize} pixels)
            </span>
            <div className="p-2 bg-slate-900 rounded border border-slate-700">
              <div
                className="grid gap-px"
                style={{ gridTemplateColumns: `repeat(${targetSize}, minmax(0, 1fr))` }}
              >
                {resampled.map((row, y) =>
                  row.map((p, x) => (
                    <div
                      key={`res-${y}-${x}`}
                      style={{
                        backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})`,
                        width: targetSize > 16 ? '8px' : '12px',
                        height: targetSize > 16 ? '8px' : '12px',
                      }}
                      className="rounded-xs"
                      title={`(${y}, ${x}): rgb(${p.r}, ${p.g}, ${p.b})`}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-800 font-mono font-medium">
                Shape : ({targetSize}, {targetSize}, 3)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">
                {method === 'bilinear' ? 'Lissage continu' : 'Blocs de pixels constants'}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Comparison Note */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-950 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quand utiliser quelle méthode ?</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Pour les photographies naturelles destinées à un CNN de classification (ResNet, EfficientNet), l'interpolation <strong>Bilinéaire (Bilinear)</strong> est obligatoire afin de préserver la cohérence des gradients et d'éviter les discontinuités artificielles. Pour les masques de segmentation sémantique (labels de classes discrètes 0, 1, 2), utilisez impérativement <strong>Nearest Neighbor</strong> afin de ne jamais interpoler entre deux classes différentes !
          </p>
        </div>
      </div>
    </div>
  );
};
