import React, { useState } from 'react';
import { Sliders, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface RealScenePreprocessingProps {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealScenePreprocessing: React.FC<RealScenePreprocessingProps> = () => {
  const [r, setR] = useState<number>(200);
  const [g, setG] = useState<number>(100);
  const [b, setB] = useState<number>(50);

  // Computations
  // 1. Standard normalization [0.0, 1.0]
  const stdR = (r / 255.0).toFixed(3);
  const stdG = (g / 255.0).toFixed(3);
  const stdB = (b / 255.0).toFixed(3);

  // 2. ResNet50 (Caffe mode : RGB -> BGR then subtract ImageNet mean)
  // ImageNet mean: B=103.939, G=116.779, R=123.68
  const resnetB = (b - 103.939).toFixed(1);
  const resnetG = (g - 116.779).toFixed(1);
  const resnetR = (r - 123.68).toFixed(1);

  // 3. MobileNetV2 (TF mode : scale into [-1.0, 1.0])
  const mobR = ((r / 127.5) - 1.0).toFixed(3);
  const mobG = ((g / 127.5) - 1.0).toFixed(3);
  const mobB = ((b / 127.5) - 1.0).toFixed(3);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Comparateur : Normalisation vs preprocess_input Spécifique</span>
        </span>
        <span className="text-emerald-700 font-semibold">Impact de la Cohérence</span>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {/* Pixel Color Picker / Sliders */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-lg shadow-sm border border-slate-300 shrink-0"
            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
            title={`RGB(${r}, ${g}, ${b})`}
          />
          <div className="flex-1 grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-red-700 font-bold block text-[11px]">Rouge : {r}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={r}
                onChange={(e) => setR(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>
            <div>
              <span className="text-emerald-700 font-bold block text-[11px]">Vert : {g}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={g}
                onChange={(e) => setG(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <span className="text-blue-700 font-bold block text-[11px]">Bleu : {b}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Comparison 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          {/* Column 1: Standard Normalization */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-800 text-[11px] block border-b border-slate-200 pb-1">
              1. Standard (x / 255.0)
            </span>
            <span className="text-[10px] text-slate-500 block">Intervalle [0.0, 1.0] (RGB)</span>
            <div className="text-[11px] font-bold text-emerald-800 space-y-0.5 pt-1">
              <div>R : {stdR}</div>
              <div>V : {stdG}</div>
              <div>B : {stdB}</div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1">Modèles personnalisés</span>
          </div>

          {/* Column 2: ResNet50 Caffe Mode */}
          <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg space-y-1">
            <span className="font-bold text-amber-900 text-[11px] block border-b border-amber-200 pb-1">
              2. ResNet50 (Mode Caffe)
            </span>
            <span className="text-[10px] text-amber-700 block">BGR + Moyenne ImageNet</span>
            <div className="text-[11px] font-bold text-amber-950 space-y-0.5 pt-1">
              <div>B : {resnetB}</div>
              <div>V : {resnetG}</div>
              <div>R : {resnetR}</div>
            </div>
            <span className="text-[10px] text-amber-800 block pt-1">Centré autour de 0</span>
          </div>

          {/* Column 3: MobileNetV2 TF Mode */}
          <div className="p-2.5 bg-sky-50/60 border border-sky-200 rounded-lg space-y-1">
            <span className="font-bold text-sky-900 text-[11px] block border-b border-sky-200 pb-1">
              3. MobileNet (Mode TF)
            </span>
            <span className="text-[10px] text-sky-700 block">Intervalle [-1.0, 1.0]</span>
            <div className="text-[11px] font-bold text-sky-950 space-y-0.5 pt-1">
              <div>R : {mobR}</div>
              <div>V : {mobG}</div>
              <div>B : {mobB}</div>
            </div>
            <span className="text-[10px] text-sky-800 block pt-1">(x / 127.5) - 1.0</span>
          </div>
        </div>

        {/* Warning Alert on Coherence */}
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-900 font-sans">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-[11px] leading-tight">
            <strong>Règle d'or :</strong> Ne JAMAIS alimenter ResNet50 avec des valeurs [0, 1] ! Les poids pré-entraînés attendent des valeurs centrées de l'ordre de ~[-100, +100] en ordre BGR. Toujours appeler <code className="font-mono text-red-800 font-bold">preprocess_input</code> de l'architecture choisie.
          </p>
        </div>
      </div>
    </div>
  );
};
