import React, { useState } from 'react';
import { Layers, Cpu, Server, Zap, HardDrive } from 'lucide-react';
import { Badge } from '../common/Badge';

export const BatchBuilder: React.FC = () => {
  const [batchSize, setBatchSize] = useState<number>(16);
  const [datasetSize, setDatasetSize] = useState<number>(100);
  const [imageRes, setImageRes] = useState<number>(224);

  // Computations
  const numFullBatches = Math.floor(datasetSize / batchSize);
  const remainder = datasetSize % batchSize;
  const totalBatchesPerEpoch = Math.ceil(datasetSize / batchSize);

  // GPU Memory for 1 batch in float32 (4 bytes per element)
  const elementsPerBatch = batchSize * imageRes * imageRes * 3;
  const bytesPerBatch = elementsPerBatch * 4;
  const mbPerBatch = (bytesPerBatch / (1024 * 1024)).toFixed(1);

  // Simulated GPU parallel efficiency (vectorized matrix compute)
  const theoreticalSpeedup = Math.min(32, Math.max(1, Math.round(batchSize * 0.85)));

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Simulateur d'Empilement par Lots (Batch Stacking)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Shape du lot : ({batchSize}, {imageRes}, {imageRes}, 3)</Badge>
          <Badge variant="blue">{totalBatchesPerEpoch} lots / epoch</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700">Taille de lot (Batch Size) :</span>
              <span className="font-mono font-bold text-emerald-800">{batchSize}</span>
            </div>
            <div className="flex gap-1.5">
              {[4, 8, 16, 32, 64].map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchSize(b)}
                  className={`flex-1 py-1 rounded text-xs font-semibold border transition-colors ${
                    batchSize === b
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Dimension 0 du tenseur NHWC
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700">Images dans le dataset :</span>
              <span className="font-mono font-bold text-slate-800">{datasetSize}</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={datasetSize}
              onChange={(e) => setDatasetSize(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Nombre total d'échantillons à traiter
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700">Résolution d'image :</span>
              <span className="font-mono font-bold text-slate-800">{imageRes}x{imageRes}</span>
            </div>
            <select
              value={imageRes}
              onChange={(e) => setImageRes(Number(e.target.value))}
              className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-mono"
            >
              <option value={32}>32x32 (CIFAR)</option>
              <option value={128}>128x128 (Moyen)</option>
              <option value={224}>224x224 (ResNet)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Forme unitaire : ({imageRes}, {imageRes}, 3)
            </span>
          </div>
        </div>

        {/* Dynamic Visual Batch Stacking */}
        <div className="p-5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <span className="text-xs text-slate-400 font-mono">
              Opération : tf.stack([img_0, img_1, ..., img_{batchSize - 1}], axis=0)
            </span>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              Tenseur 4D de forme ({batchSize}, {imageRes}, {imageRes}, 3)
            </div>
          </div>

          {/* Stacking 3D Layers representation */}
          <div className="relative w-64 h-32 flex items-center justify-center">
            {Array.from({ length: Math.min(12, batchSize) }, (_, i) => {
              const offset = (i - Math.min(12, batchSize) / 2) * 8;
              const zIndex = i + 1;
              const isFirst = i === 0;
              const isLast = i === Math.min(12, batchSize) - 1;

              return (
                <div
                  key={i}
                  className="absolute w-36 h-24 rounded border border-emerald-400/80 bg-slate-900/90 shadow-lg flex items-center justify-between px-3 text-xs font-mono transition-transform duration-200"
                  style={{
                    transform: `translate(${offset}px, ${-offset * 0.5}px)`,
                    zIndex,
                    backgroundColor: isFirst
                      ? '#064e3b'
                      : isLast
                      ? '#065f46'
                      : '#0f172a',
                  }}
                >
                  <span className="text-[10px] text-emerald-300">Image [{i}]</span>
                  <span className="text-[9px] text-slate-400">({imageRes}x{imageRes}x3)</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {batchSize} tenseurs 3D empilés le long de l'axe 0
            </span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-emerald-400">{mbPerBatch} Mo VRAM par lot</span>
          </div>
        </div>

        {/* Epoch & Batch Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-slate-500 font-medium block mb-1">
              Lots complets générés
            </span>
            <div className="text-base font-bold text-slate-900 font-mono">
              {numFullBatches} lots de {batchSize}
            </div>
            <span className="text-[10px] text-slate-500">
              Total : {numFullBatches * batchSize} images
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-slate-500 font-medium block mb-1">
              Dernier lot résiduel (reste)
            </span>
            <div className={`text-base font-bold font-mono ${remainder > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {remainder > 0 ? `1 lot partiel de ${remainder}` : 'Aucun résidu (parfait)'}
            </div>
            <span className="text-[10px] text-slate-500">
              {remainder > 0 ? 'tf.data gère automatiquement les formes partielles' : 'Dataset exactement divisible'}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-md">
            <span className="text-emerald-800 font-medium block mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              Accélération matricielle estimée
            </span>
            <div className="text-base font-bold text-emerald-950 font-mono">
              ~{theoreticalSpeedup}x plus rapide
            </div>
            <span className="text-[10px] text-emerald-700">
              Parallélisme Tensor Cores vs batch de 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
