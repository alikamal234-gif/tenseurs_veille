import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Sliders } from 'lucide-react';
import { Badge } from '../common/Badge';

export const NormalizationSimulator: React.FC = () => {
  const [pixelVal, setPixelVal] = useState<number>(180);
  const [mode, setMode] = useState<'raw' | 'zero_to_one' | 'minus_one_to_one' | 'zscore'>('zero_to_one');

  // Reference distribution sample values (black, dark shadow, medium gray, highlight, white)
  const samplePixels = [0, 64, 128, 192, 255];
  const mean = 127.8;
  const std = 73.5;

  const transform = (v: number) => {
    switch (mode) {
      case 'raw':
        return v;
      case 'zero_to_one':
        return Number((v / 255.0).toFixed(3));
      case 'minus_one_to_one':
        return Number(((v / 127.5) - 1.0).toFixed(3));
      case 'zscore':
        return Number(((v - mean) / std).toFixed(3));
    }
  };

  const currentTransformed = transform(pixelVal);

  const getCodeSnippet = () => {
    switch (mode) {
      case 'raw':
        return '# Pas de normalisation (DÉCONSEILLÉ)\nx_tensor = tf.cast(image, tf.float32)';
      case 'zero_to_one':
        return '# Mise à l\'échelle dans [0.0, 1.0]\nrescale = tf.keras.layers.Rescaling(1./255)\nx_norm = rescale(image)';
      case 'minus_one_to_one':
        return '# Centrage symétrique dans [-1.0, 1.0]\nrescale = tf.keras.layers.Rescaling(1./127.5, offset=-1.0)\nx_norm = rescale(image)';
      case 'zscore':
        return '# Standardisation Z-Score (Moyenne 0, Écart-type 1)\nmean = tf.math.reduce_mean(image)\nstd = tf.math.reduce_std(image)\nx_norm = (image - mean) / (std + 1e-7)';
    }
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Simulateur de Normalisation &amp; Stabilité des Gradients
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={mode === 'raw' ? 'amber' : 'emerald'}>
            Plage cible : {mode === 'raw' ? '[0, 255]' : mode === 'zero_to_one' ? '[0.0, 1.0]' : mode === 'minus_one_to_one' ? '[-1.0, 1.0]' : 'Z-Score'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-lg">
          {[
            { id: 'zero_to_one', label: '1. Standard [0.0, 1.0]', desc: 'Division par 255.0' },
            { id: 'minus_one_to_one', label: '2. Symétrique [-1.0, +1.0]', desc: 'Centré en zéro' },
            { id: 'zscore', label: '3. Z-Score (μ=0, σ=1)', desc: 'Standardisation statistique' },
            { id: 'raw', label: '4. Brut [0, 255]', desc: 'Sans normalisation' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className={`flex-1 min-w-[140px] px-3 py-2 rounded-md text-xs font-semibold text-left transition-all ${
                mode === item.id
                  ? 'bg-white text-emerald-950 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <div className="font-bold">{item.label}</div>
              <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Pixel Probe Slider */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              Tester un pixel d'entrée $x$ :
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-slate-500">uint8 : <strong className="text-slate-900">{pixelVal}</strong> / 255</span>
              <span className="text-emerald-700 font-bold">
                Normalisé : {currentTransformed}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="255"
            value={pixelVal}
            onChange={(e) => setPixelVal(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Noir pur (0)</span>
            <span>Gris sombre (64)</span>
            <span>Gris moyen (128)</span>
            <span>Gris clair (192)</span>
            <span>Blanc saturé (255)</span>
          </div>
        </div>

        {/* Table of benchmark pixels */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-md overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Échantillon visuel</th>
                <th className="p-2.5">Valeur brute uint8</th>
                <th className="p-2.5">Valeur après normalisation</th>
                <th className="p-2.5">Interprétation pour le neurone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {samplePixels.map((p) => {
                const norm = transform(p);
                return (
                  <tr key={p} className="hover:bg-slate-50/60">
                    <td className="p-2.5 flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded border border-slate-300"
                        style={{ backgroundColor: `rgb(${p}, ${p}, ${p})` }}
                      />
                      <span className="font-sans text-[11px] text-slate-600">
                        {p === 0 ? 'Noir' : p === 128 ? 'Gris médian' : p === 255 ? 'Blanc' : `Niveau ${p}`}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-800 font-semibold">{p}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{norm}</td>
                    <td className="p-2.5 font-sans text-[11px] text-slate-500">
                      {mode === 'raw'
                        ? 'Valeur très élevée : risque de saturation'
                        : norm === 0
                        ? 'Point neutre ou d\'activation nulle'
                        : norm < 0
                        ? 'Poids inhibiteur (valeur négative)'
                        : 'Poids excitateur (valeur positive)'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Gradient & Stability Diagnostics */}
        <div
          className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
            mode === 'raw'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {mode === 'raw' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Attention critique : Les valeurs brutes [0, 255] déstabilisent l'apprentissage</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Excellente stabilité numérique : Convergence optimale de l'optimiseur</span>
              </>
            )}
          </div>
          <p className="text-slate-700 text-[11px] leading-relaxed">
            {mode === 'raw'
              ? 'Injecter 255 dans un neurone dont les poids initiaux valent ~0.05 produit une somme pondérée z > 12. Dans une sigmoïde ou tanh, la dérivée devient pratiquement nulle (gradient vanishing). L\'entraînement stagne.'
              : mode === 'zero_to_one'
              ? 'La mise à l\'échelle [0.0, 1.0] maintient les valeurs dans l\'ordre de grandeur unitaire des poids du réseau, permettant une descente de gradient fluide et sans à-coups.'
              : mode === 'minus_one_to_one'
              ? 'Le centrage en zéro [-1.0, 1.0] garantit que les activations moyennes restent proches de zéro, évitant l\'oscillation systématique des gradients dans la même direction.'
              : 'La standardisation Z-Score compense les variations d\'éclairage globales et accélère l\'optimisation pour les architectures complexes.'}
          </p>
        </div>

        {/* Code snippet */}
        <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-emerald-300">
          <pre className="whitespace-pre-wrap">{getCodeSnippet()}</pre>
        </div>
      </div>
    </div>
  );
};
