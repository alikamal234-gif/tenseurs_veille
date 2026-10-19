import React, { useState } from 'react';
import { Eye, Grid, ZoomIn, Crosshair, Sparkles } from 'lucide-react';
import { DIGIT_7_PATTERN_8X8, SUNSET_PATTERN_8X8, CIRCLE_PATTERN_8X8, ImageMatrix } from '../../utils/imagePatterns';
import { Badge } from '../common/Badge';

export const PixelInspector: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<'digit' | 'sunset' | 'circle'>('digit');
  const [hoveredPixel, setHoveredPixel] = useState<{ y: number; x: number } | null>({ y: 1, x: 2 });
  const [showValuesOverlay, setShowValuesOverlay] = useState<boolean>(true);

  // Derive matrix
  let matrix: ImageMatrix;
  let isGrayscale = false;

  if (selectedPattern === 'digit') {
    isGrayscale = true;
    matrix = DIGIT_7_PATTERN_8X8.map((row) =>
      row.map((val) => ({ r: val, g: val, b: val }))
    );
  } else if (selectedPattern === 'circle') {
    matrix = CIRCLE_PATTERN_8X8;
  } else {
    matrix = SUNSET_PATTERN_8X8;
  }

  const currentPixel = hoveredPixel
    ? matrix[hoveredPixel.y]?.[hoveredPixel.x] || { r: 0, g: 0, b: 0 }
    : { r: 0, g: 0, b: 0 };

  const hexColor = `#${((1 << 24) + (currentPixel.r << 16) + (currentPixel.g << 8) + currentPixel.b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;

  const normalizedVal = (currentPixel.r / 255.0).toFixed(3);

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Inspecteur Microscopique de Pixels &amp; Matrice Tensorielle
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowValuesOverlay(!showValuesOverlay)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              showValuesOverlay
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{showValuesOverlay ? 'Masquer valeurs' : 'Afficher valeurs'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Pattern Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 mr-1">Échantillon :</span>
            <button
              onClick={() => {
                setSelectedPattern('digit');
                setHoveredPixel({ y: 1, x: 2 });
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                selectedPattern === 'digit'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Chiffre MNIST '7' (Gris 1 canal)
            </button>
            <button
              onClick={() => {
                setSelectedPattern('sunset');
                setHoveredPixel({ y: 3, x: 3 });
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                selectedPattern === 'sunset'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Paysage RGB (3 canaux)
            </button>
            <button
              onClick={() => {
                setSelectedPattern('circle');
                setHoveredPixel({ y: 3, x: 3 });
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                selectedPattern === 'circle'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cercle Géométrique
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Grille : 8 × 8 pixels ({matrix.length * matrix[0].length * (isGrayscale ? 1 : 3)} scalaires)
          </span>
        </div>

        {/* Main Grid & Pixel Inspector Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Interactive Pixel Matrix Grid */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="p-3 bg-slate-900 rounded-lg shadow-inner border border-slate-800">
              <div
                className="grid gap-1 select-none"
                style={{
                  gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))`,
                }}
              >
                {matrix.map((row, y) =>
                  row.map((pixel, x) => {
                    const isHovered = hoveredPixel?.y === y && hoveredPixel?.x === x;
                    const bgColor = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
                    // Text contrast
                    const brightness = pixel.r * 0.299 + pixel.g * 0.587 + pixel.b * 0.114;
                    const textColor = brightness > 125 ? '#0f172a' : '#ffffff';

                    return (
                      <div
                        key={`${y}-${x}`}
                        onMouseEnter={() => setHoveredPixel({ y, x })}
                        onClick={() => setHoveredPixel({ y, x })}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-sm cursor-pointer transition-all flex flex-col items-center justify-center relative font-mono text-[10px] ${
                          isHovered
                            ? 'ring-3 ring-emerald-400 z-10 scale-105 shadow-md'
                            : 'hover:ring-2 hover:ring-white/80'
                        }`}
                        style={{ backgroundColor: bgColor }}
                      >
                        {showValuesOverlay && (
                          <span
                            className="font-bold text-[9px] sm:text-[10px] drop-shadow-xs"
                            style={{ color: textColor }}
                          >
                            {isGrayscale ? pixel.r : pixel.r}
                          </span>
                        )}
                        {isHovered && (
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 italic">
              Survolez ou cliquez sur un pixel pour inspecter ses composantes exactes
            </span>
          </div>

          {/* Detailed Pixel Inspector Panel */}
          <div className="md:col-span-5 space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
                Pixel sélectionné :
              </span>
              <span className="font-mono text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                [y={hoveredPixel?.y ?? 0}, x={hoveredPixel?.x ?? 0}]
              </span>
            </div>

            {/* Visual Color Swatch */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-slate-300 shadow-inner shrink-0"
                style={{
                  backgroundColor: `rgb(${currentPixel.r}, ${currentPixel.g}, ${currentPixel.b})`,
                }}
              />
              <div className="text-xs space-y-0.5">
                <div className="font-mono font-semibold text-slate-800">{hexColor}</div>
                <div className="text-slate-500 text-[11px]">
                  {isGrayscale ? 'Teinte de gris 8 bits' : 'Couleur synthétisée RGB'}
                </div>
              </div>
            </div>

            {/* Numerical breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Valeur brute uint8 :</span>
                <span className="font-mono font-bold text-slate-900">
                  {isGrayscale
                    ? `${currentPixel.r} / 255`
                    : `R:${currentPixel.r}, V:${currentPixel.g}, B:${currentPixel.b}`}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Normalisé [0.0, 1.0] :</span>
                <span className="font-mono font-bold text-emerald-700">
                  {isGrayscale
                    ? normalizedVal
                    : `[${(currentPixel.r / 255).toFixed(2)}, ${(currentPixel.g / 255).toFixed(2)}, ${(currentPixel.b / 255).toFixed(2)}]`}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Indexation TF :</span>
                <code className="font-mono text-[11px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded">
                  img[{hoveredPixel?.y}, {hoveredPixel?.x}{isGrayscale ? '' : ', :'}]
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
