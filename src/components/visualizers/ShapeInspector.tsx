import React, { useState } from 'react';
import { Database, HardDrive, Cpu, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ShapeInspector: React.FC = () => {
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

  // Comparison with uint8
  const bytesInUint8 = totalElements * 1;
  const ratioFloatVsUint8 = (totalBytes / bytesInUint8).toFixed(0);

  const resetPreset = (preset: 'mnist' | 'cifar' | 'imagenet') => {
    if (preset === 'mnist') {
      setBatchSize(64);
      setHeight(28);
      setWidth(28);
      setChannels(1);
      setDtype('float32');
    } else if (preset === 'cifar') {
      setBatchSize(32);
      setHeight(32);
      setWidth(32);
      setChannels(3);
      setDtype('float32');
    } else {
      setBatchSize(32);
      setHeight(224);
      setWidth(224);
      setChannels(3);
      setDtype('float32');
    }
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Inspecteur de Forme (Shape), Rang et Empreinte Mémoire (Dtype)
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1">Préréglages :</span>
          <button
            onClick={() => resetPreset('mnist')}
            className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
          >
            MNIST
          </button>
          <button
            onClick={() => resetPreset('cifar')}
            className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
          >
            CIFAR-10
          </button>
          <button
            onClick={() => resetPreset('imagenet')}
            className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
          >
            ImageNet
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Dimension Sliders & Dtype Select */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Batch (B) :</span>
              <span className="font-mono text-xs font-bold text-emerald-800">{batchSize}</span>
            </div>
            <input
              type="range"
              min="1"
              max="128"
              step="1"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Nb d'échantillons</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Hauteur (H) :</span>
              <span className="font-mono text-xs font-bold text-emerald-800">{height}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="512"
              step="16"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Nombre de lignes</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Largeur (W) :</span>
              <span className="font-mono text-xs font-bold text-emerald-800">{width}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="512"
              step="16"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Nombre de colonnes</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Canaux (C) :</span>
              <span className="font-mono text-xs font-bold text-emerald-800">{channels}</span>
            </div>
            <select
              value={channels}
              onChange={(e) => setChannels(Number(e.target.value) as 1 | 3)}
              className="w-full p-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
            >
              <option value={1}>1 (Niveaux de gris)</option>
              <option value={3}>3 (Couleur RGB)</option>
            </select>
            <span className="text-[10px] text-slate-400">Dernier axe (NHWC)</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Dtype :</span>
              <span className="font-mono text-[11px] text-purple-700 font-semibold">{bytesPerElement} octets</span>
            </div>
            <select
              value={dtype}
              onChange={(e) => setDtype(e.target.value as any)}
              className="w-full p-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 font-mono"
            >
              <option value="uint8">tf.uint8 (1 octet)</option>
              <option value="float16">tf.float16 (2 octets)</option>
              <option value="float32">tf.float32 (4 octets)</option>
              <option value="float64">tf.float64 (8 octets)</option>
            </select>
            <span className="text-[10px] text-slate-400">Précision numérique</span>
          </div>
        </div>

        {/* Dynamic Tensor Breakdown Display */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Shape Card */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-md">
            <span className="text-[11px] text-emerald-800 font-medium block mb-1">
              Forme TensorShape (.shape)
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-emerald-950">
              ({batchSize}, {height}, {width}, {channels})
            </div>
            <span className="text-[10px] text-emerald-700 mt-1 block">
              Format standard NHWC
            </span>
          </div>

          {/* Rank Card */}
          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-md">
            <span className="text-[11px] text-sky-800 font-medium block mb-1">
              Rang / ndim (.ndim)
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-sky-950">
              4 dimensions
            </div>
            <span className="text-[10px] text-sky-700 mt-1 block">
              Axes : Lot, Ligne, Col, Canal
            </span>
          </div>

          {/* Elements Count Card */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-md">
            <span className="text-[11px] text-purple-800 font-medium block mb-1">
              Nombre total de scalaires
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-purple-950">
              {totalElements.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-700 mt-1 block">
              Produit B × H × W × C
            </span>
          </div>

          {/* Memory Footprint Card */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md">
            <span className="text-[11px] text-amber-800 font-medium block mb-1">
              Mémoire VRAM requise
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-950">
              {Number(totalMegabytes) > 1 ? `${totalMegabytes} Mo` : `${totalKilobytes} Ko`}
            </div>
            <span className="text-[10px] text-amber-700 mt-1 block">
              {totalElements.toLocaleString()} × {bytesPerElement} octets
            </span>
          </div>
        </div>

        {/* Academic Comparison Banner */}
        <div className="p-3.5 bg-slate-900 text-slate-200 rounded-md text-xs space-y-2 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <HardDrive className="w-4 h-4" />
            <span>Impact du dtype sur l'utilisation de la mémoire GPU :</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Sur disque dur, une image brute est stockée en <code className="text-amber-300 font-mono">uint8</code> (1 octet par pixel = {bytesInUint8.toLocaleString()} octets pour ce lot).
            Lors du passage en <code className="text-emerald-300 font-mono">{dtype}</code> pour le calcul des gradients, le tenseur occupe <strong className="text-white font-bold">{totalBytes.toLocaleString()} octets</strong>, soit une multiplication par un facteur de <strong className="text-amber-400 font-bold">{ratioFloatVsUint8}x</strong> !
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>Signature attendue par Keras Conv2D : <code className="text-sky-300 font-mono">input_shape=({height}, {width}, {channels})</code></span>
            <span className="text-slate-500 font-mono">None = dimension variable de lot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
