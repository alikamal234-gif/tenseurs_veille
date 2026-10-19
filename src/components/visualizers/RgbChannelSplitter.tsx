import React, { useState } from 'react';
import { Sliders, Split, Layers, RefreshCw } from 'lucide-react';
import { SUNSET_PATTERN_8X8 } from '../../utils/imagePatterns';
import { Badge } from '../common/Badge';

export const RgbChannelSplitter: React.FC = () => {
  const [redFactor, setRedFactor] = useState<number>(100);
  const [greenFactor, setGreenFactor] = useState<number>(100);
  const [blueFactor, setBlueFactor] = useState<number>(100);
  const [showColorTint, setShowColorTint] = useState<boolean>(true);

  const resetChannels = () => {
    setRedFactor(100);
    setGreenFactor(100);
    setBlueFactor(100);
  };

  const isolateChannel = (channel: 'r' | 'g' | 'b') => {
    setRedFactor(channel === 'r' ? 100 : 0);
    setGreenFactor(channel === 'g' ? 100 : 0);
    setBlueFactor(channel === 'b' ? 100 : 0);
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Split className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Décomposition Spectrale des Canaux (RGB Splitter)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColorTint(!showColorTint)}
            className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md hover:bg-slate-100 text-slate-700 font-medium"
          >
            Mode : {showColorTint ? 'Teinte Colorée' : 'Niveaux de Gris (Intensité)'}
          </button>
          <button
            onClick={resetChannels}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            title="Réinitialiser les canaux à 100%"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Sliders for Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          {/* Red Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-red-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                Canal Rouge [:, :, 0]
              </span>
              <span className="font-mono">{redFactor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={redFactor}
              onChange={(e) => setRedFactor(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <button
                onClick={() => isolateChannel('r')}
                className="text-red-600 hover:underline font-medium"
              >
                Isoler le Rouge
              </button>
              <span>Multiplicateur : {(redFactor / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Green Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-green-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                Canal Vert [:, :, 1]
              </span>
              <span className="font-mono">{greenFactor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={greenFactor}
              onChange={(e) => setGreenFactor(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <button
                onClick={() => isolateChannel('g')}
                className="text-green-600 hover:underline font-medium"
              >
                Isoler le Vert
              </button>
              <span>Multiplicateur : {(greenFactor / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Blue Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Canal Bleu [:, :, 2]
              </span>
              <span className="font-mono">{blueFactor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blueFactor}
              onChange={(e) => setBlueFactor(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <button
                onClick={() => isolateChannel('b')}
                className="text-blue-600 hover:underline font-medium"
              >
                Isoler le Bleu
              </button>
              <span>Multiplicateur : {(blueFactor / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 4 Panels Side by Side: Composite, R, G, B */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Composite RGB */}
          <div className="academic-card p-3 flex flex-col items-center gap-2 border-slate-300">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Synthèse Recombinée
            </span>
            <div
              className="grid gap-0.5 p-1 bg-slate-900 rounded border border-slate-700"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  const r = Math.round((p.r * redFactor) / 100);
                  const g = Math.round((p.g * greenFactor) / 100);
                  const b = Math.round((p.b * blueFactor) / 100);
                  return (
                    <div
                      key={`c-${y}-${x}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-xs"
                      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                      title={`Composite: (${r}, ${g}, ${b})`}
                    />
                  );
                })
              )}
            </div>
            <Badge variant="slate" size="sm">Shape : (8, 8, 3)</Badge>
          </div>

          {/* Red Channel */}
          <div className="academic-card p-3 flex flex-col items-center gap-2 border-red-200 bg-red-50/20">
            <span className="text-xs font-bold text-red-800">
              Canal R ([:, :, 0])
            </span>
            <div
              className="grid gap-0.5 p-1 bg-slate-900 rounded border border-slate-700"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  const r = Math.round((p.r * redFactor) / 100);
                  const bg = showColorTint
                    ? `rgb(${r}, 0, 0)`
                    : `rgb(${r}, ${r}, ${r})`;
                  return (
                    <div
                      key={`r-${y}-${x}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-xs"
                      style={{ backgroundColor: bg }}
                      title={`R=${r}`}
                    />
                  );
                })
              )}
            </div>
            <Badge variant="slate" size="sm">Shape : (8, 8)</Badge>
          </div>

          {/* Green Channel */}
          <div className="academic-card p-3 flex flex-col items-center gap-2 border-green-200 bg-green-50/20">
            <span className="text-xs font-bold text-green-800">
              Canal V ([:, :, 1])
            </span>
            <div
              className="grid gap-0.5 p-1 bg-slate-900 rounded border border-slate-700"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  const g = Math.round((p.g * greenFactor) / 100);
                  const bg = showColorTint
                    ? `rgb(0, ${g}, 0)`
                    : `rgb(${g}, ${g}, ${g})`;
                  return (
                    <div
                      key={`g-${y}-${x}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-xs"
                      style={{ backgroundColor: bg }}
                      title={`V=${g}`}
                    />
                  );
                })
              )}
            </div>
            <Badge variant="slate" size="sm">Shape : (8, 8)</Badge>
          </div>

          {/* Blue Channel */}
          <div className="academic-card p-3 flex flex-col items-center gap-2 border-blue-200 bg-blue-50/20">
            <span className="text-xs font-bold text-blue-800">
              Canal B ([:, :, 2])
            </span>
            <div
              className="grid gap-0.5 p-1 bg-slate-900 rounded border border-slate-700"
              style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
            >
              {SUNSET_PATTERN_8X8.map((row, y) =>
                row.map((p, x) => {
                  const b = Math.round((p.b * blueFactor) / 100);
                  const bg = showColorTint
                    ? `rgb(0, 0, ${b})`
                    : `rgb(${b}, ${b}, ${b})`;
                  return (
                    <div
                      key={`b-${y}-${x}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-xs"
                      style={{ backgroundColor: bg }}
                      title={`B=${b}`}
                    />
                  );
                })
              )}
            </div>
            <Badge variant="slate" size="sm">Shape : (8, 8)</Badge>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center justify-between">
          <span>
            <strong>TensorFlow Slicing :</strong> Pour conserver la dimension de canal lors de l'extraction, utilisez <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-emerald-800 font-semibold">image[:, :, 0:1]</code> (forme <code className="font-mono">8, 8, 1</code>) plutôt que <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-700">image[:, :, 0]</code> (forme <code className="font-mono">8, 8</code>).
          </span>
        </div>
      </div>
    </div>
  );
};
