import React, { useState } from 'react';
import { Crop, Scissors, ZoomIn, ArrowRight } from 'lucide-react';
import { SUNSET_PATTERN_8X8 } from '../../utils/imagePatterns';
import { Badge } from '../common/Badge';

export const TensorIndexingExplorer: React.FC = () => {
  const [yStart, setYStart] = useState<number>(2);
  const [yEnd, setYEnd] = useState<number>(6);
  const [xStart, setXStart] = useState<number>(2);
  const [xEnd, setXEnd] = useState<number>(6);
  const [step, setStep] = useState<number>(1);
  const [selectedChannel, setSelectedChannel] = useState<'all' | '0' | '1' | '2'>('all');

  const H = SUNSET_PATTERN_8X8.length;
  const W = SUNSET_PATTERN_8X8[0].length;

  // Safe bounds
  const validYStart = Math.min(yStart, yEnd - 1);
  const validYEnd = Math.max(yEnd, yStart + 1);
  const validXStart = Math.min(xStart, xEnd - 1);
  const validXEnd = Math.max(xEnd, xStart + 1);

  // Compute sliced rows & cols
  const slicedPixels: { r: number; g: number; b: number }[][] = [];
  for (let y = validYStart; y < validYEnd; y += step) {
    const row = [];
    for (let x = validXStart; x < validXEnd; x += step) {
      const p = SUNSET_PATTERN_8X8[y][x];
      if (selectedChannel === '0') {
        row.push({ r: p.r, g: 0, b: 0 });
      } else if (selectedChannel === '1') {
        row.push({ r: 0, g: p.g, b: 0 });
      } else if (selectedChannel === '2') {
        row.push({ r: 0, g: 0, b: p.b });
      } else {
        row.push(p);
      }
    }
    slicedPixels.push(row);
  }

  const croppedH = slicedPixels.length;
  const croppedW = slicedPixels[0]?.length || 0;
  const croppedC = selectedChannel === 'all' ? 3 : 1;

  // Code string
  const stepStr = step > 1 ? `:${step}` : '';
  const channelStr = selectedChannel === 'all' ? ':' : selectedChannel;
  const pythonSliceCode = `crop = image[${validYStart}:${validYEnd}${stepStr}, ${validXStart}:${validXEnd}${stepStr}, ${channelStr}]`;

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Simulateur d'Indexation &amp; Découpage Tensoriel (Slicing)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Nouvelle forme : ({croppedH}, {croppedW}, {croppedC})</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Sliders for Slicing Box */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <label className="text-slate-600 block mb-1 font-medium">
              Lignes Y : [{validYStart} : {validYEnd}]
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="7"
                value={validYStart}
                onChange={(e) => setYStart(Number(e.target.value))}
                className="w-1/2 accent-emerald-600 cursor-pointer"
                title="Y Début"
              />
              <input
                type="range"
                min="1"
                max="8"
                value={validYEnd}
                onChange={(e) => setYEnd(Number(e.target.value))}
                className="w-1/2 accent-emerald-600 cursor-pointer"
                title="Y Fin"
              />
            </div>
            <span className="text-[10px] text-slate-400">Début : {validYStart} | Fin : {validYEnd}</span>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-medium">
              Colonnes X : [{validXStart} : {validXEnd}]
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="7"
                value={validXStart}
                onChange={(e) => setXStart(Number(e.target.value))}
                className="w-1/2 accent-emerald-600 cursor-pointer"
                title="X Début"
              />
              <input
                type="range"
                min="1"
                max="8"
                value={validXEnd}
                onChange={(e) => setXEnd(Number(e.target.value))}
                className="w-1/2 accent-emerald-600 cursor-pointer"
                title="X Fin"
              />
            </div>
            <span className="text-[10px] text-slate-400">Début : {validXStart} | Fin : {validXEnd}</span>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-medium">
              Pas d'échantillonnage (Step) : {step}
            </label>
            <select
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full p-1 bg-white border border-slate-300 rounded text-xs"
            >
              <option value={1}>Pas 1 (continu)</option>
              <option value={2}>Pas 2 (1 pixel sur 2)</option>
              <option value={3}>Pas 3 (1 pixel sur 3)</option>
            </select>
            <span className="text-[10px] text-slate-400">Sous-échantillonnage</span>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <label className="text-slate-600 block mb-1 font-medium">
              Canal extrait :
            </label>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'Tous (:)' },
                { id: '0', label: 'Rouge (0)' },
                { id: '1', label: 'Vert (1)' },
                { id: '2', label: 'Bleu (2)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChannel(c.id as any)}
                  className={`flex-1 py-1 px-1 rounded text-[11px] font-medium border transition-colors ${
                    selectedChannel === c.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400">Dernier axe de canal</span>
          </div>
        </div>

        {/* Live Code Banner */}
        <div className="p-2.5 bg-slate-900 rounded-md border border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans text-[11px]">Instruction générée :</span>
            <code className="text-emerald-400 font-bold">{pythonSliceCode}</code>
          </div>
          <span className="text-slate-400 text-[11px] font-sans">Sans copie mémoire</span>
        </div>

        {/* Visual Comparison: Source with Overlay vs Cropped Sub-Tensor */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Source Image with Bounding Box Overlay */}
          <div className="md:col-span-6 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Image source (8 × 8 × 3) avec région d'intérêt sélectionnée :
            </span>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 relative">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
              >
                {SUNSET_PATTERN_8X8.map((row, y) =>
                  row.map((p, x) => {
                    const isInsideY = y >= validYStart && y < validYEnd;
                    const isInsideX = x >= validXStart && x < validXEnd;
                    const isSampled = isInsideY && isInsideX && (y - validYStart) % step === 0 && (x - validXStart) % step === 0;

                    return (
                      <div
                        key={`s-${y}-${x}`}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xs relative transition-all ${
                          isSampled
                            ? 'ring-2 ring-emerald-400 z-10 scale-105'
                            : isInsideY && isInsideX
                            ? 'opacity-80'
                            : 'opacity-30'
                        }`}
                        style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                        title={`Pixel (${y}, ${x})`}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <span className="text-[11px] text-slate-500">
              Les pixels atténués sont ignorés par le slice
            </span>
          </div>

          <div className="hidden md:flex md:col-span-1 justify-center text-slate-400">
            <ArrowRight className="w-6 h-6 text-emerald-600" />
          </div>

          {/* Resulting Cropped Tensor */}
          <div className="md:col-span-5 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Sous-tenseur résultant ({croppedH} × {croppedW} × {croppedC}) :
            </span>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 min-h-[160px] flex items-center justify-center">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${croppedW}, minmax(0, 1fr))` }}
              >
                {slicedPixels.map((row, y) =>
                  row.map((p, x) => (
                    <div
                      key={`crop-${y}-${x}`}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xs border border-white/20 shadow-xs flex items-center justify-center font-mono text-[9px] text-white/90"
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                    >
                      {y},{x}
                    </div>
                  ))
                )}
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Prêt pour une tâche de détection ou de recadrage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
