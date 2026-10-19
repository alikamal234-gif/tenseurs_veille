import React, { useState } from 'react';
import { Database, HardDrive, Cpu, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface RealSceneShapeDtypeProps {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealSceneShapeDtype: React.FC<RealSceneShapeDtypeProps> = () => {
  const [batchSize, setBatchSize] = useState<number>(32);
  const [height, setHeight] = useState<number>(224);
  const [width, setWidth] = useState<number>(224);
  const [channels, setChannels] = useState<1 | 3>(3);
  const [dtype, setDtype] = useState<'uint8' | 'float16' | 'float32' | 'float64'>('float32');

  const bytesPerElement = {
    uint8: 1,
    float16: 2,
    float32: 4,
    float64: 8,
  }[dtype];

  const totalElements = batchSize * height * width * channels;
  const totalBytes = totalElements * bytesPerElement;
  const totalMegabytes = (totalBytes / (1024 * 1024)).toFixed(2);
  const totalKilobytes = (totalBytes / 1024).toFixed(1);

  const bytesInUint8 = totalElements * 1;
  const ratioFloatVsUint8 = (totalBytes / bytesInUint8).toFixed(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Shape, Rank &amp; Dtype : Les 3 Métadonnées d'un Tenseur</span>
        </span>
        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
          Rank : {channels === 1 && batchSize === 1 ? '3 (ou 2)' : '4 (Lot complet)'}
        </span>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {/* Preset Selector */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Presets :</span>
          <div className="flex gap-1.5">
            {[
              { label: 'MNIST (28x28x1)', b: 64, h: 28, w: 28, c: 1 as const },
              { label: 'CIFAR-10 (32x32x3)', b: 32, h: 32, w: 32, c: 3 as const },
              { label: 'ResNet / ImageNet (224x224x3)', b: 32, h: 224, w: 224, c: 3 as const },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setBatchSize(preset.b);
                  setHeight(preset.h);
                  setWidth(preset.w);
                  setChannels(preset.c);
                }}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px] font-semibold transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Cards: Shape, Rank, Dtype, Memory */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
          <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase font-bold block">1. Forme (Shape)</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-950 block mt-1">
              ({batchSize}, {height}, {width}, {channels})
            </span>
            <span className="text-[10px] text-slate-500">[N, H, W, C]</span>
          </div>

          <div className="p-2.5 bg-sky-50/60 rounded-lg border border-sky-200">
            <span className="text-[10px] text-sky-700 uppercase font-bold block">2. Rang (Rank)</span>
            <span className="text-base sm:text-lg font-extrabold text-sky-950 block mt-0.5">4</span>
            <span className="text-[10px] text-slate-500">4 axes orthogonaux</span>
          </div>

          <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
            <span className="text-[10px] text-amber-700 uppercase font-bold block">3. Type (Dtype)</span>
            <select
              value={dtype}
              onChange={(e) => setDtype(e.target.value as any)}
              className="mt-1 bg-white border border-amber-300 rounded px-1.5 py-0.5 text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
            >
              <option value="uint8">uint8 (1 octet)</option>
              <option value="float16">float16 (2 octets)</option>
              <option value="float32">float32 (4 octets)</option>
              <option value="float64">float64 (8 octets)</option>
            </select>
            <span className="text-[9px] text-slate-500 block mt-0.5">{bytesPerElement} octets / valeur</span>
          </div>

          <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
            <span className="text-[10px] text-indigo-700 uppercase font-bold block">4. RAM GPU Requise</span>
            <span className="text-xs sm:text-sm font-extrabold text-indigo-950 block mt-1">
              {totalMegabytes} Mo
            </span>
            <span className="text-[10px] text-slate-500">{totalElements.toLocaleString()} valeurs</span>
          </div>
        </div>

        {/* Technical Explanatory Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">
              Pourquoi convertir de <code className="text-amber-800 bg-white px-1 py-0.2 rounded border">uint8</code> à <code className="text-emerald-800 bg-white px-1 py-0.2 rounded border">float32</code> ?
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Le stockage disque JPEG/PNG est en <strong>uint8</strong> (entiers de 0 à 255). Pour calculer les dérivées partielles et les gradients pendant l'entraînement, TensorFlow exige des nombres réels continus (<strong>tf.float32</strong>). Cela multiplie la mémoire RAM par <strong>{ratioFloatVsUint8}x</strong>, d'où l'importance de traiter les données par lots (batches).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
