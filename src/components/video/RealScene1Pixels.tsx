import React, { useState, useRef } from 'react';
import { Eye, ZoomIn, Crosshair } from 'lucide-react';

interface RealScene1Props {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScene1Pixels: React.FC<RealScene1Props> = () => {
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number; r: number; g: number; b: number }>({
    x: 48,
    y: 48,
    r: 45,
    g: 138,
    b: 72, // Cat green eye sample
  });
  const [imageType, setImageType] = useState<'cat' | 'parrot'>('cat');

  const imgSrc = imageType === 'cat' ? '/cat.jpg' : '/parrot.jpg';

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = e.currentTarget;
    ctx.drawImage(img, 0, 0, 100, 100);
    const px = Math.round(xRatio * 100);
    const py = Math.round(yRatio * 100);
    const pixelData = ctx.getImageData(px, py, 1, 1).data;

    setSelectedPoint({
      x: px,
      y: py,
      r: pixelData[0],
      g: pixelData[1],
      b: pixelData[2],
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      {/* Top watermark */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <Eye className="w-4 h-4" />
          <span>Photographie Réelle → Matrice Tensorielle</span>
        </span>
        <span>Coordonnées cartésiennes [y, x, c]</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 w-full max-w-4xl py-2">
        {/* Real photo display */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md group cursor-crosshair">
            <img
              src={imgSrc}
              alt="Photo réelle"
              onClick={handleImageClick}
              className="w-56 h-56 sm:w-64 sm:h-64 object-cover"
            />
            {/* Crosshair indicator */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-emerald-500 bg-white/40 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-md animate-pulse"
              style={{
                left: `${selectedPoint.x}%`,
                top: `${selectedPoint.y}%`,
              }}
            />
          </div>
          <span className="text-xs text-slate-500 italic">
            Cliquez sur n'importe quel pixel de la photo pour l'inspecter
          </span>
        </div>

        {/* Microscope Pixel Inspector */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 min-w-[280px] shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pixel Inspecté</span>
            </span>
            <span className="font-mono text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
              [y={selectedPoint.y}, x={selectedPoint.x}]
            </span>
          </div>

          {/* Color swatch & Hex */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border border-slate-300 shadow-inner shrink-0"
              style={{
                backgroundColor: `rgb(${selectedPoint.r}, ${selectedPoint.g}, ${selectedPoint.b})`,
              }}
            />
            <div className="text-xs space-y-0.5">
              <div className="font-mono font-bold text-slate-800">
                RGB : [{selectedPoint.r}, {selectedPoint.g}, {selectedPoint.b}]
              </div>
              <div className="text-slate-500 text-[11px]">
                Format brut : <strong>uint8</strong> (0 à 255)
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-red-700">
              <span>Rouge (R) :</span>
              <span className="font-bold">{selectedPoint.r} / 255</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${(selectedPoint.r / 255) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-green-700 pt-1">
              <span>Vert (V) :</span>
              <span className="font-bold">{selectedPoint.g} / 255</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(selectedPoint.g / 255) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-blue-700 pt-1">
              <span>Bleu (B) :</span>
              <span className="font-bold">{selectedPoint.b} / 255</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(selectedPoint.b / 255) * 100}%` }}
              />
            </div>
          </div>

          {/* Python index code */}
          <div className="pt-1 text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
            <code>pixel = tensor[{selectedPoint.y}, {selectedPoint.x}, :]</code>
          </div>
        </div>
      </div>

      {/* Image selector */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500">Changer de photo :</span>
        <button
          onClick={() => {
            setImageType('cat');
            setSelectedPoint({ x: 48, y: 48, r: 45, g: 138, b: 72 });
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
            imageType === 'cat'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Photo du Chat (Yeux verts)
        </button>
        <button
          onClick={() => {
            setImageType('parrot');
            setSelectedPoint({ x: 45, y: 35, r: 215, g: 35, b: 25 });
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
            imageType === 'parrot'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Photo du Perroquet (Couleurs vives)
        </button>
      </div>
    </div>
  );
};
