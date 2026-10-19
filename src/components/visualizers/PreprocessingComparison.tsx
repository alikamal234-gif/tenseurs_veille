import React, { useState } from 'react';
import { Network, AlertOctagon, CheckCircle2, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { Badge } from '../common/Badge';

export const PreprocessingComparison: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'resnet' | 'mobilenet' | 'efficientnet' | 'densenet'>('resnet');
  const [redVal, setRedVal] = useState<number>(200);
  const [greenVal, setGreenVal] = useState<number>(100);
  const [blueVal, setBlueVal] = useState<number>(50);

  // Model specs
  const models = {
    resnet: {
      name: 'ResNet50 / VGG16',
      mode: 'caffe',
      channelOrder: 'BGR',
      range: '[-128, +128] (centré en 0)',
      formula: 'Inverse RGB en BGR puis soustrait [103.939, 116.779, 123.68]',
      compute: (r: number, g: number, b: number) => {
        // BGR order:
        // B' = B - 103.939
        // G' = G - 116.779
        // R' = R - 123.680
        return [
          Number((b - 103.939).toFixed(2)),
          Number((g - 116.779).toFixed(2)),
          Number((r - 123.680).toFixed(2)),
        ];
      },
      importCode: 'from tensorflow.keras.applications.resnet50 import preprocess_input, ResNet50',
      callCode: 'x_ready = preprocess_input(image_rgb_uint8)',
    },
    mobilenet: {
      name: 'MobileNetV2 / InceptionV3',
      mode: 'tf',
      channelOrder: 'RGB',
      range: '[-1.0, +1.0]',
      formula: 'Conserve RGB et applique (x / 127.5) - 1.0',
      compute: (r: number, g: number, b: number) => {
        return [
          Number(((r / 127.5) - 1.0).toFixed(3)),
          Number(((g / 127.5) - 1.0).toFixed(3)),
          Number(((b / 127.5) - 1.0).toFixed(3)),
        ];
      },
      importCode: 'from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, MobileNetV2',
      callCode: 'x_ready = preprocess_input(image_rgb_uint8)',
    },
    efficientnet: {
      name: 'EfficientNetB0 / B4',
      mode: 'builtin',
      channelOrder: 'RGB',
      range: '[0, 255] (Inchangé en entrée)',
      formula: 'Normalisation gérée nativement par la première couche du modèle',
      compute: (r: number, g: number, b: number) => {
        return [r, g, b];
      },
      importCode: 'from tensorflow.keras.applications.efficientnet import preprocess_input, EfficientNetB0',
      callCode: '# Pas besoin de preprocess_input manuel !\n# Le modèle intègre une couche de normalisation en interne.\npredictions = model(image_rgb_uint8)',
    },
    densenet: {
      name: 'DenseNet121',
      mode: 'torch',
      channelOrder: 'RGB',
      range: 'Standardisé ImageNet',
      formula: 'Division par 255 puis (x - mean) / std avec ImageNet stats',
      compute: (r: number, g: number, b: number) => {
        const nr = r / 255.0;
        const ng = g / 255.0;
        const nb = b / 255.0;
        return [
          Number(((nr - 0.485) / 0.229).toFixed(3)),
          Number(((ng - 0.456) / 0.224).toFixed(3)),
          Number(((nb - 0.406) / 0.225).toFixed(3)),
        ];
      },
      importCode: 'from tensorflow.keras.applications.densenet import preprocess_input, DenseNet121',
      callCode: 'x_ready = preprocess_input(image_rgb_uint8)',
    },
  };

  const current = models[selectedModel];
  const transformed = current.compute(redVal, greenVal, blueVal);

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Comparateur Architectural de preprocess_input (Keras Applications)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Ordre : {current.channelOrder}</Badge>
          <Badge variant="blue">Mode : {current.mode.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Model Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(models).map(([key, m]) => (
            <button
              key={key}
              onClick={() => setSelectedModel(key as any)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedModel === key
                  ? 'bg-emerald-50 border-emerald-500 shadow-2xs ring-1 ring-emerald-400'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{m.name}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Mode: {m.mode}</div>
            </button>
          ))}
        </div>

        {/* Input RGB Probe */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Pixel RGB source avant tout prétraitement :
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-slate-300"
                style={{ backgroundColor: `rgb(${redVal}, ${greenVal}, ${blueVal})` }}
              />
              <span className="font-mono font-bold text-slate-800">
                [{redVal}, {greenVal}, {blueVal}] (uint8)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-[10px] text-red-700 font-medium">Rouge : {redVal}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={redVal}
                onChange={(e) => setRedVal(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-green-700 font-medium">Vert : {greenVal}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={greenVal}
                onChange={(e) => setGreenVal(Number(e.target.value))}
                className="w-full accent-green-600 cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-blue-700 font-medium">Bleu : {blueVal}</span>
              <input
                type="range"
                min="0"
                max="255"
                value={blueVal}
                onChange={(e) => setBlueVal(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Transformation breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Diagnostic Card */}
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">
                Résultat pour {current.name} :
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {current.channelOrder}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">
                Valeurs transmises au premier Conv2D :
              </span>
              <div className="p-2.5 bg-slate-950 rounded font-mono font-bold text-sm text-emerald-300 flex items-center justify-around border border-slate-800">
                {current.channelOrder.split('').map((char, idx) => (
                  <div key={idx} className="text-center">
                    <span className="text-[10px] text-slate-500 block">Canal {char}</span>
                    <span>{transformed[idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div>
                <strong className="text-slate-100">Algorithme : </strong>
                {current.formula}
              </div>
              <div>
                <strong className="text-slate-100">Échelle attendue : </strong>
                <span className="text-amber-300 font-mono">{current.range}</span>
              </div>
            </div>
          </div>

          {/* Python Code Implementation */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">
              Code Python officiel à utiliser :
            </span>
            <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {current.importCode}

{current.callCode}
            </pre>
            <p className="text-[11px] text-slate-500 italic">
              La fonction `preprocess_input` adapte automatiquement la transformation selon l'architecture sans que vous ayez à retenir les moyennes par cœur.
            </p>
          </div>
        </div>

        {/* Academic Warning Note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Avertissement Transfer Learning :</span> Si vous divisez une image par 255.0 puis la transmettez à ResNet50 au lieu d'utiliser sa fonction `preprocess_input`, le modèle recevra des valeurs comprises entre 0.0 et 1.0 au lieu de ~[-100, +150]. Sa précision Top-1 s'effondrera instantanément de 76% à moins de 2% !
          </div>
        </div>
      </div>
    </div>
  );
};
